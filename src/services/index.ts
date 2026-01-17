/**
 * Service Selector
 * 
 * This file exports the active progress service implementation.
 * Currently using IndexedDB (localProgressService).
 * 
 * Future: When ready for Supabase, simply change the export here:
 * 
 * ```typescript
 * // For local development
 * export const progressService = localProgressService;
 * 
 * // For production with Supabase
 * import { supabaseProgressService } from './supabaseProgressService';
 * export const progressService = supabaseProgressService;
 * 
 * // Or with environment-based switching
 * export const progressService = import.meta.env.VITE_USE_SUPABASE
 *   ? supabaseProgressService
 *   : localProgressService;
 * ```
 */

import { localProgressService } from './localProgressService';

// Export types for consumers
export type { ProgressService, UserProgress } from './progressService';
export { userStateToProgress, progressToUserState } from './progressService';

/**
 * The active progress service instance.
 * 
 * All UI code should import from here, not directly from implementations.
 * This makes swapping storage backends a single-line change.
 */
export const progressService = localProgressService;

/**
 * TODO: Future Supabase Implementation
 * 
 * When ready to add Supabase:
 * 
 * 1. Create src/services/supabaseProgressService.ts
 *    - Implement ProgressService interface
 *    - Use Supabase client for CRUD operations
 *    - Handle auth state for user identification
 * 
 * 2. Update this file:
 *    - Import supabaseProgressService
 *    - Switch the export based on environment or auth state
 * 
 * 3. The UI code will work unchanged because it only uses
 *    the ProgressService interface.
 * 
 * Example supabaseProgressService structure:
 * 
 * ```typescript
 * class SupabaseProgressService implements ProgressService {
 *   async getProgress(userKey: string): Promise<UserProgress | null> {
 *     const { data, error } = await supabase
 *       .from('progress')
 *       .select('*')
 *       .eq('user_id', supabase.auth.user()?.id)
 *       .single();
 *     return data;
 *   }
 *   
 *   async saveProgress(progress: UserProgress): Promise<void> {
 *     await supabase.from('progress').upsert({
 *       user_id: supabase.auth.user()?.id,
 *       ...progress,
 *     });
 *   }
 *   
 *   async clearProgress(userKey: string): Promise<void> {
 *     await supabase.from('progress')
 *       .delete()
 *       .eq('user_id', supabase.auth.user()?.id);
 *   }
 * }
 * ```
 */
