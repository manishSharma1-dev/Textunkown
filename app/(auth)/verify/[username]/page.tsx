"use client"

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { checkVerifySchema } from "@/Schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button";


export async function page(){
    const { toast } = useToast()
    const params = useParams<{username : string}>()
    const router = useRouter()

    const form = useForm<z.infer<typeof checkVerifySchema>>({
        resolver : zodResolver(checkVerifySchema)
    })

    const onSubmit =async (data: z.infer<typeof checkVerifySchema>) => {
        try {
            const response = await axios.post(`/api/verifyCode`,{
                username : params.username,
                code : data.code
            })
    
            if(!response){
                throw new Error("data didn't pass to the verifyCode route")
            }
    
            const result = await response.data.message
    
            toast({
                title : "Success",
                description : result
            })
    
            router.replace('/sign-in')
        } catch (error) {
            console.error("Otp Verification Failed",error)
            toast({
                title : "Signup failed",
                description : "failed tp verify Otp"
            })
        }
    }

    return(
        <div>
            <h1>Verify Your Account</h1>
            <p>Enter the Verification code</p>
            
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField 
            control={form.control}
            name="code"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                    <Input placeholder="Verification Code" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit" className="mr-5 p-5">Submit</Button>

            </form>
         </Form>
        </div>
    )
    
}