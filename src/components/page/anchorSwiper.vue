<template>
  <div class="item-pd anchor_box">
    <div class="anchor_list">
      <swiper class="swiper" :options="swiperOptionTop" v-if="anchorList.length">
        <swiper-slide class="slide" v-for="(ci,index) in anchorList" :key="index">
          <div class="anc_item" @click.stop="matchClickItem(ci)">
            <div class="lottie_head" v-if="ci.is_live">
              <page-lottie :animationData="Lottie.Head"></page-lottie>
            </div>
            <v-avatar
              width="40"
              min-width="40"
              height="40"
              :class="ci.is_live  ? 'breathing-element' : ''"
            >
              <v-img width="40" height="40" :src="ci.user_img_url || Img.LiveLogo"></v-img>
            </v-avatar>
            <span class="flag_live" v-if="ci.is_live">
              <v-img :src="Img.HomeAnchorLive" width="22" height="8"></v-img>
            </span>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>


<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  components: { Swiper, SwiperSlide },
  props: {
    anchorList: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      Lottie: {
        Card: require(`@/${this.$lottie.Live.Card}`),
        Head: require(`@/${this.$lottie.Live.Head}`)
      },

      Img: {
        HomeAnchorLive: require(`@/${this.$img.Page.Home.HomeAnchorLive}`),
        Living: require(`@/${this.$img.Page.Home.Living}`),
        Subscribe: require(`@/${this.$img.Page.Live.Subscribe}`),
        SubscribeSuccess: require(`@/${this.$img.Page.Live.SubscribeSuccess}`),
        FT: require(`@/${this.$img.Page.Live.FT}`),
        LiveLogo: require(`@/${this.$img.Page.Live.LiveLogo}`)
      }
    }
  },

  computed: {
    swiperOptionTop() {
      return {
        slidesPerView: 4,
        freeMode: true
        // autoplay: {
        //   delay: 2000,
        //   disableOnInteraction: false
        // }
      }
    }
  },
  methods: {
    matchClickItem(ci) {
      this.$emit('matchClickItem', this.data, ci)
    }
  }
}
</script>

<style lang="scss" scoped>
.anchor_box {
  width: 100%;
  .swiper-container {
    height: 100%;
  }
  .swiper-slide {
    filter: none;
    width: 40px !important;
    height: 100%;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .anc_item {
      width: 40px;
      .flag_live {
        left: 11px;
      }
    }
  }
}
</style>