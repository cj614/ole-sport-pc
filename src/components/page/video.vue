<template>
  <div class="m_video_warp">
    <video
      ref="videoPlayer"
      class="video-js vjs-default-skin vjs-big-play-centered"
      webkit-playsinline="true"
      playsinline="true"
    >
      <!-- <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" /> -->
    </video>
  </div>
</template>

<script>
/**autoplay : true/false 播放器准备好之后，是否自动播放 【默认false】
controls : true/false 是否拥有控制条 【默认true】,如果设为false ,那么只能通过api进行控制了。也就是说界面上不会出现任何控制按钮
height: 视频容器的高度，字符串或数字 单位像素 比如： height:300 or height:‘300px‘
width: 视频容器的宽度, 字符串或数字 单位像素
loop : true/false 视频播放结束后，是否循环播放
muted : true/false 是否静音
poster: 播放前显示的视频画面，播放开始之后自动移除。通常传入一个URL
preload:预加载
‘auto‘ 自动
’metadata‘ 元数据信息 ，比如视频长度，尺寸等
‘none‘ 不预加载任何数据，直到用户开始播放才开始下载
children: Array | Object 可选子组件 从基础的Component组件继承而来的子组件，数组中的顺序将影响组件的创建顺序哦。
**/

import videojs from 'video.js'
import 'video.js/dist/video-js.css'
export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {
          controls: true,
          poster: '',
          height: 171,
          width: 305,
          sources: [
            {
              type: 'video/mp4',
              src: 'https://vjs.zencdn.net/v/oceans.mp4'
            }
          ],
          controlBar: {
            children: [
              { name: 'playToggle' }, // 播放按钮
              { name: 'currentTimeDisplay' }, // 当前已播放时间
              { name: 'progressControl' }, // 播放进度条
              { name: 'durationDisplay' }, // 总时间
              {
                name: 'volumePanel', // 音量控制
                inline: false // 不使用水平方式
              },
              { name: 'FullscreenToggle' } // 全屏
            ]
          }
        }
      }
    },

    imgUrl: {
      type: String,
      default: ''
    },

    videoUrl: {
      type: String,
      default: ''
    },

    height: {},

    width: {}
  },

  data() {
    return {
      player: null
    }
  },

  mounted() {
    this.initVideo()
  },

  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },

  methods: {
    initVideo() {
      //初始化视频方法
      this.options.poster = this.imgUrl
      this.options.sources[0].src = this.videoUrl
      this.options.height = this.height || 171
      this.options.width = this.width || 305

      this.player = videojs(
        this.$refs.videoPlayer,
        this.options,
        function onPlayerReady() {
          // console.log('onPlayerReady', this)
        }
      )
    },

    changeVideo() {
      this.player.reset() //重置 video
      this.player.poster(this.imgUrl)
      this.player.src([
        {
          type: 'video/mp4',
          src: this.videoUrl || '//vjs.zencdn.net/v/oceans.mp4'
        }
      ])
      this.player.load()
      this.player.play()
    }
  }
}
</script>

<style lang="scss" scoped>
.video-js {
  border-radius: 10px;
  /* 给.video-js设置字体大小以统一各浏览器样式表现，因为video.js采用的是em单位 */
  // font-size: 14px;
}
.video-js button {
  outline: none;
}
.vjs-round-corners {
  border-radius: 10px; /* 设置圆角的大小 */
}
.vjs-paused .vjs-big-play-button,
.vjs-paused.vjs-has-started .vjs-big-play-button {
  display: block;
}

.video-js.vjs-fluid,
.video-js.vjs-16-9,
.video-js.vjs-4-3 {
  /* 视频占满容器高度 */
  height: 210px;
  background-color: #161616;
}
.vjs-poster {
  background-color: #161616;
}

.video-js .vjs-big-play-button {
  /* 中间大的播放按钮 */
  font-size: 2.3em;
  line-height: 2.1em;
  height: 2.3em;
  width: 2.3em;
  border-radius: 2.5em;
  background-color: #73859f;
  background-color: rgba(115, 133, 159, 0.5);
  border-width: 0.1em;
  transform: translate(-50%, -50%);
  margin-top: 0;
  margin-left: 0;
}
/* 中间的播放箭头 */
.vjs-big-play-button .vjs-icon-placeholder {
  font-size: 1.4em;
}

/* 加载圆圈 */
.vjs-loading-spinner {
  font-size: 2.5em;
  width: 2em;
  height: 2em;
  border-radius: 1em;
}

.video-js.vjs-playing .vjs-tech {
  pointer-events: auto !important;
}
.video-js .vjs-time-control {
  display: block;
}
.video-js .vjs-remaining-time {
  display: none;
}

.vjs-picture-in-picture-control {
  display: none !important;
}

.h5-video {
  width: 100%;
  height: 210px;
}
</style>
