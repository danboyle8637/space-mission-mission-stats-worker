import { MissionStats } from "../MissionStats";
import { getErrorMessage } from "../helpers/worker";
import type { Env, GetAllMissionStatsBody } from "../types";

export async function getAllMissionStats(
  request: Request,
  env: Env
): Promise<Response> {
  const formattedReq = new Response(request.body);
  const body: GetAllMissionStatsBody = await formattedReq.json();
  const { userId } = body;

  if (!userId) {
    const response = new Response("Bad Request", { status: 400 });
    return response;
  }

  try {
    const missionStats = new MissionStats(env);

    const allMissionStats = await missionStats.getAllMissionStats(userId);

    const response = new Response(JSON.stringify(allMissionStats), {
      status: 200,
    });
    return response;
  } catch (error) {
    const response = new Response(getErrorMessage(error), { status: 500 });
    return response;
  }
}
