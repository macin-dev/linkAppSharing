import { logosArr } from "../data/data.js";

export const getLinkDataById = (id) => {
  return logosArr.filter((link) => link.uuid === id).at(0);
};
