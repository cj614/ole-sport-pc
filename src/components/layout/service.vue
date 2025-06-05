<template>
  <v-fab-transition v-if="showScrollTopIcon">
    <div class="m_stop_top" @click.stop="handleScrollTop">
      <div class="top_item">
        <span>
          <v-img :src="Img.ScrollTop" width="28" height="28"></v-img>
        </span>
      </div>
    </div>
  </v-fab-transition>
</template>

<script>
import { scrollToTop } from '@/libs/util'
export default {
  data() {
    return {
      Img: {
        ScrollTop: require(`@/${this.$img.Page.Layout.ScrollTop}`)
      },
      showScrollTopIcon: false
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', this.handleScroll)
    })
  },

  methods: {
    handleScrollTop() {
      scrollToTop()
    },
    handleScroll() {
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      //变量windowHeight是可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      // //变量scrollHeight是滚动条的总高度
      // let scrollHeight =
      //   document.documentElement.scrollHeight || document.body.scrollHeight
      if (scrollTop > windowHeight) {
        this.showScrollTopIcon = true
        // 这里可以执行你需要的操作
      } else {
        this.showScrollTopIcon = false
      }
    }
  }
}
</script>

<style>
.m_stop_top {
  @apply absolute right-0px bottom-180px z-4;
  transform: translatey(20px);

  .top_item {
    @apply flex items-center px-15px w-48px h-58px mb-10px rounded-l-10px cursor-pointer relative;
    background: #25262E;
  }
}
</style>
