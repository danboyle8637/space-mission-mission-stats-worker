import { MissionStats } from "../MissionStats";
import { getErrorMessage } from "../helpers/worker";
import type { Env, UpdateMissionStatsBody } from "../types";

export async function updateMissionStats(
  request: Request,
  env: Env
): Promise<Response> {
  const formattedReq = new Response(request.body);
  const body: UpdateMissionStatsBody = await formattedReq.json();
  const { userId, missionId, goal } = body;

  if (!userId || !missionId || !goal) {
    const response = new Response("Bad Request", { status: 400 });
    return response;
  }

  try {
    const missionStats = new MissionStats(env);

    await missionStats.updateMissionStats(userId, missionId, goal);

    const response = new Response(
      JSON.stringify("Mission Stats Doc updated successfully"),
      {
        status: 200,
      }
    );
    return response;
  } catch (error) {
    const response = new Response(getErrorMessage(error), { status: 500 });
    return response;
  }
}
