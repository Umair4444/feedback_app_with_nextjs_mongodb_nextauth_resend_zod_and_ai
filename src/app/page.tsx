"use client";

import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-5 lg:px-18 py-12">
        {/* Hero Section */}
        <section className="text-center mb-8 md:mb-12 max-w-5xl px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg text-white mx-auto">
            Step Into a World of Honest,
            <span className="text-pink-200"> Anonymous Feedback</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-100 opacity-90 max-w-2xl mx-auto">
            Share your thoughts freely — No names, no judgments, just the truth.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-lg md:max-w-2xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:scale-[1.02] transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="text-white text-lg font-semibold">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="p-3 bg-pink-500 rounded-full shadow-md">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/90">{message.content}</p>
                      <p className="text-xs text-white/70 mt-1">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-4">
            <CarouselPrevious className="bg-white/20 hover:bg-white/30 text-white" />
            <CarouselNext className="bg-white/20 hover:bg-white/30 text-white" />
          </div>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-black/30 text-white text-sm">
        © {new Date().getFullYear()} True Feedback. All rights reserved.
      </footer>
    </div>
  );
}
