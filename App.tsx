
import React, { useState, useEffect, useCallback } from 'react';
import type { View, PlanItem, Achievement, AppState, ThemeMode } from './types';
import { generateChecklist } from './data/checklistTemplates';
import { supabase } from './lib/supabaseClient';
import { api } from './services/api';
import { achievements } from './data/achievements';

import SpecialtiesScreen from './components/SpecialtiesScreen';
import CollegesScreen from './components/CollegesScreen';
import ProfessionDetailScreen from './components/ProfessionDetailScreen';
import CollegeDetailScreen from './components/CollegeDetailScreen';
import EducationTypeSelectionScreen from './components/EducationTypeSelectionScreen';
import QuizScreen from './components/QuizScreen';
import QuizResultView from './components/QuizResultView';
import Top50Screen from './components/Top50Screen';
import DashboardScreen from './components/DashboardScreen';
import AppBar from './components/AppBar';
import MyPlanScreen from './components/MyPlanScreen';
import CalendarScreen from './components/CalendarScreen';
import ProfileScreen from './components/ProfileScreen';
import NewsScreen from './components/NewsScreen';
import NewsDetailScreen from './components/NewsDetailScreen';
import ShortsScreen from './components/ShortsScreen';
import AuthScreen from './components/AuthScreen';
import BottomNav from './components/BottomNav';
import OnboardingScreen from './components/OnboardingScreen';
import SettingsScreen from './components/SettingsScreen';
import AchievementNotification from './components/AchievementNotification';

