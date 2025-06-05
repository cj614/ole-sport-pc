<template>
  <div class="lottie"></div>
</template>

<script>
import lottie from 'lottie-web'
export default {
  props: {
    animationData: {
      type: Object,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      lottie: null
    }
  },
  mounted() {
    this.intLottie()
  },
  methods: {
    intLottie() {
      const { animationData, autoplay, loop } = this
      animationData.assets.forEach(item => {
        if (item.w && item.h) {
          item.p = require('@/static/lottie/live/card/images/img_0.png')
          item.u = ''
        }
      }) // 获取静态资源

      this.lottie = lottie.loadAnimation({
        container: this.$el,
        renderer: 'svg',
        loop,
        autoplay,
        animationData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.lottie {
  @apply w-full h-full;
}
</style>
