
import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../services/api';
import type { CalendarEvent } from '../types';

const getMonthName = (date: Date) => date.toLocaleString('ru-RU', { month: 'long' });

const EventCard: React.FC<{ event: CalendarEvent, onNavigate: () => void }> = ({ event, onNavigate }) => {
    return (
        <div onClick={onNavigate} className="w-full text-left bg-white dark:bg-slate-800/70 p-4 rounded-xl flex items-center space-x-4 border border-slate-200 dark:border-white/10 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all cursor-pointer animate-fade-in-up shadow-sm">
             {event.collegeLogoUrl ? (
                 <img src={event.collegeLogoUrl} alt="logo" className="w-12 h-12 rounded-full object-contain flex-shrink-0 bg-slate-100 dark:bg-slate-700 p-1" />
             ) : (
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500 dark:text-slate-300">Лого</div>
             )}
            <div className="flex-grow">
                <p className="font-bold text-slate-900 dark:text-white">{event.title}</p>
                <p className="text-slate-500 dark:text-slate-300 text-sm">{event.collegeName || 'Колледж'}</p>
                <p className="text-sky-600 dark:text-sky-400 text-xs mt-1">
                    {new Date(event.date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
                </p>
            </div>
        </div>
    );
};

const CalendarScreen: React.FC<{ onBack: () => void; onNavigateToCollege: (id: string) => void; }> = ({ onBack, onNavigateToCollege }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await api.getEvents();
                setEvents(data);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const eventsByDate = useMemo(() => {
        return events.reduce((acc, event) => {
            const dateKey = new Date(event.date).toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(event);
            return acc;
        }, {} as { [key: string]: CalendarEvent[] });
    }, [events]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Set to the first day to avoid issues with month lengths
            newDate.setMonth(prev.getMonth() + offset);
            return newDate;
        });
    };

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const grid = [];
        const dayOfWeek = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = 0; i < dayOfWeek; i++) {
            grid.push({
                date: new Date(year, month - 1, prevMonthDays - dayOfWeek + i + 1),
                isCurrentMonth: false,
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            grid.push({
                date: new Date(year, month, i),
                isCurrentMonth: true,
            });
        }
        
        const totalCells = grid.length > 35 ? 42 : 35;
        const remainingCells = totalCells - grid.length;
        for (let i = 1; i <= remainingCells; i++) {
            grid.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
            });
        }
        return grid;
    }, [currentDate]);

    const selectedDayEvents = useMemo(() => {
        const dateKey = selectedDate.toISOString().split('T')[0];
        return eventsByDate[dateKey] || [];
    }, [selectedDate, eventsByDate]);

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <button onClick={onBack} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold">На главный</span>
            </button>
            <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Календарь абитуриента</h1>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-2xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-slate-600 dark:text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-xl font-semibold capitalize text-slate-900 dark:text-white">{getMonthName(currentDate)} {currentDate.getFullYear()}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-slate-600 dark:text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-500 dark:text-slate-400 mb-2">
                    {weekDays.map(day => <div key={day}>{day}</div>)}
                </div>

                {loading ? (
                     <div className="flex justify-center py-10 h-[300px] items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-1">
                        {calendarGrid.map((day, index) => {
                            const dateKey = day.date.toISOString().split('T')[0];
                            const dayEvents = eventsByDate[dateKey] || [];
                            const isSelected = selectedDate.toDateString() === day.date.toDateString();
                            const isToday = new Date().toDateString() === day.date.toDateString();

                            return (
                                <div key={index} onClick={() => setSelectedDate(day.date)}
                                    className={`aspect-square flex flex-col items-center justify-start p-1 rounded-lg cursor-pointer transition-all relative overflow-hidden ${
                                        day.isCurrentMonth ? 'hover:bg-slate-100 dark:hover:bg-slate-700/50' : 'opacity-30'
                                    } ${isSelected ? 'bg-sky-500/10 dark:bg-sky-500/20 border-sky-500' : 'border-transparent'} ${isToday ? 'border border-amber-500 dark:border-amber-400' : 'border'}`}>
                                    
                                    <span className={`font-semibold text-sm z-10 ${isToday ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-white'}`}>{day.date.getDate()}</span>
                                    
                                    {/* Event Indicators */}
                                    <div className="flex justify-center items-center mt-1 w-full">
                                        {dayEvents.length === 1 ? (
                                            dayEvents[0].collegeLogoUrl ? (
                                                <img src={dayEvents[0].collegeLogoUrl} className="w-4 h-4 rounded-full object-cover bg-slate-100 dark:bg-slate-900" title={dayEvents[0].collegeName} />
                                            ) : (
                                                <div className="w-2 h-2 bg-sky-400 rounded-full" />
                                            )
                                        ) : dayEvents.length >= 2 ? (
                                            <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white/20 shadow-sm">
                                                {dayEvents.length}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <div className="animate-fade-in">
                 <h3 className="text-xl font-semibold text-center mb-4 text-slate-900 dark:text-white">
                    События на {selectedDate.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'})}
                </h3>
                <div className="space-y-3">
                    {selectedDayEvents.length > 0 ? (
                        selectedDayEvents.map(event => <EventCard key={event.id} event={event} onNavigate={() => onNavigateToCollege(event.collegeId)} />)
                    ) : (
                        <div className="text-center py-6 px-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10">
                            <p className="text-slate-500 dark:text-slate-400">На выбранную дату событий нет.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarScreen;
