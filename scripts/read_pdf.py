"""Extract text from PDF file"""
try:
    from pypdf import PdfReader
    reader = PdfReader("Rishi_Task.pdf")
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        print(f"--- Page {i+1} ---")
        print(text)
except ImportError:
    print("Installing pypdf...")
    import subprocess
    subprocess.run(["pip", "install", "pypdf"], check=True)
    from pypdf import PdfReader
    reader = PdfReader("Rishi_Task.pdf")
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        print(f"--- Page {i+1} ---")
        print(text)
except Exception as e:
    print(f"Error: {e}")
