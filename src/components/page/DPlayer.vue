<template>
  <div class="dplayer_box">
    <page-progress class="progress"></page-progress>

    <div class="dplayer" id="dplayer_video"></div>
  </div>
</template>

<script>
import DPlayer from 'dplayer'
export default {
  props: {
    movie: {
      type: Object,
      default: () => {
        return {}
      }
    },
    theme: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      DPlayer: null,
      screenDirection: 'portrait'
    }
  },
  computed: {
    localConfig() {
      return this.$store.state.app.localConfig
        ? JSON.parse(this.$store.state.app.localConfig)
        : {}
    }
  },
  methods: {
    initVideo() {
      let { localConfig } = this
      const player = (this.DPlayer = new DPlayer({
        autoplay: true,
        theme: this.theme || '#F9B31F',
        loop: false,
        lang: localConfig.lang === 'zh_CN' ? 'zh-cn' : 'en',
        hotkey: true,
        airplay: false,
        preload: 'auto',
        mutex: true,
        danmaku: false,
        contextmenu: [],
        container: document.querySelector('#dplayer_video'),
        video: {
          pic: this.movie.img,
          url: this.movie.video
          // type: "customHls",
          // customType: {
          //   customHls: (video, player) => {
          //     const hls = new Hls();
          //     hls.loadSource(this.movie.video);
          //     hls.attachMedia(video);
          //   },
          // },
        }
      }))
      document
        .getElementById('dplayer_video')
        .classList.add('dplayer-hide-controller')

      player.on('loadstart', () => {
        this.$emit('loadstart')
      })
      player.on('play', () => {
        this.$emit('play')
      })
      player.on('quality_end', () => {
        this.$emit('quality_end')
        player.on('play')
        document
          .getElementById('dplayer_video')
          .classList.add('dplayer-hide-controller')
      })
      player.on('pause', () => {
        this.$emit('pause')
      })
      player.on('canplay', () => {
        this.$emit('canplay')
      })
      player.on('playing', () => {
        this.$emit('playing')
      })
      player.on('ended', () => {
        this.$emit('ended')
      })
      player.on('error', res => {
        this.$emit('error', res)
      })
    },
    switchVideo() {
      this.DPlayer.switchVideo({
        pic: this.movie.img,
        url: this.movie.video,
        type: 'auto'
        // customType: {
        //   customHls: (video, player) => {
        //     const hls = new Hls();
        //     hls.loadSource(this.movie.movieURL);
        //     hls.attachMedia(video);
        //   },
        // },
      })
      setTimeout(() => {
        this.DPlayer.play()
      }, 1000)
    },
    videoSeek(type) {
      let time = this.DPlayer.video.currentTime
      let allTime = this.DPlayer.video.duration
      switch (type) {
        case 'left':
          this.DPlayer.seek(time - 5 < 0 ? 0 : time - 5)
          break
        case 'right':
          this.DPlayer.seek(time + 5 > allTime ? allTime : time + 5)
          break
      }
    },
    videoDestroy() {
      this.DPlayer && this.DPlayer.destroy()
    }
  },
  watch: {
    'movie.video'(val) {
      if (val) {
        this.initVideo()
      }
    }
  },
  beforeDestroy() {
    this.videoDestroy()
  }
}
</script>

<style lang="scss" scoped>
.dplayer_box {
  @apply w-940px h-528px;
  position: relative;

  .progress {
    position: absolute;
    right: 10px;
    top: 20px;
    z-index: 2;
  }

  #dplayer_video {
    @apply w-940px h-528px;
  }

  .dplayer.dplayer-mobile {
    @apply w-full h-full;

    .dplayer-controller {
      .dplayer-setting {
        @apply hidden;
      }

      .dplayer-icons-right {
        .dplayer-full {
          .dplayer-full-in-icon {
            @apply hidden;
          }
        }
      }
    }
  }
}
</style>