const App: React.FC = () => {
  // Replace single view state with a history stack
  const [history, setHistory] = useState<View[]>([{ name: 'dashboard' }]);
  
  // The current view is always the last item in the history array
  const currentView = history[history.length - 1];

  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
      const savedTheme = localStorage.getItem('app_theme');
      return (savedTheme as ThemeMode) || 'system';
  });

  // Achievement State
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [appState, setAppState] = useState<AppState>(() => {
      const saved = localStorage.getItem('appState');
      return saved ? JSON.parse(saved) : {
          planCount: 0,
          hasCalculatedScore: false,
          quizzesPassed: 0,
          collegesViewed: 0,
          videosWatched: 0,
          specialtiesInPlan: 0,
          collegesInPlan: 0,
          hasUsedComparison: false,
          videosLiked: 0
      };
  });

  // Theme Logic
  useEffect(() => {
      const root = document.documentElement;
      const applyTheme = (mode: 'light' | 'dark') => {
          if (mode === 'dark') {
              root.classList.add('dark');
          } else {
              root.classList.remove('dark');
          }
      };

      if (theme === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          applyTheme(systemPrefersDark ? 'dark' : 'light');

          // Listener for system changes
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = (e: MediaQueryListEvent) => {
              applyTheme(e.matches ? 'dark' : 'light');
          };
          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
          applyTheme(theme);
      }
      
      localStorage.setItem('app_theme', theme);
  }, [theme]);


  // Check for onboarding status on mount
  useEffect(() => {
      const hasSeen = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeen) {
          setShowOnboarding(true);
      }
  }, []);

  // Persist App State
  useEffect(() => {
      localStorage.setItem('appState', JSON.stringify(appState));
      checkAchievements();
  }, [appState]);

  const checkAchievements = useCallback(() => {
      const unlockedIds = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
      
      for (const achievement of achievements) {
          if (!unlockedIds.includes(achievement.id)) {
              if (achievement.condition(appState)) {
                  // Unlock it
                  unlockedIds.push(achievement.id);
                  localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedIds));
                  setNewAchievement(achievement); // Trigger toast
                  
                  // Play sound if enabled
                  const soundEnabled = localStorage.getItem('app_sound_enabled') !== 'false';
                  if (soundEnabled) {
                      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
                      audio.volume = 0.5;
                      audio.play().catch(() => {/* Ignore play errors (e.g. no interaction) */});
                  }
              }
          }
      }
  }, [appState]);

  // --- Action Triggers for Achievements ---
  
  const incrementVideoWatch = () => {
      setAppState(prev => ({ ...prev, videosWatched: prev.videosWatched + 1 }));
  };

  const incrementVideoLike = () => {
      setAppState(prev => ({ ...prev, videosLiked: prev.videosLiked + 1 }));
  };

  const incrementQuizPass = () => {
      setAppState(prev => ({ ...prev, quizzesPassed: prev.quizzesPassed + 1 }));
  };

  const markScoreCalculated = () => {
      setAppState(prev => ({ ...prev, hasCalculatedScore: true }));
  };

  const markComparisonUsed = () => {
      setAppState(prev => ({ ...prev, hasUsedComparison: true }));
  };

  const handleOnboardingComplete = (action: 'dashboard' | 'quiz') => {
      localStorage.setItem('hasSeenOnboarding', 'true');
      setShowOnboarding(false);
      if (action === 'quiz') {
          navigateTo({ name: 'quiz' });
      } else {
          navigateTo({ name: 'dashboard' });
      }
  };

  const handleReplayOnboarding = () => {
      setShowOnboarding(true);
  };

  // Plan is initialized from localStorage, but will be synced with server if user logs in
  const [plan, setPlan] = useState<PlanItem[]>(() => {
    try {
        const item = window.localStorage.getItem('myPlan');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.warn('Error reading localStorage key “myPlan”:', error);
        return [];
    }
  });

  // 1. Persist to localStorage whenever plan changes (Offline First approach)
  useEffect(() => {
    window.localStorage.setItem('myPlan', JSON.stringify(plan));
    
    // Update achievement state for plan details
    const specialties = plan.filter(i => i.type === 'specialty').length;
    const colleges = plan.filter(i => i.type === 'college').length;
    
    setAppState(prev => ({ 
        ...prev, 
        planCount: plan.length,
        specialtiesInPlan: specialties,
        collegesInPlan: colleges
    }));
  }, [plan]);

  // 2. Handle Auth State and Data Sync
  useEffect(() => {
      if (!supabase) return;

      // Check initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null);
          if (session?.user) {
              syncPlanWithServer(session.user.id);
          }
      });

      // Listen for auth changes (login, logout, signup)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          
          if (currentUser) {
              // User logged in: Sync local plan to server, then fetch server plan
              await syncPlanWithServer(currentUser.id);
          } else {
              // User logged out: Clear plan to avoid showing previous user's data
              // Optionally we could keep it, but security-wise it's better to clear
              setPlan([]);
              localStorage.removeItem('myPlan');
          }
      });

      return () => subscription.unsubscribe();
  }, []);

  const syncPlanWithServer = async (userId: string) => {
      // 1. Get what we have locally currently
      const localPlanStr = window.localStorage.getItem('myPlan');
      const localPlan: PlanItem[] = localPlanStr ? JSON.parse(localPlanStr) : [];

      // 2. Upload local items to server (if they don't exist there, handled by upsert/ignore logic in API)
      if (localPlan.length > 0) {
          await Promise.all(localPlan.map(item => api.addToUserPlan(userId, item)));
      }

      // 3. Fetch the definitive list from server
      const serverPlan = await api.getUserPlan(userId);
      
      // 4. Update local state to match server
      setPlan(serverPlan);
  };
  
  const addToPlan = async (id: string, type: 'specialty' | 'college') => {
    if (plan.some(item => item.id === id)) return; // Already in plan

    const checklist = generateChecklist(type, id);
    const newItem: PlanItem = { id, type, checklist };
    
    // Optimistic UI update
    setPlan(prev => [...prev, newItem]);

    // If logged in, save to server
    if (user) {
        await api.addToUserPlan(user.id, newItem);
    }
  };
  
  const removeFromPlan = async (id: string) => {
    // Optimistic UI update
    setPlan(prev => prev.filter(item => item.id !== id));

    // If logged in, remove from server
    if (user) {
        await api.removeFromUserPlan(user.id, id);
    }
  };
  
  const updateChecklistItem = async (planItemId: string, checklistItemId: string, isCompleted: boolean) => {
    let updatedChecklist: any[] = [];

    // Optimistic UI update
    setPlan(prevPlan => prevPlan.map(item => {
        if (item.id === planItemId) {
            updatedChecklist = item.checklist.map(checkItem => 
                checkItem.id === checklistItemId ? { ...checkItem, isCompleted } : checkItem
            );
            return { ...item, checklist: updatedChecklist };
        }
        return item;
    }));

    // If logged in, update server
    if (user && updatedChecklist.length > 0) {
        await api.updateUserPlanChecklist(user.id, planItemId, updatedChecklist);
    }
  };
  
  // Push new view to history
  const navigateTo = (newView: View) => {
    if (newView.name === 'dashboard') {
        setHistory([{ name: 'dashboard' }]);
    } else if (newView.name === 'shorts' || newView.name === 'news') {
        setHistory(prev => [...prev, newView]);
    } else {
        setHistory(prev => [...prev, newView]);
    }
  };

  // Pop last view from history
  const navigateBack = () => {
    // Special handling: When backing out of Quiz Result, go straight to Quiz Selection (skipping the active quiz)
    if (currentView.name === 'quizResult') {
        // Look backwards in history to find the Quiz Selection screen (name='quiz' without type)
        let selectionIndex = -1;
        for (let i = history.length - 2; i >= 0; i--) {
            const view = history[i];
            if (view.name === 'quiz' && !view.quizType) {
                selectionIndex = i;
                break;
            }
        }

        if (selectionIndex !== -1) {
            setHistory(prev => prev.slice(0, selectionIndex + 1));
            return;
        } else {
            navigateTo({ name: 'quiz' });
            return;
        }
    }

    setHistory(prev => {
        if (prev.length > 1) {
            return prev.slice(0, -1);
        }
        return prev; // Don't pop the last item (Dashboard)
    });
  };
  
  // Handle Bottom Nav Switching
  const handleTabSelect = (tab: 'home' | 'video' | 'news') => {
      if (tab === 'home') navigateTo({ name: 'dashboard' });
      if (tab === 'video') navigateTo({ name: 'shorts' });
      if (tab === 'news') navigateTo({ name: 'news' });
  };

  // Determine active tab for visual state
  const activeTab = currentView.name === 'shorts' ? 'video' : (currentView.name === 'news' || currentView.name === 'newsDetail') ? 'news' : 'home';

  const renderContent = () => {
    switch (currentView.name) {
      case 'dashboard':
        return <DashboardScreen setView={navigateTo} />;
      case 'auth':
        return <AuthScreen onBack={navigateBack} onSuccess={navigateBack} />;
      case 'specialties':
        return <SpecialtiesScreen onNavigate={(id) => navigateTo({ name: 'professionDetail', id })} onBack={navigateBack} plan={plan} onAddToPlan={addToPlan} onRemoveFromPlan={removeFromPlan} />;
      case 'colleges':
        return <CollegesScreen onNavigate={(id) => navigateTo({ name: 'collegeDetail', id })} onBack={navigateBack} plan={plan} onAddToPlan={addToPlan} onRemoveFromPlan={removeFromPlan} />;
       case 'educationTypeSelection':
        return <EducationTypeSelectionScreen onNavigate={() => navigateTo({ name: 'colleges'})} onBack={navigateBack} />;
      case 'profile':
        return <ProfileScreen onBack={navigateBack} onCalculateScore={markScoreCalculated} />;
      case 'settings':
        return <SettingsScreen 
            onBack={navigateBack} 
            onReplayOnboarding={handleReplayOnboarding} 
            currentTheme={theme}
            onThemeChange={setTheme}
        />;
      case 'professionDetail':
        return <ProfessionDetailScreen 
                    specialtyId={currentView.id} 
                    onBack={navigateBack} 
                    onNavigateToCollege={(id) => navigateTo({ name: 'collegeDetail', id })}
                    isInPlan={plan.some(p => p.id === currentView.id)}
                    onAddToPlan={addToPlan}
                    onRemoveFromPlan={removeFromPlan}
                />;
      case 'collegeDetail':
        return <CollegeDetailScreen 
                    collegeId={currentView.id} 
                    onBack={navigateBack} 
                    onNavigateToSpecialty={(id) => navigateTo({ name: 'professionDetail', id })}
                    isInPlan={plan.some(p => p.id === currentView.id)}
                    onAddToPlan={addToPlan}
                    onRemoveFromPlan={removeFromPlan}
                    onNavigateToCalendar={() => navigateTo({name: 'calendar'})}
                />;
      case 'quiz':
        return <QuizScreen onBack={navigateBack} onNavigate={navigateTo} quizType={currentView.quizType} />;
      case 'quizResult':
        // Wrap navigateTo to inject achievement trigger
        const handleQuizFinish = () => {
            incrementQuizPass();
            // Does not change navigation, just updates state. Navigation happens inside the component via onNavigateToCollege or onBack
        };
        // We call incrementQuizPass on mount of result view to simplify
        return (
            <QuizResultViewWrapper 
                scores={currentView.scores}
                quizType={currentView.quizType}
                onBack={navigateBack}
                onNavigateToCollege={(id) => navigateTo({ name: 'collegeDetail', id })}
                onMount={incrementQuizPass}
            />
        );
      case 'myPlan':
        return <MyPlanScreen
                  onBack={navigateBack}
                  plan={plan}
                  onRemoveFromPlan={removeFromPlan}
                  onUpdateChecklistItem={updateChecklistItem}
                  onNavigateToSpecialty={(id) => navigateTo({ name: 'professionDetail', id })}
                  onNavigateToCollege={(id) => navigateTo({ name: 'collegeDetail', id })}
                  onNavigateToCalculator={() => navigateTo({ name: 'profile' })}
                  onNavigateToCalendar={() => navigateTo({ name: 'calendar' })}
                  onNavigateToSpecialtiesList={() => navigateTo({ name: 'specialties' })}
                  onNavigateToCollegesList={() => navigateTo({ name: 'educationTypeSelection' })}
                  onCompare={markComparisonUsed}
                />
      case 'top50':
          return <Top50Screen 
              onBack={navigateBack} 
              onNavigateToCollege={(id) => navigateTo({ name: 'collegeDetail', id })}
              onNavigateToSpecialty={(id) => navigateTo({ name: 'professionDetail', id })}
          />;
      case 'calendar':
          return <CalendarScreen onBack={navigateBack} onNavigateToCollege={(id) => navigateTo({ name: 'collegeDetail', id })} />;
      case 'news':
          return <NewsScreen onBack={navigateBack} onNavigateToDetail={(id) => navigateTo({ name: 'newsDetail', id })} />;
      case 'newsDetail':
          return <NewsDetailScreen newsId={currentView.id} onBack={navigateBack} />;
      case 'shorts':
          // Wrap shorts to trigger view count on mount
          return (
              <ShortsScreenWrapper 
                onBack={navigateBack}
                onNavigateToAuth={() => navigateTo({ name: 'auth' })}
                onNavigateToCollege={(id) => navigateTo({ name: 'collegeDetail', id })}
                onNavigateToSpecialty={(id) => navigateTo({ name: 'professionDetail', id })}
                onWatch={incrementVideoWatch}
                onLike={incrementVideoLike}
              />
          );
      default:
        return <DashboardScreen setView={navigateTo} />;
    }
  };
  
  const showAppBar = !showOnboarding && currentView.name !== 'shorts' && currentView.name !== 'auth';
  const showBottomNav = !showOnboarding && currentView.name !== 'auth';

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white pb-16 transition-colors duration-300">
      {showOnboarding && <OnboardingScreen onComplete={handleOnboardingComplete} />}
      {newAchievement && (
          <AchievementNotification 
            achievement={newAchievement} 
            onClose={() => setNewAchievement(null)} 
          />
      )}
      
      { showAppBar && <AppBar onBack={navigateBack} onNavigate={navigateTo} showBack={currentView.name !== 'dashboard'} /> }
      <div className={showAppBar ? "pt-20" : ""}>
        <main className={currentView.name === 'shorts' || currentView.name === 'auth' ? "" : "p-4 sm:p-6"}>
          {renderContent()}
        </main>
      </div>
      { showBottomNav && <BottomNav activeTab={activeTab} onSelect={handleTabSelect} /> }
    </div>
  );
};

// Helper wrappers to trigger achievements on component mount
const QuizResultViewWrapper: React.FC<any> = (props) => {
    useEffect(() => {
        props.onMount();
    }, []);
    return <QuizResultView {...props} />;
}

const ShortsScreenWrapper: React.FC<any> = (props) => {
    useEffect(() => {
        // Count as "watched" if they stay on the screen for 5 seconds
        const timer = setTimeout(() => {
            props.onWatch();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);
    return <ShortsScreen {...props} />;
}

export default App;