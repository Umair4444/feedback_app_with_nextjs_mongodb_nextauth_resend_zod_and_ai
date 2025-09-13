// import { google } from "@ai-sdk/google";
// import { generateText } from "ai";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const message =
//     "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//   const { text } = await generateText({
//     model: google("gemini-2.5-flash"),
//     prompt: message,
//   });
//   console.log("text response \n", text);

//   return NextResponse.json({ response: text });
// }

import { google } from "@ai-sdk/google";
import { streamText, StreamTextResult } from "ai";
import { NextRequest } from "next/server";

export const runtime = "edge";
const message =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

export async function POST(req: NextRequest) {
  const { textStream } = streamText({
    model: google("gemini-2.5-flash"),
    prompt: message,
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const textPart of textStream) {
          controller.enqueue(encoder.encode(textPart)); // send chunk to client
          console.log(textPart);
        }
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
