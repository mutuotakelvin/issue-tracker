"use client"

import { Button, Callout, CalloutText, Text, TextField, TextFieldInput } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import {useForm, Controller, set} from 'react-hook-form'
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/ValidationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { useRouter } from 'next/navigation';

const IssueForm =  z.infer<typeof createIssueSchema>

interface IssueForm {
  title: string,
  description: string
}


const NewIssuePage = () => {
  const router = useRouter()
  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema)
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmiting] = useState(false)

  return (
    <div className=''>
      { 
        error &&
        <Callout.Root color='red' className='mb-5'>
          <CalloutText>{error}</CalloutText>
        </Callout.Root>
      }
      <form className='space-y-3'
          onSubmit={handleSubmit(async(data) => {
            try {
              setIsSubmiting(true)
              await axios.post('/api/issues',data)
              router.push('/issues')
            } catch (error) {
              setIsSubmiting(false)
              setError('Unexpetected error occured')
            }
          })}>
          <TextField.Root >
              <TextFieldInput placeholder='Title' {...register('title')}/>
          </TextField.Root>
          <ErrorMessage> {errors.title?.message}</ErrorMessage>
          <Controller 
            name="description"
            control={control}
            render={({field}) => (
            <SimpleMDE placeholder='Description' {...field} />
            )}
          />
          <ErrorMessage> {errors.description?.message}</ErrorMessage>
          <Button disabled={isSubmitting}>Submit New Issue { isSubmitting && <Spinner />}</Button>
      </form>
    </div>
  )
}

export default NewIssuePage