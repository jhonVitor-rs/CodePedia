import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import { TextEditor } from "~/components/textEditor";
import { FormField } from "~/components/formField";
import { Button } from "~/components/ui/button";
import useForm from "~/lib/validateForm"
import { languagesForPost } from "~/types/language";

const PostSchema = z.object({
  title: z.string().min(3, { message: 'The title must have at least 3 characters' }),
  language: z.string() ,
});

export function New(){
  const navigate = useNavigate()
  const [textInput, setTextInput] = useState('')
  const {formData, errors, handleInputChange, validateForm} = useForm({
    schema: PostSchema,
    initialValues: {
      title: "",
      language: languagesForPost[0]
    }
  })

  const handleFormUpload = async () => {
    if(validateForm()){
      const inputFormData = new FormData()
      inputFormData.append('title', formData.title)
      inputFormData.append('content', textInput)
      inputFormData.append('lang', formData.language)
  
      try {
        const response = await fetch('/newPost', {
          method: 'POST',
          body: inputFormData,
        });
  
        const { postId } = await response.json();
  
        if (postId && typeof postId === 'string') {
          navigate(`/post/${postId}`);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }else{
      console.log(errors)
    }
  }

  return(
    <div className="flex flex-col p-3 gap-4 max-w-3xl w-screen">
      <div className="flex items-center justify-around w-full gap-4">
        <FormField
          htmlFor="title"
          label="Title:"
          value={formData.title}
          onChange={(event) => handleInputChange({event, field: 'title'})}
          error={errors.title}
          className="flex flex-col w-full"
        />
        <div>
          <label htmlFor="language" className="text-blue-600 font-semibold">
            Language:
          </label>
          <select
            id="language"
            name="language"
            defaultValue={formData.language}
            onChange={(event) => handleInputChange({event, field: 'language'})}
            className="w-full p-2 rounded-xl my-2 text-slate-900"
          >
            {languagesForPost.map((language, index) => (
              <option key={index} value={language} className="text-slate-900">{language}</option>
            ))}
          </select>
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            {errors.language || ''}
          </div>
        </div>
      </div>
      <TextEditor 
        value={textInput} 
        onChange={setTextInput} 
        className="min-h-[480px]"
      />
      <div className="flex w-full justify-center">
        <Button onClick={() => handleFormUpload()} name="button">Register</Button>
      </div>
    </div>
  )
}