import { MissionStats } from "../MissionStats";
import { getErrorMessage, USERID_HEADER } from "../helpers/worker";
import type { Env, FinishedMission } from "../types";

export async function getFinishedMissions(
  request: Request,
  env: Env
): Promise<Response> {
  const headers = request.headers;
  const userId = headers.get(USERID_HEADER);

  if (!userId) {
    const response = new Response("Bad Request", { status: 400 });
    return response;
  }

  try {
    const missionStats = new MissionStats(env).getAllFinishedMissions;

    const response = new Response(JSON.stringify(missionStats), {
      status: 200,
    });
    return response;
  } catch (error) {
    const response = new Response(getErrorMessage(error), { status: 200 });
    return response;
  }
}
