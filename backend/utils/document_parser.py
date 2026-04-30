import fitz  # PyMuPDF
import docx2txt
import io

def extract_text_from_pdf(file_bytes):
    """Extract text from a PDF file."""
    text = ""
    try:
        # Open the PDF using fitz (PyMuPDF) from memory
        pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
        for page_num in range(pdf_document.page_count):
            page = pdf_document.load_page(page_num)
            text += page.get_text("text") + "\n"
        pdf_document.close()
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_text_from_docx(file_bytes):
    """Extract text from a DOCX file."""
    text = ""
    try:
        # docx2txt expects a file-like object or path
        # Use io.BytesIO to simulate a file
        doc_stream = io.BytesIO(file_bytes)
        text = docx2txt.process(doc_stream)
    except Exception as e:
        print(f"Error reading DOCX: {e}")
    return text

def extract_text(uploaded_file):
    """Parse the uploaded file based on its type."""
    if uploaded_file is None:
        return ""
        
    file_type = uploaded_file.name.split('.')[-1].lower()
    file_bytes = uploaded_file.read()
    
    if file_type == 'pdf':
        return extract_text_from_pdf(file_bytes)
    elif file_type in ['docx', 'doc']:
        return extract_text_from_docx(file_bytes)
    elif file_type == 'txt':
        return file_bytes.decode('utf-8')
    else:
        return ""
