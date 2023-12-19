import type { Post as PrismaPost } from "@prisma/client";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Post } from "~/components/post";
import { MdDelete } from 'react-icons/md/index.js'
import { Button } from "~/components/ui/button";
import { useNavigate } from "@remix-run/react";

interface IPost extends PrismaPost {
  _count: {
    comments: number,
  },
  author: {
    userName: string;
    avatar: string
  };
}

interface PostsProps {
  posts: IPost[]
}

export function Posts({posts}: PostsProps){
  const navigate = useNavigate()

  if(!posts || posts.length === 0){
    return(
      <div className="flex w-full text-center justify-center font-bold text-4xl text-background">
        No post found!!!
      </div>
    )
  }else {
    return(
      <ScrollArea className="flex w-full max-h-screen overflow-auto p-0">  
        {posts.map((post) => (
          <div key={post.id} className="relative">
            <div className="absolute bottom-1 right-3 z-30">
              <Button 
                className="font-bold text-xl p-2"
                onClick={() => navigate(`/delete-post/${post.id}`)}
              >
                <MdDelete/>
              </Button>
            </div>
            <Post
              post={post}
              className="max-h-24 overflow-hidden"
              classOverflow="bg-gradient-to-b from-white/20 to-white/60"
            />
          </div>
        ))}
      </ScrollArea>
    )
  }
}