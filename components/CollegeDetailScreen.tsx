
import React from 'react';
import { mockColleges, mockSpecialties, mockEvents } from '../data/mockData';
import type { Specialty } from '../types';

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-semibold">Назад</span>
    </button>
);

const InfoLine: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline border-b border-slate-200 dark:border-white/10 py-3">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-bold text-slate-900 dark:text-white text-right">{value}</span>
    </div>
);

const SpecialtyChip: React.FC<{ specialty: Specialty; onClick: () => void }> = ({ specialty, onClick }) => (
    <button 
        onClick={onClick} 
        className="group relative px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/40 flex items-center gap-2 w-full sm:w-auto"
    >
        <span className="text-left">{specialty.title}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </button>
);

const ContactButton: React.FC<{ text: string; href?: string; icon: React.ReactNode }> = ({ text, href, icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-4 bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl transition-all ${href ? 'hover:bg-slate-200 dark:hover:bg-slate-700/80 hover:scale-[1.02]' : 'opacity-50 cursor-not-allowed'}`}>
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-700 dark:text-white">
            {icon}
        </div>
        <span className="font-bold text-slate-900 dark:text-white flex-grow">{text}</span>
        { href && 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
        }
    </a>
);

interface CollegeDetailScreenProps {
    collegeId: string;
    onBack: () => void;
    onNavigateToSpecialty: (id: string) => void;
    isInPlan: boolean;
    onAddToPlan: (id: string, type: 'specialty' | 'college') => void;
    onRemoveFromPlan: (id: string) => void;
    onNavigateToCalendar: () => void;
}

const CollegeDetailScreen: React.FC<CollegeDetailScreenProps> = ({ collegeId, onBack, onNavigateToSpecialty, isInPlan, onAddToPlan, onRemoveFromPlan, onNavigateToCalendar }) => {
    const college = mockColleges.find(c => c.id === collegeId);

    if (!college) {
        return (
            <div>
                <BackButton onClick={onBack} />
                <p>Учебное заведение не найдено</p>
            </div>
        );
    }

    const offeredSpecialties = mockSpecialties.filter(s => college.specialtyIds.includes(s.id));
    
    const upcomingOpenDay = mockEvents
        .filter(event => event.collegeId === collegeId && event.type === 'openDay' && new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];


    return (
        <div className="space-y-6 animate-fade-in">
            <div className="relative">
                <img src={college.imageUrl} alt={college.name} className="w-full h-48 object-cover rounded-2xl shadow-lg" />
                <div className="absolute -bottom-8 left-4 bg-white dark:bg-slate-800 p-2 rounded-full border-4 border-slate-100 dark:border-slate-900/50">
                     <img src={college.logoUrl} alt={`${college.name} logo`} className="w-16 h-16 rounded-full object-contain" />
                </div>
            </div>

            <div className="pt-10 flex justify-between items-start gap-4">
                <h1 className="text-2xl md:text-3xl font-bold flex-1 text-slate-900 dark:text-white">{college.name}</h1>
                 <button
                    onClick={() => isInPlan ? onRemoveFromPlan(college.id) : onAddToPlan(college.id, 'college')}
                    className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-slate-700/80"
                    aria-label={isInPlan ? 'Удалить из плана' : 'Добавить в план'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-all ${isInPlan ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
                    </svg>
                </button>
            </div>
            
             {upcomingOpenDay && (
                <button onClick={onNavigateToCalendar} className="w-full text-left bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-center space-x-4 hover:bg-blue-500/20 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Ближайший День открытых дверей</p>
                        <p className="text-blue-600 dark:text-blue-200">{new Date(upcomingOpenDay.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </button>
            )}

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-1">
                 <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Информация об учреждении</h2>
                 <p className="text-slate-600 dark:text-slate-200 leading-relaxed pb-3">{college.description}</p>
                 <InfoLine label="Средний балл аттестата" value={college.passingScore} />
                 <InfoLine label="Наличие общежития" value={college.info.hasDormitory ? 'Да' : 'Нет'} />
                 <InfoLine label="Бесплатное питание" value={college.info.hasFreeMeals ? 'Да' : 'Нет'} />
                 <InfoLine label="Доступность для инвалидов" value={college.info.isAccessibleForDisabled ? 'Да' : 'Нет'} />
                 <InfoLine label="Наличие библиотеки" value={college.info.hasLibrary ? 'Да' : 'Нет'} />
                 <InfoLine label="Наличие объектов спорта" value={college.info.hasSportsFacilities ? 'Да' : 'Нет'} />
            </div>

            {offeredSpecialties.length > 0 && (
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Специальности</h2>
                    <div className="flex flex-wrap gap-3">
                        {offeredSpecialties.map(spec => <SpecialtyChip key={spec.id} specialty={spec} onClick={() => onNavigateToSpecialty(spec.id)} />)}
                    </div>
                </div>
            )}
            
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-white/10">
                 <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Контакты</h2>
                 <div className="space-y-3">
                    { college.contacts.vk && 
                        <ContactButton text="Мы ВКонтакте" href={college.contacts.vk} icon={<svg className="w-8 h-8 text-[#0077FF]" viewBox="0 0 24 24" fill="currentColor"><path d="M13.128 18.667c.834 0 1.554-.533 1.554-1.125 0-.5-.333-.833-.5-.916-.167-.084-.25-.167-.25-.334 0-.166.083-.333.25-.5.25-.166.583-.333 1.083-.333.917 0 1.583.5 1.583 1.583 0 .834-.5 1.417-1.5 1.75.083.083.167.167.167.333 0 .334-.417.584-1.084.584-.916 0-1.75-.5-1.75-1.5 0-.583.334-.916.5-.916.167 0 .25.083.25.25 0 .167-.083.333-.25.5s-.5.417-1 .417c-1 0-1.667-.583-1.667-1.75 0-1.166.75-1.916 2.084-1.916.5 0 .833.084 1.083.167.334.083.5.333.5.583 0 .417-.333.583-1.166.583-.5 0-.75-.083-.917-.167-.25-.083-.416-.25-.416-.5 0-.584.583-.834 1.583-.834h.334c1.166 0 2.083.667 2.083 2.083 0 1-.583 1.667-1.25 2.083.916.417 1.583 1.167 1.583 2.25 0 1.5-1.084 2.583-2.917 2.583-2 0-3.5-1.417-3.5-3.833 0-2.834 1.75-4.417 4.167-4.417 1.5 0 2.5.417 2.5 1.417 0 .5-.25.833-.5.916-.25.084-.417.167-.417.334 0 .166.167.333.417.5s.583.333 1 .333c1.083 0 1.833-.584 1.833-1.834 0-1.666-1.5-2.5-3.5-2.5-2.833 0-5.083 2.084-5.083 5.25 0 3.084 2 5.084 4.583 5.084Z"/></svg>} />
                    }
                    <ContactButton text="Наш сайт" href={college.contacts.website} icon={<svg className="w-7 h-7 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>} />
                    <ContactButton text="Мы на карте" href={college.contacts.map} icon={<svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                 </div>
            </div>

        </div>
    );
};

export default CollegeDetailScreen;
