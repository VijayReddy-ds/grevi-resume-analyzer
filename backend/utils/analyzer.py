import json
import re
from utils.nlp_engine import extract_skills, calculate_similarity

# Define intelligent project mappings based on role and skills
PROJECT_MAPPINGS = {
    "Data Science": [
        {"skill": "nlp", "project": "Sentiment Analysis using NLP"},
        {"skill": "machine learning", "project": "Customer Churn Prediction using ML"},
        {"skill": "deep learning", "project": "Image Classification with CNN"},
        {"skill": "python", "project": "Data Cleaning and EDA Pipeline"},
        {"skill": "pandas", "project": "Sales Data Analysis Dashboard"}
    ],
    "Web Development": [
        {"skill": "react", "project": "Full-stack e-commerce app"},
        {"skill": "node.js", "project": "Authentication system with JWT"},
        {"skill": "javascript", "project": "Interactive Portfolio website with API integration"},
        {"skill": "django", "project": "Blogging platform with User Roles"},
        {"skill": "api", "project": "RESTful Task Management API"}
    ],
    "Cloud/DevOps": [
        {"skill": "docker", "project": "Containerized Microservices Architecture"},
        {"skill": "aws", "project": "Serverless API using AWS Lambda"},
        {"skill": "ci/cd", "project": "Automated Deployment Pipeline with GitHub Actions"}
    ],
    "Mobile": [
        {"skill": "react native", "project": "Cross-platform Mobile To-Do App"},
        {"skill": "android", "project": "Location-based Android Weather App"},
        {"skill": "swift", "project": "iOS Expense Tracker"}
    ],
    "General / Uncategorized": [
        {"skill": "python", "project": "Automated Web Scraper"},
        {"skill": "sql", "project": "Database schema design for a library"},
        {"skill": "git", "project": "Open source project contribution"}
    ]
}

def detect_role(skills):
    """Categorize the primary role based on skills."""
    categories = {
        "Data Science": ["python", "r", "machine learning", "deep learning", "nlp", "pandas", "tensorflow", "pytorch", "data analysis", "statistics"],
        "Web Development": ["html", "css", "javascript", "react", "node.js", "django", "flask", "php", "web development", "next.js"],
        "Cloud/DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "terraform", "devops"],
        "Mobile": ["android", "ios", "swift", "kotlin", "react native", "flutter"]
    }
    
    scores = {cat: 0 for cat in categories}
    for skill in skills:
        for cat, cat_skills in categories.items():
            if skill in cat_skills:
                scores[cat] += 1
                
    max_cat = max(scores, key=scores.get)
    if scores[max_cat] > 0:
        return max_cat
    return "General / Uncategorized"

def compute_match_score(skill_match_pct, text_similarity, experience_relevance):
    """
    Weighted scoring:
    - Skills -> 50%
    - Keywords -> 30%
    - Experience -> 20%
    """
    score = (skill_match_pct * 50) + (text_similarity * 30) + (experience_relevance * 20)
    return round(score)

def calculate_experience_relevance(resume_text, jd_text):
    """Heuristic: Compute overlap of strong action verbs indicating experience level."""
    action_verbs = ['developed', 'managed', 'led', 'designed', 'created', 'implemented', 'optimized', 'reduced', 'increased', 'architected', 'spearheaded']
    res_lower = resume_text.lower()
    jd_lower = jd_text.lower()
    
    jd_verbs = [v for v in action_verbs if v in jd_lower]
    if not jd_verbs:
        return 1.0 # If JD doesn't ask for specific action verbs, grant full relevance
        
    res_verbs = [v for v in action_verbs if v in res_lower]
    overlap = set(jd_verbs).intersection(set(res_verbs))
    
    return len(overlap) / len(jd_verbs)

def get_top_missing_skills(missing_skills):
    """Select the TOP 3 most important missing skills."""
    # For a deterministic and simple approach, we sort alphabetically, but prioritize known core skills
    # Here we just take the first 3 from the set
    return sorted(list(missing_skills))[:3]

