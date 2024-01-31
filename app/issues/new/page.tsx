"use client"

import { Button, Callout, CalloutText, Text, TextField, TextFieldInput } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import {useForm, Controller, set} from 'react-hook-form'
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/ValidationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';

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
              await axios.post('api/issues',data)
              router.push('/issues')
            } catch (error) {
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
          <Button>Submit New Issue</Button>
      </form>
    </div>
  )
}

export default NewIssuePage