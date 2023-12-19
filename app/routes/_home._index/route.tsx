import { json, type LoaderFunction } from "@remix-run/node";
import { useEffect } from "react";
import { useLoaderData, Form, useNavigation, useSubmit } from "@remix-run/react";
import { findAllPosts } from "~/server/posts.server";
import { languagesForPost } from "~/types/language";
import { PostList } from "./postList";
import { Button } from "~/components/ui/button";

export const loader: LoaderFunction = async ({request}) => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") as string;
  const lang = url.searchParams.get("lang") as string;
  const page = url.searchParams.get("page") as string

  const {posts, totalPosts} = await findAllPosts({
    title: title || '', 
    language: lang || '', 
    page: parseInt(page) || 1
  })

  if (posts instanceof Error) {
    console.error("Error fetching posts:", posts);
    throw posts; 
  }
  
  return json({posts, totalPosts, title, lang})
}

export default function () {
  const { posts, totalPosts, title, lang } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const submit = useSubmit()

  const searching = navigation.location && 
    new URLSearchParams(navigation.location.search).has("title")

  useEffect(() => {
    const searchPostByTitle = document.getElementById("title")
    const searchPostByLanguage = document.getElementById("lang")
    if(searchPostByTitle instanceof HTMLInputElement && 
      searchPostByLanguage instanceof HTMLSelectElement){
      searchPostByTitle.value = title || ''
      searchPostByLanguage.value = lang || ''
    }
  }, [title, lang])

  return (
    <div className="bg-white/70 shadow-lg w-full max-w-5xl mx-auto mb-4 flex flex-col p-4 rounded-xl">
      <Form 
        id='search-post'
        className="flex flex-col gap-2 relative w-full p-2 items-center"
        onChange={(event) =>{
          const isFirstSearch = title === null;
          submit(event.currentTarget, {
            replace: !isFirstSearch,
          });
        }}
        role="search"
      >
        <div className="flex flex-row gap-2 w-full items-center">
          <input 
            id="title"
            name="title"
            className="block outline-none w-full p-2 rounded-lg text-background text-xl"
            type="search"
            defaultValue={title || ''}
            placeholder="Search posts by title"
          />
          <select
            id="lang"
            name="lang"
            defaultValue={lang || ''}
            className="text-xl block outline-none w-1/4 p-2 text-slate-900 rounded-md bg-white"
          >
            <option value=''>
            </option>
            {languagesForPost.map((language, index) => (
              <option key={index} value={language}>{language}</option>
            ))}
          </select>
        </div>
      </Form>
      <div className="flex w-full min-h-[560px] gap-1">
        <PostList searching={searching} posts={posts}/>
      </div>
        {totalPosts > 0 && (
          <div className="flex w-full items-center justify-center text-slate-900">
            Showing {Math.min(totalPosts, posts.length)} of {totalPosts} posts
          </div>
        )}
      <Form
        id="search-page"
        className="w-full flex flex-wrap gap-2 items-center justify-center"
        onChange={(event) => {
          submit(event.currentTarget)
        }}
      >
        {Array.from({length: Math.ceil(totalPosts / 10)}, (_, index) => (
          <Button
            key={index+1}
            id="page"
            name="page"
            value={index+1}

          >
            {index+1}
          </Button>
        ))}
      </Form>
    </div>
  )
}