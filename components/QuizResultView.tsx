
import React, { useMemo } from 'react';
import type { QuizScores, QuizCategory, College, View, QuizScoresSwipe, QuizScoresBattle } from '../types';
import { collegeRecommendations, mockColleges, swipeCollegeRecommendations, klimovRecommendations } from '../data/mockData';

const ResultCard: React.FC<{ category: string; score: number; index: number }> = ({ category, score, index }) => {
    const colors = [
        "from-green-400 to-blue-500",
        "from-yellow-400 to-orange-500",
        "from-purple-400 to-pink-500",
        "from-rose-400 to-red-500",
        "from-indigo-400 to-violet-500",
    ];
    const scoreText = (score: number) => {
        if (score === 1) return 'ответ';
        if (score > 1 && score < 5) return 'ответа';
        return 'ответов';
    }
    return (
        <div className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/10 flex items-center space-x-4`}>
            <div className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br ${colors[index % colors.length]}`}>
                #{index + 1}
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">{category}</h3>
                <p className="text-slate-400">{score} {scoreText(score)}</p>
            </div>
        </div>
    );
};

const CollegeLinkCard: React.FC<{ college: College, onClick: () => void }> = ({ college, onClick }) => (
    <div onClick={onClick} className="flex items-center space-x-4 bg-slate-800/50 p-4 rounded-xl border border-white/10 hover:bg-slate-700 hover:border-sky-500/50 transition-all cursor-pointer">
        <img src={college.logoUrl} alt={`${college.name} logo`} className="w-12 h-12 rounded-full object-contain flex-shrink-0 bg-slate-700 p-1" />
        <div>
            <h4 className="font-bold text-white">{college.name}</h4>
            <p className="text-sm text-slate-300">Проходной балл: {college.passingScore}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </div>
);

interface QuizResultViewProps {
    scores: QuizScores | QuizScoresSwipe | QuizScoresBattle;
    quizType: 'classic' | 'swipe' | 'battle';
    onBack: () => void;
    onNavigateToCollege: (id: string) => void;
}

const QuizResultView: React.FC<QuizResultViewProps> = ({ scores, quizType, onBack, onNavigateToCollege }) => {
    const sortedScores = useMemo(() => {
        return Object.entries(scores)
            .filter(([, score]) => typeof score === 'number' && score > 0)
            .sort((a, b) => (b[1] as number) - (a[1] as number));
    }, [scores]);

    const topThree = sortedScores.slice(0, 3);
    const topCategory = topThree.length > 0 ? topThree[0][0] as any : null;

    let recommendations: any = collegeRecommendations;
    if (quizType === 'swipe') recommendations = swipeCollegeRecommendations;
    if (quizType === 'battle') recommendations = klimovRecommendations;

    const recommendedCollegeIds = topCategory ? recommendations[topCategory] : [];
    const recommendedColleges = recommendedCollegeIds
        ? recommendedCollegeIds
            .map((id: string) => mockColleges.find(c => c.id === id))
            .filter((c: College | undefined): c is College => !!c)
        : [];

    return (
        <div className="animate-fade-in-up space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 text-center">
                <h2 className="text-2xl font-semibold mb-2">Тест завершен!</h2>
                <p className="text-slate-300 mb-6">Ваши топ-3 направления:</p>
                <div className="space-y-3 text-left">
                    {topThree.length > 0 ? topThree.map(([category, score], index) => (
                        <ResultCard key={category} category={category} score={score as number || 0} index={index} />
                    )) : <p className="text-slate-400 text-center">Не удалось определить направления. Попробуйте снова!</p>}
                </div>
                
                <button onClick={onBack} className="mt-6 text-sky-400 hover:text-sky-300 font-medium">
                    Пройти другой тест
                </button>
            </div>
            {recommendedColleges.length > 0 && onNavigateToCollege && (
                 <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-center">Рекомендуемые учебные заведения</h2>
                    <div className="space-y-3">
                        {recommendedColleges.map(college => (
                            <CollegeLinkCard key={college.id} college={college} onClick={() => onNavigateToCollege(college.id)} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizResultView;
