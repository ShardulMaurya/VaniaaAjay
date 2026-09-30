import os
import json
import re
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Vani-Ajay Livelihood & NSQF Advisor",
    description="AI-Driven Voice & Conversational Assistant for SC Communities under PM-AJAY GIA Component",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Knowledge Base
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "knowledge_base.json")
try:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        KB = json.load(f)
except Exception as e:
    KB = {"districts": {}, "nsqf_courses": [], "pm_ajay_gia_guidelines": {}}

# --- SCHEMAS ---
class VoiceProfileRequest(BaseModel):
    user_speech: str
    selected_district: Optional[str] = "Bhopal"
    education: Optional[str] = "8th Pass"
    aspiration_type: Optional[str] = "self_employment" # "self_employment" or "wage_job"
    language: Optional[str] = "Hindi"

class CourseRecommendation(BaseModel):
    qp_code: str
    job_role: str
    nsqf_level: int
    sector: str
    min_education: str
    duration_hours: int
    description: str
    match_score: int
    reasoning: str
    self_employment_potential: str
    wage_employment_avg_monthly: int

class GIABenefitSummary(BaseModel):
    training_cost: str
    toolkit_grant: str
    capital_subsidy: str
    credit_support: str

class AdviceResponse(BaseModel):
    user_speech: str
    detected_intent: Dict[str, Any]
    district_info: Dict[str, Any]
    recommendations: List[CourseRecommendation]
    gia_benefits: GIABenefitSummary
    spoken_summary_hi: str
    spoken_summary_en: str

# --- CORE NLP & RECOMMENDATION LOGIC ---
def extract_profile_from_speech(text: str) -> Dict[str, Any]:
    cleaned = text.lower()
    
    # Check interest tokens
    interests = []
    if any(k in cleaned for k in ["पानी", "सिंचाई", "पंप", "नल", "water", "irrigation", "pump", "pipe"]):
        interests.append("irrigation")
    if any(k in cleaned for k in ["दूध", "डेयरी", "गाय", "भैंस", "पशु", "dairy", "milk", "cattle"]):
        interests.append("dairy")
    if any(k in cleaned for k in ["सोलर", "धूप", "सौर", "solar", "panel", "bijli", "electric"]):
        interests.append("solar")
    if any(k in cleaned for k in ["मसाला", "अनाज", "चक्की", "आटा", "food", "spice", "grain", "mill"]):
        interests.append("food_processing")
    if any(k in cleaned for k in ["मशरूम", "खाद", "organic", "fertilizer", "mushroom"]):
        interests.append("mushroom")
    if any(k in cleaned for k in ["गाड़ी", "मोटरसाइकिल", "ट्रैक्टर", "मैकेनिक", "tractor", "bike", "mechanic", "repair"]):
        interests.append("automotive")

    # Education detection
    edu = "8th Pass"
    if any(k in cleaned for k in ["10वीं", "दसवीं", "10th", "matric"]):
        edu = "10th Pass"
    elif any(k in cleaned for k in ["12वीं", "बारहवीं", "12th", "inter"]):
        edu = "12th Pass"
    elif any(k in cleaned for k in ["5वीं", "पांचवीं", "5th", "uneducated", "कम पढ़ा"]):
        edu = "5th Pass"

    # Enterprise vs Job
    aspiration = "self_employment"
    if any(k in cleaned for k in ["नौकरी", "कंपनी", "वेतन", "job", "salary", "wage"]):
        aspiration = "wage_job"

    return {
        "interests": interests,
        "education": edu,
        "aspiration": aspiration
    }

def calculate_nsqf_match(course: dict, profile: dict, speech: str) -> int:
    score = 40 # Base eligibility score
    keywords = [k.lower() for k in course.get("keywords", [])]
    user_text = speech.lower()

    # Keyword semantic hit
    for kw in keywords:
        if kw in user_text:
            score += 20

    # Sector interest match
    for interest in profile["interests"]:
        if any(interest in kw for kw in keywords):
            score += 25

    return min(score, 98)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Vani-Ajay Core Livelihood Engine", "version": "1.0.0"}

