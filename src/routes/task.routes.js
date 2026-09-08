import { Router } from "express";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../controllers/task.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/:projectId")
    .get(getTasks)
    .post(createTask);

router.route("/:projectId/tasks/:taskId")
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

export default router;