import { CHANGE_DIRECTORY } from "./types";

export const changeDirectory = (id) => {
  return {
    type: CHANGE_DIRECTORY,
    payload: id,
  };
};
