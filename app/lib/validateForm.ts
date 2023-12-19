import type { ChangeEvent} from "react";
import type { ZodObject } from "zod";
import { useState } from "react";
import { ZodError } from "zod";

interface FormProps<T> {
  initialValues: T;
  schema: ZodObject<any, any, any, T>;
}

type FormErrors<T> = {
  [k in keyof T]?: string
}

const useForm = <T>({initialValues, schema}: FormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({} as FormErrors<T>);

  const validateField = ({field, value}: {field: keyof T, value: any}) => {
    try {
      const pickObject = { [field]: true } as Record<keyof T, true | undefined>;
      schema.pick(pickObject).parse({ [field]: value });
      setErrors((prevErrors) => ({...prevErrors, [field as string]: ""}))
    } catch (error) { 
      const fieldError = (error as ZodError).errors[0]?.message;
      setErrors((prevErrors) => ({...prevErrors, [field as string]: fieldError || ""}))
    }
  };

  const handleInputChange = ({event, field}: {event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: keyof T}) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    validateField({field, value})
  };

  const validateForm = () => {
    try {
      schema.parse(formData);
      setErrors({} as FormErrors<T>);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails: FormErrors<T> = {} as FormErrors<T>;
        error.errors.forEach((err) => {
          if (err.path) {
            errorDetails[err.path.join(".") as keyof T] = err.message;
          }
        });
        setErrors(errorDetails);
      }
      return false;
    }
  };

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
  };
};

export default useForm;