def recommend_projects(role, missing_skills):
    """Generate ONLY TOP 3 HIGH-VALUE PROJECTS based on role and missing skills."""
    projects = []
    role_projects = PROJECT_MAPPINGS.get(role, PROJECT_MAPPINGS["General / Uncategorized"])
    
    # 1. Try to match missing skills to specific projects
    for missing in missing_skills:
        for proj in role_projects:
            if proj["skill"] == missing.lower() and proj["project"] not in projects:
                projects.append(proj["project"])
                
    # 2. Fill the rest with generic high-value projects for the role
    for proj in role_projects:
        if len(projects) >= 3:
            break
        if proj["project"] not in projects:
            projects.append(proj["project"])
            
    return projects[:3]

def generate_resume_improvements(resume_text):
    """Detect missing metrics and weak project descriptions."""
    improvements = []
    
    # Detect missing metrics (%, $, or multipliers)
    if not re.search(r'\d+%|\$\d+|\d+x', resume_text):
        improvements.append("Missing metrics: Add numbers, percentages, or dollar amounts to demonstrate impact.")
        
    # Weak action verbs
    weak_words = ['helped', 'worked on', 'assisted', 'responsible for']
    res_lower = resume_text.lower()
    found_weak = [w for w in weak_words if w in res_lower]
    if found_weak:
        improvements.append(f"Weak descriptions: Avoid passive phrases like '{found_weak[0]}'. Use strong action verbs like 'Led', 'Developed', or 'Optimized'.")
        
    if not improvements:
        improvements.append("Your resume descriptions look strong and metric-driven!")
        
    return improvements

def generate_json_output(resume_text, jd_text):
    """Main orchestration function to generate the structured JSON output."""
    
    # 1. Extract Skills
    resume_skills = set(extract_skills(resume_text))
    jd_skills = set(extract_skills(jd_text))
    
    # 2. Skill Matching
    matched_skills = resume_skills.intersection(jd_skills)
    missing_skills = jd_skills.difference(resume_skills)
    irrelevant_skills = resume_skills.difference(jd_skills)
    
    skill_match_pct = (len(matched_skills) / len(jd_skills)) if len(jd_skills) > 0 else 0
    
    # 3. Keyword / Semantic Match
    text_similarity = calculate_similarity(resume_text, jd_text)
    
    # 4. Experience Relevance
    exp_relevance = calculate_experience_relevance(resume_text, jd_text)
    
    # 5. Compute Match Score
    final_score = compute_match_score(skill_match_pct, text_similarity, exp_relevance)
    final_score = max(0, min(100, final_score))
    
    # 6. Role Detection
    resume_role = detect_role(resume_skills)
    jd_role = detect_role(jd_skills)
    
    match_summary = "Your profile aligns perfectly with the target role."
    if resume_role != jd_role and jd_role != "General / Uncategorized" and resume_role != "General / Uncategorized":
        match_summary = f"Your profile aligns more with {resume_role} while the job role is {jd_role}."
        
    # 7. Extract Top Missing Skills
    top_missing = get_top_missing_skills(missing_skills)
    
    # 8. Recommend Projects
    top_projects = recommend_projects(jd_role, missing_skills)
    
    # 9. Feedback Engine
    resume_improvements = generate_resume_improvements(resume_text)
    
    # Ensure missing skills without JDs don't look weird
    if len(jd_skills) == 0:
        resume_improvements.append("Job description lacks parseable technical keywords.")
        
    # Construct Output JSON
    output = {
        "app_name": "Grevi Resume Analyzer",
        "match_score": final_score,
        "role_detected": resume_role,
        "job_role": jd_role,
        "match_summary": match_summary,
        "analysis": {
            "matched_skills": list(matched_skills),
            "missing_skills": list(missing_skills),
            "irrelevant_skills": list(irrelevant_skills)
        },
        "top_missing_skills": top_missing,
        "top_project_recommendations": top_projects,
        "score_breakdown": {
            "skills_match": round(skill_match_pct * 100),
            "keyword_match": round(text_similarity * 100),
            "experience_relevance": round(exp_relevance * 100)
        },
        "suggestions": {
            "skills_to_add": top_missing,
            "projects_to_build": top_projects,
            "resume_improvements": resume_improvements
        }
    }
    
    return output
