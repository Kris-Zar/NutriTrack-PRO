import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Foods from './components/Foods';
import LogMeals from './components/LogMeals';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userId, setUserId] = useState('user-001');
  const [profile, setProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await axios.get(`${API}/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.log('Profile not found, creating default profile');
      const defaultProfile = {
        id: userId,
        name: '',
        age: 25,
        weight: 70,
        height: 175,
        gender: 'Male',
        activity_level: 'moderate',
        fitness_goal: 'maintain',
        daily_calorie_target: 2000,
        protein_target: 150,
        carbs_target: 250,
        fats_target: 65
      };
      setProfile(defaultProfile);
    }
  };

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      await axios.put(`${API}/profile/${userId}`, updatedProfile);
      setProfile(updatedProfile);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'foods', label: 'Foods', icon: '🍎' },
    { id: 'log-meals', label: 'Log Meals', icon: '🍽️' },
    { id: 'planner', label: 'Planner', icon: '📅' },
    { id: 'recipes', label: 'Recipes', icon: '📖' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'fasting', label: 'Fasting', icon: '⏰' }
  ];

  return (
    <div className="App min-h-screen bg-[#0f0f10] text-white flex flex-col">
      <header className="bg-[#1a1a1c] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">NutriTrack</h1>
          <p className="text-gray-400 text-sm mt-1">Your Complete Nutrition & Fitness Companion</p>
        </div>
      </header>

      <nav className="bg-[#1a1a1c] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                data-testid={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#84cc16] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                } rounded-lg my-2`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        {activeTab === 'dashboard' && (
          <Dashboard userId={userId} profile={profile} refreshTrigger={refreshTrigger} />
        )}
        {activeTab === 'profile' && (
          <Profile profile={profile} onUpdateProfile={handleProfileUpdate} />
        )}
        {activeTab === 'foods' && (
          <Foods userId={userId} onFoodAdded={triggerRefresh} />
        )}
        {activeTab === 'log-meals' && (
          <LogMeals userId={userId} onMealLogged={triggerRefresh} />
        )}
        {(activeTab === 'planner' || activeTab === 'recipes' || activeTab === 'progress' || activeTab === 'fasting') && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-400">Coming Soon</h2>
            <p className="text-gray-500 mt-2">This feature is under development</p>
          </div>
        )}
      </main>

      <footer className="bg-[#1a1a1c] border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">Created by Gyanendra & Developed by Parth</p>
          <p className="text-gray-500 text-sm">App is still in development and soon will come with all new features</p>
        </div>
      </footer>
    </div>
  );
}

export default App;