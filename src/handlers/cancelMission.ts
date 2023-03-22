import { MissionStats } from "../MissionStats";
import { getErrorMessage, USERID_HEADER } from "../helpers/worker";
import type { Env, CancelMissionBody, MissionId } from "../types";

export async function cancelMission(
  request: Request,
  env: Env
): Promise<Response> {
  const headers = request.headers;
  const userId = headers.get(USERID_HEADER);

  const formattedReq = new Response(request.body);
  const body: CancelMissionBody = await formattedReq.json();
  const { missionId } = body;

  if (!userId || !missionId) {
    const response = new Response("Bad Request", { status: 400 });
    return response;
  }

  try {
    const missionStats = new MissionStats(env);

    const cancelMission = await missionStats.cancelMission(
      userId,
      missionId as MissionId
    );

    const response = new Response(cancelMission, {
      status: 200,
    });
    return response;
  } catch (error) {
    const response = new Response(getErrorMessage(error), { status: 500 });
    return response;
  }
}
