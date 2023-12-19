import type { Post as PrismaPost } from "@prisma/client";
import { Loading } from "~/components/loading";
import { Post } from "~/components/post";
import { ScrollArea } from "~/components/ui/scroll-area";

interface IPost extends PrismaPost {
  _count: {
    comments: number,
  },
  author: {
    userName: string;
    avatar?: string
  };
}

interface PostListProps {
  searching: boolean | undefined;
  posts: IPost[];
}

export function PostList({searching, posts}: PostListProps) {

  return searching ? (
    <Loading/>
  ) : !posts || posts.length === 0 ? (
    <div className="flex w-full text-center justify-center font-bold text-4xl text-background">
      No post found!!!
    </div>
  ) : (
    <ScrollArea className="w-full max-h-[90vh]">
      {posts.map((post: IPost) => (
        <Post
          key={post.id}
          post={post}
          className="max-h-24 overflow-hidden"
          classOverflow="bg-gradient-to-b from-white/20 to-white/60"
        />
      ))}
    </ScrollArea>
  )
}