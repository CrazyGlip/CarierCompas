
import React from 'react';
import type { College } from '../types';

const ContactIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <div className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded-full transition-colors hover:bg-sky-100 dark:hover:bg-sky-500/50 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white">
    {icon}
  </div>
);

export const CollegeCard: React.FC<{
  college: College,
  onClick: () => void,
  isInPlan: boolean;
  onTogglePlan: (e: React.MouseEvent) => void;
}> = ({ college, onClick, isInPlan, onTogglePlan }) => (
    <div onClick={onClick} className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-white/10 cursor-pointer group transition-all duration-300 hover:border-sky-500/50 hover:scale-[1.03]">
        <div className="relative">
            <img src={college.imageUrl} alt={college.name} className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/70 p-1 rounded-full border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                <img src={college.logoUrl} alt={`${college.name} logo`} className="w-12 h-12 rounded-full object-contain" />
            </div>
            <button
                onClick={onTogglePlan}
                className="absolute top-4 right-4 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-black/60 transition-all z-10 shadow-sm"
                aria-label={isInPlan ? 'Удалить из плана' : 'Добавить в план'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all ${isInPlan ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
                </svg>
            </button>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{college.name}</h3>
            <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                    <ContactIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>} />
                    <ContactIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>} />
                    <ContactIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 2.003l7.997 3.881A2 2 0 0119 7.616V16a2 2 0 01-2 2H3a2 2 0 01-2-2V7.616a2 2 0 011.003-1.732zM10 12a2 2 0 100-4 2 2 0 000 4z" /></svg>} />
                    <ContactIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 112.828-2.828l1.5 1.5l3-3zM7.414 9.414a2 2 0 112.828-2.828l3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 11-2.828 2.828l1.5 1.5l-3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 11-2.828-2.828l1.5-1.5 3-3z" clipRule="evenodd" /></svg>} />
                </div>
            </div>
        </div>
    </div>
);

export default CollegeCard;
