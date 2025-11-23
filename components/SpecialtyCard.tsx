
import React from 'react';
import type { Specialty } from '../types';

interface SpecialtyCardProps {
  specialty: Specialty;
  onClick: () => void;
  isInPlan: boolean;
  onTogglePlan: (e: React.MouseEvent) => void;
}

export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ specialty, onClick, isInPlan, onTogglePlan }) => {
    // Deterministic color generation based on ID for consistent vibrant look
    const gradients = [
        'from-violet-600 to-indigo-900',
        'from-blue-600 to-cyan-800',
        'from-emerald-500 to-teal-900',
        'from-rose-500 to-pink-900',
        'from-amber-500 to-orange-900',
        'from-fuchsia-600 to-purple-900',
    ];
    
    const colorIndex = specialty.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
    const gradientClass = gradients[colorIndex];

    return (
        <div 
            onClick={onClick} 
            className="relative overflow-hidden rounded-3xl group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/20 border border-slate-200 dark:border-white/5 h-[260px] shadow-lg"
        >
            {/* Background Image with stylized effects */}
            <div className="absolute inset-0 bg-slate-900">
                 <img 
                    src={specialty.imageUrl} 
                    alt={specialty.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                />
            </div>

            {/* Gradient Overlay for "stylized" look - REDUCED OPACITY to 20% */}
            <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-20 transition-opacity duration-300 group-hover:opacity-10`} />
            
            {/* Text readability gradient (black at bottom) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                     <span className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg ${
                        specialty.type === 'профессия' ? 'bg-blue-500/60 text-blue-50' : 'bg-purple-500/60 text-purple-50'
                    }`}>
                        {specialty.type}
                    </span>
                    
                    <button
                        onClick={onTogglePlan}
                        className="bg-black/30 backdrop-blur-md p-2.5 rounded-full hover:bg-black/50 transition-colors border border-white/20 active:scale-95 shadow-lg"
                        aria-label={isInPlan ? 'Удалить из плана' : 'Добавить в план'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isInPlan ? 'text-amber-400 fill-amber-400' : 'text-white fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                <div className="transform transition-transform duration-300 group-hover:translate-y-[-5px]">
                    <div className="flex items-center gap-1.5 mb-2 text-slate-200 text-xs font-medium bg-black/40 w-fit px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {specialty.duration}
                    </div>
                    <h3 className="font-bold text-white text-xl leading-tight drop-shadow-md mb-2 line-clamp-2">
                        {specialty.title}
                    </h3>
                     <p className="text-slate-200 font-medium drop-shadow-sm text-sm opacity-90 line-clamp-2">
                        {specialty.description}
                    </p>
                </div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none"></div>
        </div>
    );
};

export default SpecialtyCard;
