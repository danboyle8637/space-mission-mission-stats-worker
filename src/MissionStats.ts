import { db } from "./helpers/supabase";
import { getErrorMessage } from "./helpers/worker";
import type { Env, MissionId, MissionStatsDoc, Goal } from "./types";

export class MissionStats {
  env;

  constructor(env: Env) {
    this.env = env;
  }

  async getMissionStats(userId: string, missionId: MissionId) {
    const missionStats = await db(this.env)
      .from("mission_stats")
      .select("*")
      .eq("mission_id", missionId)
      .eq("user_id", userId);

    if (missionStats.error) {
      throw new Error("Could not get Mission Stats Doc");
    }

    return missionStats.data;
  }

  async createMissionDoc(userId: string, missionId: MissionId) {
    const newMissionDoc = await db(this.env).from("mission_stats").insert({
      user_id: userId,
      mission_id: missionId,
      is_goal1_complete: false,
      is_goal2_complete: false,
      is_goal3_complete: false,
      status: "active",
    });

    if (newMissionDoc.error) {
      throw new Error("Could not create the Mission Stats Doc");
    }

    return;
  }

  async updateMissionStats(userId: string, missionId: MissionId, goal: Goal) {
    switch (goal) {
      case "goal1": {
        const updatedMissionStats = await db(this.env)
          .from("mission_stats")
          .update({ is_goal1_complete: true })
          .eq("user_id", userId)
          .eq("mission_id", missionId);

        if (updatedMissionStats.error) {
          throw new Error("Could not update mission stats doc");
        }

        return;
      }
      case "goal2": {
        const updatedMissionStats = await db(this.env)
          .from("mission_stats")
          .update({ is_goal2_complete: true })
          .eq("user_id", userId)
          .eq("mission_id", missionId);

        if (updatedMissionStats.error) {
          throw new Error("Could not update mission stats doc");
        }

        return;
      }
      case "goal3": {
        const finishedDate = new Date().toDateString();

        const updatedMissionStats = await db(this.env)
          .from("mission_stats")
          .update({
            is_goal3_complete: true,
            status: "complete",
            finished_date: finishedDate,
          })
          .eq("user_id", userId)
          .eq("mission_id", missionId);

        if (updatedMissionStats.error) {
          throw new Error("Could not update mission stats doc");
        }

        return;
      }
    }
  }

  async createFinishedMissionDoc(userId: string, missionId: MissionId) {
    const finishedMissionDoc = await db(this.env)
      .from("finished_missions")
      .insert({
        user_id: userId,
        mission_id: missionId,
      });

    if (finishedMissionDoc.error) {
      throw new Error("Could not create the finished mission doc");
    }

    return;
  }
}
