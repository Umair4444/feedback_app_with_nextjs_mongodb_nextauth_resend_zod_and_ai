import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/model/UserModel";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;
  // console.log(user);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Not Authenticated user",
        success: false,
      },
      { status: 401 }
    );
  }

  // for aggregation pipeline
  const UserId = new mongoose.Types.ObjectId(user._id);
  // console.log("Session user:", typeof session?.user._id); // string id
  // console.log("new mong:", typeof(new mongoose.Types.ObjectId(user._id))); // object id

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: UserId } },
      { $unwind: "$message" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$message" } } },
    ]).exec();

    // console.log("user", user);

    if (user.length == 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User have no message!",
        },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not found!",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
