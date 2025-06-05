<template>
  <div class="dplayer_box">
    <div class="live-stop" v-if="isStop">
      <div class="line"></div>
      <div class="text">{{$t(`Module['直播已结束']`)}}</div>
      <div class="line"></div>
    </div>
    <page-progress class="progress"></page-progress>
    <div class="dplayer" id="dplayer_video"></div>
  </div>
</template>

<script>
import DPlayer from "dplayer";
import Hls from "hls.js";
import { handleToggleScreenDirection } from "@/libs/util.js";

export default {
  props: {
    movie: {
      type: Object,
      default: () => {
        return {};
      },
    },
    theme: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      DPlayer: null,
      screenDirection: "portrait",
      isPausedByUser: false,
      isStop: false,
    };
  },
  computed: {
    Color() {
      return this.$store.state.app.appColor || 'blue';
    },
    localConfig() {
      return JSON.parse(this.$store.state.app.localConfig) || {};
    },
  },
  methods: {

    initVideo() {
      let video = {
        pic: this.movie.img,
        url: this.movie.video,
      }

      if (this.movie.videType === "customHls") {
        video = {
          pic: this.movie.img,
          url: this.movie.video,
          type: "customHls",
          live: true,
          customType: {
            customHls: (video, player) => {
              const hls = new Hls();
              const self = this;  // 保存组件实例的引用
              hls.on(Hls.Events.ERROR, function (event, data) {
                if (
                    data.type === Hls.ErrorTypes.NETWORK_ERROR &&
                    data.details === 'manifestLoadError'
                ) {
                  console.log('live stream error');
                  self.isStop = true;  // 使用保存的引用
                }
              });

              hls.loadSource(this.movie.video);
              hls.attachMedia(video);
            },
          },
        }
      }

      let { localConfig, Color } = this;
      const player = (this.DPlayer = new DPlayer({
        autoplay: true,
        theme: this.theme || Color,
        loop: false,
        lang: localConfig.lang === "zh_CN" ? "zh-cn" : "en",
        hotkey: true,
        airplay: false,
        preload: "auto",
        mutex: true,
        danmaku: false,
        contextmenu: [],
        container: document.querySelector("#dplayer_video"),
        video: video,
      }));

      document
        .getElementById("dplayer_video")
        .classList.add("dplayer-hide-controller");

      player.on("loadstart", () => {
        this.$emit("loadstart");
      });

      player.on('pause', () => {
        if (this.movie.videType === "customHls"){
          this.isPausedByUser = true;
        }
      });

      player.on('play', () => {
        if (this.isPausedByUser) {
          player.switchVideo({
            url: this.movie.video,
            type: 'customHls'
          });
          player.play();
          this.isPausedByUser = false;
        }
      });

      // 视频加载完成
      player.on("loadedmetadata", () => {
        this.$emit("loadedmetadata");
      });

      // 视频可以播放
      player.on("canplay", () => {
        this.$emit("canplay");
      });

      // 视频正在播放
      player.on("playing", () => {
        this.$emit("playing");
      });

      // 视频暂停
      player.on("pause", () => {
        this.$emit("pause");
      });

      // 视频结束
      player.on("ended", () => {
        this.$emit("ended");
      });

      // 视频错误
      player.on("error", (error) => {
        console.error("Video error:", error);
        this.$emit("error", error);
      });

      // 视频缓冲
      player.on("waiting", () => {
        this.$emit("waiting");
      });

      // 视频缓冲完成
      player.on("stalled", () => {
        this.$emit("stalled");
      });

      // 视频进度更新
      player.on("timeupdate", () => {
        this.$emit("timeupdate", player.video.currentTime);
      });

      // 视频音量变化
      player.on("volumechange", () => {
        this.$emit("volumechange", player.volume);
      });

      // 视频播放速率变化
      player.on("ratechange", () => {
        this.$emit("ratechange", player.video.playbackRate);
      });

      // 视频质量切换完成
      player.on("quality_end", () => {
        this.$emit("quality_end");
        document
          .getElementById("dplayer_video")
          .classList.add("dplayer-hide-controller");
      });

      if (window.handleToggleScreenDirection) {
        document.getElementsByClassName("dplayer-full")[0].onclick = () => {
          let { screenDirection } = this;
          switch (screenDirection) {
            case "landscape":
              handleToggleScreenDirection("portrait");
              player.fullScreen.cancel("web");
              this.screenDirection = "portrait";
              break;
            case "portrait":
              handleToggleScreenDirection("landscape");
              player.fullScreen.request("web");
              this.screenDirection = "landscape";
              break;
          }
        };
      } else {
        player.on("fullscreen", () => {
          handleToggleScreenDirection("landscape");
          this.screenDirection = "landscape";
          document
            .getElementById("dplayer_video")
            .classList.add("fullscreen");
        });
        player.on("fullscreen_cancel", () => {
          handleToggleScreenDirection("portrait");
          this.screenDirection = "portrait";
          document
            .getElementById("dplayer_video")
            .classList.remove("fullscreen");
        });
      }
    },
    switchVideo() {
      this.DPlayer.switchVideo({
        pic: this.movie.img,
        url: this.movie.video,
        type: "auto",
        // customType: {
        //   customHls: (video, player) => {
        //     const hls = new Hls();
        //     hls.loadSource(this.movie.movieURL);
        //     hls.attachMedia(video);
        //   },
        // },
      });
      setTimeout(() => {
        this.DPlayer.play();
      }, 1000);
    },
    videoDestroy() {
      console.log('videoDestroy')
      this.DPlayer && this.DPlayer.destroy();
    },
  },

  mounted() {
    this.initVideo()
  },
  beforeDestroy() {
    this.videoDestroy();
  },
};
</script>

<style lang="scss" scoped>
.dplayer_box {
  position: relative;
  height: 100%;
  width: 100%;

  .dplayer {
    height: 100%;
    width: 100%;
  }

  .progress {
    position: absolute;
    right: 10px;
    top: 20px;
    z-index: 2;
  }
}

.live-stop {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  backdrop-filter: blur(8px); /* 模糊强度：8px */
  -webkit-backdrop-filter: blur(8px); /* 兼容 Safari */

  .line {
    width: 145px;
    height: 0;
    border: 1px solid #F2DF78;
  }
  .text {
    color: #F2DF78;
    font-size: 36px;
    margin: 0 20px;
  }
}

</style>