@app.get("/api/metadata")
def get_metadata():
    return {
        "districts": list(KB["districts"].keys()),
        "total_courses": len(KB["nsqf_courses"]),
        "sectors": list(set(c["sector"] for c in KB["nsqf_courses"]))
    }

@app.post("/api/advisor/analyze", response_model=AdviceResponse)
def analyze_livelihood_voice(req: VoiceProfileRequest):
    speech = req.user_speech.strip()
    if not speech:
        raise HTTPException(status_code=400, detail="Voice transcript or query is required.")

    # 1. Profile Extraction
    profile = extract_profile_from_speech(speech)
    if req.education:
        profile["education"] = req.education
    if req.aspiration_type:
        profile["aspiration"] = req.aspiration_type

    # 2. Match NSQF Courses
    scored_courses = []
    for c in KB["nsqf_courses"]:
        match_score = calculate_nsqf_match(c, profile, speech)
        
        # Build reasoning explanation
        reasoning = (
            f"Matches your experience in {c['sector']}. This level-{c['nsqf_level']} certified program "
            f"qualifies you for PM-AJAY enterprise funding and has high rural demand in {req.selected_district}."
        )

        scored_courses.append(CourseRecommendation(
            qp_code=c["qp_code"],
            job_role=c["job_role"],
            nsqf_level=c["nsqf_level"],
            sector=c["sector"],
            min_education=c["min_education"],
            duration_hours=c["duration_hours"],
            description=c["description"],
            match_score=match_score,
            reasoning=reasoning,
            self_employment_potential=c["self_employment_potential"],
            wage_employment_avg_monthly=c["wage_employment_avg_monthly"]
        ))

    # Sort top 3 recommendations
    scored_courses.sort(key=lambda x: x.match_score, reverse=True)
    top_recommendations = scored_courses[:3]

    # 3. Pull District & Scheme Details
    dist_data = KB["districts"].get(req.selected_district, KB["districts"]["Bhopal"])
    gia_rules = KB["pm_ajay_gia_guidelines"]

    gia_benefits = GIABenefitSummary(
        training_cost=gia_rules["skill_development_stipend"],
        toolkit_grant=gia_rules["tool_kit_grant"],
        capital_subsidy=gia_rules["micro_enterprise_capital_subsidy"],
        credit_support=gia_rules["credit_linkage"]
    )

    # 4. Spoken Responses (Hindi & English for direct TTS playback)
    primary_job = top_recommendations[0].job_role
    primary_qp = top_recommendations[0].qp_code

    spoken_hi = (
        f"नमस्ते। आपके अनुभव और {req.selected_district} जिले में मांग के अनुसार, आपके लिए सबसे उपयुक्त प्रशिक्षण "
        f"'{primary_job}' (एनएसक्यूएफ स्तर {top_recommendations[0].nsqf_level}) है। पीएम-अजय योजना के तहत आपको "
        f"यह प्रशिक्षण 100% निशुल्क मिलेगा, साथ में ₹15,000 तक की टूलकिट और अपना स्वरोजगार शुरू करने के लिए "
        f"₹50,000 तक का सरकारी अनुदान भी मिलेगा।"
    )

    spoken_en = (
        f"Hello. Based on your inputs and market demand in {req.selected_district}, your best-fit skill course is "
        f"'{primary_job}' (NSQF Level {top_recommendations[0].nsqf_level}, QP Code {primary_qp}). Under PM-AJAY GIA, "
        f"you are eligible for 100% free training with stipend, a ₹15,000 free toolkit grant, and up to ₹50,000 enterprise subsidy."
    )

    return AdviceResponse(
        user_speech=speech,
        detected_intent=profile,
        district_info=dist_data,
        recommendations=top_recommendations,
        gia_benefits=gia_benefits,
        spoken_summary_hi=spoken_hi,
        spoken_summary_en=spoken_en
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)