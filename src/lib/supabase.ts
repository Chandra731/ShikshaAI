import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      student_profiles: {
        Row: {
          id: string;
          user_id: string;
          grade_level: number;
          learning_style: 'visual' | 'audio' | 'text';
          preferred_subjects: string[];
          created_at: string;
          updated_at: string;
          exam_type: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          grade_level?: number;
          learning_style?: 'visual' | 'audio' | 'text';
          preferred_subjects?: string[];
          created_at?: string;
          updated_at?: string;
          exam_type?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          grade_level?: number;
          learning_style?: 'visual' | 'audio' | 'text';
          preferred_subjects?: string[];
          created_at?: string;
          updated_at?: string;
          exam_type?: string;
        };
      };
      student_progress: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string;
          completed_at: string;
          quiz_score: number | null;
          subtopic: string | null;
          time_spent: number | null;
          difficulty_level: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic: string;
          completed_at?: string;
          quiz_score?: number | null;
          subtopic?: string | null;
          time_spent?: number | null;
          difficulty_level?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          topic?: string;
          completed_at?: string;
          quiz_score?: number | null;
          subtopic?: string | null;
          time_spent?: number | null;
          difficulty_level?: string | null;
        };
      };
      learning_roadmaps: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string;
          plan_type: 'fast-track' | 'deep-learning';
          roadmap_data: any;
          progress: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic: string;
          plan_type?: 'fast-track' | 'deep-learning';
          roadmap_data?: any;
          progress?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          topic?: string;
          plan_type?: 'fast-track' | 'deep-learning';
          roadmap_data?: any;
          progress?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      student_interactions: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string;
          subtopic: string | null;
          interaction_type: 'question' | 'answer' | 'doubt' | 'feedback';
          content: string;
          ai_response: string | null;
          context: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic: string;
          subtopic?: string | null;
          interaction_type: 'question' | 'answer' | 'doubt' | 'feedback';
          content: string;
          ai_response?: string | null;
          context?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          topic?: string;
          subtopic?: string | null;
          interaction_type?: 'question' | 'answer' | 'doubt' | 'feedback';
          content?: string;
          ai_response?: string | null;
          context?: any;
          created_at?: string;
        };
      };
      syllabus: {
        Row: {
          id: number;
          class: string;
          subject: string;
          parent_subject: string | null;
          chapter_id: string;
          chapter_name: string;
          order: number;
        };
        Insert: {
          id?: number;
          class: string;
          subject: string;
          parent_subject?: string | null;
          chapter_id: string;
          chapter_name: string;
          order: number;
        };
        Update: {
          id?: number;
          class?: string;
          subject?: string;
          parent_subject?: string | null;
          chapter_id?: string;
          chapter_name?: string;
          order?: number;
        };
      };
    };
  };
};