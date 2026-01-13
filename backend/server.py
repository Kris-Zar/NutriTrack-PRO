from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, date
import base64
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    age: int = 25
    weight: float = 70.0
    height: float = 175.0
    gender: str = "Male"
    activity_level: str = "moderate"
    fitness_goal: str = "maintain"
    daily_calorie_target: int = 2000
    protein_target: int = 150
    carbs_target: int = 250
    fats_target: int = 65
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FoodItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    calories: float
    protein: float = 0
    carbs: float = 0
    fats: float = 0
    serving_size: str = "1 serving"
    date: str = Field(default_factory=lambda: date.today().isoformat())
    meal_type: str = "snack"  # breakfast, lunch, dinner, snack
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    image_url: Optional[str] = None

class AnalyzedFood(BaseModel):
    food_name: str
    calories: float
    protein: float
    carbs: float
    fats: float
    description: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "NutriTrack API is running"}

# Profile endpoints
@api_router.post("/profile", response_model=UserProfile)
async def create_profile(profile: UserProfile):
    profile_dict = profile.model_dump()
    profile_dict['created_at'] = profile_dict['created_at'].isoformat()
    await db.profiles.insert_one(profile_dict)
    return profile

@api_router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    profile = await db.profiles.find_one({"id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    if isinstance(profile['created_at'], str):
        profile['created_at'] = datetime.fromisoformat(profile['created_at'])
    return profile

@api_router.put("/profile/{user_id}", response_model=UserProfile)
async def update_profile(user_id: str, profile: UserProfile):
    profile_dict = profile.model_dump()
    profile_dict['created_at'] = profile_dict['created_at'].isoformat()
    result = await db.profiles.update_one(
        {"id": user_id},
        {"$set": profile_dict}
    )
    if result.matched_count == 0:
        # Create new profile if doesn't exist
        await db.profiles.insert_one(profile_dict)
    return profile

# Food logging endpoints
@api_router.post("/food", response_model=FoodItem)
async def log_food(food: FoodItem):
    food_dict = food.model_dump()
    food_dict['created_at'] = food_dict['created_at'].isoformat()
    await db.foods.insert_one(food_dict)
    return food

@api_router.get("/food/{user_id}", response_model=List[FoodItem])
async def get_foods(user_id: str, date_filter: Optional[str] = None):
    query = {"user_id": user_id}
    if date_filter:
        query["date"] = date_filter
    foods = await db.foods.find(query, {"_id": 0}).to_list(1000)
    for food in foods:
        if isinstance(food['created_at'], str):
            food['created_at'] = datetime.fromisoformat(food['created_at'])
    return foods

@api_router.delete("/food/{food_id}")
async def delete_food(food_id: str):
    result = await db.foods.delete_one({"id": food_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Food not found")
    return {"message": "Food deleted successfully"}

# Image analysis endpoint
@api_router.post("/analyze-food-image", response_model=AnalyzedFood)
async def analyze_food_image(file: UploadFile = File(...)):
    try:
        # Read image file
        contents = await file.read()
        
        # Convert to base64
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        # Get API key
        google_api_key = os.environ.get('GOOGLE_API_KEY')
        if not google_api_key:
            raise HTTPException(status_code=500, detail="Google API key not configured")
        
        # Initialize Gemini chat
        chat = LlmChat(
            api_key=google_api_key,
            session_id=f"food-analysis-{uuid.uuid4()}",
            system_message="You are a nutrition expert. Analyze food images and provide detailed nutritional information."
        ).with_model("gemini", "gemini-2.0-flash")
        
        # Create image content
        image_content = ImageContent(image_base64=base64_image)
        
        # Analyze the image
        prompt = """Analyze this food image and provide:
1. Food name
2. Estimated calories (kcal)
3. Estimated protein (grams)
4. Estimated carbohydrates (grams)
5. Estimated fats (grams)
6. Brief description

Respond in this exact format:
Food: [name]
Calories: [number]
Protein: [number]g
Carbs: [number]g
Fats: [number]g
Description: [brief description]"""
        
        user_message = UserMessage(
            text=prompt,
            file_contents=[image_content]
        )
        
        response = await chat.send_message(user_message)
        
        # Parse the response
        lines = response.strip().split('\n')
        food_data = {}
        
        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip().lower()
                value = value.strip()
                
                if key == 'food':
                    food_data['food_name'] = value
                elif key == 'calories':
                    food_data['calories'] = float(value.replace('kcal', '').strip())
                elif key == 'protein':
                    food_data['protein'] = float(value.replace('g', '').strip())
                elif key == 'carbs':
                    food_data['carbs'] = float(value.replace('g', '').strip())
                elif key == 'fats':
                    food_data['fats'] = float(value.replace('g', '').strip())
                elif key == 'description':
                    food_data['description'] = value
        
        # Set defaults if parsing failed
        result = AnalyzedFood(
            food_name=food_data.get('food_name', 'Unknown food'),
            calories=food_data.get('calories', 0),
            protein=food_data.get('protein', 0),
            carbs=food_data.get('carbs', 0),
            fats=food_data.get('fats', 0),
            description=food_data.get('description', 'Food analysis completed')
        )
        
        return result
        
    except Exception as e:
        logging.error(f"Error analyzing food image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")

# Dashboard stats
@api_router.get("/stats/{user_id}")
async def get_stats(user_id: str, date_filter: Optional[str] = None):
    if not date_filter:
        date_filter = date.today().isoformat()
    
    # Get today's foods
    foods = await db.foods.find({"user_id": user_id, "date": date_filter}, {"_id": 0}).to_list(1000)
    
    total_calories = sum(food['calories'] for food in foods)
    total_protein = sum(food.get('protein', 0) for food in foods)
    total_carbs = sum(food.get('carbs', 0) for food in foods)
    total_fats = sum(food.get('fats', 0) for food in foods)
    
    # Get profile for targets
    profile = await db.profiles.find_one({"id": user_id}, {"_id": 0})
    
    return {
        "date": date_filter,
        "meals_logged": len(foods),
        "calories": total_calories,
        "protein": total_protein,
        "carbs": total_carbs,
        "fats": total_fats,
        "calorie_target": profile.get('daily_calorie_target', 2000) if profile else 2000,
        "protein_target": profile.get('protein_target', 150) if profile else 150,
        "carbs_target": profile.get('carbs_target', 250) if profile else 250,
        "fats_target": profile.get('fats_target', 65) if profile else 65
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()