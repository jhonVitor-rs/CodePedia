import { json, redirect, type LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getUser } from "~/server/auth.server";
import { Modal } from "~/components/modal";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "~/components/ui/navigation-menu";
import { New } from "~/routes/newPost/new";
import { MdOutlinePermIdentity } from "react-icons/md/index.js";

export const loader: LoaderFunction = async ({request}) => {
  const user = await getUser(request)

  return json({user})
}

export default function() {
  const { user } = useLoaderData<typeof loader>()

  const [openModal, setOpenModal] = useState(false)
  const handleCloseModal = () => setOpenModal(false)

  return (
    <div className="min-w-full flex flex-col gap-2">
      <header className="bg-white/70 flex items-center justify-center w-full p-3"> 
        <div className="flex items-center justify-between w-full max-w-5xl">
          <div className="flex items-center gap-2" onClick={() => redirect('/')}>
            <img src="logo.png" alt="" width={80} className="rounded"/>
            <h1 className="text-3xl font-black">CodePedia</h1>
          </div>
          <div>
            {
              (user) ? (
                <NavigationMenu className="z-10">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-white/70 hover:bg-white/40 h-12 rounded-3xl flex p-1 gap-2">
                        <Avatar>
                          <AvatarImage src={user.avatar}/>
                          <AvatarFallback><MdOutlinePermIdentity/></AvatarFallback>
                        </Avatar>
                        <p className="text-background">{user?.userName || 'UserName'}</p>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="p-3 flex flex-col min-w-[200px] bg-slate-400 border-none">
                        <div className="w-full flex flex-col gap-3 items-center justify-center">
                          <Link to={'/profile'}>
                            <Button>Access profile</Button>
                          </Link>
                          <Button onClick={() => setOpenModal(true)}>New post</Button>
                          <Link to={'/logout'}>
                            <Button>Logout</Button>
                          </Link>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ) : (
                <Link to={'/sign-in'}>
                  <Button>SignIn</Button>
                </Link>
              )
            }
          </div>
        </div>
      </header>
      <Modal isOpen={openModal} onChange={handleCloseModal}>
        <New/>
      </Modal>
      <Outlet/>
    </div>
  )
}
