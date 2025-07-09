export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          github_username: string | null
          skill_level: 'beginner' | 'intermediate' | 'advanced'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          github_username?: string | null
          skill_level?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          github_username?: string | null
          skill_level?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          code: string
          is_public: boolean
          tags: string[] | null
          file_structure: any | null
          active_file_id: string | null
          project_type: string | null
          visibility: string | null
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          description?: string | null
          code: string
          is_public?: boolean
          tags?: string[] | null
          file_structure?: any | null
          active_file_id?: string | null
          project_type?: string | null
          visibility?: string | null
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          code?: string
          is_public?: boolean
          tags?: string[] | null
          file_structure?: any | null
          active_file_id?: string | null
          project_type?: string | null
          visibility?: string | null
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          name: string
          type: string
          content: string
          parent_id: string | null
          is_open: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          type: string
          content?: string
          parent_id?: string | null
          is_open?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          type?: string
          content?: string
          parent_id?: string | null
          is_open?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          example_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          example_id: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          example_id?: string
          completed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}