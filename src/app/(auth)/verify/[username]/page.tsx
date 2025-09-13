"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/lib/Schemas/verifySchema";
import { ApiResponse } from "@/lib/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error during verification:", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        "There was a problem. Please try again.";

      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gradient-to-r from-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl shadow-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Verify Your Account
          </h1>
          <p className="mt-2 text-white/80 text-sm md:text-base">
            Enter the verification code sent to your email
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Code Input */}
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Verification Code
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="123456"
                    className="bg-white/20 border-white/30 text-white placeholder-white/60 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-400"
                  />
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 hover:from-teal-300 hover:via-indigo-400 hover:to-purple-400 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
