// Database types. Hand-written to match the first migration; regenerate after every migration:
//   npx supabase gen types typescript --linked > lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Table<Row, Insert, Relationships extends unknown[] = []> = {
  Row: Row
  Insert: Insert
  Update: Partial<Insert>
  Relationships: Relationships
}

type LocationStatus = "active" | "coming_soon"

export type Database = {
  public: {
    Tables: {
      states: Table<
        { id: string; name: string; slug: string; status: LocationStatus; sort: number; created_at: string },
        { id?: string; name: string; slug: string; status?: LocationStatus; sort?: number; created_at?: string }
      >
      cities: Table<
        {
          id: string
          state_id: string
          name: string
          slug: string
          status: LocationStatus
          sort: number
          created_at: string
        },
        {
          id?: string
          state_id: string
          name: string
          slug: string
          status?: LocationStatus
          sort?: number
          created_at?: string
        }
      >
      areas: Table<
        {
          id: string
          city_id: string
          name: string
          slug: string
          pin: string | null
          status: LocationStatus
          sort: number
          created_at: string
        },
        {
          id?: string
          city_id: string
          name: string
          slug: string
          pin?: string | null
          status?: LocationStatus
          sort?: number
          created_at?: string
        }
      >
      budget_packages: Table<
        {
          id: string
          slug: string
          name: string
          tagline: string | null
          sort: number
          is_active: boolean
          created_at: string
        },
        {
          id?: string
          slug: string
          name: string
          tagline?: string | null
          sort?: number
          is_active?: boolean
          created_at?: string
        }
      >
      budget_rates: Table<
        {
          id: string
          city_id: string
          package_id: string
          rate_per_sqft: number
          is_active: boolean
          updated_at: string
        },
        {
          id?: string
          city_id: string
          package_id: string
          rate_per_sqft: number
          is_active?: boolean
          updated_at?: string
        }
      >
      budget_package_features: Table<
        { id: string; package_id: string; label: string; value: string; sort: number },
        { id?: string; package_id: string; label: string; value: string; sort?: number }
      >
      budget_stages: Table<
        { id: string; name: string; percent: number; ground_floor_only: boolean; sort: number },
        { id?: string; name: string; percent: number; ground_floor_only?: boolean; sort?: number }
      >
      site_settings: Table<
        { key: string; value: Json; is_public: boolean; updated_at: string },
        { key: string; value: Json; is_public?: boolean; updated_at?: string }
      >
      leads: Table<
        {
          id: string
          ref_code: string
          type: string
          status: string
          name: string
          mobile: string
          city_id: string | null
          area_id: string | null
          area_other: string | null
          details: Json
          source_page: string | null
          source_button: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          device: string | null
          consent: boolean
          is_duplicate: boolean
          duplicate_of: string | null
          result_token: string | null
          ip_hash: string | null
          assigned_to: string | null
          follow_up_at: string | null
          created_at: string
          updated_at: string
        },
        {
          id?: string
          ref_code?: string
          type: string
          status?: string
          name: string
          mobile: string
          city_id?: string | null
          area_id?: string | null
          area_other?: string | null
          details?: Json
          source_page?: string | null
          source_button?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          device?: string | null
          consent: boolean
          is_duplicate?: boolean
          duplicate_of?: string | null
          result_token?: string | null
          ip_hash?: string | null
          assigned_to?: string | null
          follow_up_at?: string | null
          created_at?: string
          updated_at?: string
        }
      >
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
