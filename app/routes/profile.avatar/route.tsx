import type { ActionFunction } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  redirect,
} from "@remix-run/node";
import { Avatar } from "@radix-ui/react-avatar";
import { Form, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { Modal } from "~/components/modal";
import { AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { MdOutlinePermIdentity } from "react-icons/md/index.js";
import { Button } from "~/components/ui/button";
import { uploadImage } from "~/server/upload.server";
import { getUserId } from "~/server/auth.server";
import { AddAvatar } from "~/server/user.server";

export const action: ActionFunction = async ({request}) => {
  const userId = await getUserId(request)
  let avatarId = ''
  const uploadHandler = composeUploadHandlers(
    async ({name, data}) => {
      if (name !== "img") {
        return undefined
      }
      const uploadedImage = await uploadImage(data)
      if(uploadedImage) {
        avatarId = uploadedImage.public_id
        return uploadedImage.secure_url
      }
      return undefined;
    },
    createMemoryUploadHandler()
  )

  const formData = await parseMultipartFormData(request, uploadHandler)
  const imageUrl = formData.get("img")
  
  if(imageUrl && userId){
    try {
      await AddAvatar(imageUrl.toString(), avatarId, userId)
      return redirect('/profile')
    } catch (error) {
      return json({error}, {status: 400})
    }
  } else {
    return json({error: 'Error to updated user'}, {status: 400})
  }
}

export default function () {
  const navigate = useNavigate();
  const imageInput = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageChange = () => {
    const fileInput = imageInput.current;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <Modal isOpen={true} onChange={() => navigate(-1)}>
      <div className="bg-primary-foreground p-4 rounded-lg flex flex-col gap-2 items-start justify-center">
        <h2 className="font-bold text-xl">Select a photo for your profile</h2>
        <div className="flex w-full justify-center items-center p-4">
          <Avatar className="w-24 h-24 rounded-full">
            <AvatarImage src={selectedImage} className="rounded-full"/>
            <AvatarFallback><MdOutlinePermIdentity/></AvatarFallback>
          </Avatar>
        </div>
        <Form 
          method="post" 
          encType="multipart/form-data"
          className="flex items-center justify-between gap-2"
        >
          <input
            type="file"
            id="img"
            name="img"
            className="rounded-full bg-white text-slate-900 p-1"
            ref={imageInput}
            onChange={handleImageChange}
          />
          <Button type="submit" className="">
            Select
          </Button>
        </Form>
      </div>
    </Modal>
  );
}
