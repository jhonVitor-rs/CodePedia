import { type ActionFunction, redirect, json } from "@remix-run/node";
import { getUserId } from "~/server/auth.server";
import { createPost } from "~/server/posts.server";

export const action: ActionFunction = async ({request}) => {
  const authorId = await getUserId(request)
  if(authorId){
    const form = await request.formData()
    const title = form.get('title') as string
    const content = form.get('content') as string
    const lang = form.get('lang') as string

    try {
      const postId = await createPost({title, content, language: lang, authorId})
      return json({postId})
    } catch (error) {
      alert(error)
      return redirect('/')
    }
  } else {
    return redirect('/')
  }
}