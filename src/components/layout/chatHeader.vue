<template>
  <v-app-bar app class="main_chat_header" height="60" extension-height="60" elevate-on-scroll fixed>
    <div class="m_chat_header_warp">
      <div class="logo">
        <span class="cursor-pointer" @click.stop="() => {$router.push({name:'home'})}">
          <v-img :src="Img.OleLogo" contain height="42" width="150"></v-img>
        </span>
      </div>
      <div class="msg">{{$t(`Module['欢迎来到聊天']`)}}</div>
      <div class="btn">
        <v-btn
          height="34"
          width="64"
          class="btn_box"
          depressed
          outlined
          color="#fff"
          @click="handleQuit"
        >{{$t(`Module['返回']`)}}</v-btn>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'main-header',
  data() {
    return {
      Img: {
        OleLogo: require(`@/${this.$img.Page.Layout.OleLogo}`)
      },
      lineCount: 0
    }
  },
  mounted() {
    this.$bus.$on('chat/room/count', this.setCountData)
  },
  beforeDestroy() {
    this.$bus.$off('chat/room/count', this.setCountData)
  },
  methods: {
    setCountData(count) {
      this.lineCount = count
    },
    handleQuit() {
      this.$router.go('-1')
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  .main_chat_header {
    @apply z-100;
    background: #2BA5FF;
    .v-toolbar__content {
      @apply pr-54px pl-40px;
    }
    .m_chat_header_warp {
      @apply w-full flex items-center justify-between;
      .msg {
        @apply text-lightFirst text-16px;
      }
      .btn {
        @apply flex items-center;
        .info_count {
          @apply flex items-center mr-40px;
          .dian {
            @apply bg-hex-44D611 w-6px h-6px rounded-1/2 mr-10px;
          }
          .count {
            @apply text-lightFirst text-16px;
            .number {
              @apply font-sans;
            }
          }
        }
        .btn_box {
          @apply rounded-10px;
        }
      }
    }
  }
}
</style>
