import type { TComment } from "~/types/comments.server";
import { prisma } from "./prisma.server";
import { redirect } from "@remix-run/node";

export async function createComment(comment: TComment) {
  const { content, authorId, postId } = comment
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId
      }
    })
    return newComment.id
  } catch (error) {
    return new Error('Error to create comment!')
  }
}

export async function findCommentByAuthor(authorId:string) {
  const comments = await prisma.comment.findMany({
    where: {
      authorId
    },
    select:{
      content: true,
      created_at: true,
      post: {
        select: {
          id: true,
          title: true
        }
      }
    }
  })

  return comments
}

export async function deleteComment(id:string) {
  try{
    await prisma.comment.delete({
      where: {id}
    })
    return redirect('/profile')
  } catch (error) {
    throw new Error('Error to deleted comment!')
  }
}