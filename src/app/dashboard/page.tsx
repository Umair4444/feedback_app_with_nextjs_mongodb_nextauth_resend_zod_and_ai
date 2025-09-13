"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/lib/model/UserModel";
import { ApiResponse } from "@/lib/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Link } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptingMessageSchema } from "@/lib/Schemas/acceptingMeassageSchema";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptingMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptingMessage");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptingMessage", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptingMessage", !acceptMessages);
      toast({ title: response.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="text-center py-10">
        <DashboardSkeleton />
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-8 text-gray-800">User Dashboard</h1>

      {/* PROFILE LINK CARD */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Link className="w-5 h-5 text-indigo-500" /> Your Unique Link
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full rounded-md border border-gray-300 p-2 bg-gray-50 text-gray-700"
          />
          <Button onClick={copyToClipboard} className="shrink-0">
            Copy
          </Button>
        </div>
      </div>

      {/* SWITCH */}
      <div className="bg-white w-fit rounded-xl shadow-md p-5 mb-6 border border-gray-100 flex gap-4 items-center justify-between">
        <span className="font-medium text-gray-700">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
        <Switch
          {...register("acceptingMessage")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
      </div>

      <Separator className="mb-6" />

      {/* REFRESH BUTTON */}
      <div className="flex justify-end mb-4">
        <Button
          size="icon"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* MESSAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No messages to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
