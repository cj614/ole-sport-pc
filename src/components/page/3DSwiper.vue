<template>
  <div class="m_home_swiper">
    <swiper
      class="swiper"
      ref="mySwiper"
      :options="swiperOptionTop"
      @slideChange="onSwiperChange"
      v-if="list.length"
    >
      <swiper-slide class="slide" v-for="(item, index) in list" :key="index">
        <div class="coverflow-item" @click.stop="handleLive(item)">
          <div class="overlay" @click.stop="handleLive(item)"></div>
          <div class="item-tit">
            <div class="tit-pad">
              <span class="tit-left">
                <span class="mr-20px" v-if="item.Type === 'ANCHOR' || item.LeagueLogo">
                  <page-pageLoad
                    :src="item.Type === 'ANCHOR'?Img.LiveLogo:item.LeagueLogo"
                    width="40"
                    height="40"
                    :contain="true"
                  ></page-pageLoad>
                </span>
                <span>{{ item.League }} -</span>
                <span>{{ item.Home }}</span>
                <span class="t2">VS</span>
                <span>{{ item.Away }}</span>
              </span>
              <div class="lottie_Line">
                <!-- <page-lottie :animationData="Lottie.Line"></page-lottie> -->
                <page-pageLoad :src="Img.TopLiving" width="40" height="24"></page-pageLoad>
              </div>
            </div>
          </div>
          <div class="item_logo" v-show="!item.showLive">
            <div class="logo logo_home" v-if="item.HomeLogo">
              <page-pageLoad :src="item.HomeLogo" width="80" height="80" :contain="true"></page-pageLoad>
            </div>
            <div class="logo logo_away" v-if="item.AwayLogo">
              <page-pageLoad :src="item.AwayLogo" width="80" height="80" :contain="true"></page-pageLoad>
            </div>
          </div>
          <module-iframLive
            v-if="item.showLive && item.Type !== 'ANCHOR'"
            ref="liveIframe"
            :url="play.PlayerUrl"
          ></module-iframLive>
          <module-tcpLayer
            ref="liveTCPlayer"
            class="liveTCPlayer"
            :swiper="true"
            v-else-if="item.showLive"
            :anchor="play"
          ></module-tcpLayer>
          <page-pageLoad
            :src="item.liveImg"
            v-show="!item.showLive"
            currentClass="rounded-10px"
            width="864"
            height="486"
          ></page-pageLoad>
        </div>
      </swiper-slide>

      <div slot="button-next" class="swiper-button-next swiper-button-white"></div>
      <div slot="button-prev" class="swiper-button-prev swiper-button-white"></div>
    </swiper>
    <template v-else>
      <v-progress-circular v-if="loading" indeterminate color="primary" size="24"></v-progress-circular>
      <page-empty :top="0" v-else :title="$t(`Module['暂无数据']`)"></page-empty>
    </template>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import { getMatchLiveListPage, getLivePlayerUrl } from '@/api/live.js'
