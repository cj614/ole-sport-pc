<template>
  <div class="svga_play_box" v-show="show">
    <div class="svga_box" v-html="animateHtml"></div>
  </div>
</template>

<script>
import Vap from 'video-animation-player'
import { Parser, Player, DB } from 'svga'

export default {
  data() {
    return {
      show: false,
      animateHtml: ''
    }
  },
  computed: {
    giftList() {
      return this.$store.state.app.giftList
    }
  },
  methods: {
    close() {
      this.show = false
    },

    async svgaPlay(item) {
      this.show = true
      let { animate_file } = item
      let json_file = ''
      if (animate_file.indexOf('.mp4') !== -1) {
        this.animateHtml = `<div id="video_play" class="svga_play"></div>`
        this.$nextTick(() => {
          let dom = document.getElementById('video_play')
          let vapPlayer = new Vap({
            container: dom,
            src: animate_file,
            config: json_file,
            width: '450px',
            height: '400px',
            fps: 30,
            mute: true,
            type: 2,
            loop: false,
            precache: true,
            beginPoint: 0,
            accurate: true
          })
          vapPlayer.play()
          vapPlayer.on('ended', () => {
            vapPlayer.destroy()
            vapPlayer = null
            this.$emit('finished')
          })
        })
      }
      if (animate_file.indexOf('.svga') !== -1) {
        const db = new DB()
        let svga = await db.find(animate_file)
        if (!svga) {
          const parser = new Parser({ isDisableImageBitmapShim: true })
          svga = await parser.load(animate_file)
          await db.insert(animate_file, svga)
          parser.destroy()
        }
        let { width, height } = svga.size
        console.log(width, height,'----')
        let widthStr ='100%'
        let heightStr = '100%'
        this.animateHtml = `<canvas id="svga_play" class="svga_play" style="width:${widthStr};height:${heightStr}"></canvas>`
        this.$nextTick(async () => {
          const player = new Player({
            container: document.getElementById('svga_play'),
            loop: 1
          })
          await player.mount(svga)
          player.onEnd = () => {
            this.$emit('finished')
            player.destroy()
          }
          player.start()
        })
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.svga_play_box {
  @apply absolute bottom-100px right-0px w-330px h-660px overflow-hidden pointer-events-none bg-transparent;
}
.svga_box {
  @apply bg-transparent w-330px h-660px overflow-hidden;
}
</style>
