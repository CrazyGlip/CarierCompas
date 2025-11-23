
import React, { useState, useMemo, useRef } from 'react';
import type { QuizScores, QuizCategory, College, View, QuizScoresSwipe, QuizScoresBattle, KlimovCategory } from '../types';
import { quizQuestions, collegeRecommendations, mockColleges, swipeQuizQuestions, swipeCollegeRecommendations, battleQuestions } from '../data/mockData';

const QuizSelectionView: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => (
    <div className="space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Выберите тест</h1>
        <div className="space-y-4">
            <button 
                onClick={() => onNavigate({ name: 'quiz', quizType: 'battle' })}
                className="w-full p-6 rounded-2xl text-left transition-transform duration-300 shadow-lg bg-gradient-to-r from-indigo-500 to-violet-600 backdrop-blur-xl border border-white/10 hover:scale-[1.03] hover:border-indigo-400/50 cursor-pointer relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Битва выборов 
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">HOT</span>
                    </h3>
                    <p className="text-indigo-100 mt-1">Что ты выберешь? Визуальный тест по методике Климова.</p>
                </div>
            </button>

             <button 
                onClick={() => onNavigate({ name: 'quiz', quizType: 'swipe' })}
                className="w-full p-6 rounded-2xl text-left transition-transform duration-300 shadow-lg bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:scale-[1.03] hover:border-purple-500/50 cursor-pointer"
            >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Быстрый выбор (Да/Нет)</h3>
                <p className="text-slate-500 dark:text-slate-300 mt-1">Определите свои предпочтения с помощью карточек.</p>
            </button>

             <button 
                onClick={() => onNavigate({ name: 'quiz', quizType: 'classic' })}
                className="w-full p-6 rounded-2xl text-left transition-transform duration-300 shadow-lg bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:scale-[1.03] hover:border-sky-500/50 cursor-pointer"
            >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Классический тест</h3>
                <p className="text-slate-500 dark:text-slate-300 mt-1">Ответьте на вопросы и узнайте свои сильные стороны.</p>
            </button>
        </div>
    </div>
);

