export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          department: string | null
          position: string | null
          last_active: string | null
          created_at: string
          updated_at: string
          has_pin: boolean
          is_active: boolean
          phone_number: string | null
          two_factor_enabled: boolean
        }
        Insert: {
          id: string
          username: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          department?: string | null
          position?: string | null
          last_active?: string | null
          created_at?: string
          updated_at?: string
          has_pin?: boolean
          is_active?: boolean
          phone_number?: string | null
          two_factor_enabled?: boolean
        }
        Update: {
          id?: string
          username?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          department?: string | null
          position?: string | null
          last_active?: string | null
          created_at?: string
          updated_at?: string
          has_pin?: boolean
          is_active?: boolean
          phone_number?: string | null
          two_factor_enabled?: boolean
        }
      }
      user_pins: {
        Row: {
          id: number
          user_id: string
          pin_hash: string
          created_at: string
          updated_at: string
          last_used: string | null
          attempts: number
          locked_until: string | null
        }
        Insert: {
          id?: number
          user_id: string
          pin_hash: string
          created_at?: string
          updated_at?: string
          last_used?: string | null
          attempts?: number
          locked_until?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          pin_hash?: string
          created_at?: string
          updated_at?: string
          last_used?: string | null
          attempts?: number
          locked_until?: string | null
        }
      }
      activity_logs: {
        Row: {
          id: number
          user_id: string
          action: string
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          action: string
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          action?: string
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      security_questions: {
        Row: {
          id: number
          user_id: string
          question: string
          answer_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          question: string
          answer_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          question?: string
          answer_hash?: string
          created_at?: string
          updated_at?: string
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

