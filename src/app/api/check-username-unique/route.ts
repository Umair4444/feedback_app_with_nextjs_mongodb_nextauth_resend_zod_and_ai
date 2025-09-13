// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/lib/model/UserModel";
// import { z } from "zod";
// import { usernameValidation } from "@/lib/Schemas/signUpSchema";
// import { NextRequest, NextResponse } from "next/server";
// export const dynamic = "force-dynamic";

// const usernameQuerySchema = z.object({
//   username: usernameValidation,
// });

// export async function GET(request: NextRequest) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(request.url);
//     const queryParams = {
//       username: searchParams.get("username"),
//     };

//     // validate with zod safeParse check if query follows zod usernameQuerySchema or not
//     const result = usernameQuerySchema.safeParse(queryParams);

//     // check result
//     // console.log("result >>> ", result);

//     if (!result.success) {
//       const usernameErrors = result.error.format().username?._errors || [];
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             usernameErrors.length > 0
//               ? usernameErrors?.join(",")
//               : "Invalid Valid Parameter",
//         },
//         { status: 400 }
//       );
//     }

//     const { username } = result.data;

//     const existingVerifiedUser = await UserModel.findOne({
//       username,
//       isVerified: true,
//     });

//     if (existingVerifiedUser) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Username already taken",
//         },
//         { status: 400 }
//       );
//     }

//     // If username is available
//     return NextResponse.json(
//       { success: true, message: "Username is available" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error checking username", error);
//     return NextResponse.json(
//       {
//         message: "Error checking username",
//         success: false,
//       },
//       { status: 500 }
//     );
//   }
// }

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/model/UserModel";
import { z } from "zod";
import { usernameValidation } from "@/lib/Schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Force runtime rendering

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // ✅ Use request.nextUrl instead of new URL(request.url)
    const username = request.nextUrl.searchParams.get("username");

    const result = usernameQuerySchema.safeParse({ username });

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "Invalid username parameter",
        },
        { status: 400 }
      );
    }

    const existingVerifiedUser = await UserModel.findOne({
      username: result.data.username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return NextResponse.json(
      { message: "Error checking username", success: false },
      { status: 500 }
    );
  }
}
