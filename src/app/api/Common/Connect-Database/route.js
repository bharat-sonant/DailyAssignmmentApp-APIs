import { NextResponse } from "next/server";
import { initFirebase } from "../../../services/firebaseClient";

/**
 * @param {Request} req - Next.js API request containing Firebase connection config in body
 * @returns {Promise<Response>} JSON response with connection status and selected city/project
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description 
 * This API initializes a Firebase Realtime Database connection dynamically 
 * based on the provided configuration object (`connectObj`). 
 * It validates that the `databaseURL` is present, initializes Firebase 
 * using `initFirebase`, and sets the active DB connection.
 * 
 * Success → Returns status "success" with connected DB URL and city/project name.  
 * Failure → Returns status "fail" with error message.
 */
export async function POST(req) {
  try {
    const connectObj = await req.json();


    if (!connectObj?.databaseURL) {
      return NextResponse.json(
        { status: "fail", msg: "Invalid config" },
        { status: 400 }
      );
    }

    const db = initFirebase(connectObj);
  
    if (db) {
      return NextResponse.json({
        status: "success",
        msg: `Connected to ${connectObj.databaseURL}`,
        city: connectObj.city || connectObj.projectId,
      });
    }

    return NextResponse.json(
      { status: "fail", msg: "Could not connect to DB" },
      { status: 500 }
    );
  } catch (error) {
    console.log("❌ Connect-Database error:", error);
    return NextResponse.json(
      { status: "fail", msg: error.message },
      { status: 500 }
    );
  }
}
