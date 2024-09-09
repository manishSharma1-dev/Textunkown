"use client"
// Creating form for handling uaer sign-up feature

import React, { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from 'next/navigation'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { checkSignInSchema } from '@/Schemas/signInSchema'
import { signIn } from 'next-auth/react'


export default function page() {
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
    const result = await signIn('credentials',{
      redirect : false,
      identifiers : data.identifiers,
      password : data.password
    })

    if(result?.error){

      toast({
        title : "sign-in Failed",
        description : result?.error
      })

      throw new Error("Failed to sign-in User")
    }

    toast({
      title : "success",
      description : result?.url
    })

    router.replace('/dashboard')

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


