"use client"
// Creating form for handling uaer sign-up feature

import React, { useEffect, useState } from 'react'
import { checkSignUpSchema } from "@/Schemas/signUpSchema"
import Link from 'next/link'
import axios from 'axios'
import { useToast } from "@/components/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from 'next/navigation'
import { useDebounceValue } from "usehooks-ts" //this library is used here to to throtting/debouncing of the value -> A Custom hook that returns a debounced version of the provided value, along with a function to update it.
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from "lucide-react"


export default function page() {
  const [username,setUsername] = useState(' ') // this state -> to handle Username send by user
  const [usernameMessage, setUsernameMessage] = useState(' ') //  this state for handling response from backecnd  when we pass it
  const [isCheckingUsername, setIsCheckingUsername] = useState(false) // loading state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouncedValue = useDebounceValue(username, 300) 
  const { toast } = useToast()
  const  router  = useRouter()

// this is an instance of usefomr hook 
  const form = useForm({
    resolver : zodResolver(checkSignUpSchema),
    defaultValues : {
      username : '',
      email : '',
      password: ''
    }
  })

  // this block of code check if the userneme is valid or not
  useEffect(() => {

    const checkUserName = async() => {
      if(debouncedValue){
        
        setIsCheckingUsername(true)
        setUsernameMessage(' ')

        try {
         const response = await axios.get(`/api/unique-username?username=${debouncedValue}`)

         if(!response){
           return Response.json(
              {
                success: false,
                message : "Username is not unique"
              },
              {
                status : 400
              }
           )

         }

         const result = response.data.message
         setUsername(result)
          
        } catch (error) {
          console.error("An Error Occured while checking for the username") 
          
          return Response.json(
              {
                success : true,
                message : "An Error Occured while checking for the username"
              },
              {
                status :  500
              }
          )
        }

        finally {
          setIsCheckingUsername(false)
        }
      }
    }

    checkUserName() 

  },[debouncedValue])

  const onSubmit= async( data: z.infer<typeof checkSignUpSchema > ) => {
    setIsSubmitting(true)
    try {

      const response = await axios.post(`/api/signup`,data)

      if(!response){
        return Response.json(
           {
             success: false,
             message : "Sending data to the backend fail"
           },
           {
             status : 400
           }
        )
      }

    const result = response.data.message

    toast({
      title : 'success',
      description : 'message sent Successfully'
    })

    router.replace(`/verifyCode/${username}`)

    return Response.json(
      {
        success: true,
        message : "Data send Successfully",
        result
      },
      {
        status : 200
      }
    )

    } catch (error) {

      console.error("Error in Sign-up",error)

      toast({
         title : "sign-up failed",
         description : `Error in Sign-up ${error}`,
         variant : 'destructive'
      })

      return Response.json(
        {
          success: false,
          message : "Error in Sign-up"
        },
        {
          status : 500
        }
      )
      
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField 
           control={form.control}
           name="username"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Username</FormLabel>
               <FormControl>
                 <Input placeholder="Username" {...field} 
                 onChange={(e) => {
                  field.onChange(e)
                  setUsername(e.target.value)
                 }}/>
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />

        <FormField 
           control={form.control}
           name="email"
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

         <Button type='submit' disabled={isSubmitting} >
            {
              isSubmitting? (
                <>
                  <Loader2 className='mr-5 w-4 h-4 animate-spin' /> PLease wait 
                </>
              ) : ("sign-up")
            }
         </Button>
         
        </form>
      </Form>

      <div className='text-center mt-4'>
        <p>
          Already a member?<Link href={'/api/sign-in'} className='bg-blue-600 hover:text-blue-800'></Link>
        </p>
      </div>
    </div>
  )
}


