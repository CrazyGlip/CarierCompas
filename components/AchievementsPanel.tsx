
import React, { useState, useEffect } from 'react';
import { achievements } from '../data/achievements';

const AchievementsPanel: React.FC = () => {
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('unlockedAchievements');
        if (stored) setUnlockedIds(JSON.parse(stored));
    }, []);

    const progress = Math.round((unlockedIds.length / achievements.length) * 100);

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 mb-6">
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold text-white">Мои достижения</h3>
                <span className="text-sky-400 font-bold">{progress}%</span>
            </div>
            
            <div className="w-full bg-slate-700 h-2 rounded-full mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-400 to-purple-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {achievements.map(achievement => {
                    const isUnlocked = unlockedIds.includes(achievement.id);
                    return (
                        <div key={achievement.id} className="flex flex-col items-center text-center group relative">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-2 transition-all duration-300 ${isUnlocked ? `bg-gradient-to-br ${achievement.color} shadow-lg` : 'bg-slate-700/50 grayscale opacity-50'}`}>
                                {achievement.icon}
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 w-32 bg-black/90 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-white/10">
                                <p className="font-bold mb-1 text-sky-300">{achievement.title}</p>
                                <p className="text-slate-300">{achievement.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementsPanel;
