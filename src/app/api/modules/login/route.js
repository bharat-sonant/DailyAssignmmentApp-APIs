import { NextResponse } from "next/server";
import * as service from '../../../services/login/loginService';


/**
 * @param {Request} req - Next.js API request object containing username, password in body
 * @returns {Promise<Response>} JSON response with user details or error
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description 
 * This API checks user login credentials against the storage JSON file 
 * for the given city. It validates username, password, and user status.
 * If valid, returns user `id` and `name`; otherwise returns an error message.
 */
export async function POST(req) {
    try {
        const { username, password } = await req.json();

        const result = await service.getUserLogin(username, password);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { status: "fail", msg: error.message, service: "loginAPI" },
            { status: 500 }
        );
    }
}

