"use client";

import { z } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/lib/Schemas/signUpSchema";
import { ApiResponse } from "@/lib/types/ApiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking Username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUniqueness();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "There was a problem with your sign-up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10 pb-8 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 px-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl shadow-lg bg-gradient-to-tr from-teal-500 via-indigo-500 to-purple-500 text-white">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Join Our Community
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Sign up to start your anonymous adventure
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                    placeholder="Enter your username"
                    className="bg-white/20 border-white/30 text-white placeholder-white/60 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-400"
                  />
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin text-white mt-1" />
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm font-medium ${
                        usernameMessage === "Username is available"
                          ? "w-fit px-3 py-1 rounded-lg text-white bg-green-600"
                          : "w-fit px-3 py-1 rounded-lg text-white bg-red-600"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    className="bg-white/20 border-white/30 text-white placeholder-white/60 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-400"
                  />
                  <p className="text-xs text-white/60">
                    We will send you a verification code
                  </p>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    placeholder="••••••••"
                    className="bg-white/20 border-white/30 text-white placeholder-white/60 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-400"
                  />
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 hover:from-teal-300 hover:via-indigo-400 hover:to-purple-400 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-white/80">
          Already a member?{" "}
          <Link
            href="/sign-in"
            className="text-yellow-200 hover:text-yellow-400 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
