import type { LoaderFunction} from "@remix-run/node";
import { json, redirect } from "@remix-run/node"
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react"
import { getUserId } from "~/server/auth.server"
import { findUser } from "~/server/user.server"
import { MdEdit, MdPostAdd, MdArrowBack, MdExitToApp } from 'react-icons/md/index.js'
import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Posts } from "./posts";
import { Comments } from "./comments";
import { useState } from "react";
import { Modal } from "~/components/modal";
import { New } from "../newPost/new";


export const loader: LoaderFunction = async ({request}) => {
  const userId = await getUserId(request)
  if(userId && typeof userId === 'string') {
    const user = await findUser(userId)
    if(user) {
      return json({user})
    } else {
      return redirect('/')
    }
  } else {
    return redirect('/')
  }
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const [openModal, setOpenModal] = useState(false)
  const handleCloseModal = () => setOpenModal(false)
  
  return(
    <div className="min-w-full flex flex-col gap-2 relative">
      <Button className="absolute top-4 left-3 p-3 rounded-full" onClick={() => navigate(-1)}>
        <MdArrowBack/>
      </Button>
      <div className="bg-white/70 shadow-lg flex flex-col gap-4 w-full max-w-5xl my-6 mx-auto p-4 rounded-xl min-h-[90vh] relative">
        <Outlet context={{ userName: user.userName, firstName: user.firstName, lastName: user.lastName, email: user.email }} />
        <Modal isOpen={openModal} onChange={handleCloseModal} className="my-auto">
          <New/>
        </Modal>
        <div className="flex w-full justify-around gap-3">
          <div className="relative">
            <Avatar className="w-28 h-28" onClick={() => {!user.avatar && navigate('/profile/avatar')}}>
              <AvatarImage src={user.avatar}/>
              <AvatarFallback className="font-bold text-4xl hover:cursor-pointer">+</AvatarFallback>
            </Avatar>
            {user.avatar && (
              <Button 
                className="absolute rounded-full px-2 py-5 text-2xl top-20"
                onClick={() => navigate('/profile/avatar')}
              >
                <MdEdit/>
              </Button>
            )}
          </div>
          <div className="flex flex-1 flex-col relative w-full bg-primary rounded-md justify-center p-3 gap-2 min-h-[7rem]">
            <div className="flex gap-2 absolute top-3 right-3">
              <Button 
                className="bg-secondary text-white hover:text-secondary text-2xl p-2 hover:border border-white"
                onClick={() => setOpenModal(true)}
              >
                <MdPostAdd/>
              </Button>
              <Link to={'/profile/edit'}>
                <Button 
                  className="bg-secondary text-white hover:text-secondary text-2xl p-2 hover:border border-white"
                >
                  <MdEdit/>
                </Button>
              </Link>
              <Link to={'/logout'}>
                <Button
                  className="bg-secondary text-white hover:text-secondary text-2xl p-2 hover:border border-white"
                >
                  <MdExitToApp/>
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center w-full gap-3">
              <img src="logo.png" alt="" width={50} className="rounded-md cursor-pointer" onClick={() => navigate('/')}/>
              <h1 className="text-3xl font-black">CodePedia</h1>
            </div>
            <div className="w-full py-2 px-3 rounded-full bg-background/50 text-xl">{user.userName}</div>
            <div className="flex w-full flex-row gap-2">
              <span className="w-1/2 py-2 px-3 rounded-full bg-background/50 text-lg">{user.firstName}</span>
              <span className="w-1/2 py-2 px-3 rounded-full bg-background/50 text-lg">{user.lastName}</span>
            </div>
            <div className="max-w-xs w-full bg-background/50 rounded-full py-2 px-3 text-base">{user.email}</div>
          </div>
        </div>
        <Tabs
          defaultValue="posts"
          className="flex flex-col w-full gap-2 items-center justify-center mx-auto"
          >
          <TabsList
            className="w-full flex items-center justify-center"
          >
            <TabsTrigger value="posts" className="w-full">Posts</TabsTrigger>
            <TabsTrigger value="comments" className="w-full">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="w-full">
            <Posts posts={user.posts}/>
          </TabsContent>
          <TabsContent value="comments" className="w-full">
            <Comments comments={user.comments}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}