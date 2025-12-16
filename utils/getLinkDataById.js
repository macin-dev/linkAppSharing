import { logosArr } from "../js/data.js";

export const getLinkDataById = (id) => {
  return logosArr.filter((link) => link.uuid === id).at(0);
};
