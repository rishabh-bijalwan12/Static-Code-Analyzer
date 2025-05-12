from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import ast
import tempfile
import json

app = Flask(__name__)
CORS(app)  # Allow CORS for all domains

def check_syntax_with_ast(code):
    errors = []
    try:
        # Parse the code into an AST
        ast.parse(code)
    except SyntaxError as e:
        # If there's a syntax error, add it to the errors list
        if "unexpected indent" not in str(e):  # Exclude 'unexpected indent' errors
            errors.append({
                "message": str(e),
                "line": e.lineno,
                "column": e.offset
            })

        # Attempt to recover by parsing the code line by line
        lines = code.splitlines()
        for i, line in enumerate(lines):
            try:
                ast.parse(line)
            except SyntaxError as line_error:
                if "unexpected indent" not in str(line_error):  # Exclude 'unexpected indent' errors
                    # Correct the line number in the error message
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
            ["python", "-m", "bandit", "-q", "-r", tmp_path],  # Use python -m bandit
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

@app.route('/analyze_python', methods=['POST'])
def analyze_python():
    data = request.get_json()
    code = data.get("code", "")

    syntax_errors = check_syntax_with_ast(code)
    print("Syntax Errors:", syntax_errors)

    security_issues = check_security_rules(code)
    print("Security Issues:", security_issues)

    bandit_findings = []
    if not syntax_errors:
        bandit_findings = check_with_bandit(code)
        print("Bandit Findings:", bandit_findings)

    result = {
        "errors": syntax_errors,  # Send all syntax errors in the 'errors' array
        "security_issues": security_issues,  # Always send security issues
        "bandit_findings": bandit_findings
    }

    print("Final Result:", result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
