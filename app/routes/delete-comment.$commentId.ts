import type { LoaderFunction } from "@remix-run/node";
import { deleteComment } from "~/server/comments.server";

export const loader: LoaderFunction = async ({params}) => {
  const { commentId } = params

  if(commentId)
    return await deleteComment(commentId)
}