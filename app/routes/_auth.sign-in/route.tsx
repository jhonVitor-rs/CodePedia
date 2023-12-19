import type { ActionFunction} from "@remix-run/node";
import { json } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { z } from "zod"
import { login } from "~/server/auth.server"
import { FormField } from "~/components/formField"
import { Button } from "~/components/ui/button"
import useForm from "~/lib/validateForm"

const signInSchema = z.object({
  key: z.string().min(3, {message: 'The key must have at least 3 characters'}),
  password: z.string().min(8, { message: 'The password must have at least 8 characters' })
})

export const action: ActionFunction = async ({request}) => {
  const form = await request.formData()

  const key = form.get('key')
  const password = form.get('password')

  if((typeof key === 'string' && key.length >= 3) && 
  (typeof password === 'string' && password.length >= 8))
    return await login({key, password})
  else{
    const errors = signInSchema.parse({key, password})
    return json({errors}, {status: 400})
  }
}

export default function() {
  const { formData, errors, handleInputChange, validateForm } = useForm({
    schema: signInSchema,
    initialValues: {
      key: '',
      password: '',
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
        htmlFor="key"
        label="Username/Email"
        value={formData.key}
        onChange={(event) => handleInputChange({event, field: 'key'})}
        error={errors.key}
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
        <Button type="submit" value={'_signIn'} name="button">Login</Button>
      </div>
    </Form>
  ) 
}