
import React, { useState, useEffect } from 'react';
import type { ThemeMode } from '../types';

interface SettingsScreenProps {
    onBack: () => void;
    onReplayOnboarding: () => void;
    currentTheme: ThemeMode;
    onThemeChange: (theme: ThemeMode) => void;
}

const Toggle: React.FC<{ 
    label: string; 
    description?: string; 
    value: boolean; 
    onChange: (val: boolean) => void;
}> = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-white/10 last:border-0">
        <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{label}</h3>
            {description && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{description}</p>}
        </div>
        <button 
            onClick={() => onChange(!value)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
);

const ThemeOption: React.FC<{
    label: string;
    value: ThemeMode;
    current: ThemeMode;
    onSelect: (val: ThemeMode) => void;
    icon: React.ReactNode;
}> = ({ label, value, current, onSelect, icon }) => {
    const isSelected = current === value;
    return (
        <button
            onClick={() => onSelect(value)}
            className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                isSelected 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-[1.02]' 
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
            {icon}
            <span className="text-xs font-bold">{label}</span>
        </button>
    );
};


const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onReplayOnboarding, currentTheme, onThemeChange }) => {
    // Local settings state
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [incognitoMode, setIncognitoMode] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        // Load settings from local storage
        const storedSound = localStorage.getItem('app_sound_enabled');
        setSoundEnabled(storedSound !== 'false'); // Default true

        const storedNotifs = localStorage.getItem('app_notifications_enabled');
        setNotificationsEnabled(storedNotifs !== 'false');

        const storedIncognito = localStorage.getItem('app_incognito_mode');
        setIncognitoMode(storedIncognito === 'true');

        // PWA Install Prompt Listener
        const handler = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleSoundChange = (val: boolean) => {
        setSoundEnabled(val);
        localStorage.setItem('app_sound_enabled', String(val));
    };

    const handleNotificationsChange = (val: boolean) => {
        setNotificationsEnabled(val);
        localStorage.setItem('app_notifications_enabled', String(val));
    };

    const handleIncognitoChange = (val: boolean) => {
        setIncognitoMode(val);
        localStorage.setItem('app_incognito_mode', String(val));
    };

    const handleResetData = () => {
        if (window.confirm('Вы уверены? Это удалит "Мой план", оценки и прогресс тестов. Действие необратимо.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleInstallClick = async () => {
        if (!installPrompt) return;
        // Show the install prompt
        installPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await installPrompt.userChoice;
        // We've used the prompt, and can't use it again, throw it away
        setInstallPrompt(null);
    };

    return (
        <div className="animate-fade-in space-y-6 pb-20">
            <div className="flex items-center space-x-2 mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Настройки</h1>
            </div>
            
            {/* Theme Section */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-white/10">
                 <h2 className="text-indigo-500 dark:text-indigo-400 font-bold uppercase text-xs tracking-wider mb-4">Тема оформления</h2>
                 <div className="flex gap-3">
                     <ThemeOption 
                        label="Светлая" 
                        value="light" 
                        current={currentTheme} 
                        onSelect={onThemeChange}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                     />
                     <ThemeOption 
                        label="Темная" 
                        value="dark" 
                        current={currentTheme} 
                        onSelect={onThemeChange}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                     />
                     <ThemeOption 
                        label="Системная" 
                        value="system" 
                        current={currentTheme} 
                        onSelect={onThemeChange}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                     />
                 </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-white/10">
                <h2 className="text-sky-500 dark:text-sky-400 font-bold uppercase text-xs tracking-wider mb-4">Основные</h2>
                <Toggle 
                    label="Звук в приложении" 
                    description="Включить звук в видео и эффектах"
                    value={soundEnabled} 
                    onChange={handleSoundChange} 
                />
                <Toggle 
                    label="Уведомления" 
                    description="Напоминания о Днях открытых дверей"
                    value={notificationsEnabled} 
                    onChange={handleNotificationsChange} 
                />
                
                {/* PWA Install Button - Only visible if browser supports it (Chrome/Android) */}
                {installPrompt && (
                    <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-white/10 last:border-0">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Приложение</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Установить на рабочий стол</p>
                        </div>
                        <button 
                            onClick={handleInstallClick}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-xl transition-colors shadow-lg shadow-sky-500/30 animate-pulse"
                        >
                            Установить
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-white/10">
                <h2 className="text-purple-500 dark:text-purple-400 font-bold uppercase text-xs tracking-wider mb-4">Приватность</h2>
                <Toggle 
                    label="Режим инкогнито" 
                    description="Не показывать мое имя в лайках и рейтингах"
                    value={incognitoMode} 
                    onChange={handleIncognitoChange} 
                />
            </div>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-white/10">
                <h2 className="text-emerald-500 dark:text-emerald-400 font-bold uppercase text-xs tracking-wider mb-4">Обучение</h2>
                <div className="flex items-center justify-between py-4">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Как пользоваться?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Показать экран приветствия снова</p>
                    </div>
                    <button 
                        onClick={onReplayOnboarding}
                        className="bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Показать
                    </button>
                </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-red-200 dark:border-red-500/20">
                <h2 className="text-red-500 dark:text-red-400 font-bold uppercase text-xs tracking-wider mb-4">Опасная зона</h2>
                <button 
                    onClick={handleResetData}
                    className="w-full py-3 border-2 border-red-500/50 text-red-500 dark:text-red-300 font-bold rounded-xl hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
                >
                    Сбросить весь прогресс
                </button>
            </div>
            
            <div className="text-center text-slate-500 dark:text-slate-600 text-xs py-4">
                Версия 1.2.0 (Beta) <br/>
                Career Compass &copy; 2025
            </div>
        </div>
    );
};

export default SettingsScreen;
