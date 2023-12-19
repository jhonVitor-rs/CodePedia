import type { ActionFunction} from "@remix-run/node";
import { json } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { z } from "zod"
import { register } from "~/server/auth.server"
import { FormField } from "~/components/formField"
import { Button } from "~/components/ui/button"
import useForm from "~/lib/validateForm"

const UserSchema = z.object({
  firstName: z.string().min(3, { message: 'The first name must have at least 3 characters' }),
  lastName: z.string().min(3, { message: 'The last name must have at least 3 characters' }),
  userName: z.string().min(3, { message: 'The user name must have at least 3 characters' }),
  email: z.string().min(8, { message: 'The email must have at least 8 characters' }).email(),
  password: z.string().min(8, { message: 'The password must have at least 8 characters' })
})

export const action: ActionFunction = async ({request}) => {
  const form = await request.formData()

  const firstName = form.get('firstName')
  const lastName = form.get('lastName')
  const userName = form.get('userName')
  const email = form.get('email')
  const password = form.get('password')

  if((typeof firstName === 'string' && firstName.length >= 3) &&
  (typeof lastName === 'string' && lastName.length >= 3) &&
  (typeof userName === 'string' && userName.length >= 3) &&
  (typeof email === 'string' && email.length >= 8) &&
  (typeof password === 'string' && password.length >= 8))
    return await register({firstName, lastName, userName, email, password})
  else{
    const errors = UserSchema.parse({firstName, lastName, userName, email, password})
    return json({errors}, {status: 400})
  }
}

export default function() {
  const { formData, errors, handleInputChange, validateForm } = useForm({
    schema: UserSchema,
    initialValues: {
      firstName: '',
      lastName: '',
      userName: '',
      password: '',
      email: ''
    }
  })

  return (
    <Form 
      method="post"
      onSubmit={(event) => {
        if(!validateForm()){
          event.preventDefault()
          alert('Please correct the errors in the form!')
        }
      }}
      className="flex flex-col w-full bg-foreground/40 p-2 rounded-md"
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
      <FormField
        htmlFor="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={(event) => handleInputChange({event, field: 'password'})}
        error={errors.password}
      />
      <div className="flex w-full justify-center">
        <Button type="submit" value={'_signUp'} name="button">Register</Button>
      </div>
    </Form>
  )
}