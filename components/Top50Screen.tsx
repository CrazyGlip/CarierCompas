
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockColleges, mockSpecialties } from '../data/mockData';
import type { Profession, College, Specialty } from '../types';

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-semibold">Назад</span>
    </button>
);

const ProfessionCard: React.FC<{ 
    profession: Profession, 
    index: number, 
    isExpanded: boolean,
    onToggle: () => void,
    onNavigateToCollege: (id: string) => void,
    onNavigateToSpecialty: (id: string) => void 
}> = ({ profession, index, isExpanded, onToggle, onNavigateToCollege, onNavigateToSpecialty }) => {
    const salaryFormatter = new Intl.NumberFormat('ru-RU');

    const relatedColleges = profession.collegeIds
        .map(id => mockColleges.find(c => c.id === id))
        .filter((c): c is College => !!c);

    const relatedSpecialties = profession.relatedSpecialtyIds
        ? profession.relatedSpecialtyIds
            .map(id => mockSpecialties.find(s => s.id === id))
            .filter((s): s is Specialty => !!s)
        : [];

    const trendIcon = profession.trend === 'hot' ? '🔥' : profession.trend === 'growing' ? '📈' : '🛡️';
    const trendText = profession.trend === 'hot' ? 'Высокий спрос' : profession.trend === 'growing' ? 'Растущий тренд' : 'Стабильность';

    return (
        <div 
            className={`bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all duration-500 ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/80 border-sky-500/30 shadow-2xl' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm'}`}
        >
            {/* Header Section (Always Visible) */}
            <div onClick={onToggle} className="p-5 cursor-pointer flex items-start gap-4 relative">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <span className="font-black text-4xl text-transparent bg-clip-text bg-gradient-to-br from-sky-500 to-purple-600 dark:from-sky-400 dark:to-purple-500">
                        #{index + 1}
                    </span>
                </div>
                
                <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{profession.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                            {salaryFormatter.format(profession.salaryFrom)} - {salaryFormatter.format(profession.salaryTo)} ₽
                        </span>
                    </div>
                </div>

                <div className="flex-shrink-0 self-center transform transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Collapsed Preview (Logos) - Only visible when collapsed */}
            {!isExpanded && relatedColleges.length > 0 && (
                <div className="px-5 pb-4 flex gap-2 overflow-hidden" onClick={onToggle}>
                    {relatedColleges.slice(0, 4).map(college => (
                        <img key={college.id} src={college.logoUrl} className="w-8 h-8 rounded-full object-contain bg-slate-100 dark:bg-slate-700 p-1 opacity-70" alt={college.name} />
                    ))}
                    {relatedColleges.length > 4 && <span className="text-slate-500 text-xs self-center">+{relatedColleges.length - 4}</span>}
                </div>
            )}

            {/* Expanded Details */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-5 pb-6 pt-0 space-y-5 border-t border-slate-200 dark:border-white/5">
                    {/* Trend & Description */}
                    <div className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{trendIcon}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{trendText}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            {profession.description || "Востребованная профессия с перспективами карьерного роста."}
                        </p>
                    </div>

                    {/* Related Specialties */}
                    {relatedSpecialties.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Подходящие специальности</h4>
                            <div className="flex flex-wrap gap-2">
                                {relatedSpecialties.map(spec => (
                                    <button
                                        key={spec.id}
                                        onClick={(e) => { e.stopPropagation(); onNavigateToSpecialty(spec.id); }}
                                        className="flex items-center gap-2 bg-sky-500/10 text-sky-600 dark:text-sky-300 px-3 py-2 rounded-xl text-sm font-medium hover:bg-sky-500/20 transition-colors text-left border border-sky-500/20"
                                    >
                                        <span>{spec.title}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Where to study */}
                    {relatedColleges.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Где учиться</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {relatedColleges.map(college => (
                                    <button
                                        key={college.id}
                                        onClick={(e) => { e.stopPropagation(); onNavigateToCollege(college.id); }}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <img src={college.logoUrl} alt={college.name} className="w-10 h-10 rounded-full object-contain bg-slate-200 dark:bg-slate-700 p-1" />
                                        <span className="text-sm text-slate-700 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-white">{college.name}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 ml-auto group-hover:text-slate-600 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const Top50Screen: React.FC<{ 
    onBack: () => void; 
    onNavigateToCollege: (id: string) => void; 
    onNavigateToSpecialty: (id: string) => void;
}> = ({ onBack, onNavigateToCollege, onNavigateToSpecialty }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
          const data = await api.getTopProfessions();
          setProfessions(data);
          setLoading(false);
      };
      fetchData();
  }, []);

  const handleToggle = (id: number) => {
      setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        <BackButton onClick={onBack} />
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 dark:from-teal-300 dark:via-emerald-300 dark:to-green-300">
                Топ-30 профессий 2025
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Рейтинг востребованности в Липецкой области</p>
        </div>
        
        {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        ) : (
            <div className="space-y-4">
                {professions.map((profession, index) => (
                    <ProfessionCard 
                        key={profession.id} 
                        profession={profession} 
                        index={index} 
                        isExpanded={expandedId === profession.id}
                        onToggle={() => handleToggle(profession.id)}
                        onNavigateToCollege={onNavigateToCollege}
                        onNavigateToSpecialty={onNavigateToSpecialty}
                    />
                ))}
            </div>
        )}
        
        <div className="text-center text-slate-500 text-sm pt-8 pb-4">
            <p>На основе данных регионального рынка труда и запросов работодателей (НЛМК, ОЭЗ "Липецк", Агрохолдинги).</p>
        </div>
    </div>
  );
};

export default Top50Screen;
