import {
  createMissionStats,
  getMissionStats,
  updateMissionStats,
  getAllMissionStats,
  getFinishedMissions,
  cancelMission,
} from "./handlers";
import type { Env, Actions } from "./types";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const workerAction: Actions =
      (url.pathname.split("/").pop() as Actions) || "";

    switch (workerAction) {
      case "create-mission-stats": {
        if (request.method !== "POST") {
          return new Response("Bad Request", { status: 405 });
        }

        return createMissionStats(request, env);
      }
      case "get-mission-stats": {
        if (request.method !== "POST") {
          return new Response("Bad Request", { status: 405 });
        }

        return getMissionStats(request, env);
      }
      case "get-all-mission-stats": {
        if (request.method !== "GET") {
          return new Response("Bad Request", { status: 405 });
        }

        return getAllMissionStats(request, env);
      }
      case "update-mission-stats": {
        if (request.method !== "PATCH") {
          return new Response("Bad Request", { status: 405 });
        }

        return updateMissionStats(request, env);
      }
      case "get-finished-missions": {
        if (request.method !== "GET") {
          return new Response("Bad Request", { status: 405 });
        }

        return getFinishedMissions(request, env);
      }
      case "cancel-mission": {
        if (request.method !== "POST") {
          return new Response("Bad Request", { status: 405 });
        }

        return cancelMission(request, env);
      }
      default: {
        return new Response("Bad Request", { status: 400 });
      }
    }
  },
};
