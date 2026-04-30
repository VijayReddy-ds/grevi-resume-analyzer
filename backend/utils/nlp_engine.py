import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

# A comprehensive list of common skills for matching
COMMON_SKILLS = [
    # Data Science & AI
    "python", "r", "sql", "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy", "matplotlib",
    "seaborn", "tableau", "power bi", "hadoop", "spark", "data analysis", "data mining",
    "artificial intelligence", "predictive modeling", "statistics",
    
    # Web Development
    "html", "css", "javascript", "typescript", "react", "angular", "vue", "node.js",
    "express", "django", "flask", "fastapi", "php", "ruby on rails", "spring boot",
    "java", "c#", ".net", "bootstrap", "tailwind css", "web development", "rest api",
    "graphql", "next.js",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab ci", "github actions",
    "terraform", "ansible", "linux", "bash", "shell scripting", "ci/cd", "devops", "cloud computing",
    
    # Database
    "mysql", "postgresql", "mongodb", "redis", "cassandra", "elasticsearch", "oracle",
    "nosql", "relational database",
    
    # Mobile
    "android", "ios", "swift", "kotlin", "react native", "flutter", "dart",
    
    # Soft Skills & Others
    "project management", "agile", "scrum", "leadership", "communication", "problem solving",
    "teamwork", "git", "github", "bitbucket", "jira"
]

def preprocess_text(text):
    """Basic text cleaning: lowercase, remove special characters."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_skills(text):
    """Extract skills from text based on predefined list and some NLP."""
    extracted = set()
    cleaned_text = preprocess_text(text)
    
    # 1. Keyword Matching
    for skill in COMMON_SKILLS:
        # Use regex to match whole words/phrases
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, cleaned_text):
            extracted.add(skill)
            
    # 2. Add Spacy Noun Chunks (Optional enhancement for unknown skills)
    if nlp:
        doc = nlp(cleaned_text)
        for chunk in doc.noun_chunks:
            # Filter simple, short noun chunks that might be skills
            if 2 < len(chunk.text) < 20 and chunk.text not in extracted:
                # Basic heuristic: if it's mostly alphabetical and not a stop word
                if chunk.text.replace(' ', '').isalpha() and not doc.vocab[chunk.text].is_stop:
                    # We might add it if we want to be aggressive, but for now we rely on the dictionary
                    # extracted.add(chunk.text)
                    pass
                    
    return list(extracted)

def calculate_similarity(text1, text2):
    """Calculate cosine similarity using TF-IDF."""
    if not text1 or not text2:
        return 0.0
        
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform([preprocess_text(text1), preprocess_text(text2)])
        sim_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(sim_score)
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0.0
