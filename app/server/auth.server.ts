import { redirect, json, createCookieSessionStorage } from '@remix-run/node'
import { prisma } from './prisma.server'
import { createUser } from './user.server'
import bcrypt from 'bcryptjs'
import type { TUser } from '~/types/user.server'

const sessionSecret = ENV.SESSION_SECRET

const storage = createCookieSessionStorage({
  cookie: {
    name: 'code_pedia-session',
    secure: ENV.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function register(user: TUser) {
  const existsEmail = await prisma.user.count({where: {email: user.email}})
  if (existsEmail) {
    return json({ error: `User already exists with that email` }, { status: 400 })
  }
  const existsUserName = await prisma.user.count({where: {userName: user.userName}})
  if (existsUserName) {
    return json({ error: `User already exists with that username` }, { status: 400 })
  }

  const newUser = await createUser(user)
  if(newUser instanceof Error){
    return json(
      {
        message: newUser.message,
        error: `Something went wrong trying to create a new user.`,
      },
      {status: 400}
    )
  }
  return createUserSession(newUser.id, '/')
}

export async function login({key, password}: {key: string, password: string}) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {userName: key},
        {email: key}
      ]
    }
  })

  if(!user || !(await bcrypt.compare(password, user.password)))
    return json({ error: `Incorrect login` }, { status: 400 })

  return createUserSession(user.id, "/");
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

function getUserSession(request: Request){
  return storage.getSession(request.headers.get('Cookie'))
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') return null
  return userId
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        userName: true,
        avatar: true
      },
    })
    return user
  } catch {
    return null
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}