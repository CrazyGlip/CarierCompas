
import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../services/api'; // Updated import
import SpecialtyCard from './SpecialtyCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import type { PlanItem, Specialty, College } from '../types';

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors group mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-semibold">На главный</span>
    </button>
);

interface SpecialtiesScreenProps {
  onNavigate: (id: string) => void;
  onBack: () => void;
  plan: PlanItem[];
  onAddToPlan: (id: string, type: 'specialty' | 'college') => void;
  onRemoveFromPlan: (id: string) => void;
}

const SpecialtiesScreen: React.FC<SpecialtiesScreenProps> = ({ onNavigate, onBack, plan, onAddToPlan, onRemoveFromPlan }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [selectedCity, setSelectedCity] = useState('');
  const [userScore, setUserScore] = useState('');
  const [selectedForm, setSelectedForm] = useState('any');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [specsData, colData] = await Promise.all([
                api.getSpecialties(),
                api.getColleges()
            ]);
            setSpecialties(specsData);
            setColleges(colData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // Extract unique cities from colleges to populate filter
  const cities = useMemo(() => {
      const unique = new Set(colleges.map(c => c.city).filter(Boolean));
      return Array.from(unique).sort();
  }, [colleges]);

  const filteredSpecialties = useMemo(() => {
    let items = specialties;

    // 1. Basic Text Search
    if (searchQuery) {
      items = items.filter(spec =>
        spec.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Smart Filtering based on Colleges
    // If any college filter is active (City, Score, Form), we need to cross-reference
    if (selectedCity || userScore || selectedForm !== 'any') {
        
        // Find colleges that match the criteria
        const matchingColleges = colleges.filter(c => {
            // City match
            if (selectedCity && c.city !== selectedCity) return false;
            
            // Score match (College passing score must be <= userScore)
            // NOTE: While specialty also has a passingScore, usually admission depends on the college + specialty combo. 
            // For simplified UX, we filter by college availability first.
            if (userScore) {
                const score = parseFloat(userScore);
                if (!isNaN(score) && c.passingScore > score) return false;
            }

            // Form match
            if (selectedForm !== 'any' && (!c.educationForms || !c.educationForms.includes(selectedForm))) return false;

            return true;
        });

        const matchingCollegeIds = new Set(matchingColleges.map(c => c.id));

        // Filter specialties that are taught in at least one of the matching colleges
        // We assume college.specialtyIds contains list of specialty IDs it teaches
        items = items.filter(spec => {
            // Check if this specialty is present in any of the matching colleges
            const isAvailable = colleges.some(c => 
                matchingCollegeIds.has(c.id) && c.specialtyIds.includes(spec.id)
            );
            return isAvailable;
        });
    }

    return items;
  }, [searchQuery, specialties, colleges, selectedCity, userScore, selectedForm]);
  
  const handleTogglePlan = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (plan.some(item => item.id === id)) {
        onRemoveFromPlan(id);
      } else {
        onAddToPlan(id, 'specialty');
      }
  };

  const handleResetFilters = () => {
      setSelectedCity('');
      setUserScore('');
      setSelectedForm('any');
      setSearchQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <BackButton onClick={onBack} />
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300">
            На кого учиться?
        </h1>
        <p className="text-slate-400 text-lg">Выбери своё будущее призвание</p>
      </div>
      
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Найти профессию мечты..." />
      
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
      ) : filteredSpecialties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSpecialties.map(spec => (
            <SpecialtyCard 
              key={spec.id} 
              specialty={spec} 
              onClick={() => onNavigate(spec.id)}
              isInPlan={plan.some(item => item.id === spec.id)}
              onTogglePlan={(e) => handleTogglePlan(e, spec.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-slate-800/50 rounded-3xl border border-white/10">
            <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Ничего не найдено</h3>
          <p className="text-slate-400">Попробуйте изменить параметры фильтрации.</p>
          <button onClick={handleResetFilters} className="mt-4 text-sky-400 hover:underline">Сбросить фильтры</button>
        </div>
      )}
    </div>
  );
};

export default SpecialtiesScreen;
