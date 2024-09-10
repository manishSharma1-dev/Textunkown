"use client"

import React,{ useCallback, useEffect, useState } from 'react'
import { Message } from '@/models/user.model'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { checkAcceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { ApiResponse } from '@/types/Apiresponse'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw } from 'lucide-react'
import { MessageCard } from '@/components/MessageCard'


export default function page() {
    const [ messages, setMessages ] = useState<Message[]>([])
    const [isloading,setIsLoading] = useState(false)
    const [isswitchLoading,setIsSwitchLoading] = useState(false)
    const { toast } = useToast()

    const handelDeleteMessages = (messageId : string ) => {
         setMessages(messages.filter((message) => message._id !== messageId))
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

    const Handle_Switch_Change_Between_Accept_OrDecline_Message  = async() => {
     
      try {

        setIsSwitchLoading(false)

        const response  = await axios.post<ApiResponse>('/api/accept-message',{
          acceptMessages : !acceptMessages
        })

        setValue('acceptMessages',!acceptMessages)

        toast({
          title : "Success",
          description : "Access granted"
        })
  
      } catch (error) {

        toast({
          title : "Switching Failed",
          description : `An Error Occured while access to the switch ${error}`,
          variant : 'destructive'
        })

        throw new Error('An Error Occured while Switched between access')
      } finally { 
        setIsSwitchLoading(false)
      }

    }


    if(!session || !session.user){
      return <div>login first Pls</div>
    }

    const { username } = session.user
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copytoClipBoard = () => {
      navigator.clipboard.writeText(profileUrl)
      toast({
        title : "Success",
        description : "Copied Successfully"
      })
    }


  return (
    <div>
      <h1>User DashBoard</h1>
      <p>Copy your Profile url</p>

      <div>
        <input type='text' value={profileUrl} />
        <Button onClick={copytoClipBoard}>Copy</Button>
      </div>

      <Switch 
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={Handle_Switch_Change_Between_Accept_OrDecline_Message}
        disabled={isswitchLoading}
      />
      <span>Accept Messageg: {acceptMessages?'On':'Off'}</span>

      <Separator />

      <Button
        variant={'outline'}
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true)
        }}
      >{
        isloading? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <RefreshCcw className='h-4 w-4' />
        )
      }</Button>


      <div>

       {messages.length > 0 ? (
        messages.map((message,index) => (
          <MessageCard 
            key={index}
            message={message}
            onMessageDelete={handelDeleteMessages}
          />
        ))
       ) : (
         <p>No message to display</p>
       )}

      </div>

    </div>
  )
}