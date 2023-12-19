import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useNavigate } from "@remix-run/react";
import { Comment as CommentComponent } from "~/components/comment";
import { Button } from "~/components/ui/button";
import { MdDelete } from 'react-icons/md/index.js'

interface CommentsUser {
  comments: {
    id: string;
    content: string;
    created_at: string;
    author: {
      userName: string;
      avatar?: string;
    }
    post: {
      title: string;
      id: string;
      author: {
        userName: string;
      }
    };
  }[];
}

export function Comments({comments}: CommentsUser) {
  const navigate = useNavigate()

  if(!comments || comments.length === 0){
    return (
      <div className="flex w-full text-center justify-center font-bold text-4xl text-background">
        No comments found!!!
      </div>
    )
  }else{
    return (
      <ScrollArea>
        {comments.map((comment) => (
          <div key={comment.id} className="relative">
            <div className="absolute bottom-1 right-3 z-50">
              <Button 
                className="font-bold text-xl p-2"
                onClick={() => navigate(`/delete-comment/${comment.id}`)}
              >
                <MdDelete/>
              </Button>
            </div>
            <div
              className="flex flex-col w-full gap-2 bg-foreground text-primary rounded-lg p-2 my-4 shadow-lg cursor-pointer hover:shadow-2xl hover:bg-foreground/60"
              onClick={() => navigate(`/post/${comment.post.id}`)}
            >
              <div className="font-bold text-2xl">
                <span>{comment.post.title} - {comment.post.author.userName}</span>
              </div>
              <CommentComponent 
                content={comment.content}
                author={comment.author}
                created_at={comment.created_at}
                clickable={false}
              />
            </div>
          </div>
        ))}
      </ScrollArea>
    )
  }
}