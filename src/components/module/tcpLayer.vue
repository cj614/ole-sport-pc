<template>
  <div class="m_live_player_wrap">
    <div class="live_player_content">
      <v-progress-circular indeterminate color="#1862C8" v-if="!anchor.status" loading></v-progress-circular>
      <div
        v-else-if="anchor.status === 1"
        class="video"
        :class="{on_swiper:swiper}"
        v-html="videoHtml"
      ></div>
      <module-liveSwiper v-else-if="anchor.status === 2"></module-liveSwiper>
      <div class="danmku_box">
        <module-danmaku ref="danmakuRef" :danmakuList="danmakuList"></module-danmaku>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    danmu: {
      type: Boolean,
      default: true
    },

    danmakuList: {
      type: Array,
      default: () => {
        return []
      }
    },

    anchor: {
      type: Object,
      default: () => {
        return {}
      }
    },
    swiper: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      screenDirection: 'portrait',
      isApp: false,
      fullScreenSw: false,
      player: null,
      videoHtml: ''
    }
  },
  computed: {},

  watch: {
    anchor: {
      handler(val) {
        this.loadVideo(val)
      },
      immediate: true
    }
  },

  methods: {
    loadVideo(val) {
      if (Object.keys(val).length) {
        let { status } = this.anchor
        if (status === 1) {
          this.videoHtml = `<video
          id="player_tc"
          width="100%"
          height="100%"
          preload="auto"
          playsinline
          webkit-playsinline>
        </video>`
        }
        this.$nextTick(() => {
          if (status === 1) {
            this.initPlayer()
          }
        })
      }
    },
    initPlayer() {
      let { play_url_flv, license_url, img_url } = this.anchor
      this.player = TCPlayer('player_tc', {
        sources: [
          {
            src: play_url_flv
          }
        ],
        licenseUrl: license_url,
        autoplay: true,
        poster: img_url,
        language: 'en',
        fakeFullscreen: true
      })
      this.player.on('fullscreenchange', () => {})
    },
    switchChange() {
      if (this.fullScreenSw) {
        this.$emit('switchChange')
      }
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
    }
  },
  destroyed() {
    this.player && this.player.dispose()
    window.removeEventListener('message', null)
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.m_live_player_wrap {
  @apply h-full w-full bg-dark;
  .live_player_content {
    @apply h-full w-full flex justify-center items-center relative;
    .video {
      width: 100% !important;
      height: 100% !important;
      @apply border-none bg-dark absolute z-50;
      .tcplayer {
        width: 100% !important;
        height: 100% !important;
        .vjs-poster {
          border-radius: 10px;
        }
        .vjs-error-display {
          border-radius: 10px;
        }
        .vjs-big-play-button {
          border-color: transparent;
          background-color: transparent;
        }
        .vjs-big-play-button::before {
          content: url('../../static/image/page/news/image_video_play.png');
          display: block;
          width: 50px; /* 根据图标大小调整 */
          height: 50px; /* 根据图标大小调整 */
          background-size: cover;
          background-position: center;
        }
        .vjs-button-icon {
          svg {
            display: none;
          }
        }
        .vjs-big-play-button.vjs-button-icon::before {
          content: url('../../static/image/page/news/image_video_play.png');
        }
      }
    }
    .on_swiper {
      .vjs-icon-placeholder::before {
        display: none;
      }
    }
    .danmku_box {
      top: 30px;
      @apply absolute z-50 w-full h-200px left-0;
    }
  }
}
</style>
