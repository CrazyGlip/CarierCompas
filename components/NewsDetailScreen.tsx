
import React from 'react';
import { mockNews } from '../data/mockData';

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group mb-6 z-10 relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-semibold">Назад к новостям</span>
    </button>
);

interface NewsDetailScreenProps {
    newsId: string;
    onBack: () => void;
}

const NewsDetailScreen: React.FC<NewsDetailScreenProps> = ({ newsId, onBack }) => {
    const newsItem = mockNews.find(n => n.id === newsId);

    if (!newsItem) {
        return (
            <div className="p-6">
                <BackButton onClick={onBack} />
                <p className="text-center text-slate-500 dark:text-slate-400">Новость не найдена</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-10">
            <BackButton onClick={onBack} />
            
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
                <div className="h-64 md:h-80 relative">
                     <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                     <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex flex-wrap gap-2 mb-3">
                             {newsItem.tags.map(tag => (
                                <span key={tag} className="bg-sky-500/80 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight">{newsItem.title}</h1>
                     </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                        <span className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {newsItem.date}
                        </span>
                         <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                         </button>
                    </div>

                    <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                         <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetailScreen;
