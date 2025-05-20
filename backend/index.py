from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import ast
import tempfile
import json
from openai import OpenAI  # Import OpenAI client

app = Flask(__name__)
CORS(app)  # Allow CORS for all domains

# Initialize OpenAI client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("api_key")
)

def check_syntax_with_ast(code):
    errors = []
    try:
        ast.parse(code)
    except SyntaxError as e:
        if "unexpected indent" not in str(e):
            errors.append({
                "message": str(e),
                "line": e.lineno,
                "column": e.offset
            })

        lines = code.splitlines()
        for i, line in enumerate(lines):
            try:
                ast.parse(line)
            except SyntaxError as line_error:
                if "unexpected indent" not in str(line_error):
                    errors.append({
                        "message": str(line_error).replace("<unknown>, line 1", f"line {i + 1}"),
                        "line": i + 1,
                        "column": line_error.offset
                    })
    return errors

def check_security_rules(code):
    issues = []
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id == "eval":
                    issues.append(f"⚠️ Use of eval() at line {node.lineno}")
                elif isinstance(node.func, ast.Attribute):
                    if node.func.attr == "loads" and getattr(node.func.value, "id", "") == "pickle":
                        issues.append(f"⚠️ Use of pickle.loads() at line {node.lineno}")
    except SyntaxError as e:
        issues.append(f"Security rule analysis failed due to syntax error: {str(e)}")
    except Exception as e:
        issues.append(f"Security rule analysis failed: {str(e)}")
    return issues

def check_with_bandit(code):
    tmp_path = ""
    try:
        with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode="w") as tmp:
            tmp.write(code)
            tmp_path = tmp.name

        result = subprocess.run(
            ["python", "-m", "bandit", "-q", "-r", tmp_path],
            capture_output=True,
            text=True
        )

        findings = []
        for line in result.stdout.splitlines():
            if "Issue:" in line:
                findings.append(line.strip())
        return findings
    except Exception as e:
        return [f"Bandit error: {str(e)}"]
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

def analyze_code_with_llm(code):
    prompt = (
        "You are a highly skilled Python static code analyzer.\n"
        "Analyze the following Python code for:\n"
        "- Syntax errors\n"
        "- Possible runtime errors or bugs\n"
        "- Code style or best practice improvements\n"
        "- Security vulnerabilities if any\n"
        "Provide detailed feedback, explanations, and suggest fixes.\n\n"
        f"Code to analyze:\n```python\n{code}\n```"
    )
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "<YOUR_SITE_URL>",  # optional
                "X-Title": "<YOUR_SITE_NAME>",      # optional
            },
            model="deepseek/deepseek-prover-v2:free",  # or any other code-analysis capable model
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            timeout=30  # optional: prevent hanging
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"LLM analysis failed: {str(e)}"

@app.route('/analyze_python', methods=['POST'])
def analyze_python():
    data = request.get_json()
    code = data.get("code", "")

    syntax_errors = check_syntax_with_ast(code)
    security_issues = check_security_rules(code)

    bandit_findings = []
    if not syntax_errors:
        bandit_findings = check_with_bandit(code)

    result = {
        "errors": syntax_errors,
        "security_issues": security_issues,
        "bandit_findings": bandit_findings,
    }

    return jsonify(result)

@app.route('/analyze_python_llm', methods=['POST'])
def analyze_python_llm():
    data = request.get_json()
    code = data.get("code", "")

    llm_analysis = analyze_code_with_llm(code)

    return jsonify({"llm_analysis": llm_analysis})


if __name__ == '__main__':
    app.run(port=5000, debug=True)
