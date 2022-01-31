import { Request, Response, NextFunction } from "express"
import * as express from "express"
import { wrapAsync } from "../errors/error-handler"
import { paramsSchemaValidator, bodySchemaValidator } from "../schema-validator/schema-validator-middleware"
import {
  paramSchemaNotification, paramsSchema,
  scenarioNotificationBodySchema, updateScenarioSchema,
} from "../schema-validator/scenario-schema"
import { projectNameParam, scenarioSchema } from "../schema-validator/project-schema"
import { getScenariosController } from "../controllers/scenario/get-scenarios-controller"
import { createScenarioController } from "../controllers/scenario/create-scenario-controller"
import { deleteScenarioController } from "../controllers/scenario/delete-scenario-controller"
import { getScenarioTrendsController } from "../controllers/scenario/trends/get-scenario-trends-controller"
import { getScenarioNotificationsController } from "../controllers/scenario/notifications/get-notifications-controllers"
import { createScenarioNotificationController }
  from "../controllers/scenario/notifications/create-notification-controller"
import { deleteScenarioNotificationController }
  from "../controllers/scenario/notifications/delete-scenario-notification-controller"
import { updateScenarioController } from "../controllers/scenario/update-scenario-controller"
import { getScenarioController } from "../controllers/scenario/get-scenario-controller"
import { authenticationMiddleware } from "../middleware/authentication-middleware"
import { AllowedRoles, authorizationMiddleware } from "../middleware/authorization-middleware"

export class ScenarioRoutes {

  routes(app: express.Application): void {

    app.route("/api/projects/:projectName/scenarios")
      .get(
        authenticationMiddleware,
        authorizationMiddleware([AllowedRoles.Readonly, AllowedRoles.Operator, AllowedRoles.Admin]),
        paramsSchemaValidator(projectNameParam),
        wrapAsync( (req: Request, res: Response) => getScenariosController(req, res)))

      .post(
        authenticationMiddleware,
        authorizationMiddleware([AllowedRoles.Operator, AllowedRoles.Admin]),
        paramsSchemaValidator(projectNameParam),
        bodySchemaValidator(scenarioSchema),
        wrapAsync( (req: Request, res: Response, next: NextFunction) => createScenarioController(req, res, next)))

    app.route("/api/projects/:projectName/scenarios/:scenarioName")
      .get(
        authenticationMiddleware,
        authorizationMiddleware([AllowedRoles.Readonly, AllowedRoles.Operator, AllowedRoles.Admin]),
        paramsSchemaValidator(paramsSchema),
        wrapAsync( (req: Request, res: Response) => getScenarioController(req, res))
      )

      .put(
        authenticationMiddleware,
        authorizationMiddleware([AllowedRoles.Operator, AllowedRoles.Admin]),
        paramsSchemaValidator(paramsSchema),
        bodySchemaValidator(updateScenarioSchema),
        wrapAsync( (req: Request, res: Response) => updateScenarioController(req, res)))

      .delete(
        authenticationMiddleware,
        authorizationMiddleware([AllowedRoles.Operator, AllowedRoles.Admin]),
        paramsSchemaValidator(paramsSchema),
        wrapAsync( (req: Request, res: Response) => deleteScenarioController(req, res)))

    app.route("/api/projects/:projectName/scenarios/:scenarioName/notifications")
      .get(
        authenticationMiddleware,
        authorizationMiddleware([AllowedRoles.Readonly, AllowedRoles.Operator, AllowedRoles.Admin]),
        paramsSchemaValidator(paramsSchema),
        wrapAsync( (req: Request, res: Response) => getScenarioNotificationsController(req, res)))

      .post(
        authenticationMiddleware,
        authorizationMiddleware([AllowedRoles.Operator, AllowedRoles.Admin]),
        paramsSchemaValidator(paramsSchema),
        bodySchemaValidator(scenarioNotificationBodySchema),
        wrapAsync( (req: Request, res: Response) => createScenarioNotificationController(req, res)))


    app.route("/api/projects/:projectName/scenarios/:scenarioName/notifications/:notificationId")
      .delete(
        authenticationMiddleware,
        authorizationMiddleware([AllowedRoles.Operator, AllowedRoles.Admin]),
        paramsSchemaValidator(paramSchemaNotification),
        wrapAsync( (req: Request, res: Response) => deleteScenarioNotificationController(req, res)))

    app.route("/api/projects/:projectName/scenarios/:scenarioName/trends")
      .get(
        authenticationMiddleware,
        authorizationMiddleware([AllowedRoles.Readonly, AllowedRoles.Operator, AllowedRoles.Admin]),
        paramsSchemaValidator(paramsSchema),
        wrapAsync( (req: Request, res: Response) => getScenarioTrendsController(req, res)))
  }
}
