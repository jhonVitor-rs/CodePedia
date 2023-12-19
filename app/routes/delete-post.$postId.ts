import type { LoaderFunction } from "@remix-run/node";
import { deletePost } from "~/server/posts.server";

export const loader: LoaderFunction = async ({params}) => {
  const { postId } = params

  if (postId) 
    return await deletePost(postId)
}