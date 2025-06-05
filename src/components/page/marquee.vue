<template>
  <div class="cb-marquee" ref="marqueeWrap">
    <div
      class="marquee-content"
      :class="{ 'row': direction == 'row', 'col': direction == 'col', 'animate': animation }"
      :style="contentStyle"
      ref="marqueeContent"
    >
      <div class="marquee-data" ref="data">
        <slot></slot>
      </div>
      <div class="marquee-copy" ref="copy" v-show="copyShow">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VueMarquee',
  props: {
    msg: {
      type: Array,
      default() {
        return []
      }
    },

    direction: {
      type: String,
      default: 'row'
    },

    speed: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      animation: true,
      contentStyle: {},
      copyShow: false
    }
  },
  watch: {
    msg() {
      this.$nextTick(() => {
        this.handleAnimation()
      })
    }
  },

  mounted() {
    this.handleAnimation()
  },

  methods: {
    handleAnimation() {
      const wrapWidth = this.$refs.marqueeWrap.getBoundingClientRect().width
      const wrapHeight = this.$refs.marqueeWrap.getBoundingClientRect().height
      const contentWidth = this.$refs.data.getBoundingClientRect().width
      const contentHeifht = this.$refs.data.getBoundingClientRect().height

      // 如果滚动内容 小于 外面盒子的宽度/高度 再插入dom，不进行无缝滚动
      if (
        (this.direction == 'col' && contentHeifht < wrapHeight) ||
        (this.direction == 'row' && contentWidth < wrapWidth)
      ) {
        this.animation = true
        this.copyShow = true
      } else {
        this.animation = true
        this.copyShow = true
      }

      const msgLength = this.$refs.data.children.length
      this.contentStyle = {
        animationDuration: msgLength * 2 * this.speed + 's',
        animationDelay: '0.01s'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cb-marquee * {
  -webkit-backface-visibility: hidden;
}

.cb-marquee {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  font-size: 12px;
  display: flex;
  align-items: center;
  .row {
    display: inline-block;
    white-space: nowrap;

    &.animate {
      animation: marqueeRow linear infinite;
    }

    &.animate:hover {
      animation-play-state: paused;
    }

    .marquee-data,
    .marquee-copy {
      width: 100%;
      display: inline-block;
      white-space: nowrap;

      span,
      div,
      p {
        display: inline-block;
        white-space: nowrap;
        padding-right: 40px;
      }
    }
  }

  .col {
    width: 100%;

    &.animate {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      animation: marqueeCol linear infinite;
    }

    &.animate:hover {
      animation-play-state: paused;
    }

    .marquee-data,
    .marquee-copy {
      span,
      div,
      p {
        width: 100%;
        display: block;
        text-align: center;
      }
    }
  }
  @keyframes marqueeRow {
    0% {
      transform: translate3d(0, 0, 0);
    }

    100% {
      transform: translate3d(-100%, 0, 0);
    }
  }

  @keyframes marqueeCol {
    0% {
      transform: translate3d(0, 0, 0);
    }

    100% {
      transform: translate3d(0, -50%, 0);
    }
  }
}
</style>