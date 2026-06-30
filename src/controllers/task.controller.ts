import { Request, Response } from "express";

import {
  createTaskSchema,
  updateTaskSchema,
} from "../modules/tasks/task.schema";

import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.services";

import { successResponse } from "../utils/apiResponse";

export async function create(
  req: Request,
  res: Response
) {
  const data =
    createTaskSchema.parse(req.body);

  const task =
    await createTask(
      Number(req.params.projectId),
      (req as any).user.id,
      data
    );

  return successResponse(
    res,
    201,
    "Task created successfully",
    task
  );
}

export async function getTasks(
  req: Request,
  res: Response
) {
  const tasks =
    await getProjectTasks(
      Number(req.params.projectId),
      (req as any).user.id
    );

  return successResponse(
    res,
    200,
    "Tasks fetched successfully",
    tasks
  );
}

export async function getTask(
  req: Request,
  res: Response
) {
  const task =
    await getTaskById(
      Number(req.params.taskId),
      (req as any).user.id
    );

  return successResponse(
    res,
    200,
    "Task fetched successfully",
    task
  );
}

export async function update(
  req: Request,
  res: Response
) {
  const data =
    updateTaskSchema.parse(req.body);

  const task =
    await updateTask(
      Number(req.params.taskId),
      (req as any).user.id,
      data
    );

  return successResponse(
    res,
    200,
    "Task updated successfully",
    task
  );
}

export async function remove(
  req: Request,
  res: Response
) {
  await deleteTask(
    Number(req.params.taskId),
    (req as any).user.id
  );

  return res.status(204).send();
}