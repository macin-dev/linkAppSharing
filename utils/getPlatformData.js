import { logosArr as arr } from "../data/data.js";

// Get platform name's data
export function getPlatformData(name) {
  return arr.filter((obj) => obj.value === name).at(0);
}
