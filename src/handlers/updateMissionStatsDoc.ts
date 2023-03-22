import { MissionStats } from "../MissionStats";
import { getErrorMessage, USERID_HEADER } from "../helpers/worker";
import type { Env, UpdateMissionStatsBody } from "../types";

export async function updateMissionStats(
  request: Request,
  env: Env
): Promise<Response> {
  const headers = request.headers;
  const userId = headers.get(USERID_HEADER);

  const formattedReq = new Response(request.body);
  const body: UpdateMissionStatsBody = await formattedReq.json();
  const { missionId, goal } = body;

  if (!userId || !missionId || !goal) {
    const response = new Response("Bad Request", { status: 400 });
    return response;
  }

  try {
    const missionStats = new MissionStats(env);

    const updatedMissionStats = await missionStats.updateMissionStats(
      userId,
      missionId,
      goal
    );

    const response = new Response(JSON.stringify(updatedMissionStats), {
      status: 200,
    });
    return response;
  } catch (error) {
    const response = new Response(getErrorMessage(error), { status: 500 });
    return response;
  }
}
