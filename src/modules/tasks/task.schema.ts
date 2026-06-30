import { z } from "zod";

const taskFields = {
  title: z.string().min(3).max(100),

  description: z.string().optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  assigneeId: z.number().optional(),

  dueDate: z.string().datetime().optional(),
};

export const createTaskSchema = z
  .object(taskFields)
  .refine(
    (data) =>
      !data.dueDate ||
      new Date(data.dueDate) > new Date(),
    {
      message: "Due date must be in the future",
      path: ["dueDate"],
    }
  );

export const updateTaskSchema = z.object({
  title: taskFields.title.optional(),
  description: taskFields.description,
  priority: taskFields.priority,
  assigneeId: taskFields.assigneeId,
  dueDate: taskFields.dueDate,
  status: z
    .enum(["TODO", "IN_PROGRESS", "DONE"])
    .optional(),
});