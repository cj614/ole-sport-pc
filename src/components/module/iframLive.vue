<template>
  <div class="m_live_iframe_warp" ref="liveIframe">
    <template v-if="!url">
      <v-progress-circular indeterminate color="#1862C8" loading></v-progress-circular>
    </template>
    <template v-else>
      <iframe  allowfullscreen    :src="url"></iframe>
    </template>
    <div class="danmku_box transparent-div">
      <module-danmaku   ref="danmakuRef"  :danmakuList="danmakuList"></module-danmaku>
    </div>
  </div>
</template>

<script>
import {
  handleToggleScreenDirection,
  handleSafeZoneColor
} from '@/libs/util.js'
export default {
  props: {
    danmakuList: {
      type: Array,
      default: () => {
        return []
      }
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow:true,
      screenDirection: 'portrait',
      isApp: false,
      fullScreenSw: false
    }
  },
  methods: {
    mouseover(e){
      console.log("123",e)
    },
    insert(danmu) {
      this.$refs.danmakuRef.insert(danmu)
    },
    setDanmus() {
      this.$refs.danmakuRef.setDanmus()
    },
    show() {
      this.$refs.danmakuRef.show()
    },
    hide() {
      this.$refs.danmakuRef.hide()
    },
    resize() {
      this.$refs.danmakuRef.resize()
    },
    // 进入全屏
    requestFullScreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },

    // 退出全屏
    exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },

    handleToggleScreenDirection() {
      if (window.handleToggleScreenDirection) {
        this.exitFullScreen()
      } else {
        this.requestFullScreen(this.$refs.liveIframe)
      }
      this.$emit('setScreenDirection', this.screenDirection)
      this.fullScreenSw = !this.fullScreenSw
      setTimeout(() => {
        this.resize()
      }, 200)
    },
    setIframe() {
      window.addEventListener(
        'message',
        event => {
          let { url } = this
          if (url) {
            let arr = url.split('.com')
            if (arr.length) {
              url = `${arr[0]}.com`
            }
          }
          if (event.origin === url) {
            let { type } = event.data
            if (type === 'full_screen_click') {
              this.handleToggleScreenDirection()
            }
          }
        },
        false
      )
    }
  },
  destroyed() {
    window.removeEventListener('message', null)
  },
  mounted() {
    this.setIframe()
  }
}
</script>

<style lang="scss" scoped>

.transparent-div {
  pointer-events: none;
}
.m_live_iframe_warp {
  @apply flex justify-center items-center bg-dark w-full h-full relative;
  iframe {
    width: 100% !important;
    height: 100% !important;
    @apply border-none;
  }
  .danmku_box {
    top: 50px;
    @apply absolute z-50 w-full h-200px left-0;
  }
}
</style>