<template>
  <div class="live_swiper">
    <div class="swiper_text">
      <div class="swiper_label">{{ $t(`Module['主播正在赶来']`) }}~{{ $t(`Module['猜你喜欢']`) }}~</div>
    </div>
    <div class="live_swiper_box" v-if="swiperList.length">
      <swiper class="swiper" :options="swiperOptions">
        <swiper-slide class="slide" v-for="(item, index) in swiperList" :key="index">
          <div class="item_box">
            <page-pageLoad width="305" height="171" :src="item.img"></page-pageLoad>
            <div class="lottie_Line">
              <page-lottie :animationData="Lottie.Line"></page-lottie>
            </div>
            <div>{{item.text}}</div>
          </div>
        </swiper-slide>
        <div slot="button-next" class="swiper-button-next swiper-button-white"></div>
        <div slot="button-prev" class="swiper-button-prev swiper-button-white"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import { getMatchLiveListPage } from '@/api/live.js'
export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      params: {
        page: 1,
        limit: 20
      },
      Lottie: {
        Line: require(`@/${this.$lottie.Live.Line}`)
      },

      swiperOptions: {
        slidesPerView: 3,
        spaceBetween: 20,
        slidesPerGroup: 1,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      swiperList: []
    }
  },
  computed: {},
  methods: {
    liveMatchList() {
      let { page, limit } = this.params
      getMatchLiveListPage({
        page,
        limit,
        sport_type: 'ANCHOR'
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          this.swiperList = Data.Data.map(item => {
            return {
              ...item,
              img: item.LiveRoomImgUrl,
              topImg: item.LeagueLogo,
              leftInfo: {
                img: item.HomeLogo || '',
                name: item.Home
              },
              rightInfo: {
                img: item.AwayLogo || '',
                name: item.Away
              },
              title: `${item.LiveRoomTitle}`
            }
          })
        }
      })
    }
  },
  mounted() {
    this.liveMatchList()
  }
}
</script>

<style lang="scss" scoped>
.live_swiper {
  @apply h-full w-full bg-dark;
  .swiper_text {
    @apply h-308px w-full flex justify-center items-center;
    .swiper_label {
      @apply text-16px text-lightFirst;
    }
  }
  .live_swiper_box {
    height: 171px;
    position: relative;
    padding: 0px 20px;
    .swiper-slide {
      height: 171px;
      width: 305px !important;
    }
    .swiper-slide img {
      display: block;
      width: 100%;
    }
    .item_box {
      height: 171px;
      width: 305px;
      position: relative;
      .lottie_Line {
        @apply absolute z-10 top-10px right-10px;
      }
    }
    .swiper-button-white {
      @apply w-24px h-40px bg-hex-00000050;
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
  }
}
</style>
