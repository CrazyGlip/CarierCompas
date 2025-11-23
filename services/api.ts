
import { supabase } from '../lib/supabaseClient';
import { mockSpecialties, mockColleges, mockNews, mockShorts, mockEvents, mockTop50Professions } from '../data/mockData';
import type { Specialty, College, NewsItem, ShortVideo, PlanItem, CalendarEvent, Profession } from '../types';

// Helper to simulate network delay for realistic feel when using mocks
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    async getSpecialties(): Promise<Specialty[]> {
        if (!supabase) {
            await delay(300);
            return mockSpecialties;
        }

        const { data, error } = await supabase
            .from('specialties')
            .select('*');

        if (error || !data || data.length === 0) {
            console.warn('Supabase error or empty table, falling back to mocks:', error);
            return mockSpecialties;
        }

        return data.map((item: any) => ({
            ...item,
            imageUrl: item.image_url,
            fullDescription: item.full_description,
            passingScore: item.passing_score,
        })) as Specialty[];
    },

    async getColleges(): Promise<College[]> {
        if (!supabase) {
            await delay(300);
            return mockColleges;
        }

        const { data, error } = await supabase
            .from('colleges')
            .select('*');

        if (error || !data || data.length === 0) {
            console.warn('Supabase error or empty table, falling back to mocks');
            return mockColleges;
        }

        return data.map((item: any) => ({
            ...item,
            imageUrl: item.image_url,
            logoUrl: item.logo_url,
            passingScore: item.passing_score,
            specialtyIds: item.specialty_ids,
            city: item.city || 'Липецк', // Fallback
            educationForms: item.education_forms || ['очная'], // Fallback map
        })) as College[];
    },

    async getNews(): Promise<NewsItem[]> {
        if (!supabase) {
            await delay(300);
            return mockNews;
        }

        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            return mockNews;
        }

        return data.map((item: any) => ({
            ...item,
            imageUrl: item.image_url,
        })) as NewsItem[];
    },

    async getShorts(): Promise<ShortVideo[]> {
        if (!supabase) {
            await delay(300);
            return mockShorts;
        }

        const { data, error } = await supabase
            .from('shorts')
            .select('*, colleges(name), specialties(title)');

        if (error || !data || data.length === 0) {
            return mockShorts;
        }

        return data.map((item: any) => {
            let collegeId = item.college_id;
            let collegeName = item.colleges?.name;
            let specialtyId = item.specialty_id;
            let specialtyTitle = item.specialties?.title;

            // FALLBACK: If DB data is missing relations, pick random ones from mock data
            // This ensures the UI buttons are visible for demonstration purposes
            if (!collegeId && mockColleges.length > 0) {
                const randomCollege = mockColleges[Math.floor(Math.random() * mockColleges.length)];
                collegeId = randomCollege.id;
                collegeName = randomCollege.name;
            }
            
            if (!specialtyId && mockSpecialties.length > 0) {
                 const randomSpec = mockSpecialties[Math.floor(Math.random() * mockSpecialties.length)];
                 specialtyId = randomSpec.id;
                 specialtyTitle = randomSpec.title;
            }

            return {
                ...item,
                imageUrl: item.image_url,
                videoUrl: item.video_url,
                collegeId: collegeId,
                collegeName: collegeName,
                specialtyId: specialtyId,
                specialtyTitle: specialtyTitle,
            };
        }) as ShortVideo[];
    },

    async getEvents(): Promise<CalendarEvent[]> {
        if (!supabase) {
            await delay(300);
            return mockEvents;
        }

        const { data, error } = await supabase
            .from('events')
            .select('*, colleges(name, logo_url)');

        if (error || !data || data.length === 0) {
            return mockEvents;
        }

        return data.map((item: any) => ({
            id: item.id,
            collegeId: item.college_id,
            title: item.title,
            description: item.description,
            date: item.date,
            type: item.type,
            collegeName: item.colleges?.name,
            collegeLogoUrl: item.colleges?.logo_url
        })) as CalendarEvent[];
    },

    async getTopProfessions(): Promise<Profession[]> {
        if (!supabase) {
            await delay(300);
            return mockTop50Professions;
        }

        const { data, error } = await supabase
            .from('professions')
            .select('*')
            .order('id', { ascending: true });

        if (error || !data || data.length === 0) {
            return mockTop50Professions;
        }

        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            sphere: item.sphere,
            salaryFrom: item.salary_from,
            salaryTo: item.salary_to,
            collegeIds: item.college_ids || [],
            description: item.description,
            trend: item.trend,
            relatedSpecialtyIds: item.related_specialty_ids || []
        }));
    },

    // --- Interactions (Likes) ---

    async toggleLike(videoId: string, userId: string): Promise<boolean> {
        if (!supabase) return true;

        const { data } = await supabase
            .from('video_likes')
            .select('*')
            .eq('user_id', userId)
            .eq('video_id', videoId)
            .single();

        if (data) {
            await supabase.from('video_likes').delete().eq('user_id', userId).eq('video_id', videoId);
            return false;
        } else {
            await supabase.from('video_likes').insert({ user_id: userId, video_id: videoId });
            return true;
        }
    },

    async getLikeStatus(videoId: string, userId?: string): Promise<{ liked: boolean, count: number }> {
        if (!supabase) return { liked: false, count: 0 };

        const { count } = await supabase
            .from('video_likes')
            .select('*', { count: 'exact', head: true })
            .eq('video_id', videoId);

        let liked = false;
        if (userId) {
            const { data } = await supabase
                .from('video_likes')
                .select('*')
                .eq('user_id', userId)
                .eq('video_id', videoId)
                .single();
            liked = !!data;
        }

        return { liked, count: count || 0 };
    },

    // --- User Plan Synchronization ---

    async getUserPlan(userId: string): Promise<PlanItem[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('user_plans')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching user plan:", error);
            return [];
        }

        return data.map((row: any) => ({
            id: row.item_id,
            type: row.type as 'specialty' | 'college',
            checklist: row.checklist
        }));
    },

    async addToUserPlan(userId: string, item: PlanItem): Promise<void> {
        if (!supabase) return;

        const { error } = await supabase
            .from('user_plans')
            .upsert({
                user_id: userId,
                item_id: item.id,
                type: item.type,
                checklist: item.checklist
            }, { onConflict: 'user_id, item_id' });

        if (error) console.error("Error adding to plan:", error);
    },

    async removeFromUserPlan(userId: string, itemId: string): Promise<void> {
        if (!supabase) return;

        const { error } = await supabase
            .from('user_plans')
            .delete()
            .eq('user_id', userId)
            .eq('item_id', itemId);

        if (error) console.error("Error removing from plan:", error);
    },

    async updateUserPlanChecklist(userId: string, itemId: string, checklist: any[]): Promise<void> {
        if (!supabase) return;

        const { error } = await supabase
            .from('user_plans')
            .update({ checklist: checklist })
            .eq('user_id', userId)
            .eq('item_id', itemId);

        if (error) console.error("Error updating checklist:", error);
    }
};
