import { storageRead } from "@/libs/util";
export default {
  userInfo:
    storageRead("userInfo") ||
    JSON.stringify({
      token: "",
      user: {},
    }),
};
