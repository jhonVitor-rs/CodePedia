import type { TPost } from "~/types/post.server";
import { prisma } from "./prisma.server";
import { redirect } from "@remix-run/node";

interface PaginationOptions {
  title?: string;
  language?: string;
  page?: number;
}

export async function createPost(post: TPost) {
  const { title, content, language, authorId } = post
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        language,
        authorId
      }
    })

    return newPost.id
  } catch (error) {
    return new Error('Error to create post!')
  }
}

export async function findAllPosts({title, language, page = 1}: PaginationOptions) {
  const skip = (page - 1) * 10;

  const posts = await prisma.post.findMany({
    where: {
      title: {contains: title},
      language: {contains: language}
    },
    orderBy: {created_at: 'desc'},
    include: {
      author: {
        select: {
          userName: true,
          avatar: true
        }
      },
      _count: {
        select: {comments: true}
      }
    },
    skip,
    take: 10,
  })

  const totalPosts = await prisma.post.count({
    where: {
      title: { contains: title },
      language: { contains: language },
    },
  });

  return { posts, totalPosts };
}

export async function findPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            userName: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          select: {
            content: true,
            created_at: true,
            author: {
              select: {
                userName: true,
                avatar: true
              }
            }
          },
          orderBy: {created_at: 'desc'}
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    return post
  } catch (error) {
    return new Error('Not found post!')
  }
}

export async function updatedPost(post: TPost, id: string) {
  const { title, content, language, authorId } = post
  try {
    const post = await prisma.post.update({
      where: {id},
      data: {
        title,
        content,
        language,
        authorId
      }
    })
    
    return post
  } catch (error) {
    return new Error('Error to updated post!')
  }
}

export async function deletePost(id: string) {
  try{
    await prisma.post.delete({
      where: {id},
      include: {comments: true}
    })
    return redirect('/profile')
  } catch (error) {
    throw new Error('Error to deleted post!')
  }
}