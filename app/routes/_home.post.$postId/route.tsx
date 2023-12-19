import { redirect, type LoaderFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { findPostById } from "~/server/posts.server"
import { Post as PostComponent } from "~/components/post"
import { Comment } from "~/components/comment"
import NewComment from "./newComment"
import { ScrollArea } from "~/components/ui/scroll-area"
import { getUserId } from "~/server/auth.server"

interface IComments {
  content: string;
  created_at: string;
  author: {
    userName: string;
    avatar?: string;
  };
}

export const loader: LoaderFunction = async ({params, request}) => {
  const { postId } = params
  const userId = await getUserId(request)
  
  if(!postId || typeof postId !== 'string'){
    alert(`Post ID undefined!`)
    return redirect('/')
  }

  const post = await findPostById(postId)

  if(post instanceof Error){
    alert(`Not find Post with id: ${postId}!`)
    return redirect('/')
  }

  return json({post, userId})
}

export default function() {
  const { post, userId } = useLoaderData<typeof loader>()

  return(
    <div className="bg-white/70 shadow-lg w-full max-w-5xl mx-auto mb-4 flex flex-col p-4 rounded-xl min-h-[90vh] relative">
      <PostComponent
        post={post}
        clickable={false}
      />
      {(post.comments.length >= 0) && (
        <ScrollArea className="flex w-full max-h-[80vh] overflow-auto">
          {post.comments.map((comment: IComments, index: number) => (
            <Comment 
              key={index} 
              content={comment.content} 
              created_at={comment.created_at} 
              author={comment.author}
              clickable={false}
            />
          ))}
        </ScrollArea>
      )}
      {userId && (
        <NewComment postId={post.id}/>
      )}
    </div>
  )
}