import { useState } from "react";
import { TextEditor } from "~/components/textEditor";
import { Button } from "~/components/ui/button";

export default function NewComment({postId}: {postId: string}) {
  const [commentValue, setCommentValue] = useState('')

  const handleFormUpload = async () => {
    console.log(postId)
    if(commentValue.length >= 100 && postId) {
      const inputFormData = new FormData()
      inputFormData.append('postId', postId)
      inputFormData.append('comment', commentValue)
      console.log(inputFormData)

      try {
        const response = await fetch('/new-comment', {
          method: 'POST',
          body: inputFormData,
        })

        const {commentId} = await response.json()
        console.log(commentId)
        if(commentId) {
          window.location.reload()
        }
      } catch (error) {
        console.log(error)
      }
    }else {
      alert('And you need to fill in the field with your comment')
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="font-bold text-2xl text-primary">Add your comment!</p>
      <TextEditor
        value={commentValue}
        onChange={setCommentValue}
        className="min-h-[240px] w-full max-w-full shadow-lg"
      />
      <div className="flex w-full justify-end">
        <Button onClick={() => handleFormUpload()} name="button">Comment</Button>
      </div>
    </div>
  )
}