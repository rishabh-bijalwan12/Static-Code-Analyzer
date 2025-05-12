import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = 5002;


const corsOptions = {
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions)); // Apply the specific CORS policy
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Utility to create and remove temp files
function writeTempFile(content, ext) {
  const fileName = `temp_code_${Date.now()}.${ext}`;
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, content);
  return filePath;
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// ESLint (JavaScript Rule-based)
function runEslint(codePath) {
  return new Promise((resolve, reject) => {
    exec(`npx eslint "${codePath}" --format json`, (error, stdout, stderr) => {
      if (error && !stdout) {
        return reject(`ESLint error: ${stderr || error.message}`);
      }
      try {
        const result = JSON.parse(stdout);
        const messages = result[0]?.messages || [];
        resolve(messages.map(msg => `${msg.line}:${msg.column} ${msg.message} (${msg.ruleId})`));
      } catch (e) {
        reject(`Failed to parse ESLint output: ${e.message}`);
      }
    });
  });
}

// JSHint (JavaScript security-ish check)
function runJshint(codePath) {
  return new Promise((resolve, reject) => {
    exec(`npx jshint "${codePath}"`, (error, stdout, stderr) => {
      if (error && !stdout) {
        return reject(`JSHint error: ${stderr || error.message}`);
      }
      resolve(stdout.trim().split('\n'));
    });
  });
}

// POST endpoint for JS analysis
app.post('/analyze_js', async (req, res) => {
  const { code } = req.body;
  console.log('Received JavaScript code:', code);

  const tempFile = writeTempFile(code, 'js');

  try {
    const eslintResults = await runEslint(tempFile);
    const securityIssues = await runJshint(tempFile);

    // Parse ESLint results to extract syntax errors and other issues
    const formattedEslintErrors = eslintResults.map(error => {
      const match = error.match(/(\d+):(\d+) (.+)/);
      if (match) {
        return {
          line: parseInt(match[1], 10),
          column: parseInt(match[2], 10),
          message: match[3].trim(),
        };
      }
      return { message: error.trim() };
    });

    // Parse JSHint results to extract issues
    const formattedJshintErrors = securityIssues.map(issue => {
      const match = issue.match(/line (\d+), col (\d+), (.+)/);
      if (match) {
        return {
          line: parseInt(match[1], 10),
          column: parseInt(match[2], 10),
          message: match[3].trim(),
        };
      }
      return { message: issue.trim() };
    });

    // Combine all errors
    const allErrors = [...formattedEslintErrors, ...formattedJshintErrors];

    res.json({
      errors: allErrors.length > 0 ? allErrors : ['No errors found.'],
    });
  } catch (err) {
    console.error('Error in JavaScript analysis:', err);
    res.status(500).json({ error: 'An error occurred during JavaScript analysis.', details: err.message });
  } finally {
    deleteFile(tempFile);
  }
});


try {
  app.listen(5002, () => {
    console.log('Server running on port 5002');
  });
} catch (error) {
  console.error('Error starting server:', error);
}
