import { Client } from "@neondatabase/serverless";
import { db } from "./helpers/supabase";
import type { Env, MissionId, Goal } from "./types";

export class MissionStats {
  env;
  private db;

  constructor(env: Env) {
    this.env = env;
    this.db = new Client(this.env.NEON_DATABASE);
  }

  async getMissionStats(userId: string, missionId: MissionId) {
    // const missionStats = await db(this.env)
    //   .from("mission_stats")
    //   .select("*")
    //   .eq("mission_id", missionId)
    //   .eq("user_id", userId);

    // if (missionStats.error) {
    //   throw new Error("Could not get Mission Stats Doc");
    // }

    await this.db.connect();

    const missionStats = await this.db.query(`
      SELECT mission_id, is_goal1_complete, is_goal2_complete, is_goal3_complete, status
      FROM mission_stats
      WHERE user_id = '${userId}' AND mission_id = '${missionId}';
    `);

    await this.db.end();

    return missionStats.rows[0];
  }

  async createMissionDoc(userId: string, missionId: MissionId) {
    // const newMissionDoc = await db(this.env).from("mission_stats").insert({
    //   user_id: userId,
    //   mission_id: missionId,
    //   is_goal1_complete: false,
    //   is_goal2_complete: false,
    //   is_goal3_complete: false,
    //   status: "active",
    // });

    // if (newMissionDoc.error) {
    //   throw new Error("Could not create the Mission Stats Doc");
    // }

    await this.db.connect();

    const activeMission = await this.db.query(`
      INSERT INTO mission_stats
          (user_id, mission_id, status)
      VALUES ('${userId}', '${missionId}', 'active')
      RETURNING user_id, mission_id, is_goal1_complete, is_goal2_complete, is_goal3_complete, status;
    `);

    await this.db.end();

    return activeMission.rows[0];
  }

  async updateMissionStats(userId: string, missionId: MissionId, goal: Goal) {
    // switch (goal) {
    //   case "goal1": {
    //     const updatedMissionStats = await db(this.env)
    //       .from("mission_stats")
    //       .update({ is_goal1_complete: true })
    //       .eq("user_id", userId)
    //       .eq("mission_id", missionId);

    //     if (updatedMissionStats.error) {
    //       throw new Error("Could not update mission stats doc");
    //     }

    //     return;
    //   }
    //   case "goal2": {
    //     const updatedMissionStats = await db(this.env)
    //       .from("mission_stats")
    //       .update({ is_goal2_complete: true })
    //       .eq("user_id", userId)
    //       .eq("mission_id", missionId);

    //     if (updatedMissionStats.error) {
    //       throw new Error("Could not update mission stats doc");
    //     }

    //     return;
    //   }
    //   case "goal3": {
    //     const finishedDate = new Date().toDateString();

    //     const updatedMissionStats = await db(this.env)
    //       .from("mission_stats")
    //       .update({
    //         is_goal3_complete: true,
    //         status: "complete",
    //         finished_date: finishedDate,
    //       })
    //       .eq("user_id", userId)
    //       .eq("mission_id", missionId);

    //     if (updatedMissionStats.error) {
    //       throw new Error("Could not update mission stats doc");
    //     }

    //     return;
    //   }
    // }

    const goalToUpdate = () => {
      switch (goal) {
        case "goal1": {
          return "is_goal1_complete";
        }
        case "goal2": {
          return "is_goal2_complete";
        }
        case "goal3": {
          return "is_goal3_complete";
        }
      }
    };

    await this.db.connect();

    const updatedMissionStats = await this.db.query(`
      UPDATE mission_stats
      SET ${goalToUpdate()} = true
      WHERE user_id = '${userId}' AND mission_id = '${missionId}'
      RETURNING user_id, mission_id, is_goal1_complete, is_goal2_complete, is_goal3_complete, status;
    `);

    await this.db.end();

    return updatedMissionStats.rows[0];
  }

  async createFinishedMissionDoc(userId: string, missionId: MissionId) {
    // const finishedMissionDoc = await db(this.env)
    //   .from("finished_missions")
    //   .insert({
    //     user_id: userId,
    //     mission_id: missionId,
    //   });

    // if (finishedMissionDoc.error) {
    //   throw new Error("Could not create the finished mission doc");
    // }

    await this.db.connect();

    await this.db.query(`
      INSERT INTO finished_missions
      (user_id, mission_id)
      VALUES ('${userId}', '${missionId}');
    `);

    await this.db.end();

    return "Mission Completed";
  }
}
