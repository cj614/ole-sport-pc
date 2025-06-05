<template>
  <div class="m_self_bg">
    <div class="m_self_color">
      <div class="m_self_content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  }
}
</script>


<style lang="scss" scoped>
.m_self_bg {
  @apply flex-1 h-full bg-no-repeat bg-center;
  background: #000;

  // background: url(../../static/image/page/layout/image_ole_bg.png);
  // background-position: center center;
  // background-repeat: no-repeat;
  // background-attachment: fixed;
  // background-size: cover;
  .m_self_color {

    // @apply bg-hex-f4f6ff;
    .m_self_content {
      @apply w-1280px my-0px mx-auto;
    }
  }
}
</style>