"use client"
// Creating form for handling uaer sign-up feature

import React, { useState } from 'react'
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from 'next/navigation'
import { useDebounceValue } from "usehooks-ts" //this library is used here to to throtting/debouncing of the value -> A Custom hook that returns a debounced version of the provided value, along with a function to update it.
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from "lucide-react"
import { checkSignInSchema } from '@/Schemas/signInSchema'
import { signIn } from 'next-auth/react'


export default function page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const  router  = useRouter()

// this is an instance of usefomr hook 
  const form = useForm<z.infer<typeof checkSignInSchema>>({
    resolver : zodResolver(checkSignInSchema),
    defaultValues : {
      email : '',
      password: ''
    }
  })
  

  const onSubmit= async( data: z.infer<typeof checkSignInSchema > ) => {
    await signIn('credentials',{
      redirect : false,
      identifiers : data.identifiers,
      password : data.password
    })
  }


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField 
           control={form.control}
           name="identifiers"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Email</FormLabel>
               <FormControl>
                 <Input type='email' placeholder="Email" {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />

        <FormField 
           control={form.control}
           name="password"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Password</FormLabel>
               <FormControl>
                 <Input type='password' placeholder="Username" {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />

         <Button type='submit'>
            signIn
         </Button>
         
        </form>
      </Form>
    </div>
  )
}


