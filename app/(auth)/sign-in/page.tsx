"use client"
// Creating form for handling uaer sign-in feature

import React, { useState } from 'react'
import { checkUserName } from "@/Schemas/signUpSchema"
import Link from 'next/link'
import axios from 'axios'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Toaster } from "@/components/ui/toaster"
import * as z from "zod"
 
import { useDebounceValue } from "usehooks-ts" //this library is used here to to throtting/debouncing of the value -> A Custom hook that returns a debounced version of the provided value, along with a function to update it.
 
const formSchema = z.object({
  username: checkUserName
})

export default function page() {
  const [username,setUsername] = useState(' ') // this state -> to handle Username send by user
  const [usernameMessage, setUsernameMessage] = useState(' ') //  this state for handling response from backecnd  when we pass it
  const [isCheckingUsername, setIsCheckingUsername] = useState(false) // loading state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouncedValue = useDebounceValue(username, 300) 

  return (
    <div>hello this is sign-in form handle page </div>
  )
}


