import React, { useState, useEffect } from 'react';

const Profile = ({ profile, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    weight: 70,
    height: 175,
    gender: 'Male',
    activity_level: 'moderate',
    fitness_goal: 'maintain'
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || 25,
        weight: profile.weight || 70,
        height: profile.height || 175,
        gender: profile.gender || 'Male',
        activity_level: profile.activity_level || 'moderate',
        fitness_goal: profile.fitness_goal || 'maintain'
      });
    }
  }, [profile]);

  const calculateCalories = (goal, activityLevel, weight) => {
    const baseCalories = weight * 24; // Basic metabolic rate
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    let calories = baseCalories * (activityMultipliers[activityLevel] || 1.55);
    
    if (goal === 'lose') {
      calories -= 500;
    } else if (goal === 'gain') {
      calories += 300;
    }
    
    return Math.round(calories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const calories = calculateCalories(formData.fitness_goal, formData.activity_level, formData.weight);
    const protein = Math.round(formData.weight * 2.2); // 2.2g per kg
    const fats = Math.round(calories * 0.25 / 9); // 25% of calories from fat
    const carbs = Math.round((calories - (protein * 4) - (fats * 9)) / 4);
    
    const updatedProfile = {
      ...profile,
      ...formData,
      daily_calorie_target: calories,
      protein_target: protein,
      carbs_target: carbs,
      fats_target: fats
    };
    
    onUpdateProfile(updatedProfile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto" data-testid="profile-container">
      <div className="bg-[#1a1a1c] p-6 rounded-lg border border-gray-800">
        <div className="flex items-center mb-4">
          <span className="text-green-500 mr-2 text-2xl">👤</span>
          <h2 className="text-2xl font-bold">My Profile</h2>
        </div>
        <p className="text-gray-400 mb-6">Enter your details to get personalized calorie recommendations</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                data-testid="profile-name-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Age (years)</label>
              <input
                type="number"
                name="age"
                data-testid="profile-age-input"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                data-testid="profile-weight-input"
                value={formData.weight}
                onChange={handleChange}
                step="0.1"
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Height (cm)</label>
              <input
                type="number"
                name="height"
                data-testid="profile-height-input"
                value={formData.height}
                onChange={handleChange}
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Gender</label>
              <select
                name="gender"
                data-testid="profile-gender-select"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Activity Level</label>
              <select
                name="activity_level"
                data-testid="profile-activity-select"
                value={formData.activity_level}
                onChange={handleChange}
                className="w-full bg-[#0f0f10] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (intense exercise daily)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-4">Fitness Goal</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'lose', label: 'Lose Weight', subtitle: '500 cal deficit' },
                { value: 'maintain', label: 'Maintain Weight', subtitle: 'Balanced intake' },
                { value: 'gain', label: 'Build Muscle', subtitle: '300 cal surplus' }
              ].map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  data-testid={`fitness-goal-${goal.value}`}
                  onClick={() => setFormData(prev => ({ ...prev, fitness_goal: goal.value }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.fitness_goal === goal.value
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-lg font-semibold text-white">{goal.label}</div>
                  <div className="text-sm text-gray-400">{goal.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0f0f10] p-4 rounded-lg border border-gray-800">
            <h3 className="text-green-500 font-semibold mb-2">Current Goals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {calculateCalories(formData.fitness_goal, formData.activity_level, formData.weight)}
                </div>
                <div className="text-xs text-gray-400">Calories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{Math.round(formData.weight * 2.2)}g</div>
                <div className="text-xs text-gray-400">Protein</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {Math.round((calculateCalories(formData.fitness_goal, formData.activity_level, formData.weight) - (Math.round(formData.weight * 2.2) * 4) - (Math.round(calculateCalories(formData.fitness_goal, formData.activity_level, formData.weight) * 0.25 / 9) * 9)) / 4)}g
                </div>
                <div className="text-xs text-gray-400">Carbs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(calculateCalories(formData.fitness_goal, formData.activity_level, formData.weight) * 0.25 / 9)}g
                </div>
                <div className="text-xs text-gray-400">Fats</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            data-testid="profile-save-button"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition-colors"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;