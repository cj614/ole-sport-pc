<template>
  <vue-danmaku
    ref="danmaku"
    :channels="3"
    :speeds="100"
    :randomChannel="true"
    :autoplay="false"
    :fontSize="16"
    :extraStyle="`color: ${'#fff'}`"
    v-model="danmus"
    style="height: 100%; width: 100%"
  ></vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue-danmaku'
export default {
  components: {
    vueDanmaku
  },
  props: {
    danmakuList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    Color() {
      return this.$store.state.app.appColor
    }
  },
  data() {
    return {
      danmus: []
    }
  },
  methods: {
    setDanmus() {
      this.reset()
      let { danmakuList } = this
      this.danmus = danmakuList
        .filter(item => {
          return item.msg.type === 'text'
        })
        .map(item => {
          return item.msg.data.text
        })
      this.play()
    },
    reset() {
      this.$refs.danmaku.reset()
    },
    play() {
      this.$refs.danmaku.play()
    },
    stop() {
      this.$refs.danmaku.stop()
    },
    resize() {
      this.$refs.danmaku.resize()
    },
    insert(danmu) {
      this.$refs.danmaku.insert(danmu)
    },
    show() {
      this.$refs.danmaku.show()
    },
    hide() {
      this.$refs.danmaku.hide()
    }
  }
}
</script>

<style></style>
