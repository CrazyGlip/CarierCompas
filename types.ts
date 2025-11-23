
export interface Specialty {
  id: string;
  title: string;
  type: 'профессия' | 'специальность';
  description: string;
  imageUrl: string;
  fullDescription: string;
  passingScore: number;
  duration: string;
  details: {
    dayInLife: string;
    pros: string[];
    cons: string[];
    salary: {
      novice: { from: number; to: number };
      experienced: { from: number; to: number };
    };
    skills: string[];
    careerTrack: { step: number; title: string }[];
  };
}

export interface College {
  id: string;
  name: string;
  imageUrl: string;
  logoUrl: string;
  description: string;
  passingScore: number;
  specialtyIds: string[];
  city: string; 
  educationForms: string[];
  contacts: {
    phone: string;
    map: string;
    email: string;
    website: string;
    vk?: string;
    ok?: string;
  };
  info: {
    hasDormitory: boolean;
    hasFreeMeals: boolean;
    isAccessibleForDisabled: boolean;
    hasLibrary: boolean;
    hasSportsFacilities: boolean;
  };
}

export interface Subject {
  id:string;
  name: string;
  grade: number;
  weight: number;
}

export interface Profession {
  id: number;
  name: string;
  sphere: string;
  salaryFrom: number;
  salaryTo: number;
  collegeIds: string[];
  description?: string; // New: Why is it in top?
  trend?: 'growing' | 'stable' | 'hot'; // New: Market trend
  relatedSpecialtyIds?: string[]; // New: Links to specific specialties
}

export interface CalendarEvent {
  id: string;
  collegeId: string;
  title: string;
  date: string; // ISO format
  type: 'openDay' | 'deadlineStart' | 'deadlineEnd' | 'exam';
  collegeLogoUrl?: string;
  collegeName?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  type: 'info' | 'action' | 'link' | 'navigation';
  payload?: any; 
}

export interface PlanItem {
  id: string;
  type: 'specialty' | 'college';
  checklist: ChecklistItem[];
}

export interface NewsItem {
    id: string;
    title: string;
    date: string;
    summary: string;
    content: string;
    imageUrl: string;
    tags: string[];
}

export interface ShortVideo {
    id: string;
    title: string;
    description: string;
    author: string;
    imageUrl: string;
    videoUrl?: string;
    likes: number;
    views: string;
    collegeId?: string;
    collegeName?: string;
    specialtyId?: string;
    specialtyTitle?: string;
}

export type Tab = 'specialties' | 'colleges' | 'profile';

export type QuizCategory = 'Техническое' | 'IT' | 'Сельское хозяйство' | 'Искусство' | 'Медицина' | 'Строительство';

export interface QuizQuestion {
  id: number;
  text: string;
  answers: {
    text: string;
    category: QuizCategory;
  }[];
}

export type QuizScores = { [key in QuizCategory]?: number };

export type QuizCategorySwipe = 'Аналитика' | 'Творчество' | 'Лидерство' | 'Практика';

export interface QuizQuestionSwipe {
  id: number;
  text: string;
  category: QuizCategorySwipe;
}

export type QuizScoresSwipe = { [key in QuizCategorySwipe]?: number };

// --- New Types for Battle Quiz (Klimov) ---
export type KlimovCategory = 'Человек-Природа' | 'Человек-Техника' | 'Человек-Человек' | 'Человек-Знак' | 'Человек-Образ';

export interface BattleQuestion {
    id: number;
    optionA: {
        text: string;
        imageUrl: string;
        category: KlimovCategory;
    };
    optionB: {
        text: string;
        imageUrl: string;
        category: KlimovCategory;
    };
}

export type QuizScoresBattle = { [key in KlimovCategory]?: number };

// --- Achievement Types ---
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    condition: (state: AppState) => boolean;
}

// A simple state representation for checking achievements
export interface AppState {
    planCount: number;
    hasCalculatedScore: boolean;
    quizzesPassed: number;
    collegesViewed: number;
    videosWatched: number;
    specialtiesInPlan: number;
    collegesInPlan: number;
    hasUsedComparison: boolean;
    videosLiked: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type View =
    | { name: 'auth' }
    | { name: 'dashboard' }
    | { name: 'specialties' }
    | { name: 'colleges' }
    | { name: 'profile' }
    | { name: 'professionDetail', id: string }
    | { name: 'collegeDetail', id: string }
    | { name: 'educationTypeSelection' }
    | { name: 'quiz', quizType?: 'classic' | 'swipe' | 'battle' }
    | { name: 'myPlan' }
    | { name: 'top50' }
    | { name: 'calendar' }
    | { name: 'quizResult', scores: any, quizType: 'classic' | 'swipe' | 'battle' }
    | { name: 'news' }
    | { name: 'newsDetail', id: string }
    | { name: 'shorts' }
    | { name: 'settings' };