import type { Descendant } from "slate";
import { useMemo } from "react";
import { Editable, Slate } from "slate-react";
import { useAppContext } from "~/context/AppContext";
import { convertDate } from "~/lib/convertDate";
import { useNavigate } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { MdOutlinePermIdentity } from "react-icons/md/index.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface CommentProps {
  postId?: string;
  content: string;
  created_at: string;
  author?: {
    userName: string;
    avatar?: string;
  };
  clickable?: boolean
  className?: string
}

export function Comment({postId, content, created_at, author, clickable=true, className}: CommentProps) {
  const { editor, renderElement, renderLeaf } = useAppContext()
  const initialValue: Descendant[] = useMemo(() => JSON.parse(content), [content])
  const navigate = useNavigate()

  return(
    <div 
      className={
        clickable ? "flex flex-col w-full gap-2 bg-foreground rounded-lg p-3 my-4 shadow-lg cursor-pointer hover:shadow-2xl hover:bg-foreground/60"
        : "flex flex-col w-full gap-2 rounded-lg p-3 my-4 shadow-lg bg-foreground/60"
      }
      onClick={() => {clickable && navigate(`/post/${postId}`)}}
    >
      <div className="flex text-primary w-full justify-start gap-2 items-center">
        <Avatar className="w-14 h-14">
          <AvatarImage src={author?.avatar}/>
          <AvatarFallback>
            <MdOutlinePermIdentity/>
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-base">{author?.userName}</span>
          <p className="font-semibold text-sm">{convertDate(created_at)}</p>
        </div>
      </div>
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
    </div>
  )
}