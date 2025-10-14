/**
 * @function setResponse
 * @description Creates a standardized API response with an auto-formatted duration (ms, s, min, hr).
 * Detects and formats time intelligently based on total duration.
 *
 * @param {boolean} success - Indicates success or failure
 * @param {string} msg - Message to return
 * @param {any} data - Payload data (optional)
 * @param {number} [durationMs=0] - Duration in milliseconds
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {object} Standardized API response object
 * @author Ritik Parmar
 * @date 09 Oct 2025
 */
export function setResponse(
  success: boolean,
  msg: string,
  data: any = null,
  durationMs: number = 0,
  statusCode: number = 200,
) {
  // 🧠 Smart duration formatter
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`; // under 1 sec
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(2)}s`; // under 1 minute
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`; // under 1 hour
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`; // beyond 1 hour
  };

  return {
    status: success ? 'success' : 'fail',
    msg,
    data,
    statusCode,
    timestamp: new Date().toISOString(),
    duration: formatDuration(durationMs), // ✅ e.g. "950ms", "1.69s", "3m 12.50s", "1h 5m 2.15s"
  };
}
