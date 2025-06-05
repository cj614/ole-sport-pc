import CONFIG from "@/config/config"

let LOTTIE_LIST = {
  Live: {
    Card: "/lottie/live/card/data.json",
    Head: "/lottie/live/head/data.json",
    Line: "/lottie/live/line/data.json",
    Chat: "/lottie/live/chat/data.json",
  },
}

function replaceLottieUrl() {
  for (let item in LOTTIE_LIST) {
    for (let image1 in LOTTIE_LIST[item]) {
      if (LOTTIE_LIST[item][image1] instanceof Object) {
        for (let image2 in LOTTIE_LIST[item][image1]) {
          if (LOTTIE_LIST[item][image1][image2] instanceof Object) {
            for (let image3 in LOTTIE_LIST[item][image1][image2]) {
              LOTTIE_LIST[item][image1][image2][image3] = `${CONFIG.LOTTIE_PREFIX_URL[CONFIG.ENV]
                }${LOTTIE_LIST[item][image1][image2][image3]}`
            }
          } else {
            LOTTIE_LIST[item][image1][image2] = `${CONFIG.LOTTIE_PREFIX_URL[CONFIG.ENV]
              }${LOTTIE_LIST[item][image1][image2]}`
          }
        }
      } else {
        LOTTIE_LIST[item][image1] = `${CONFIG.LOTTIE_PREFIX_URL[CONFIG.ENV]}${LOTTIE_LIST[item][image1]
          }`
      }
    }
  }
}

replaceLottieUrl(LOTTIE_LIST)

export default LOTTIE_LIST
