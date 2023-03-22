export interface Env {
  SUPA_DB_URL: string;
  SUPA_DB_KEY: string;
  NEON_DATABASE: string;
  PLANETSCALE_HOST: string;
  PLANETSCALE_USERNAME: string;
  PLANETSCALE_PASSWORD: string;
}

export type Actions =
  | "create-mission-stats"
  | "get-mission-stats"
  | "update-mission-stats"
  | "cancel-mission"
  | "get-finished-missions"
  | "get-all-mission-stats";

export type MissionId = "mars" | "titan" | "pleiades" | "prodigious" | "x24c89";

export type StatsStatus = "active" | "complete" | "cancelled" | null;

export type Goal = "goal1" | "goal2" | "goal3";

export interface MissionStatsDoc {
  id: number;
  created_at: string;
  modified_at: string;
  user_id: string;
  mission_id: MissionId;
  is_goal1_complete: boolean;
  is_goal2_complete: boolean;
  is_goal3_complete: boolean;
  status: StatsStatus;
  finished_date: string;
}

export interface FinishedMission {
  created_at: string;
  call_sign: string;
  mission_id: string;
}

export interface CreateMissionStatsBody {
  missionId: MissionId;
}

export interface GetMissionStatsBody {
  missionId: MissionId;
  status: StatsStatus;
}

export interface UpdateMissionStatsBody {
  missionId: MissionId;
  goal: Goal;
}

export interface FinishMissionBody {
  missionId: MissionId;
}

export interface CancelMissionBody {
  missionId: string;
}

export interface CreateFinishedMissionBody {
  missionId: MissionId;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string;
          email_address: string;
          id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email_address?: string;
          id?: number;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          email_address?: string;
          id?: number;
          user_id?: string;
        };
      };
      finished_missions: {
        Row: {
          created_at: string | null;
          id: number;
          mission_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          mission_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          mission_id?: string;
          user_id?: string;
        };
      };
      mission_stats: {
        Row: {
          created_at: string | null;
          id: number;
          is_goal1_complete: boolean | null;
          is_goal2_complete: boolean | null;
          is_goal3_complete: boolean | null;
          mission_id: string;
          status: string;
          finished_date: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          is_goal1_complete?: boolean | null;
          is_goal2_complete?: boolean | null;
          is_goal3_complete?: boolean | null;
          mission_id: string;
          status: string;
          finished_date?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          is_goal1_complete?: boolean | null;
          is_goal2_complete?: boolean | null;
          is_goal3_complete?: boolean | null;
          mission_id?: string;
          status?: string;
          finished_date?: string | null;
          user_id?: string;
        };
      };
      users: {
        Row: {
          active_mission_id: string | null;
          avatar_url: string | null;
          call_sign: string;
          created_at: string | null;
          first_name: string;
          id: number;
          user_id: string;
        };
        Insert: {
          active_mission_id?: string | null;
          avatar_url?: string | null;
          call_sign?: string;
          created_at?: string | null;
          first_name?: string;
          id?: number;
          user_id?: string;
        };
        Update: {
          active_mission_id?: string | null;
          avatar_url?: string | null;
          call_sign?: string;
          created_at?: string | null;
          first_name?: string;
          id?: number;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
