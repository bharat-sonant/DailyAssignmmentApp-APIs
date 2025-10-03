import { getCityDetailsJson } from "../../../services/CommonService";

/**
 * @returns {Promise<Response>} JSON response containing the list of cities or an error message
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description 
 * This API fetches the list of cities available for login from Firebase Storage 
 * by calling the `getCityDetailsJson` service. 
 * 
 * Success → Returns city list with IDs, names, and connection details.  
 * Failure → Returns status "fail" with message "City list unavailable."
 */
export async function GET() {
    try {
        const res = await getCityDetailsJson();   // your common function
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                status: "fail",
                message: "City list unavailable.",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
