
import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../services/api';
import CollegeCard from './CollegeCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import type { PlanItem, College } from '../types';

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors group mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-semibold">Выбор типа</span>
    </button>
);

interface CollegesScreenProps {
  onNavigate: (id: string) => void;
  onBack: () => void;
  plan: PlanItem[];
  onAddToPlan: (id: string, type: 'specialty' | 'college') => void;
  onRemoveFromPlan: (id: string) => void;
}

const CollegesScreen: React.FC<CollegesScreenProps> = ({ onNavigate, onBack, plan, onAddToPlan, onRemoveFromPlan }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [selectedCity, setSelectedCity] = useState('');
  const [userScore, setUserScore] = useState('');
  const [selectedForm, setSelectedForm] = useState('any');

  useEffect(() => {
      const fetchData = async () => {
          try {
              const data = await api.getColleges();
              setColleges(data);
          } finally {
              setLoading(false);
          }
      };
      fetchData();
  }, []);

  // Extract unique cities
  const cities = useMemo(() => {
      const unique = new Set(colleges.map(c => c.city).filter(Boolean));
      return Array.from(unique).sort();
  }, [colleges]);

  const filteredColleges = useMemo(() => {
    let items = colleges;

    // 1. Text Search
    if (searchQuery) {
      items = items.filter(college =>
        college.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. City Filter
    if (selectedCity) {
        items = items.filter(c => c.city === selectedCity);
    }

    // 3. Score Filter (Show colleges where passing score is <= userScore)
    // If userScore is set, filter out colleges that are "too hard" (passingScore > userScore)
    if (userScore) {
        const score = parseFloat(userScore);
        if (!isNaN(score)) {
            items = items.filter(c => c.passingScore <= score);
        }
    }

    // 4. Education Form Filter
    if (selectedForm !== 'any') {
        items = items.filter(c => c.educationForms && c.educationForms.includes(selectedForm));
    }

    return items;
  }, [searchQuery, colleges, selectedCity, userScore, selectedForm]);

  const handleTogglePlan = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (plan.some(item => item.id === id)) {
        onRemoveFromPlan(id);
      } else {
        onAddToPlan(id, 'college');
      }
  };

  const handleResetFilters = () => {
      setSelectedCity('');
      setUserScore('');
      setSelectedForm('any');
      setSearchQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <BackButton onClick={onBack} />
      <h1 className="text-3xl font-bold text-center">
        Среднее профессиональное образование
      </h1>
      
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Поиск по учебным заведениям..." />
      
      <FilterPanel 
        cities={cities}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        userScore={userScore}
        onUserScoreChange={setUserScore}
        selectedForm={selectedForm}
        onFormChange={setSelectedForm}
        onReset={handleResetFilters}
      />
      
      {loading ? (
          <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
      ) : filteredColleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredColleges.map(college => (
            <CollegeCard 
              key={college.id} 
              college={college} 
              onClick={() => onNavigate(college.id)}
              isInPlan={plan.some(p => p.id === college.id)}
              onTogglePlan={(e) => handleTogglePlan(e, college.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-6 bg-slate-800/50 rounded-2xl border border-white/10">
          <p className="text-slate-400">По вашему запросу ничего не найдено.</p>
          <button onClick={handleResetFilters} className="mt-4 text-sky-400 hover:underline">Сбросить фильтры</button>
        </div>
      )}
    </div>
  );
};

export default CollegesScreen;
