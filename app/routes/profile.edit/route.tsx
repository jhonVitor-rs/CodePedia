import type { User } from "@prisma/client";
import { json, type ActionFunction, redirect } from "@remix-run/node";
import { Form, useNavigate, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import { getUserId } from "~/server/auth.server";
import { hashPassword, updateUser } from "~/server/user.server";
import { FormField } from "~/components/formField";
import { Modal } from "~/components/modal";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import useForm from "~/lib/validateForm";

const UserSchema = z.object({
  firstName: z.string().min(3, { message: 'The first name must have at least 3 characters' }),
  lastName: z.string().min(3, { message: 'The last name must have at least 3 characters' }),
  userName: z.string().min(3, { message: 'The user name must have at least 3 characters' }),
  email: z.string().min(8, { message: 'The email must have at least 8 characters' }).email(),
  password: z.string().optional()
})

export const action: ActionFunction = async ({request}) => {
  const userId = await getUserId(request)
  const form = await request.formData()

  const sendPassword = form.get('switch')
  const firstName = form.get('firstName')
  const lastName = form.get('lastName')
  const userName = form.get('userName')
  const email = form.get('email')
  const password = form.get('password')

  try {
    if(userId && !sendPassword &&
      (typeof firstName === 'string' && firstName.length >= 3) &&
      (typeof lastName === 'string' && lastName.length >= 3) &&
      (typeof userName === 'string' && userName.length >= 3) &&
      (typeof email === 'string' && email.length >= 8)){
        await updateUser(userId, {firstName, lastName, userName, email})
        return redirect('/profile')
    }else if(userId &&
      (typeof firstName === 'string' && firstName.length >= 3) &&
      (typeof lastName === 'string' && lastName.length >= 3) &&
      (typeof userName === 'string' && userName.length >= 3) &&
      (typeof email === 'string' && email.length >= 8) &&
      (typeof password === 'string' && password.length >= 8)){
        const passwordHash = await hashPassword(password)
        await updateUser(userId, {firstName, lastName, userName, email, password: passwordHash})
        return redirect('/profile')
    }else{
      const errors = UserSchema.parse({firstName, lastName, userName, email, password})
      return json({errors}, {status: 400})
    }
  } catch (error) {
    return json({error: 'Error to updated user'}, {status: 400})

  }
}

export default function() {
  const user = useOutletContext<User>()
  const [onChecked, setOnChecked] = useState(false)
  const navigate = useNavigate()

  const { formData, errors, handleInputChange, validateForm } = useForm({
    schema: UserSchema,
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      password: '',
      email: user.email
    }
  })
  
  return(
    <Modal isOpen={true} onChange={() => navigate(-1)}>
      <div className="bg-primary-foreground max-w-sm w-screen p-4 rounded-lg">
        <Form
          method="post"
          onSubmit={(event) => {
            if(!validateForm()){
              event.preventDefault()
              alert('Please correct the errors in the form!')
            }
          }}
        >
          <FormField
            htmlFor="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={(event) => handleInputChange({event, field: 'firstName'})}
            error={errors.firstName}
          />
          <FormField
            htmlFor="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={(event) => handleInputChange({event, field: 'lastName'})}
            error={errors.lastName}
          />
          <FormField
            htmlFor="userName"
            label="User Name"
            value={formData.userName}
            onChange={(event) => handleInputChange({event, field: 'userName'})}
            error={errors.userName}
          />
          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(event) => handleInputChange({event, field: 'email'})}
            error={errors.email}
          />
          <div className="flex w-full items-center gap-3">
            <Label>Edit password?</Label><Switch name="switch" checked={onChecked} onCheckedChange={() => setOnChecked(!onChecked)}/>
          </div>
          <FormField
            htmlFor="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(event) => handleInputChange({event, field: 'password'})}
            error={errors.password}
            disable={!onChecked}
          />
          <div className="flex w-full justify-center">
            <Button type="submit" value={'_signUp'} name="button">Save</Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}
