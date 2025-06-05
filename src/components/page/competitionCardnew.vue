<template>
  <!--   @apply mb-30px; -->
  <!-- <div class="m_competition_card_warp"> -->
  <ul class="competition_content">
    <div class="gradient-border" style="height: 235px;" v-for="(item, index) in List" :key="item + index"
      @click="handleClickItem(item)">
      <li class="competition_item">
        <page-pageLoad v-if="type == 0" :src="item.bg_img" currentClass="rounded-t-10px" width="295"
          height="171"></page-pageLoad>
        <page-pageLoad v-else :src="item.img_url" currentClass="rounded-t-10px" width="295"
          height="171"></page-pageLoad>

        <!-- </template> -->
        <!-- logo -->
        <div class="item_logo" :style="{ top: type == 0 ? '20px' : '60px', left: type == 0 ? '0px' : '100px' }">
          <div class="logo" v-if="type == 1">
            <page-pageLoad :src="Img.VideoPlay" width="60" height="60" :contain="true"></page-pageLoad>
          </div>
          <div class="live_text" v-else>
            {{ $t(`Module['正在直播']`) }}
            <img style="height: 12px;margin-left: 5px;" :src="Img.Liveicon" />
          </div>

        </div>

        <template>
          <!-- 卡片 -->

          <div class="footer_live">
            <v-avatar width="40" height="40" min-width="40" v-if="type == 0">
              <v-img :src="item.img_url || Img.LiveTeam"></v-img>
            </v-avatar>
            <div v-else class="outer">
              <div class="inner">
              </div>
            </div>
            <div class="subtitle_l">
              <div class="live_name" :style="{ maxWidth: type === 3 ? '160px' : '245px' }">{{ item.user_name ||
                item.title || $t(`Module['官方直播']`) }}</div>
              <div style="display:flex;align-items: center; color:#999" v-if="type == 0">
                <img :src="Img.Fire" style="width:12px;height:18px;margin-right: 10px;" alt="">
                {{ item.view_num }}
              </div>
            </div>
          </div>
        </template>

        <slot></slot>
      </li>
    </div>

  </ul>
  <!-- </div> -->
</template>

<script>
import { timeFormat, timeFormatSJ } from '@/libs/util.js'
export default {
  props: {
    type: {
      type: Number,
      default: 3
    },

    Anchor: {
      type: Boolean,
      default: false
    },

    showMr: {
      type: Boolean,
      default: true
    },

    hasScale: {
      type: Boolean,
      default: true
    },

    isVideo: {
      type: Boolean,
      default: false
    },

    List: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Lottie: {
        Line: require(`@/${this.$lottie.Live.Line}`)
      },
      Img: {
        Views: require(`@/${this.$img.Page.Home.Views}`),
        LiveTeam: require(`@/${this.$img.Page.Live.LiveLogo}`),
        Liveicon: require(`@/${this.$img.Page.Live.Liveicon}`),
        VideoPlay: require(`@/${this.$img.Page.News.VideoPlay}`),
        Fire: require(`@/${this.$img.Page.Live.Fire}`),

      }
    }
  },

  methods: {
    returnIMG(item) {
      return require(`../../static/image/page/live/${item}.jpg`)
    },
    handleClickItem(item) {
      this.$emit('handleClickItem', item)
    },
    timeFormat(date) {
      return timeFormat(date * 1000)
    },
    timeFormatSJ(date) {
      return timeFormatSJ(date * 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.gradient-border {
  padding: 2px;
  background: linear-gradient(134.91deg,
      rgba(214, 207, 188, 1) 0%,
      rgba(84, 84, 67, 1) 37.14%,
      rgba(197, 193, 159, 1) 67.77%,
      rgba(144, 142, 116, 1) 100%);

  margin: 10px 0;
  border-radius: 10px;
  margin-right: 20px;

}

.gradient-border:nth-child(4n) {
  margin-right: 0px;
}

// .gradient-border:nth-of-type(4),
// .gradient-border:nth-of-type(8) {
//   margin-right: 0px;
// }

.competition_content {
  @apply flex flex-wrap;

  .competition_item {
    @apply w-295px relative;
    border-radius: 10px;
    background: none;


    .item_logo {
      @apply absolute w-full flex z-10 items-center justify-between px-20px;


      .live_text {
        background: #FF5733;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        padding: 5px 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        // @apply left-1/3
      }
    }

    .item_name {
      @apply absolute h-70/100 w-full left-0px top-0px flex flex-col z-10 items-center justify-between py-20px;

      .name {
        @apply text-lightFirst w-full text-center px-20px;
      }
    }

    .item_top_info {
      @apply absolute w-full top-0px h-50px left-0px;

      .LeagueLogo {
        @apply w-full h-full flex items-center pl-10px;
      }

      .League {
        @apply w-full h-full flex items-center justify-center text-lightFirst;

        .League_name {
          @apply px-10px;
        }
      }
    }

    .footer_subtitle {
      @apply h-61px p-10px bg--hex-111319 rounded-bl-10px rounded-br-10px;

      .subtitle {
        @apply text-14px font-bold text-dark;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .actions {
        @apply flex items-center justify-between text-12px font-normal text-info mt-10px;

        .actions_right_blue {
          @apply flex items-center text-primaryFirst;
        }

        .actions_right {
          @apply flex items-center ml-10px;

          .count_ {
            @apply font-sans;
          }
        }
      }
    }

    .footer_live {
      @apply h-61px p-10px bg-hex-111319 rounded-bl-10px rounded-br-10px flex items-center;

      .outer {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: linear-gradient(180deg, #FFF3C7 0%, #DDD67E 100%);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .inner {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #111319;
      }

      .subtitle_l {
        @apply w-full flex items-center justify-between;

        .live_name {
          @apply text-14px text-white text-left;
          // max-width: 160px !important;
          margin-left: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .competition_item_scale:hover {
    scale: 1.1;
  }

  .competition_noLeft {
    @apply mr-0px;
  }
}

// }</style>
