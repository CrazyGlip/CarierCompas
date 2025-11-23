
import { supabase } from '../lib/supabaseClient';
import { mockTop50Professions, mockColleges } from '../data/mockData';

export const seedDatabase = async () => {
  if (!supabase) {
    return { success: false, message: 'Supabase клиент не инициализирован.' };
  }

  try {
    console.log('Starting safe database update...');

    // --- 1. COLLEGES: SAFE PATCH ---
    // We only update 'city' and 'education_forms' to avoid overwriting descriptions/images
    console.log('Patching Colleges (Cities & Forms)...');
    
    let updatedCount = 0;
    let errorCount = 0;

    // We process sequentially to avoid overwhelming the connection with many requests
    for (const college of mockColleges) {
        // Check if college exists
        const { count } = await supabase
            .from('colleges')
            .select('*', { count: 'exact', head: true })
            .eq('id', college.id);

        if (count && count > 0) {
            // UPDATE specific fields only
            const { error } = await supabase
                .from('colleges')
                .update({ 
                    city: college.city,
                    education_forms: college.educationForms
                })
                .eq('id', college.id);
            
            if (error) {
                console.error(`Error updating ${college.name}:`, error);
                errorCount++;
            } else {
                updatedCount++;
            }
        } else {
            // INSERT new college (full data) if it doesn't exist
            const { error } = await supabase
                .from('colleges')
                .insert({
                    id: college.id,
                    name: college.name,
                    description: college.description,
                    image_url: college.imageUrl,
                    logo_url: college.logoUrl,
                    passing_score: college.passingScore,
                    specialty_ids: college.specialtyIds,
                    contacts: college.contacts,
                    info: college.info,
                    city: college.city,
                    education_forms: college.educationForms
                });
             if (error) errorCount++;
        }
    }

    // --- 2. PROFESSIONS (TOP 30): FULL SYNC ---
    // For the Top 30 list, we can safely upsert as this data is usually managed in code
    console.log('Updating Professions table...');
    const professionsData = mockTop50Professions.map(p => ({
        id: p.id,
        name: p.name,
        sphere: p.sphere,
        salary_from: p.salaryFrom,
        salary_to: p.salaryTo,
        college_ids: p.collegeIds,
        description: p.description,
        trend: p.trend,
        related_specialty_ids: p.relatedSpecialtyIds
    }));

    const { error: profError } = await supabase
        .from('professions')
        .upsert(professionsData, { onConflict: 'id' });

    if (profError) {
        if (profError.message.includes('row-level security')) {
             return { success: false, isRlsError: true, message: 'Ошибка прав доступа (RLS).' };
        }
        throw new Error(`Ошибка профессий: ${profError.message}`);
    }

    return { 
        success: true, 
        message: `Готово! Обновлено колледжей: ${updatedCount}. Топ-30 синхронизирован.` 
    };

  } catch (error: any) {
    console.error('Seeding error:', error);
    return { success: false, message: error.message };
  }
};
