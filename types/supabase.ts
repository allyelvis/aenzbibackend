export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
          preferences: Json | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          preferences?: Json | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          preferences?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
          status?: string
          notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
          status?: string
          notes?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          stock: number
          created_at: string
          updated_at: string
          category: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          stock: number
          created_at?: string
          updated_at?: string
          category?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          created_at?: string
          updated_at?: string
          category?: string | null
          image_url?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          status: string
          total: number
          created_at: string
          updated_at: string
          notes: string | null
          payment_status: string
        }
        Insert: {
          id?: string
          customer_id: string
          status?: string
          total: number
          created_at?: string
          updated_at?: string
          notes?: string | null
          payment_status?: string
        }
        Update: {
          id?: string
          customer_id?: string
          status?: string
          total?: number
          created_at?: string
          updated_at?: string
          notes?: string | null
          payment_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

