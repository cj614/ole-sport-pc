<template>
  <div class="footer_adv" v-if="show" v-show="leftValue">
    <div class="adv_content">
      <div class="w-670px">
        <page-ImgSwiper height="70" width="670" :typeName="footer"
          @show="value => (leftValue = value)"></page-ImgSwiper>
      </div>
      <span class="adv_close" @click.stop="() => (show = false)">
        <v-img :src="Img.AdvClose" height="20" width="20"></v-img>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    footer: {
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
      show: true
    }
  }
}
</script>

<style lang="scss" scoped>
.footer_adv {
  @apply fixed bottom-0px z-15 left-1/2;
  transform: translate(-50%);

  .adv_content {
    @apply relative;

    .adv_close {
      @apply absolute top-0px right-0px cursor-pointer;
    }
  }
}
</style>
