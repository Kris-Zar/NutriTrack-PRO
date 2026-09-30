import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LogMeals = ({ userId, onMealLogged }) => {
  const [mealType, setMealType] = useState('breakfast');
  const [manualEntry, setManualEntry] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    serving_size: '1 serving'
  });
  const [imageFile, setImageFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
      setError('');
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await axios.post(`${API}/analyze-food-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAnalysisResult(response.data);
      // Pre-fill the form with analyzed data
      setFormData({
        name: response.data.food_name,
        calories: response.data.calories.toString(),
        protein: response.data.protein.toString(),
        carbs: response.data.carbs.toString(),
        fats: response.data.fats.toString(),
        serving_size: '1 serving'
      });
      setManualEntry(true); // Switch to manual entry to show the filled form
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze image. Please try again or enter manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const foodData = {
        user_id: userId,
        name: formData.name,
        calories: parseFloat(formData.calories) || 0,
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fats: parseFloat(formData.fats) || 0,
        serving_size: formData.serving_size,
        meal_type: mealType,
        date: new Date().toISOString().split('T')[0]
      };

      await axios.post(`${API}/food`, foodData);
      
      // Reset form
      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        serving_size: '1 serving'
      });
      setImageFile(null);
      setImagePreview(null);
      setAnalysisResult(null);
      
      onMealLogged();
      alert('Food logged successfully!');
    } catch (error) {
      console.error('Error logging food:', error);
      setError('Failed to log food. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto" data-testid="log-meals-container">
      <div className="bg-[#1a1a1c] p-6 rounded-lg border border-gray-800">
        <div className="flex items-center mb-6">
          <span className="text-green-500 mr-2 text-2xl">🍽️</span>
          <h2 className="text-2xl font-bold">Log Meals</h2>
        </div>

        {/* Meal Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-3">Meal Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'breakfast', label: 'Breakfast', emoji: '🍳' },
              { value: 'lunch', label: 'Lunch', emoji: '🍛' },
              { value: 'dinner', label: 'Dinner', emoji: '🍴' },
              { value: 'snack', label: 'Snack', emoji: '🍪' }
            ].map((meal) => (
              <button
                key={meal.value}
                type="button"
                data-testid={`meal-type-${meal.value}`}
                onClick={() => setMealType(meal.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  mealType === meal.value
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{meal.emoji}</div>
                <div className="text-sm font-medium">{meal.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Entry Method Toggle */}
        <div className="mb-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setManualEntry(true)}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                manualEntry
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              data-testid="manual-entry-toggle"
            >
              ✏️ Manual Entry
            </button>
            <button
              type="button"
              onClick={() => setManualEntry(false)}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                !manualEntry
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              data-testid="image-analysis-toggle"
            >
              📸 Image Analysis
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {!manualEntry && (
          <div className="mb-6">
            <div className="bg-[#0f0f10] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">🤖 AI-Powered Food Detection</h3>
              <p className="text-gray-400 text-sm mb-4">
                Upload a photo of your food and our AI will detect what it is and estimate nutritional information!
              </p>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="food-image-upload"
                    data-testid="image-upload-input"
                  />
                  <label
                    htmlFor="food-image-upload"
                    className="block w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg cursor-pointer text-center transition-colors"
                  >
                    {imageFile ? 'Change Image' : 'Choose Image'}
                  </label>
                </div>

                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Food preview"
                      className="w-full max-h-64 object-cover rounded-lg"
                      data-testid="image-preview"
                    />
                  </div>
                )}

                {imageFile && !analysisResult && (
                  <button
                    type="button"
                    onClick={analyzeImage}
                    disabled={analyzing}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-black font-semibold py-3 rounded-lg transition-colors"
                    data-testid="analyze-image-button"
                  >
                    {analyzing ? '🔄 Analyzing...' : '🔍 Analyze Food Image'}
                  </button>
                )}

                {analysisResult && (
                  <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
                    <h4 className="text-green-500 font-semibold mb-2">✅ Analysis Complete!</h4>
                    <div className="text-sm space-y-1">
                      <p className="text-white"><strong>Detected:</strong> {analysisResult.food_name}</p>
                      <p className="text-gray-300"><strong>Calories:</strong> {Math.round(analysisResult.calories)} kcal</p>
                      <p className="text-gray-300">
                        <strong>Macros:</strong> P: {Math.round(analysisResult.protein)}g • C: {Math.round(analysisResult.carbs)}g • F: {Math.round(analysisResult.fats)}g
                      </p>
                      <p className="text-gray-400 text-xs mt-2">{analysisResult.description}</p>
                    </div>
                    <p className="text-green-500 text-xs mt-3">
                      The form below has been pre-filled. You can edit the values before logging.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual Entry Form */}
        {(manualEntry || analysisResult) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Food Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Grilled Chicken Breast"
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                data-testid="food-name-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Calories (kcal) *</label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  required
                  step="0.1"
                  placeholder="0"
                  className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  data-testid="food-calories-input"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Serving Size</label>
                <input
                  type="text"
                  name="serving_size"
                  value={formData.serving_size}
                  onChange={handleChange}
                  placeholder="1 serving"
                  className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  data-testid="food-serving-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="0"
                  className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  data-testid="food-protein-input"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Carbs (g)</label>
                <input
                  type="number"
                  name="carbs"
                  value={formData.carbs}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="0"
                  className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  data-testid="food-carbs-input"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Fats (g)</label>
                <input
                  type="number"
                  name="fats"
                  value={formData.fats}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="0"
                  className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  data-testid="food-fats-input"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition-colors"
              data-testid="log-food-button"
            >
              ✅ Log Food
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LogMeals;