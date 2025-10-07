import { NextResponse } from "next/server";
import { getFirebaseApp } from "../../../services/firebaseClient";

/**
 * @route POST /api/Common/Connect-Database
 * @description Connects dynamically to a Firebase project based on `connectObj`.
 * Reuses Firebase apps across cities (no reinit) and stores in memory.
 * @author Ritik Parmar
 * @date 06 Oct 2025
 */
export async function POST(req) {
  try {
    const connectObj = await req.json();
    if (!connectObj?.databaseURL) {
      return NextResponse.json(
        { status: "fail", msg: "Missing Firebase connection details." },
        { status: 400 }
      );
    }

    const { db } = getFirebaseApp(connectObj);

    if (db) {
      return NextResponse.json(
        {
          status: "success",
          msg: `Connected to ${connectObj.cityName || connectObj.projectId}`,
          city: connectObj.cityName || connectObj.projectId,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: "fail", msg: "Database connection failed." },
      { status: 500 }
    );
  } catch (error) {
    console.log("❌ Connect-Database API Error:", error.message);
    return NextResponse.json(
      { status: "fail", msg: error.message || "Unexpected Firebase connection error." },
      { status: 500 }
    );
  }
}
