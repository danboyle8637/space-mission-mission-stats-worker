import { MissionStats } from "../MissionStats";
import { getErrorMessage } from "../helpers/worker";
import type { Env, GetMissionStatsBody } from "../types";

export async function getMissionStats(
  request: Request,
  env: Env
): Promise<Response> {
  const formattedReq = new Response(request.body);
  const body: GetMissionStatsBody = await formattedReq.json();
  const { userId, missionId } = body;

  if (!userId || !missionId) {
    const response = new Response("Bad Request", { status: 400 });
    return response;
  }

  try {
    const missionStats = new MissionStats(env);

    const currentMissionStats = await missionStats.getMissionStats(
      userId,
      missionId
    );

    const response = new Response(JSON.stringify(currentMissionStats), {
      status: 200,
    });
    return response;
  } catch (error) {
    const response = new Response(getErrorMessage(error), { status: 500 });
    return response;
  }
}
