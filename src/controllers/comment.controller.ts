import { Request, Response } from "express";

import { createCommentSchema } from "../modules/comment/comment.schema";

import { createComment } from "../services/comment.service";

import { successResponse } from "../utils/apiResponse";

export async function create(
  req: Request,
  res: Response
) {
  const { body } =
    createCommentSchema.parse(req.body);

  const comment =
    await createComment(
      Number(req.params.taskId),
      (req as any).user.id,
      body
    );

  return successResponse(
    res,
    201,
    "Comment added successfully",
    comment
  );
}