import { json, type ActionFunction, redirect } from "@remix-run/node";
import { getUserId } from "~/server/auth.server";
import { createComment } from "~/server/comments.server";

export const action: ActionFunction = async ({request}) => {
  const authorId = await getUserId(request)
  const form = await request.formData()
  const comment = form.get('comment') as string
  const postId = form.get('postId') as string
  if(authorId){

    try {
      const commentId = await createComment({authorId, content: comment, postId: postId})
      return json({commentId})
    } catch (error) {
      alert(error)
      return redirect(`/post/${postId}`)
    }
  }else {
    return redirect(`/post/${postId}`)
  }
}