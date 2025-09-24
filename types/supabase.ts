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
      consent_records: {
        Row: {
          id: string
          user_id: string
          purpose: string
          legal_basis: string
          granted: boolean
          granted_at: string
          revoked_at: string | null
          expires_at: string | null
          ip_address: string | null
          user_agent: string | null
          version: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          purpose: string
          legal_basis?: string
          granted?: boolean
          granted_at?: string
          revoked_at?: string | null
          expires_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          version?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          purpose?: string
          legal_basis?: string
          granted?: boolean
          granted_at?: string
          revoked_at?: string | null
          expires_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          version?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}