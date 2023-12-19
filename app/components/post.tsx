import type { Descendant } from "slate";
import type { Post as PrismaPost } from "@prisma/client";
import { useMemo } from "react";
import { Editable, Slate } from "slate-react";
import { useAppContext } from "~/context/AppContext";
import { useNavigate } from "@remix-run/react";
import { convertDate } from "~/lib/convertDate";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MdOutlinePermIdentity } from "react-icons/md/index.js";
import { cn } from "~/lib/utils";

interface IPost extends PrismaPost {
  _count: {
    comments: number,
  },
  author: {
    userName: string;
    avatar?: string
  };
}

interface PostProps{
  post: IPost
  className?: string;
  classOverflow?: string
  clickable?: boolean
}

export function Post({post, className, classOverflow, clickable=true}: PostProps) {
  const { editor, renderElement, renderLeaf } = useAppContext()
  const navigate = useNavigate()

  const initialValue: Descendant[] = useMemo(() => JSON.parse(post.content), [post.content])

  return(
    <div 
      className={
        clickable ? "flex flex-col w-full gap-2 bg-foreground rounded-lg p-3 my-4 shadow-lg cursor-pointer hover:shadow-2xl hover:bg-foreground/60"
        : "flex flex-col w-full gap-2 rounded-lg p-3 my-4 shadow-lg bg-foreground/60"
      }
      onClick={() => {clickable && navigate(`/post/${post.id}`)}}
    >
      <div className="flex items-center gap-4 w-full text-primary relative">
        <Avatar 
          className="h-16 w-16"
        >
          <AvatarImage src={post.author.avatar}/>
          <AvatarFallback className="font-bold text-4xl hover:cursor-pointer"><MdOutlinePermIdentity/></AvatarFallback>
        </Avatar>
        <div>
          <span className="font-bold text-lg">{post.author.userName}</span>
          <h2 className="font-bold text-3xl">{post.title}</h2>
          <p className="font-semibold text-xl">{post.language}</p>
        </div>
        <div className="absolute right-0 top-0 font-semibold text-base">
          <span>{convertDate(post.created_at.toString())}</span>
        </div>
      </div>
      <div className="relative">
        <Slate
          editor={editor}
          initialValue={initialValue}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck
            readOnly
            className={cn("bg-background/20 p-2 rounded-md", className)}
          />
        </Slate>
        <div className={cn("absolute left-0 top-0 right-0 bottom-0 rounded-md", classOverflow)}></div>
      </div>
      <div className="flex w-full items-center relative text-primary">
        <p>{post._count.comments} Comments</p>
      </div>
    </div>
  )
}