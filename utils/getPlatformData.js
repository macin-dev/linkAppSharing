// Get platform name's data
export function getPlatformData(arr = [], name) {
  return arr.filter((obj) => obj.value === name).at(0);
}
