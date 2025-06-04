export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          is_premium: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          is_premium?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_premium?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      verifications: {
        Row: {
          id: string
          user_id: string
          news: string
          source: string | null
          is_true: boolean
          explanation: string
          related_facts: string[] | null
          verified_at: string
        }
        Insert: {
          id?: string
          user_id: string
          news: string
          source?: string | null
          is_true: boolean
          explanation: string
          related_facts?: string[] | null
          verified_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          news?: string
          source?: string | null
          is_true?: boolean
          explanation?: string
          related_facts?: string[] | null
          verified_at?: string
        }
      }
    }
  }
}