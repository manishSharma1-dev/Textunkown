import { EmailTemplate } from '@/email/email-template';
import { resend } from '@/lib/ResendConnection';
import { ApiResponse } from '@/types/Apiresponse';

export async function SendVerificationEmail(
    email : string,
    username: string,
    verificationCode : string
): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from : "onboarding@resend.dev",
            to : email,
            subject : "Verification email",
            react : EmailTemplate({ username , verificationCode })
        })
        
        return { success : true , message : "Verification Code sent Successfully"}
        
    } catch (error) {
        console.error("Error Sending Verification emasil",error)
        return { success : false, message : "failed to send verification email"}
    }

}