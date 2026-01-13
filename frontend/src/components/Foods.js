import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Foods = ({ userId, onFoodAdded }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadFoods();
  }, [userId, selectedDate]);

  const loadFoods = async () => {
    try {
      const response = await axios.get(`${API}/food/${userId}?date_filter=${selectedDate}`);
      setFoods(response.data);
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFood = async (foodId) => {
    try {
      await axios.delete(`${API}/food/${foodId}`);
      loadFoods();
      onFoodAdded();
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  const getMealTypeEmoji = (mealType) => {
    const emojis = {
      breakfast: '🍳',
      lunch: '🍛',
      dinner: '🍴',
      snack: '🍪'
    };
    return emojis[mealType] || '🍽️';
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto" data-testid="foods-container">
      <div className="bg-[#1a1a1c] p-6 rounded-lg border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-green-500 mr-2 text-2xl">🍎</span>
            <h2 className="text-2xl font-bold">Food Log</h2>
          </div>
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {foods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No foods logged for this date</p>
            <p className="text-gray-500 text-sm mt-2">Go to "Log Meals" to add food items</p>
          </div>
        ) : (
          <div className="space-y-4">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
              const mealFoods = foods.filter(f => f.meal_type === mealType);
              if (mealFoods.length === 0) return null;

              const totalCalories = mealFoods.reduce((sum, f) => sum + f.calories, 0);
              const totalProtein = mealFoods.reduce((sum, f) => sum + (f.protein || 0), 0);
              const totalCarbs = mealFoods.reduce((sum, f) => sum + (f.carbs || 0), 0);
              const totalFats = mealFoods.reduce((sum, f) => sum + (f.fats || 0), 0);

              return (
                <div key={mealType} className="bg-[#0f0f10] p-4 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-3 capitalize flex items-center">
                    <span className="mr-2">{getMealTypeEmoji(mealType)}</span>
                    {mealType}
                    <span className="ml-auto text-sm text-gray-400">
                      {Math.round(totalCalories)} cal
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {mealFoods.map((food) => (
                      <div
                        key={food.id}
                        className="flex items-center justify-between bg-[#1a1a1c] p-3 rounded border border-gray-700"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-white">{food.name}</div>
                          <div className="text-sm text-gray-400">
                            {food.serving_size} • {Math.round(food.calories)} cal
                          </div>
                          {(food.protein > 0 || food.carbs > 0 || food.fats > 0) && (
                            <div className="text-xs text-gray-500 mt-1">
                              P: {Math.round(food.protein)}g • C: {Math.round(food.carbs)}g • F: {Math.round(food.fats)}g
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteFood(food.id)}
                          className="ml-4 text-red-500 hover:text-red-400 transition-colors"
                          data-testid={`delete-food-${food.id}`}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <div className="text-gray-400">Calories</div>
                      <div className="font-semibold text-white">{Math.round(totalCalories)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Protein</div>
                      <div className="font-semibold text-blue-500">{Math.round(totalProtein)}g</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Carbs</div>
                      <div className="font-semibold text-yellow-500">{Math.round(totalCarbs)}g</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Fats</div>
                      <div className="font-semibold text-red-500">{Math.round(totalFats)}g</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Foods;