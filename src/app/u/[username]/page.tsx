"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/lib/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/lib/Schemas/messageSchema";

const specialChar = "||";
const parseStringMessages = (messageString: string) =>
  messageString.split(specialChar);

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const { username } = useParams<{ username: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [messages, setMessages] = useState(initialMessageString);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", {
        ...data,
        username,
      });
      toast({ title: response.data.message });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const res = await fetch("/api/suggest-messages", { method: "POST" });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        text += decoder.decode(value);
        setMessages(text); // streaming effect
      }
    } catch (err) {
      setError("Failed to load suggestions");
      console.error(err);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-2 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Public Profile Link
      </h1>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600 font-medium">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here..."
                    className="resize-none rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 transition-all shadow-sm"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading || !messageContent}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105 transition-transform"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Sending..." : "Send It"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Suggestions */}
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 transition-transform"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" /> Suggesting...
              </span>
            ) : (
              " Suggest Messages"
            )}
          </Button>
          <p className="text-gray-500 text-sm">
            Click on any message below to select it.
          </p>
        </div>

        <Card className="bg-white/70 backdrop-blur-md shadow-md border-none">
          <CardHeader>
            <h3 className="text-lg sm:text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              parseStringMessages(messages).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="rounded-full text-wrap  px-4 py-6 hover:bg-purple-50 transition-colors"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* Call to Action */}
      <div className="text-center">
        <div className="mb-4 text-gray-500">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button className="rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-105 transition-transform">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
