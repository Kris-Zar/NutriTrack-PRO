from datetime import date, datetime, timezone
import base64
import logging
import os
from pathlib import Path
from typing import List, Optional
import uuid

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    from motor.motor_asyncio import AsyncIOMotorClient
except ImportError:  # pragma: no cover - demo mode does not need the AI package
    AsyncIOMotorClient = None

try:
    from emergentintegrations.llm.chat import ImageContent, LlmChat, UserMessage
except ImportError:  # pragma: no cover - demo mode does not need the AI package
    ImageContent = LlmChat = UserMessage = None

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ.get("MONGO_URL") or os.environ.get("MONGO_URI")
db_name = os.environ.get("DB_NAME", "nutritrack")
demo_requested = os.environ.get("DEMO_MODE", "").lower() in {"1", "true", "yes", "on"}
DEMO_MODE = demo_requested or not mongo_url

client = None
db = None
if not DEMO_MODE and AsyncIOMotorClient:
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

memory_profiles = {}
memory_foods = {}

app = FastAPI(title="NutriTrack API")
api_router = APIRouter(prefix="/api")


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
    meal_type: str = "snack"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    image_url: Optional[str] = None


class AnalyzedFood(BaseModel):
    food_name: str
    calories: float
    protein: float
    carbs: float
    fats: float
    description: str


def stored_model(model):
    data = model.model_dump()
    data["created_at"] = data["created_at"].isoformat()
    return data


def restore_model(data, model_type):
    if isinstance(data.get("created_at"), str):
        data["created_at"] = datetime.fromisoformat(data["created_at"])
    return model_type(**data)


@api_router.get("/")
async def root():
    return {"message": "NutriTrack API is running", "mode": "demo" if DEMO_MODE else "production"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "mode": "demo" if DEMO_MODE else "production", "database": "memory" if DEMO_MODE else "mongodb"}


@api_router.post("/profile", response_model=UserProfile)
async def create_profile(profile: UserProfile):
    data = stored_model(profile)
    if DEMO_MODE:
        memory_profiles[profile.id] = data
    else:
        await db.profiles.insert_one(data)
    return profile


@api_router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    profile = memory_profiles.get(user_id) if DEMO_MODE else await db.profiles.find_one({"id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return restore_model(profile, UserProfile)


@api_router.put("/profile/{user_id}", response_model=UserProfile)
async def update_profile(user_id: str, profile: UserProfile):
    data = stored_model(profile)
    if DEMO_MODE:
        memory_profiles[user_id] = data
    else:
        result = await db.profiles.update_one({"id": user_id}, {"$set": data})
        if result.matched_count == 0:
            await db.profiles.insert_one(data)
    return profile


@api_router.post("/food", response_model=FoodItem)
async def log_food(food: FoodItem):
    data = stored_model(food)
    if DEMO_MODE:
        memory_foods[food.id] = data
    else:
        await db.foods.insert_one(data)
    return food


@api_router.get("/food/{user_id}", response_model=List[FoodItem])
async def get_foods(user_id: str, date_filter: Optional[str] = None):
    if DEMO_MODE:
        foods = [item for item in memory_foods.values() if item["user_id"] == user_id]
    else:
        query = {"user_id": user_id}
        if date_filter:
            query["date"] = date_filter
        foods = await db.foods.find(query, {"_id": 0}).to_list(1000)
    if date_filter:
        foods = [item for item in foods if item["date"] == date_filter]
    return [restore_model(item, FoodItem) for item in foods]


@api_router.delete("/food/{food_id}")
async def delete_food(food_id: str):
    if DEMO_MODE:
        deleted = memory_foods.pop(food_id, None)
        deleted_count = 1 if deleted else 0
    else:
        result = await db.foods.delete_one({"id": food_id})
        deleted_count = result.deleted_count
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Food not found")
    return {"message": "Food deleted successfully"}


@api_router.post("/analyze-food-image", response_model=AnalyzedFood)
async def analyze_food_image(file: UploadFile = File(...)):
    contents = await file.read()
    google_api_key = os.environ.get("GOOGLE_API_KEY")
    if not google_api_key or not LlmChat:
        return AnalyzedFood(
            food_name="Demo grain bowl",
            calories=520,
            protein=24,
            carbs=62,
            fats=18,
            description="Demo estimate used because live image analysis is not configured.",
        )

    try:
        base64_image = base64.b64encode(contents).decode("utf-8")
        chat = LlmChat(
            api_key=google_api_key,
            session_id=f"food-analysis-{uuid.uuid4()}",
            system_message="You are a nutrition expert. Analyze food images and provide detailed nutritional information.",
        ).with_model("gemini", "gemini-2.0-flash")
        prompt = """Analyze this food image and provide:
1. Food name
2. Estimated calories (kcal)
3. Estimated protein (grams)
4. Estimated carbohydrates (grams)
5. Estimated fats (grams)
6. Brief description

Respond in this exact format:
Food: [name]
Calories: [number] kcal
Protein: [number]g
Carbs: [number]g
Fats: [number]g
Description: [brief description]"""
        response = await chat.send_message(UserMessage(text=prompt, file_contents=[ImageContent(image_base64=base64_image)]))
        food_data = {}
        for line in response.strip().split("\n"):
            if ":" not in line:
                continue
            key, value = [part.strip() for part in line.split(":", 1)]
            key = key.lower()
            if key == "food":
                food_data["food_name"] = value
            elif key == "calories":
                food_data["calories"] = float(value.replace("kcal", "").strip())
            elif key in {"protein", "carbs", "fats"}:
                food_data[key] = float(value.replace("g", "").strip())
            elif key == "description":
                food_data["description"] = value
        return AnalyzedFood(
            food_name=food_data.get("food_name", "Unknown food"),
            calories=food_data.get("calories", 0),
            protein=food_data.get("protein", 0),
            carbs=food_data.get("carbs", 0),
            fats=food_data.get("fats", 0),
            description=food_data.get("description", "Food analysis completed"),
        )
    except Exception as exc:
        logging.exception("Error analyzing food image")
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {exc}")


@api_router.get("/stats/{user_id}")
async def get_stats(user_id: str, date_filter: Optional[str] = None):
    date_filter = date_filter or date.today().isoformat()
    if DEMO_MODE:
        foods = [item for item in memory_foods.values() if item["user_id"] == user_id and item["date"] == date_filter]
        profile = memory_profiles.get(user_id)
    else:
        foods = await db.foods.find({"user_id": user_id, "date": date_filter}, {"_id": 0}).to_list(1000)
        profile = await db.profiles.find_one({"id": user_id}, {"_id": 0})
    return {
        "date": date_filter,
        "meals_logged": len(foods),
        "calories": sum(food["calories"] for food in foods),
        "protein": sum(food.get("protein", 0) for food in foods),
        "carbs": sum(food.get("carbs", 0) for food in foods),
        "fats": sum(food.get("fats", 0) for food in foods),
        "calorie_target": profile.get("daily_calorie_target", 2000) if profile else 2000,
        "protein_target": profile.get("protein_target", 150) if profile else 150,
        "carbs_target": profile.get("carbs_target", 250) if profile else 250,
        "fats_target": profile.get("fats_target", 65) if profile else 65,
    }


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()
