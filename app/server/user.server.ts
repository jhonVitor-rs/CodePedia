import type { TUser } from "~/types/user.server";
import bcrypt from 'bcryptjs'
import { prisma } from "./prisma.server";
import { deleteImage } from "./upload.server";

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10)

export async function createUser(user: TUser) {
  const {firstName, lastName, userName, password, email} = user
  const passwordHash = await hashPassword(password)
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName, 
        lastName,
        userName,
        email,
        password: passwordHash
      }
    })

    return newUser;
  } catch (error) {
    return new Error('Error to create user!');
  }
}

export async function findUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        userName: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        posts: {
          select: {
            id: true,
            title: true,
            language: true,
            content: true,
            created_at: true,
            author: {
              select: {
                userName: true,
                avatar: true,
              }
            },
            _count: {select: {comments: true}}
          },
          orderBy: {created_at: 'desc'}
        },
        comments: {
          select: {
            id: true,
            content: true,
            created_at: true,
            author: {
              select: {
                userName: true,
                avatar: true
              }
            }, 
            post: {
              select: {
                id: true,
                title: true,
                author: {
                  select: {
                    userName: true,
                  }
                }
              }
            }
          },
          orderBy: {created_at: 'desc'}
        }
      },
    })

    return user
  } catch (error) {
    return new Error('Not found user!')
  }
}

export async function updateUser(id: string, userData: Partial<TUser>) {
  try {
    const user = prisma.user.update({
      where: {id},
      data: userData
    })

    return user;
  } catch (error) {
    return new Error('Error to update user!')
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: {id},
      include: {
        posts: true,
        comments: true
      }
    })
  } catch (error) {
    throw new Error('Error to deleted user!')
  }
}

export async function AddAvatar(avatar:string, avatarId: string, userID: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {id: userID},
      select: {
        avatar: true,
        avatarId: true
      }
    })

    if(user?.avatar && user?.avatarId) deleteImage(user.avatarId)

    await prisma.user.update({
      where: {id: userID},
      data: {
        avatar,
        avatarId
      }
    })
  } catch (error) {
    throw new Error('Error to update Image Avatar!')
  }
}