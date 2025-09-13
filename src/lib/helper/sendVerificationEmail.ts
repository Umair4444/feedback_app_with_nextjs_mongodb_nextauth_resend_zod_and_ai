import { resend } from "@/lib/resend";
import VerificationEmail from "../emails/VerificationEmail";
import { ApiResponse } from "@/lib/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      // change from value to your email if using personal domain currently using resend default email
      from: "onboarding@resend.dev",
      to: email,
      subject: "Feedback App | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email send Successfully",
    };
  } catch (emailError) {
    console.error("error sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
