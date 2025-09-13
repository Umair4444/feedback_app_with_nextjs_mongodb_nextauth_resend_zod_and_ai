"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/lib/Schemas/signInSchema";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    setIsLoading(false);

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center pt-10 pb-36 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 px-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl shadow-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-teal-500 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-white/80">
            Sign in to continue your secret conversations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Identifier */}
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Email / Username
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="Enter your email or username"
                    className="bg-white/20 border-white/30 text-white placeholder-white/60 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-400"
                  />
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
              className="w-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 hover:from-teal-300 hover:via-indigo-400 hover:to-purple-400 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-white/80">
          Not a member yet?{" "}
          <Link
            href="/sign-up"
            className="text-yellow-200 hover:text-yellow-400"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
