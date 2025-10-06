import { NextResponse } from "next/server";
import { initFirebase } from "../../../services/firebaseClient";


/**
 * 🔹 Default Firebase (DevTest) configuration — used at startup
 */
const defaultFirebaseConfig = {
  cityName: "DevTest",
  city: "devtest",
  key: "MNZ",
  dbPath: "https://devtest-62768-default-rtdb.firebaseio.com/",
  storagePath: "gs://devtest-62768.firebasestorage.app/DevTest",
  empCode: "DEV",
  firebaseStoragePath:
    "https://firebasestorage.googleapis.com/v0/b/devtest-62768.firebasestorage.app/o/",
  apiKey: "AIzaSyBNHi7UP5nwqLnFU2tuKpArS1MhZDYsiLM",
  appId: "1:799504409644:android:8ce294ed91867118cedd89",
  authDomain: "devtest-62768.firebaseapp.com",
  databaseURL: "https://devtest-62768-default-rtdb.firebaseio.com",
  projectId: "devtest-62768",
  storageBucket: "devtest-62768.firebasestorage.app",
  messagingSenderId: "799504409644",
  databaseName: "devtest-62768-default-rtdb",
};

/**
 * @function POST /api/Common/Connect-Database
 * @param {Request} req - Firebase connection config (optional)
 * @returns {Promise<Response>} Connection status JSON
 * @author Ritik Parmar
 * @date 06 Oct 2025
 * @description
 * Initializes Firebase dynamically with provided or default configuration.
 * If no body or incomplete config is sent, default DevTest configuration is used.
 */
export async function POST(req) {
  try {
    let connectObj = {};

    // 🧩 Safely parse JSON body
    try {
      connectObj = await req.json();
    } catch {
      connectObj = {};
    }

    // ✅ Merge default config (to fill missing fields)
    const finalConfig = { ...defaultFirebaseConfig, ...connectObj };

    // ✅ Initialize Firebase
    const db = initFirebase(finalConfig);

    if (db) {
      return NextResponse.json(
        {
          status: "success",
          msg: `Connected to ${finalConfig.databaseURL}`,
          city: finalConfig.cityName || finalConfig.projectId,
        },
        { status: 200 }
      );
    }

    // ❌ Fallback — no DB returned
    return NextResponse.json(
      { status: "fail", msg: "Could not connect to Firebase Database." },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "fail",
        msg:
          error?.message ||
          "Unexpected server error while connecting to Firebase.",
      },
      { status: 500 }
    );
  }
}
