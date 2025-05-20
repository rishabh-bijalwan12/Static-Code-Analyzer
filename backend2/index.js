import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import OpenAI from 'openai';

const app = express();
const PORT = 5002;

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.apiKey,
});


// Middleware
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helpers: create & delete temp file
const writeTempFile = (content, ext) => {
  const filePath = path.join(__dirname, `temp_${Date.now()}.${ext}`);
  fs.writeFileSync(filePath, content);
  return filePath;
};

const deleteFile = filePath => fs.existsSync(filePath) && fs.unlinkSync(filePath);

// Run ESLint
const runEslint = filePath => new Promise((resolve, reject) => {
  exec(`npx eslint "${filePath}" --format json`, (err, stdout) => {
    if (err && !stdout) return reject(err.message);
    try {
      const messages = JSON.parse(stdout)[0]?.messages || [];
      resolve(messages.map(m => ({
        line: m.line,
        column: m.column,
        message: `${m.message} (${m.ruleId})`
      })));
    } catch (e) {
      reject(`ESLint parsing error: ${e.message}`);
    }
  });
});

// Run JSHint
const runJshint = filePath => new Promise((resolve, reject) => {
  exec(`npx jshint "${filePath}"`, (err, stdout) => {
    if (err && !stdout) return reject(err.message);
    const issues = stdout.trim().split('\n').filter(Boolean);
    const results = issues.map(line => {
      const match = line.match(/line (\d+), col (\d+), (.+)/);
      return match ? {
        line: parseInt(match[1], 10),
        column: parseInt(match[2], 10),
        message: match[3].trim()
      } : { message: line.trim() };
    });
    resolve(results);
  });
});

// Main analysis endpoint
app.post('/analyze_js', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided.' });

  const tempFile = writeTempFile(code, 'js');

  try {
    const [eslintResults, jshintResults] = await Promise.all([
      runEslint(tempFile),
      runJshint(tempFile)
    ]);
    const allErrors = [...eslintResults, ...jshintResults];
    res.json({ errors: allErrors.length ? allErrors : [] });

  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Analysis failed.', details: err.toString() });
  } finally {
    deleteFile(tempFile);
  }
});

// LLM analysis endpoint
app.post('/analyze_js_llm', async (req, res) => {
  const { code } = req.body;

  if (!code || code.trim() === '') {
    return res.status(400).json({ error: 'Code is required for LLM analysis.' });
  }

  // Compose the prompt content for the LLM
  const prompt = `
You are a highly skilled JavaScript static code analyzer.
Analyze the following JavaScript code for:
- Syntax errors
- Possible runtime errors or bugs
- Code style or best practice improvements
- Security vulnerabilities if any
Provide detailed feedback, explanations, and suggest fixes.

Code to analyze:

${code}
  `;

  try {
    const llmCompletion = await client.chat.completions.create({
      model: "deepseek/deepseek-prover-v2:free",  // use your preferred model
      messages: [
        { role: "user", content: prompt }
      ],
      timeout: 30
    });

    const llmResponse = llmCompletion.choices?.[0]?.message?.content || 'No response from LLM.';

    console.log('LLM JS Analysis:\n', llmResponse); 
    res.json({ llm_analysis: llmResponse });
  } catch (err) {
    console.error('LLM Analysis error:', err);
    res.status(500).json({ error: 'LLM analysis failed.', details: err.toString() });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
