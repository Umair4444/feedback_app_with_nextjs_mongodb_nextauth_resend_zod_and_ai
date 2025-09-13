import UserModel from "@/lib/model/UserModel";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/lib/model/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        {
          message: "User Bot found",
          success: false,
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          message: "User is not accepting Messages",
          success: false,
        },
        { status: 403 }
      );
    }

    const newMessages = { content, createdAt: new Date() };
    user.message.push(newMessages as Message);
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Message Send Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    {
      console.error("Error adding messages:", error);
      return NextResponse.json(
        { message: "Internal server error", success: false },
        { status: 500 }
      );
    }
  }
}
