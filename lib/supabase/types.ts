// Generated from the Supabase project. Do not edit by hand. Identical in swapnobari and swapnobari-admin.
// Regenerate after every migration (from swapnobari-admin), then copy to the website:
//   npx supabase gen types typescript --remote --schema public > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      areas: {
        Row: {
          city_id: string
          created_at: string
          id: string
          name: string
          pin: string | null
          slug: string
          sort: number
          status: string
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          name: string
          pin?: string | null
          slug: string
          sort?: number
          status?: string
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          name?: string
          pin?: string | null
          slug?: string
          sort?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "areas_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_attempts: {
        Row: {
          created_at: string
          id: string
          kind: string
          subject_hash: string
          succeeded: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          subject_hash: string
          succeeded: boolean
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          subject_hash?: string
          succeeded?: boolean
        }
        Relationships: []
      }
      budget_package_features: {
        Row: {
          id: string
          label: string
          package_id: string
          sort: number
          value: string
        }
        Insert: {
          id?: string
          label: string
          package_id: string
          sort?: number
          value: string
        }
        Update: {
          id?: string
          label?: string
          package_id?: string
          sort?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_package_features_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "budget_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_packages: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort: number
          tagline: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort?: number
          tagline?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort?: number
          tagline?: string | null
        }
        Relationships: []
      }
      budget_rates: {
        Row: {
          city_id: string
          id: string
          is_active: boolean
          package_id: string
          rate_per_sqft: number
          updated_at: string
        }
        Insert: {
          city_id: string
          id?: string
          is_active?: boolean
          package_id: string
          rate_per_sqft: number
          updated_at?: string
        }
        Update: {
          city_id?: string
          id?: string
          is_active?: boolean
          package_id?: string
          rate_per_sqft?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_rates_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_rates_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "budget_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_stages: {
        Row: {
          ground_floor_only: boolean
          id: string
          name: string
          percent: number
          sort: number
        }
        Insert: {
          ground_floor_only?: boolean
          id?: string
          name: string
          percent: number
          sort?: number
        }
        Update: {
          ground_floor_only?: boolean
          id?: string
          name?: string
          percent?: number
          sort?: number
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort: number
          state_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort?: number
          state_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort?: number
          state_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          follow_up_at: string | null
          id: string
          lead_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          follow_up_at?: string | null
          id?: string
          lead_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          follow_up_at?: string | null
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: string
          id: string
          lead_id: string
          reason: string | null
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status: string
          id?: string
          lead_id: string
          reason?: string | null
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: string
          id?: string
          lead_id?: string
          reason?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          area_id: string | null
          area_other: string | null
          assigned_to: string | null
          city_id: string | null
          consent: boolean
          created_at: string
          details: Json
          device: string | null
          duplicate_of: string | null
          follow_up_at: string | null
          id: string
          ip_hash: string | null
          is_duplicate: boolean
          mobile: string
          name: string
          ref_code: string
          result_token: string | null
          source_button: string | null
          source_page: string | null
          status: string
          status_reason: string | null
          type: string
          updated_at: string
          updated_by: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          area_id?: string | null
          area_other?: string | null
          assigned_to?: string | null
          city_id?: string | null
          consent: boolean
          created_at?: string
          details?: Json
          device?: string | null
          duplicate_of?: string | null
          follow_up_at?: string | null
          id?: string
          ip_hash?: string | null
          is_duplicate?: boolean
          mobile: string
          name: string
          ref_code?: string
          result_token?: string | null
          source_button?: string | null
          source_page?: string | null
          status?: string
          status_reason?: string | null
          type: string
          updated_at?: string
          updated_by?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          area_id?: string | null
          area_other?: string | null
          assigned_to?: string | null
          city_id?: string | null
          consent?: boolean
          created_at?: string
          details?: Json
          device?: string | null
          duplicate_of?: string | null
          follow_up_at?: string | null
          id?: string
          ip_hash?: string | null
          is_duplicate?: boolean
          mobile?: string
          name?: string
          ref_code?: string
          result_token?: string | null
          source_button?: string | null
          source_page?: string | null
          status?: string
          status_reason?: string | null
          type?: string
          updated_at?: string
          updated_by?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city_id: string | null
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          role: string
          updated_at: string
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_active?: boolean
          role: string
          updated_at?: string
        }
        Update: {
          city_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      states: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort: number
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort?: number
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort?: number
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      replace_budget_stages: { Args: { stages: Json }; Returns: number }
      replace_package_features: {
        Args: { features: Json; target_package_id: string }
        Returns: number
      }
      save_budget_rates: { Args: { changes: Json }; Returns: number }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
