import React,{ useCallback, useEffect, useState } from 'react'
import { Message } from '@/models/user.model'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { checkAcceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { ApiResponse } from '@/types/Apiresponse'


export default function page() {
    const [ Message, setMessages ] = useState<Message[]>([])
    const [isloading,setIsLoading] = useState(false)
    const [isswitchLoading,setIsSwitchLoading] = useState(false)
    const { toast } = useToast()

    const handelDeleteMessages = (messageId:string) => {
         setMessages(Message.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()

    const form = useForm({
        resolver : zodResolver(checkAcceptMessageSchema)
    })

    const { watch, setValue, register } = form

    const acceptMessages = watch('acceptMessages')
    
    const fetchAcceptMessages = useCallback( async() => {
        setIsSwitchLoading(true)

       try {

         const response = await axios.get('/api/accept-message')
 
         setValue('acceptMessages',response.data.isAcceptingMessages)
 
         setIsLoading(false)

       } catch (error) {

         toast({
          title : "access denied",
          description :`Access denied User don't accept messages ${error}`
         })

         throw new Error("User cannot Accerpt Message") 
       } finally { 
        setIsSwitchLoading(false)
       }

    },[setValue])

    const fetchAllMessages = useCallback( async(refresh?:boolean) => {
      setIsLoading(true)
      setIsSwitchLoading(true)
      try {

        const response = await axios.get<ApiResponse>('/api/get-message')

        if(refresh){

          toast({
            title : "Refereshed Messages",
            description : "Showing Latest messages"
          })

        }
  
        setMessages(response.data.messages || [] )

      } catch (error) {

        toast({
          title : "failed to get Messages",
          description : `failed to get Messages ${error}`
        })

      } finally { 
        setIsSwitchLoading(false)
        setIsLoading(false)
      }

    },[setIsLoading,setMessages])

    useEffect(() => {
      if(!session || !session.user) return
      fetchAcceptMessages()
      fetchAllMessages()
    }, [session,setValue,fetchAcceptMessages,fetchAllMessages])

  return (
    <div>
      
    </div>
  )
}
 