from openai import OpenAI

# Initialize the client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
)

def analyze_code(code: str) -> str:
    """
    Sends the provided code to the language model to analyze it for syntax errors,
    bugs, style issues, and suggestions for improvements.
    """
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
        ]
    )
    
    return completion.choices[0].message.content


# Example large Python code snippet to analyze
large_code = """
def calculate_factorial(n):
    '''Calculate factorial of n recursively'''
    if n == 0:
        return 1
    else:
        return n * calculate_factorial(n - 1)

def print_factorials(numbers):
    for num in numbers:
        print(f"Factorial of {num} is {calculate_factorial(num)}")

# Intentional errors and bad practices below
def faulty_function():
    print("Starting faulty function"
    x = 10 / 0  # This will cause ZeroDivisionError
    y = undefined_var  # This will cause NameError

print_factorials([5, 7, 10])
faulty_function()
"""

# Run analyzer and print results
analysis = analyze_code(large_code)
print("=== Static Code Analysis Result ===\n")
print(analysis)
