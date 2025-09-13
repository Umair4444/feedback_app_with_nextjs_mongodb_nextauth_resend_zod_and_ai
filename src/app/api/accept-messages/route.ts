import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/model/UserModel";

export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Not Authenticated user",
        success: false,
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: "Failed to update user status with acceptance",
          success: false,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message Acceptance Updated Successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return NextResponse.json(
      {
        message: "Failed to update user status to accept messages",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        message: "Not Authenticated user",
        success: false,
      },
      { status: 401 }
    );
  }
  const UserId = user._id;

  const foundUser = await UserModel.findById(UserId);

  try {
    if (!foundUser) {
      return NextResponse.json(
        {
          message: "User Not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User found Successfully",
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user acceptance message");
    return NextResponse.json(
      {
        success: false,
        message: "Error in getting message Acceptance",
      },
      { status: 500 }
    );
  }
}