import { getRoomDetail } from '@/api/room.js'
export default {
  components: { Swiper, SwiperSlide },

  data() {
    return {
      Lottie: {
        Line: require(`@/${this.$lottie.Live.Line}`)
      },
      Img: {
        TopLiving: require(`@/${this.$img.Page.Home.TopLiving}`),
        LiveLogo: require(`@/${this.$img.Page.Live.LiveLogo}`)
      },
      list: [],
      loading: false,
      row: {},
      activeIndex: 3,
      play: {},
      params: {
        page: 1,
        limit: 20
      }
    }
  },

  computed: {
    swiperOptionTop() {
      return {
        initialSlide: 3,
        autoplay: false,
        slidesPerView: 3.8,
        centeredSlides: true,
        spaceBetween: -480,
        loop: true,

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    },

    swiper() {
      return this.$refs.mySwiper.$swiper
    },

    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    }
  },

  mounted() {
    this.getMatchLiveListPage()
  },

  methods: {
    onSwiperChange() {
      if (this.swiper) {
        this.activeIndex = this.swiper.realIndex
        this.$nextTick(() => {
          this.living()
        })
      }
    },

    getMatchLiveListPage() {
      this.loading = true
      let { page, limit } = this.params
      getMatchLiveListPage({
        page,
        limit
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          const { Data: List } = Data
          let live = this.$img.Page.Live
          let arr = List.map(r => ({
            ...r,
            liveImg:
              r.LiveRoomImgUrl ||
              (live[r.Type] ? require(`@/${live[r.Type]}`) : ''),
            showLive: false
          }))

          this.list = this.swapArrayElements(arr, 0, 3)

          this.$nextTick(() => {
            this.living()
          })
        }
        this.loading = false
      })
    },

    swapArrayElements(arr, indexA, indexB) {
      const temp = arr[indexA]
      arr[indexA] = arr[indexB]
      arr[indexB] = temp
      return arr
    },

    async living() {
      const { list, activeIndex } = this
      if (Object.keys(this.row).length) {
        this.$set(this.row, 'showLive', false)
      }
      let data = list[activeIndex]
      if (data) {
        this.row = data
        this.$set(this.row, 'showLive', true)
        if (data.Type === 'ANCHOR') {
          await this.liveAnchor(data)
        } else {
          await this.liveOfficial(data)
        }
      }
    },

    async liveOfficial(item) {
      const { Id } = item
      const { Data, Code } = await getLivePlayerUrl({ match_id: String(Id) })
      if (Code === 200) {
        this.play = Data
      }
    },

    async liveAnchor(item) {
      const { LiveRoomId } = item
      const { Data, Code } = await getRoomDetail({
        id: String(LiveRoomId)
      })
      if (Code === 200) {
        const { data } = Data
        this.play = data
      }
    },

    handleLive(item) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      const { Id, Type, LiveRoomId } = item
      if (Type === 'ANCHOR') {
        this.$router.push({ name: 'anchorRoom', params: { id: LiveRoomId } })
      } else {
        this.$router.push({ name: 'officialRoom', params: { id: Id } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_home_swiper {
  @apply mb-34px w-full flex justify-center items-center;
  .swiper {
    @apply w-1280px h-486px;
    .swiper-slide {
      text-align: center;
      height: 100%;

      display: flex;
      justify-content: center;
      align-items: center;
      transition: 300ms;
      transform: scale(0.7);
    }

    .swiper-slide-active,
    .swiper-slide-duplicate-active {
      transform: scale(1);
    }

    .swiper-slide-next {
      transform: scale(0.8);
      z-index: 998 !important;
    }

    .swiper-slide-prev {
      transform: scale(0.8);
    }

    .swiper-slide-active {
      z-index: 999 !important;
    }
  }
  .coverflow-item {
    @apply relative w-864px h-486px flex cursor-pointer;
    .overlay {
      @apply absolute w-864px h-486px z-200 cursor-pointer;
    }
    .item-tit {
      @apply w-864px absolute top-0px h-50px z-999 leading-50px flex;
      .tit-pad {
        @apply flex justify-between items-center mx-20px w-full relative;
        .tit-left {
          @apply text-16px font-bold text-lightFirst flex items-center;
          .t2 {
            @apply mx-10px;
          }
        }
        .lottie_Line {
          @apply absolute z-10 top-10px right-20px;
        }
      }
    }
    .item_logo {
      @apply absolute w-864px top-1/2 flex z-10 items-center justify-around;
    }
    .liveTCPlayer {
      @apply rounded-10px  w-864px h-486px;
      .live_player_content {
        @apply rounded-10px;
        .video {
          @apply rounded-10px;
        }
      }
    }
    .m_live_iframe_warp {
      @apply rounded-10px  w-864px h-486px;
      iframe {
        @apply rounded-10px;
      }
    }
  }

  .swiper-button-white {
    @apply w-24px h-40px bg-hex-FFFFFF80;
  }
  .swiper-button-white::after {
    @apply text-white;
    font-size: 15px !important;
  }
  .swiper-button-prev {
    @apply left-0px rounded-br-10px rounded-tr-10px;
  }
  .swiper-button-next {
    @apply right-0px rounded-bl-10px rounded-tl-10px;
  }
  .slide:hover {
    scale: 1.1;
    .item-tit {
      top: 20px;
    }
  }
}
</style>
