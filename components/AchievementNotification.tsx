
import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementNotificationProps {
    achievement: Achievement;
    onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setTimeout(() => setVisible(true), 100);
        
        // Auto hide
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 500); // Wait for exit animation
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-20 left-4 right-4 z-[100] flex justify-center pointer-events-none transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <div className="bg-slate-800/90 backdrop-blur-xl border border-yellow-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(234,179,8,0.3)] flex items-center gap-4 max-w-sm w-full pointer-events-auto">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {achievement.icon}
                </div>
                <div className="flex-1">
                    <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-0.5">Достижение разблокировано!</p>
                    <h4 className="text-white font-bold leading-tight">{achievement.title}</h4>
                    <p className="text-slate-300 text-xs mt-1">{achievement.description}</p>
                </div>
            </div>
        </div>
    );
};

export default AchievementNotification;
