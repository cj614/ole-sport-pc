<template>
  <div>
    <div class="adv left_adv" v-if="showLeft" v-show="leftValue">
      <div class="adv_content">
        <div class="w-160px">
          <page-ImgSwiper height="160" :typeName="left" @show="value => (leftValue = value)"></page-ImgSwiper>
        </div>
        <span class="adv_close" @click.stop="() => (showLeft = false)">
          <v-img :src="Img.AdvClose" height="24" width="24"></v-img>
        </span>
      </div>
    </div>

    <div class="adv right_adv" v-if="showRight" v-show="rightValue">
      <div class="adv_content">
        <div class="w-160px">
          <page-ImgSwiper height="160" :typeName="right" @show="value => (rightValue = value)"></page-ImgSwiper>
        </div>
        <span class="adv_close" @click.stop="() => (showRight = false)">
          <v-img :src="Img.AdvClose" height="24" width="24"></v-img>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    left: {
      type: String,
      default: ''
    },
    right: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Img: {
        AdvClose: require(`@/${this.$img.Page.Layout.AdvClose}`)
      },
      leftValue: false,
      rightValue: false,
      showLeft: true,
      showRight: true
    }
  }
}
</script>

<style lang="scss" scoped>
.adv {
  @apply fixed bottom-0px z-15;

  .adv_content {
    @apply relative;

    .adv_close {
      @apply absolute top-10px right-10px cursor-pointer;
    }
  }
}

.left_adv {
  @apply left-0px;
}

.right_adv {
  @apply right-0px;
}
</style>
