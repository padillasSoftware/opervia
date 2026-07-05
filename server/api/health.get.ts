import { logger } from "#shared/utils/logger";
import { prisma } from "#server/utils/db";
import { HttpStatus } from "#shared/utils/httpstatus";

export default defineEventHandler(async () => {
  logger.info("health check requested");

  const databaseStatus = await prisma
    .$queryRaw`SELECT 1 as status`
    .then(() => "ok")
    .catch((error) => {
      logger.error("health check database error", { error: String(error) });
      return "error";
    });

  const appStatus = databaseStatus === "ok" ? "ok" : "degraded";

  return {
    status: HttpStatus.OK,
    statusCode: HttpStatus.OK,
    data: {
      status: appStatus,
      database: databaseStatus,
      uptime: process.uptime(),
      stage: process.env.STAGE ?? "local",
    },
  };
});
