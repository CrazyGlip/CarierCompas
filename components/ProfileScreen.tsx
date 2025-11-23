
import React, { useState, useMemo, useEffect } from 'react';
import type { Subject } from '../types';
import { defaultSubjects, mockColleges } from '../data/mockData';
import CalculatorChart from './CalculatorChart';
import { seedDatabase } from '../services/dbSeeder';

const CalculatorView: React.FC<{ onCalculate: () => void }> = ({ onCalculate }) => {
    const [subjects, setSubjects] = useState<Subject[]>(() => {
        const savedSubjects = localStorage.getItem('calculatorSubjects');
        return savedSubjects ? JSON.parse(savedSubjects) : defaultSubjects;
    });
    const [averageScore, setAverageScore] = useState<number | null>(() => {
        const savedScore = localStorage.getItem('averageScore');
        return savedScore ? parseFloat(savedScore) : null;
    });

    useEffect(() => {
        localStorage.setItem('calculatorSubjects', JSON.stringify(subjects));
        if (averageScore !== null) {
            localStorage.setItem('averageScore', averageScore.toString());
        }
    }, [subjects, averageScore]);

    const handleGradeChange = (id: string, grade: number) => {
        const newGrade = Math.max(0, Math.min(5, grade));
        setSubjects(prevSubjects =>
            prevSubjects.map(subject =>
                subject.id === id ? { ...subject, grade: newGrade } : subject
            )
        );
    };

    const handleCalculate = () => {
        const filledSubjects = subjects.filter(s => s.grade > 0);
        if (filledSubjects.length === 0) {
            setAverageScore(0);
            return;
        }
        const totalWeightedGrade = filledSubjects.reduce((acc, subject) => acc + subject.grade * subject.weight, 0);
        const totalWeight = filledSubjects.reduce((acc, subject) => acc + subject.weight, 0);
        
        const avg = totalWeightedGrade / totalWeight;
        setAverageScore(avg);
        
        // Notify parent to trigger achievement check
        onCalculate();
    };
    
    const chartData = useMemo(() => {
        return subjects.filter(s => s.grade > 0).map(s => ({ name: s.name.substring(0,3), Оценка: s.grade }));
    }, [subjects, averageScore]);
    
    const scoreContext = useMemo(() => {
        if (averageScore === null) return null;
        const totalColleges = mockColleges.length;
        const passableColleges = mockColleges.filter(c => averageScore >= c.passingScore).length;
        return `Ваш балл выше, чем проходной в ${passableColleges} из ${totalColleges} колледжей.`;
    }, [averageScore]);

    return (
         <div className="animate-fade-in">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-white/10">
                <h2 className="text-2xl font-semibold mb-6 text-center text-slate-900 dark:text-white">Калькулятор балла аттестата</h2>
                
                {/* Manual Input Section */}
                <div className="mb-8 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 border-dashed">
                    <label className="block text-slate-500 dark:text-slate-400 text-sm mb-2 font-medium text-center">Уже знаете свой средний балл?</label>
                    <div className="relative max-w-[150px] mx-auto">
                        <input
                            type="number"
                            step="0.01"
                            min="2"
                            max="5"
                            placeholder="—"
                            value={averageScore || ''}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val >= 0 && val <= 5) {
                                    setAverageScore(val);
                                    onCalculate(); 
                                } else if (e.target.value === '') {
                                    setAverageScore(null);
                                }
                            }}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-bold text-3xl text-center focus:ring-2 focus:ring-sky-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
                        />
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-2">Введите значение от 2.0 до 5.0</p>
                </div>

                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px bg-slate-200 dark:bg-slate-600 flex-1"></div>
                    <span className="text-slate-500 text-sm font-bold uppercase">Или укажите оценки</span>
                    <div className="h-px bg-slate-200 dark:bg-slate-600 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    {subjects.map(subject => (
                        <div key={subject.id} className="flex items-center justify-between">
                            <label htmlFor={subject.id} className="text-slate-700 dark:text-slate-300 text-lg">{subject.name}</label>
                            <input
                                type="number"
                                id={subject.id}
                                value={subject.grade === 0 ? '' : subject.grade}
                                onChange={(e) => handleGradeChange(subject.id, parseInt(e.target.value) || 0)}
                                placeholder="—"
                                min="2"
                                max="5"
                                className="w-20 p-2 text-center bg-slate-100 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-brand-purple focus:border-brand-purple outline-none transition"
                            />
                        </div>
                    ))}
                </div>
                <button onClick={handleCalculate} className="w-full bg-brand-purple text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
                    Рассчитать по предметам
                </button>
                {averageScore !== null && (
                    <div className="mt-8 text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl animate-fade-in-up border border-slate-200 dark:border-white/5">
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Твой средний балл:</p>
                        <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 my-2">
                            {averageScore.toFixed(2)}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{scoreContext}</p>
                    </div>
                )}
            </div>
            {averageScore !== null && chartData.length > 0 && (
                 <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl mt-8 rounded-2xl p-4 md:p-6 shadow-2xl border border-slate-200 dark:border-white/10">
                     <h3 className="text-xl font-semibold mb-4 text-center text-slate-900 dark:text-white">Визуализация оценок</h3>
                     <div className="w-full h-72">
                        <CalculatorChart data={chartData} />
                     </div>
                 </div>
            )}
        </div>
    );
}

// --- Safe Admin Panel for DB Updates ---
const AdminPanel: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSeed = async () => {
        setStatus('loading');
        setMessage('Синхронизация данных с Supabase...');
        
        const result = await seedDatabase();
        
        if (result.success) {
            setStatus('success');
            setMessage(result.message);
        } else {
            setStatus('error');
            setMessage('Ошибка: ' + result.message);
        }
    };

    return (
        <div className="mt-8 bg-slate-100 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-300 dark:border-white/5 border-dashed">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Администрирование</h3>
            <button 
                onClick={handleSeed} 
                disabled={status === 'loading'}
                className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
                    status === 'loading' ? 'bg-slate-300 dark:bg-slate-700 cursor-wait' :
                    status === 'success' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
                {status === 'loading' ? 'Загрузка...' : 'Синхронизировать фильтры (Безопасно)'}
            </button>
            {message && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">{message}</p>}
        </div>
    );
};

const ProfileScreen: React.FC<{ onBack: () => void; onCalculateScore: () => void; }> = ({ onBack, onCalculateScore }) => {
    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex items-center space-x-2 mb-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Калькулятор</h1>
            </div>
            
            <CalculatorView onCalculate={onCalculateScore} />
            <AdminPanel />
        </div>
    );
};

export default ProfileScreen;
