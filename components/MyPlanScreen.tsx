
import React, { useState, useEffect } from 'react';
import { mockSpecialties, mockColleges } from '../data/mockData';
import type { PlanItem, ChecklistItem, College, Specialty } from '../types';
import AchievementsPanel from './AchievementsPanel';

// Component to display admission chances
const AdmissionChanceIndicator: React.FC<{ userScore: number; passingScore: number }> = ({ userScore, passingScore }) => {
    const diff = userScore - passingScore;
    
    let status: 'good' | 'warning' | 'danger';
    let text = '';
    let colorClass = '';
    let bgClass = '';

    if (diff >= 0) {
        status = 'good';
        text = `Вы проходите! (Запас +${diff.toFixed(2)})`;
        colorClass = 'text-emerald-600 dark:text-emerald-400';
        bgClass = 'bg-emerald-500/10 border-emerald-500/30';
    } else if (diff > -0.2) {
        status = 'warning';
        text = `Рискованно (Не хватает ${Math.abs(diff).toFixed(2)})`;
        colorClass = 'text-amber-600 dark:text-amber-400';
        bgClass = 'bg-amber-500/10 border-amber-500/30';
    } else {
        status = 'danger';
        text = `Сложно поступить (Не хватает ${Math.abs(diff).toFixed(2)})`;
        colorClass = 'text-rose-600 dark:text-rose-400';
        bgClass = 'bg-rose-500/10 border-rose-500/30';
    }

    // Visual Bar calculation
    const maxVal = 5.0;
    const minVal = 3.0;
    const range = maxVal - minVal;
    const userPercent = Math.max(0, Math.min(100, ((userScore - minVal) / range) * 100));
    const passingPercent = Math.max(0, Math.min(100, ((passingScore - minVal) / range) * 100));

    return (
        <div className={`mt-3 p-3 rounded-xl border ${bgClass}`}>
            <div className="flex justify-between items-center mb-2">
                <span className={`font-bold text-sm ${colorClass}`}>{text}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Проходной: <span className="text-slate-900 dark:text-white font-bold">{passingScore}</span></span>
            </div>
            
            {/* Visual Bar */}
            <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full">
                {/* Passing Score Marker */}
                <div 
                    className="absolute top-0 bottom-0 w-1 bg-slate-900 dark:bg-white z-10 shadow-[0_0_5px_rgba(0,0,0,0.5)] dark:shadow-[0_0_5px_rgba(255,255,255,0.8)]" 
                    style={{ left: `${passingPercent}%` }}
                    title={`Проходной: ${passingScore}`}
                />
                
                {/* User Score Fill */}
                <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${status === 'good' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${userPercent}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>3.0</span>
                <span>Твой балл: {userScore}</span>
                <span>5.0</span>
            </div>
        </div>
    );
};

const Checklist: React.FC<{ 
    items: ChecklistItem[], 
    planItemId: string;
    onUpdate: (planItemId: string, checklistItemId: string, isCompleted: boolean) => void;
    onNavigate: (view: any) => void;
}> = ({ items, planItemId, onUpdate, onNavigate }) => {

    const handleAction = (item: ChecklistItem) => {
        if (item.type === 'navigation') {
            onNavigate(item.payload);
        } else if (item.type === 'link' && typeof item.payload === 'string') {
            window.open(item.payload, '_blank');
        }
    };

    return (
        <div className="space-y-3 mt-4 pl-1">
            {items.map(item => (
                <div key={item.id} className="flex items-center group">
                    <div className="relative flex items-center justify-center">
                        <input 
                            type="checkbox" 
                            id={`${planItemId}-${item.id}`}
                            checked={item.isCompleted}
                            onChange={(e) => onUpdate(planItemId, item.id, e.target.checked)}
                            className="peer h-5 w-5 rounded-md bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-sky-500 focus:ring-sky-500 focus:ring-offset-0 transition-all checked:bg-sky-500 checked:border-sky-500 cursor-pointer"
                        />
                    </div>
                    <label htmlFor={`${planItemId}-${item.id}`} className={`ml-3 text-sm transition-colors cursor-pointer select-none flex-grow ${item.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                        {item.text}
                    </label>
                    {(item.type === 'navigation' || item.type === 'link') && (
                         <button onClick={() => handleAction(item)} className="ml-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-xs font-bold uppercase tracking-wide bg-sky-500/10 px-2 py-1 rounded-lg hover:bg-sky-500/20 transition-colors">
                            {item.type === 'link' ? 'Сайт' : 'Перейти'}
                         </button>
                    )}
                </div>
            ))}
        </div>
    );
}

const PlanItemCard: React.FC<{
    item: PlanItem;
    userScore: number | null;
    onRemove: (id: string) => void;
    onNavigate: () => void;
    isSelectionMode: boolean;
    isSelected: boolean;
    onToggleSelect: () => void;
    children: React.ReactNode;
}> = ({ item, userScore, onRemove, onNavigate, isSelectionMode, isSelected, onToggleSelect, children }) => {
    const data = item.type === 'specialty'
        ? mockSpecialties.find(s => s.id === item.id)
        : mockColleges.find(c => c.id === item.id);

    if (!data) return null;

    const title = 'title' in data ? data.title : data.name;
    const imageUrl = 'logoUrl' in data ? data.logoUrl : data.imageUrl;
    const passingScore = data.passingScore;

    const handleCardClick = () => {
        if (isSelectionMode) {
            onToggleSelect();
        } else {
            onNavigate();
        }
    };

    return (
        <div 
            onClick={isSelectionMode ? handleCardClick : undefined}
            className={`relative bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border transition-all duration-300 
                ${isSelectionMode 
                    ? (isSelected ? 'border-sky-500 bg-sky-500/10 shadow-sky-500/20 cursor-pointer transform scale-[1.02]' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 cursor-pointer opacity-80') 
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
        >
            {isSelectionMode && (
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-sky-500 border-sky-500' : 'border-slate-400'}`}>
                    {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            )}

            <div className="flex items-start gap-4">
                <img src={imageUrl} alt={title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-slate-100 dark:bg-slate-700 p-1 border border-slate-200 dark:border-white/5 shadow-sm" />
                <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                        <button onClick={handleCardClick} className="text-lg font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-300 transition-colors text-left leading-tight pr-8 disabled:hover:text-slate-900 dark:disabled:hover:text-white" disabled={isSelectionMode}>
                            {title}
                        </button>
                        {!isSelectionMode && (
                            <button onClick={(e) => { e.stopPropagation(); onRemove(item.id); }} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 -mr-2 -mt-2 rounded-full hover:bg-red-500/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mt-1 mb-2">{item.type === 'specialty' ? 'Специальность' : 'Колледж'}</p>
                </div>
            </div>

            {/* Score Analysis Block */}
            {userScore !== null ? (
                <AdmissionChanceIndicator userScore={userScore} passingScore={passingScore} />
            ) : (
                <div className="mt-3 p-3 rounded-xl border border-slate-300 dark:border-slate-600 border-dashed bg-slate-50 dark:bg-slate-700/30 flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Рассчитайте балл, чтобы оценить шансы</span>
                    <span className="font-bold text-slate-700 dark:text-white bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded text-xs">Проходной: {passingScore}</span>
                </div>
            )}

            {!isSelectionMode && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Твой чек-лист</h4>
                    {children}
                </div>
            )}
        </div>
    )
}

const ComparisonModal: React.FC<{
    items: PlanItem[];
    onClose: () => void;
}> = ({ items, onClose }) => {
    if (items.length !== 2) return null;

    const type = items[0].type;
    const data1 = type === 'specialty' ? mockSpecialties.find(s => s.id === items[0].id) : mockColleges.find(c => c.id === items[0].id);
    const data2 = type === 'specialty' ? mockSpecialties.find(s => s.id === items[1].id) : mockColleges.find(c => c.id === items[1].id);

    if (!data1 || !data2) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">⚖️</span> Сравнение
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="overflow-y-auto p-6">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="col-span-1 font-bold text-slate-500 uppercase text-xs tracking-wider py-2 flex items-end pb-4">Параметр</div>
                        <div className="col-span-1 font-bold text-slate-900 dark:text-white text-center pb-4">
                            <img src={('logoUrl' in data1 ? data1.logoUrl : data1.imageUrl)} className="w-12 h-12 mx-auto mb-2 rounded-full object-cover bg-slate-100 dark:bg-slate-700 p-1" alt="" />
                            {'title' in data1 ? data1.title : data1.name}
                        </div>
                        <div className="col-span-1 font-bold text-slate-900 dark:text-white text-center pb-4">
                            <img src={('logoUrl' in data2 ? data2.logoUrl : data2.imageUrl)} className="w-12 h-12 mx-auto mb-2 rounded-full object-cover bg-slate-100 dark:bg-slate-700 p-1" alt="" />
                            {'title' in data2 ? data2.title : data2.name}
                        </div>

                        {/* Common Rows */}
                        <div className="col-span-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 py-3">Проходной балл</div>
                        <div className={`col-span-1 text-center font-bold py-3 border-t border-slate-200 dark:border-white/5 ${data1.passingScore > data2.passingScore ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>{data1.passingScore}</div>
                        <div className={`col-span-1 text-center font-bold py-3 border-t border-slate-200 dark:border-white/5 ${data2.passingScore > data1.passingScore ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>{data2.passingScore}</div>

                        {type === 'college' && (
                            <>
                                <div className="col-span-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 py-3">Общежитие</div>
                                <div className="col-span-1 text-center font-medium py-3 border-t border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">{(data1 as College).info.hasDormitory ? '✅ Есть' : '❌ Нет'}</div>
                                <div className="col-span-1 text-center font-medium py-3 border-t border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">{(data2 as College).info.hasDormitory ? '✅ Есть' : '❌ Нет'}</div>

                                <div className="col-span-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 py-3">Бюджетных мест</div>
                                <div className="col-span-1 text-center font-medium py-3 border-t border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-300">Уточняйте</div>
                                <div className="col-span-1 text-center font-medium py-3 border-t border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-300">Уточняйте</div>

                                <div className="col-span-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 py-3">Стипендия</div>
                                <div className="col-span-1 text-center font-medium py-3 border-t border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-300">Есть</div>
                                <div className="col-span-1 text-center font-medium py-3 border-t border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-300">Есть</div>
                            </>
                        )}

                        {type === 'specialty' && (
                            <>
                                <div className="col-span-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 py-3">Срок обучения</div>
                                <div className="col-span-1 text-center font-medium py-3 border-t border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">{(data1 as Specialty).duration}</div>
                                <div className="col-span-1 text-center font-medium py-3 border-t border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">{(data2 as Specialty).duration}</div>

                                <div className="col-span-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 py-3">Зарплата (старт)</div>
                                <div className="col-span-1 text-center font-bold text-emerald-600 dark:text-emerald-400 py-3 border-t border-slate-200 dark:border-white/5">{(data1 as Specialty).details.salary.novice.from} ₽</div>
                                <div className="col-span-1 text-center font-bold text-emerald-600 dark:text-emerald-400 py-3 border-t border-slate-200 dark:border-white/5">{(data2 as Specialty).details.salary.novice.from} ₽</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


interface MyPlanScreenProps {
  plan: PlanItem[];
  onRemoveFromPlan: (id: string) => void;
  onUpdateChecklistItem: (planItemId: string, checklistItemId: string, isCompleted: boolean) => void;
  onNavigateToSpecialty: (id: string) => void;
  onNavigateToCollege: (id: string) => void;
  onNavigateToCalculator: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToSpecialtiesList: () => void;
  onNavigateToCollegesList: () => void;
  onBack: () => void;
  onCompare: () => void;
}

const MyPlanScreen: React.FC<MyPlanScreenProps> = ({
  plan,
  onRemoveFromPlan,
  onUpdateChecklistItem,
  onNavigateToSpecialty,
  onNavigateToCollege,
  onNavigateToCalculator,
  onNavigateToCalendar,
  onNavigateToSpecialtiesList,
  onNavigateToCollegesList,
  onBack,
  onCompare,
}) => {
  const [userScore, setUserScore] = useState<number | null>(null);
  
  // Comparison State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{id: string, type: 'college'|'specialty'}[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
      const storedScore = localStorage.getItem('averageScore');
      if (storedScore) {
          setUserScore(parseFloat(storedScore));
      }
  }, []);
  
  const handleChecklistNavigation = (payload: any) => {
      if (payload?.name === 'profile') onNavigateToCalculator();
      if (payload?.name === 'calendar') onNavigateToCalendar();
  }

  const toggleSelectionMode = () => {
      setIsSelectionMode(!isSelectionMode);
      setSelectedItems([]);
  };

  const handleToggleItemSelection = (id: string, type: 'college'|'specialty') => {
      const exists = selectedItems.some(i => i.id === id);
      
      if (exists) {
          setSelectedItems(prev => prev.filter(i => i.id !== id));
      } else {
          // Validation logic
          if (selectedItems.length >= 2) {
              alert("Можно сравнить только 2 объекта.");
              return;
          }
          if (selectedItems.length === 1 && selectedItems[0].type !== type) {
              alert("Нельзя сравнивать колледж со специальностью.");
              return;
          }
          setSelectedItems(prev => [...prev, { id, type }]);
      }
  };

  const handleCompare = () => {
      if (selectedItems.length === 2) {
          setShowComparison(true);
          onCompare(); // Trigger achievement
      }
  };

  const selectedPlanItems = plan.filter(p => selectedItems.some(s => s.id === p.id));

  return (
    <div className="space-y-6 animate-fade-in pb-20">
        <div className="flex justify-between items-center relative">
            <h1 className="text-3xl font-bold text-center w-full text-slate-900 dark:text-white">Мой План</h1>
        </div>

        <AchievementsPanel />

        {/* User Score Summary Banner */}
        {!isSelectionMode && (
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 shadow-xl flex items-center justify-between text-white relative overflow-hidden">
                <div className="relative z-10">
                    {userScore !== null ? (
                        <>
                            <p className="text-indigo-200 text-sm font-medium">Твой средний балл</p>
                            <p className="text-4xl font-black tracking-tight">{userScore.toFixed(2)}</p>
                        </>
                    ) : (
                        <>
                            <p className="font-bold text-lg">Узнай свои шансы!</p>
                            <p className="text-indigo-200 text-sm">Рассчитай средний балл аттестата</p>
                        </>
                    )}
                </div>
                <div className="relative z-10">
                    <button 
                        onClick={onNavigateToCalculator}
                        className="bg-white text-indigo-600 font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors text-sm"
                    >
                        {userScore !== null ? 'Пересчитать' : 'Рассчитать'}
                    </button>
                </div>
                <div className="absolute -right-6 -bottom-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        )}

        {/* Comparison Trigger Section */}
        {plan.length >= 2 && (
            <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-5 border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Режим сравнения</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Сравни колледжи или специальности</p>
                    </div>
                </div>
                <button 
                    onClick={toggleSelectionMode}
                    className={`px-5 py-3 rounded-xl font-bold transition-all text-sm ${isSelectionMode ? 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30' : 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/30'}`}
                >
                    {isSelectionMode ? 'Отмена' : 'Выбрать'}
                </button>
            </div>
        )}

        {/* Comparison Controls Sticky Header */}
        {isSelectionMode && (
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-sky-500/50 p-4 rounded-2xl sticky top-20 z-30 shadow-2xl animate-fade-in-down flex justify-between items-center ring-2 ring-sky-500/20">
                <div>
                    <p className="text-slate-900 dark:text-white font-bold">Выбрано: <span className="text-sky-600 dark:text-sky-400">{selectedItems.length}/2</span></p>
                </div>
                <button 
                    onClick={handleCompare}
                    disabled={selectedItems.length !== 2}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedItems.length === 2 ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                >
                    Сравнить
                </button>
            </div>
        )}

        {plan.length > 0 ? (
            <div className="space-y-6">
                {plan.map(item => (
                    <PlanItemCard 
                        key={item.id}
                        item={item}
                        userScore={userScore}
                        onRemove={onRemoveFromPlan}
                        onNavigate={() => item.type === 'specialty' ? onNavigateToSpecialty(item.id) : onNavigateToCollege(item.id)}
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedItems.some(s => s.id === item.id)}
                        onToggleSelect={() => handleToggleItemSelection(item.id, item.type)}
                    >
                        <Checklist items={item.checklist} planItemId={item.id} onUpdate={onUpdateChecklistItem} onNavigate={handleChecklistNavigation} />
                    </PlanItemCard>
                ))}
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center py-12 px-4">
                 <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-200 dark:border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                 </div>
                 <p className="text-slate-500 dark:text-slate-300 font-bold text-xl">План пуст</p>
                 <p className="text-slate-400 dark:text-slate-500 text-center max-w-xs mt-2 mb-8">Добавляй специальности и колледжи, чтобы отслеживать прогресс поступления.</p>
                 
                 <div className="flex flex-col w-full max-w-xs gap-3">
                     <button 
                        onClick={onNavigateToSpecialtiesList}
                        className="w-full py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 font-semibold rounded-xl border border-slate-200 dark:border-white/10 transition-colors flex items-center justify-center gap-2 shadow-sm"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Найти специальность
                     </button>
                     <button 
                        onClick={onNavigateToCollegesList}
                        className="w-full py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 font-semibold rounded-xl border border-slate-200 dark:border-white/10 transition-colors flex items-center justify-center gap-2 shadow-sm"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        Найти колледж
                     </button>
                 </div>
             </div>
        )}

        {showComparison && (
            <ComparisonModal items={selectedPlanItems} onClose={() => setShowComparison(false)} />
        )}
    </div>
  );
};

export default MyPlanScreen;
