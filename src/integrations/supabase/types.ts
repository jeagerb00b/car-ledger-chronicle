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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      car_dealer: {
        Row: {
          car_id: string
          dealership_id: string
          deposit_date: string | null
          id: string
          status: string | null
        }
        Insert: {
          car_id: string
          dealership_id: string
          deposit_date?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          car_id?: string
          dealership_id?: string
          deposit_date?: string | null
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_dealer_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_dealer_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars_with_crime_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_dealer_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "current_car_ownership_view"
            referencedColumns: ["car_id"]
          },
          {
            foreignKeyName: "car_dealer_dealership_id_fkey"
            columns: ["dealership_id"]
            isOneToOne: false
            referencedRelation: "dealerships"
            referencedColumns: ["id"]
          },
        ]
      }
      car_ownership: {
        Row: {
          car_id: string
          current_owner: boolean | null
          end_date: string | null
          id: string
          owner_id: string
          start_date: string | null
        }
        Insert: {
          car_id: string
          current_owner?: boolean | null
          end_date?: string | null
          id?: string
          owner_id: string
          start_date?: string | null
        }
        Update: {
          car_id?: string
          current_owner?: boolean | null
          end_date?: string | null
          id?: string
          owner_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_ownership_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_ownership_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars_with_crime_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_ownership_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "current_car_ownership_view"
            referencedColumns: ["car_id"]
          },
          {
            foreignKeyName: "car_ownership_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "current_car_ownership_view"
            referencedColumns: ["owner_id"]
          },
          {
            foreignKeyName: "car_ownership_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          amount: number
          color: string
          created_at: string | null
          id: string
          image: string | null
          model: string
          registration_number: string
          updated_at: string | null
          year_of_registration: number
        }
        Insert: {
          amount: number
          color: string
          created_at?: string | null
          id?: string
          image?: string | null
          model: string
          registration_number: string
          updated_at?: string | null
          year_of_registration: number
        }
        Update: {
          amount?: number
          color?: string
          created_at?: string | null
          id?: string
          image?: string | null
          model?: string
          registration_number?: string
          updated_at?: string | null
          year_of_registration?: number
        }
        Relationships: []
      }
      crime_history: {
        Row: {
          car_id: string
          cid: string
          damage: string | null
          date_recorded: string | null
          id: string
          severity: string | null
          type_of_crime: string
        }
        Insert: {
          car_id: string
          cid: string
          damage?: string | null
          date_recorded?: string | null
          id?: string
          severity?: string | null
          type_of_crime: string
        }
        Update: {
          car_id?: string
          cid?: string
          damage?: string | null
          date_recorded?: string | null
          id?: string
          severity?: string | null
          type_of_crime?: string
        }
        Relationships: [
          {
            foreignKeyName: "crime_history_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crime_history_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars_with_crime_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crime_history_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "current_car_ownership_view"
            referencedColumns: ["car_id"]
          },
        ]
      }
      dealerships: {
        Row: {
          created_at: string | null
          dealership_name: string
          id: string
          location: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          dealership_name: string
          id?: string
          location: string
          phone: string
        }
        Update: {
          created_at?: string | null
          dealership_name?: string
          id?: string
          location?: string
          phone?: string
        }
        Relationships: []
      }
      owners: {
        Row: {
          address: string
          city: string
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          pin: string
          state: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          pin: string
          state: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          pin?: string
          state?: string
        }
        Relationships: []
      }
    }
    Views: {
      cars_with_crime_stats: {
        Row: {
          amount: number | null
          color: string | null
          crime_count: number | null
          highest_severity: string | null
          id: string | null
          last_crime_date: string | null
          model: string | null
          registration_number: string | null
        }
        Relationships: []
      }
      current_car_ownership_view: {
        Row: {
          car_id: string | null
          city: string | null
          model: string | null
          owner_id: string | null
          owner_name: string | null
          registration_number: string | null
          start_date: string | null
          state: string | null
          year_of_registration: number | null
        }
        Relationships: []
      }
      dealership_inventory_view: {
        Row: {
          amount: number | null
          crime_count: number | null
          dealership_name: string | null
          deposit_date: string | null
          location: string | null
          model: string | null
          registration_number: string | null
          status: string | null
        }
        Relationships: []
      }
      high_risk_cars_view: {
        Row: {
          crime_types: string | null
          model: string | null
          registration_number: string | null
          total_crimes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_cars_by_severity: {
        Args: { severity_level: string }
        Returns: {
          car_id: string
          crime_count: number
          model: string
          registration_number: string
        }[]
      }
      get_dealership_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          available_cars: number
          avg_price: number
          dealership_name: string
          total_cars: number
        }[]
      }
      get_owner_cars: {
        Args: { owner_first_name: string }
        Returns: {
          crime_count: number
          highest_severity: string
          model: string
          registration_number: string
        }[]
      }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
