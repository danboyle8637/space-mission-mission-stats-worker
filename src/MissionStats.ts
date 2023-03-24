import { connect, Connection } from "@planetscale/database";
import type { Env, MissionId, Goal, StatsStatus } from "./types";

export class MissionStats {
  env;
  private config;

  constructor(env: Env) {
    this.env = env;

    this.config = {
      host: env.PLANETSCALE_HOST,
      username: env.PLANETSCALE_USERNAME,
      password: env.PLANETSCALE_PASSWORD,
    };
  }

  async getAllMissionStats(userId: string) {
    const ps: Connection = await connect(this.config);

    const allMissionStatsQuery = `
      SELECT created_at, mission_id, is_goal1_complete, is_goal2_complete, is_goal3_complete, status 
      FROM mission_stats
      WHERE user_id = :userId;
    `;

    const allMissionStatsParams = {
      userId: userId,
    };

    const allMissionStats = await ps.execute(
      allMissionStatsQuery,
      allMissionStatsParams
    );

    return allMissionStats.rows;
  }

  async getMissionStats(
    userId: string,
    missionId: MissionId,
    status: StatsStatus
  ) {
    const ps: Connection = await connect(this.config);

    const statsQuery = `
      SELECT created_at, is_goal1_complete, is_goal2_complete, is_goal3_complete
      FROM mission_stats
      WHERE user_id = :userId AND mission_id = :missionId AND status = :status;
    `;

    const statsParams = {
      userId: userId,
      missionId: missionId,
      status: status,
    };

    const missionStats = await ps.execute(statsQuery, statsParams);

    if (missionStats.rows.length === 0) {
      return "No mission stats";
    }

    return missionStats.rows[0];
  }

  async createMissionDoc(userId: string, missionId: MissionId) {
    const ps: Connection = await connect(this.config);

    const statsQuery = `
      INSERT INTO mission_stats
      (user_id, mission_id, status)
      VALUES (:userId, :missionId, 'active');
    `;

    const statsParams = {
      userId: userId,
      missionId: missionId,
    };

    await ps.execute(statsQuery, statsParams);

    return "Mission stats created";
  }

  async updateMissionStats(userId: string, missionId: MissionId, goal: Goal) {
    const ps: Connection = await connect(this.config);

    if (goal === "goal1" || goal === "goal2") {
      const activeQuery = () => {
        switch (goal) {
          case "goal1": {
            return `
              UPDATE mission_stats
              SET is_goal1_complete = true, modified_at = NOW()
              WHERE user_id = :userId AND mission_id = :missionId AND status = 'active';
            `;
          }
          case "goal2": {
            return `
              UPDATE mission_stats
              SET is_goal2_complete = true, modified_at = NOW()
              WHERE user_id = :userId AND mission_id = :missionId AND status = 'active';
            `;
          }
        }
      };

      const updateStatsQuery = activeQuery();

      const updateStatsParams = {
        activeGoal: updateStatsQuery,
        userId: userId,
        missionId: missionId,
      };

      await ps.execute(updateStatsQuery, updateStatsParams);

      return "Mission stats updated";
    }

    const finishStatsQuery = `
      UPDATE mission_stats
      SET
        is_goal3_complete = true,
        modified_at = NOW(),
        status = 'finished'
      WHERE user_id = :userId AND mission_id = :missionId AND status = 'active';
    `;

    const finishStatsParams = {
      userId: userId,
      missionId: missionId,
    };

    const createFinishedMissionQuery = `
      INSERT INTO finished_missions
      (user_id, mission_id)
      VALUES (:userId, :missionId);
    `;

    const createFinishedMissionParams = {
      userId: userId,
      missionId: missionId,
    };

    const updateUserQuery = `
      UPDATE users
      SET active_mission_id = null
      WHERE user_id = :userId
    `;

    const updateUserParams = {
      userId: userId,
    };

    await ps.transaction(async (tx) => {
      await tx.execute(finishStatsQuery, finishStatsParams);
      await tx.execute(createFinishedMissionQuery, createFinishedMissionParams);
      await tx.execute(updateUserQuery, updateUserParams);
      return;
    });

    return "Mission Completed";
  }

  async cancelMission(userId: string, missionId: MissionId) {
    const ps: Connection = await connect(this.config);

    const cancelQuery = `
      UPDATE mission_stats
      SET status = 'cancelled'
      WHERE user_id = :userId AND mission_id = :missionId AND status = 'active';
    `;

    const cancelParams = {
      userId: userId,
      missionId: missionId,
    };

    const updateUserQuery = `
      UPDATE users
      SET active_mission_id = null
      WHERE user_id = :userId
    `;

    const updateUserParams = {
      userId: userId,
    };

    await ps.transaction(async (tx) => {
      await tx.execute(cancelQuery, cancelParams);
      await tx.execute(updateUserQuery, updateUserParams);
    });

    return "Mission cancelled";
  }

  async getAllFinishedMissions(userId: string) {
    const ps: Connection = await connect(this.config);

    const finishedMissionsQuery = `
      SELECT 'created_at', call_sign, mission_id 
      FROM finished_missions fm JOIN users u on fm.user_id = u.user_id
      WHERE u.user_id = :userId;
    `;

    const finishedMissionsParams = {
      userId: userId,
    };

    const finishedMissions = await ps.execute(
      finishedMissionsQuery,
      finishedMissionsParams
    );

    return finishedMissions.rows;
  }
}
