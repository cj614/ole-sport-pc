// import { set, toggle, storage } from "@/store/vuex";
import { storageSave } from "@/libs/util"

export default {
  setUserInfo: (state, obj) => {
    state.userInfo = obj
    storageSave("userInfo", obj)
  },
}