const ClassicQuizView: React.FC<{ onFinish: (scores: QuizScores) => void }> = ({ onFinish }) => {
    // Store answers by index to allow revisiting questions without losing selection
    const [userAnswers, setUserAnswers] = useState<(QuizCategory | null)[]>(new Array(quizQuestions.length).fill(null));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleAnswer = (category: QuizCategory) => {
        // Update the answer for the current question
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = category;
        setUserAnswers(newAnswers);
        
        if (currentQuestionIndex < quizQuestions.length - 1) {
            // Add a small delay for better UX so user sees the selection
            setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 250);
        } else {
            // Calculate final scores from answers
            const finalScores: QuizScores = {};
            newAnswers.forEach(cat => {
                if (cat) {
                    finalScores[cat] = (finalScores[cat] || 0) + 1;
                }
            });
            if (onFinish) onFinish(finalScores);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const selectedAnswer = userAnswers[currentQuestionIndex];

    return (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-white/10">
            <div className="flex justify-between items-center mb-4 relative">
                {currentQuestionIndex > 0 ? (
                    <button 
                        onClick={handleBack}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full transition-colors absolute left-0"
                        aria-label="Предыдущий вопрос"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                ) : <div className="w-10"></div>}
                
                <h2 className="text-2xl font-semibold text-center flex-grow text-slate-900 dark:text-white">Вопрос {currentQuestionIndex + 1}</h2>
                
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            <p className="text-center text-slate-500 dark:text-slate-400 mb-6 text-sm">из {quizQuestions.length}</p>
            
            <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                ></div>
            </div>

            <div key={currentQuestion.id} className="animate-fade-in">
                <h3 className="text-xl font-medium text-center mb-6 min-h-[3rem] flex items-center justify-center text-slate-800 dark:text-white">{currentQuestion.text}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.answers.map(answer => {
                        const isSelected = selectedAnswer === answer.category;
                        return (
                            <button
                                key={answer.text}
                                onClick={() => handleAnswer(answer.category)}
                                className={`w-full p-4 text-center rounded-xl border transition-all duration-200 
                                    ${isSelected 
                                        ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/30 scale-[1.02]' 
                                        : 'bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-slate-500 hover:scale-[1.02] active:scale-95 text-slate-700 dark:text-slate-200'
                                    }`}
                            >
                                {answer.text}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const BattleQuizView: React.FC<{ onFinish: (scores: QuizScoresBattle) => void }> = ({ onFinish }) => {
    const [scores, setScores] = useState<QuizScoresBattle>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const handleChoice = (category: KlimovCategory) => {
        if (animating) return;
        setAnimating(true);

        const newScores = { ...scores, [category]: (scores[category] || 0) + 1 };
        setScores(newScores);

        setTimeout(() => {
            if (currentIndex < battleQuestions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setAnimating(false);
            } else {
                onFinish(newScores);
            }
        }, 400);
    };

    const question = battleQuestions[currentIndex];
    const progress = ((currentIndex + 1) / battleQuestions.length) * 100;

    return (
        <div className="flex flex-col h-[80vh] md:h-auto md:min-h-[600px]">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-t-2xl p-4 border-b border-slate-200 dark:border-white/10 text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Что ты выберешь?</h2>
                <div className="relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden max-w-md mx-auto">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="flex-1 grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 relative overflow-hidden bg-slate-900">
                {/* VS Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white text-black font-black text-xl p-3 rounded-full shadow-xl border-4 border-slate-900">
                    VS
                </div>

                {/* Option A */}
                <div 
                    onClick={() => handleChoice(question.optionA.category)}
                    className={`relative group cursor-pointer overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-white/10 ${animating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}
                >
                    <img src={question.optionA.imageUrl} alt={question.optionA.text} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                        <span className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Вариант 1</span>
                        <h3 className="text-2xl font-bold text-white leading-tight">{question.optionA.text}</h3>
                    </div>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                </div>

                {/* Option B */}
                <div 
                    onClick={() => handleChoice(question.optionB.category)}
                    className={`relative group cursor-pointer overflow-hidden ${animating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}
                >
                    <img src={question.optionB.imageUrl} alt={question.optionB.text} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                        <span className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Вариант 2</span>
                        <h3 className="text-2xl font-bold text-white leading-tight">{question.optionB.text}</h3>
                    </div>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                </div>
            </div>
        </div>
    );
};

const SwipeTutorial: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 animate-fade-in">
        <div className="relative w-full max-w-[240px] h-48 flex items-center justify-center mb-6">
            {/* Left Zone */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 flex flex-col items-center opacity-90">
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <span className="text-rose-400 font-black text-lg tracking-wider">НЕТ</span>
            </div>

            {/* Right Zone */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 flex flex-col items-center opacity-90">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-emerald-400 font-black text-lg tracking-wider">ДА</span>
            </div>

            {/* Hand Animation */}
            <div className="text-7xl animate-[wiggle_1.5s_ease-in-out_infinite] drop-shadow-2xl filter">
                👆
            </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 text-center">Как это работает?</h3>
        <p className="text-slate-300 text-center mb-8 max-w-xs text-lg">
            Свайпай карточку <span className="text-emerald-400 font-bold">вправо</span>, если это про тебя, и <span className="text-rose-400 font-bold">влево</span>, если нет.
        </p>

        <button 
            onClick={onDismiss}
            className="bg-white text-slate-900 font-extrabold py-4 px-12 rounded-2xl hover:scale-105 transition-transform shadow-xl active:scale-95"
        >
            Погнали!
        </button>

        <style>{`
            @keyframes wiggle {
                0%, 100% { transform: translateX(0) rotate(0deg); }
                25% { transform: translateX(40px) rotate(15deg); }
                75% { transform: translateX(-40px) rotate(-15deg); }
            }
        `}</style>
    </div>
);

const SwipeQuizView: React.FC<{ onFinish: (scores: QuizScoresSwipe) => void }> = ({ onFinish }) => {
    const [scores, setScores] = useState<QuizScoresSwipe>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTutorial, setShowTutorial] = useState(true);

    // State for card swipe interaction
    const [cardPositionX, setCardPositionX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const handleAnswer = (answeredYes: boolean) => {
        if (isExiting) return;
        setIsExiting(true);
        setCardPositionX(answeredYes ? 500 : -500); // Animate out

        const question = swipeQuizQuestions[currentIndex];
        const newScores = { ...scores };
        if (answeredYes) {
            newScores[question.category] = (newScores[question.category] || 0) + 1;
        }
        
        setTimeout(() => {
            setScores(newScores);
            if (currentIndex < swipeQuizQuestions.length - 1) {
                setIsExiting(false);
                setCardPositionX(0); // Reset position for next card
                setCurrentIndex(prev => prev + 1);
            } else {
                onFinish(newScores);
            }
        }, 300); // Corresponds to transition duration
    };
    
    // Gesture Handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        if (isExiting || showTutorial) return;
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging) {
            setCardPositionX(prev => prev + e.movementX);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);

        const swipeThreshold = 100;
        if (cardPositionX > swipeThreshold) {
            handleAnswer(true);
        } else if (cardPositionX < -swipeThreshold) {
            handleAnswer(false);
        } else {
            setCardPositionX(0); // Snap back to center
        }
    };

    const currentQuestion = swipeQuizQuestions[currentIndex];
    const progress = ((currentIndex + 1) / swipeQuizQuestions.length) * 100;

    // Dynamic styles for swipe feedback
    const getCardColor = () => {
        if (cardPositionX > 50) return 'border-emerald-500/50 bg-emerald-900/20';
        if (cardPositionX < -50) return 'border-rose-500/50 bg-rose-900/20';
        return 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50';
    };

    const cardStyle = {
        transform: `translateX(${cardPositionX}px) rotate(${cardPositionX / 20}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    };

    return (
        <div className="flex flex-col items-center relative min-h-[500px]">
            {showTutorial && <SwipeTutorial onDismiss={() => setShowTutorial(false)} />}
            
             <div className="w-full max-w-md bg-white/80 dark:bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden">
                <h2 className="text-2xl font-semibold mb-2 text-center text-slate-900 dark:text-white">Быстрый выбор</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Вопрос {currentIndex + 1} из {swipeQuizQuestions.length}</p>
                <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="relative h-64 flex items-center justify-center" style={{ touchAction: 'none' }}>
                     {/* Overlay Indicators while swiping */}
                     {isDragging && cardPositionX > 50 && (
                         <div className="absolute right-4 top-4 z-20 bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg transform rotate-12 border-2 border-white shadow-lg animate-fade-in">ДА</div>
                     )}
                     {isDragging && cardPositionX < -50 && (
                         <div className="absolute left-4 top-4 z-20 bg-rose-500 text-white font-bold px-4 py-2 rounded-lg transform -rotate-12 border-2 border-white shadow-lg animate-fade-in">НЕТ</div>
                     )}

                     <div
                        key={currentIndex}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        style={cardStyle}
                        className={`absolute w-full h-full rounded-3xl p-8 flex items-center justify-center text-center cursor-grab active:cursor-grabbing border-2 shadow-2xl ${getCardColor()} ${!isExiting ? 'animate-fade-in-up' : ''}`}
                     >
                        <h3 className="text-2xl font-bold leading-relaxed select-none text-slate-900 dark:text-white">{currentQuestion.text}</h3>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <button onClick={() => handleAnswer(false)} className="py-4 font-bold bg-rose-500/10 text-rose-600 dark:text-rose-300 rounded-xl border border-rose-500/30 hover:bg-rose-500/20 transform hover:scale-105 transition active:scale-95">Нет ❌</button>
                    <button onClick={() => handleAnswer(true)} className="py-4 font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/20 transform hover:scale-105 transition active:scale-95">Да ✅</button>
                </div>
            </div>
        </div>
    );
}

interface QuizScreenProps {
    onBack: () => void;
    onNavigate: (view: View) => void;
    quizType?: 'classic' | 'swipe' | 'battle';
}

const QuizScreen: React.FC<QuizScreenProps> = ({ onBack, onNavigate, quizType }) => {
    if (quizType === 'classic') {
        return <ClassicQuizView onFinish={(scores) => onNavigate({ name: 'quizResult', scores, quizType: 'classic' })} />;
    }
    
    if (quizType === 'swipe') {
        return <SwipeQuizView onFinish={(scores) => onNavigate({ name: 'quizResult', scores, quizType: 'swipe' })} />;
    }

    if (quizType === 'battle') {
        return <BattleQuizView onFinish={(scores) => onNavigate({ name: 'quizResult', scores, quizType: 'battle' })} />;
    }

    return <QuizSelectionView onNavigate={onNavigate} />;
};

export default QuizScreen;
