export interface Env {
  SUPA_DB_URL: string;
  SUPA_DB_KEY: string;
}

export type Actions =
  | "create-mission-stats"
  | "get-mission-stats"
  | "update-mission-stats"
  | "finish-mission-stats"
  | "create-finished-mission-doc";

export type MissionId = "mars" | "titan" | "pleiades" | "prodigious" | "x24c89";

export type StatsStatus = "active" | "complete" | null;

export type Goal = "goal1" | "goal2" | "goal3";

export interface MissionStatsDoc {
  id: number;
  created_at: string;
  user_id: string;
  mission_id: MissionId;
  is_goal1_complete: boolean;
  is_goal2_complete: boolean;
  is_goal3_complete: boolean;
  status: StatsStatus;
  finished_date: string;
}

export interface CreateMissionStatsBody {
  userId: string;
  missionId: MissionId;
}

export interface GetMissionStatsBody {
  userId: string;
  missionId: MissionId;
}

export interface UpdateMissionStatsBody {
  userId: string;
  missionId: MissionId;
  goal: Goal;
}

export interface FinishMissionBody {
  userId: string;
  missionId: MissionId;
}

export interface CreateFinishedMissionBody {
  userId: string;
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
