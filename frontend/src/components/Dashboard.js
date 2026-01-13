import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ userId, profile, refreshTrigger }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId, refreshTrigger]);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API}/stats/${userId}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const caloriePercentage = stats ? (stats.calories / stats.calorie_target) * 100 : 0;
  const proteinPercentage = stats ? (stats.protein / stats.protein_target) * 100 : 0;
  const carbsPercentage = stats ? (stats.carbs / stats.carbs_target) * 100 : 0;
  const fatsPercentage = stats ? (stats.fats / stats.fats_target) * 100 : 0;

  return (
    <div className="space-y-6" data-testid="dashboard-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Calories */}
        <div className="bg-[#1a1a1c] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center mb-4">
            <span className="text-green-500 mr-2">⚡</span>
            <h2 className="text-xl font-semibold">Daily Calories</h2>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#2a2a2c"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#84cc16"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - Math.min(caloriePercentage / 100, 1))}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-green-500">
                  {stats?.calories || 0}
                </div>
                <div className="text-gray-400 text-sm">/ {stats?.calorie_target || 2000}</div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-400">
            {stats ? stats.calorie_target - stats.calories : 2000} calories remaining
          </p>
        </div>

        {/* Macronutrients */}
        <div className="bg-[#1a1a1c] p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Macronutrients</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Protein</span>
                <span className="text-green-500">{stats?.protein || 0}g / {stats?.protein_target || 150}g</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Carbohydrates</span>
                <span className="text-green-500">{stats?.carbs || 0}g / {stats?.carbs_target || 250}g</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(carbsPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Fats</span>
                <span className="text-green-500">{stats?.fats || 0}g / {stats?.fats_target || 65}g</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(fatsPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-[#1a1a1c] p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Essential Minerals & Vitamins</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Calcium', current: '650mg', target: '1000mg', percentage: 65 },
            { name: 'Iron', current: '12mg', target: '18mg', percentage: 67 },
            { name: 'Magnesium', current: '280mg', target: '400mg', percentage: 70 },
            { name: 'Potassium', current: '2800mg', target: '4700mg', percentage: 60 },
            { name: 'Sodium', current: '1600mg', target: '2300mg', percentage: 70 },
            { name: 'Zinc', current: '8mg', target: '11mg', percentage: 73 },
            { name: 'Vitamin C', current: '65mg', target: '90mg', percentage: 72 },
            { name: 'Vitamin D', current: '12mcg', target: '20mcg', percentage: 60 }
          ].map((nutrient) => (
            <div key={nutrient.name}>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-300">{nutrient.name}</span>
                <span className="text-green-500 text-xs">{nutrient.current} / {nutrient.target}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${nutrient.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1c] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">Meals Today</h3>
          <div className="text-4xl font-bold text-green-500">{stats?.meals_logged || 0}</div>
          <p className="text-gray-400 text-sm">items logged</p>
        </div>
        <div className="bg-[#1a1a1c] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">Weight</h3>
          <div className="text-4xl font-bold text-green-500">{profile?.weight || '--'}</div>
          <p className="text-gray-400 text-sm">kg</p>
        </div>
        <div className="bg-[#1a1a1c] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">Streak</h3>
          <div className="text-4xl font-bold text-green-500">7</div>
          <p className="text-gray-400 text-sm">days</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;