import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "src/config/firebase-active.json");

/**
 * Save the latest Firebase connection config persistently (to file).
 * @param {object} config
 */
export function saveFirebaseConfig(config) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
  } catch (error) {
    console.log("❌ Failed to save Firebase config:", error);
  }
}

/**
 * Read the last saved Firebase connection config (from file).
 * @returns {object|null}
 */
export function loadFirebaseConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf8");
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.log("❌ Failed to load Firebase config:", error);
    return null;
  }
}
