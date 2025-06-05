<template>
  <div class="m_schedule_warp">
    <swiper class="swiper" :options="swiperOptionTop" v-if="matchList.length">
      <swiper-slide class="slide" v-for="(item, index) in matchList" :key="index">
        <schedule-card :item-data="item"></schedule-card>
      </swiper-slide>
    </swiper>
    <template v-else>
      <module-skeletonCard v-if="pageLoading" width="270" height="290" skeletonClass="mr-30px" :forIt="4"
        type="list-item-avatar, divider, list-item-three-line, card-heading,divider,list-item-avatar"></module-skeletonCard>
      <page-empty v-else :top="0" :title="$t(`Module['暂无数据']`)"></page-empty>
    </template>
  </div>
</template>


<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import { top_match_list } from '@/api/live'
import { setScores } from '@/libs/util.js'
import ScheduleCard from "_c/page/scheduleCard.vue";

export default {
  components: { ScheduleCard, Swiper, SwiperSlide },

  data() {
    return {
      Img: {
        Calendar: require(`@/${this.$img.Page.Home.Calendar}`)
      },
      Lottie: {
        Card: require(`@/${this.$lottie.Live.Card}`)
      },
      pageLoading: false,
      list: [],
      row: {},
      timer: null
    }
  },

  computed: {
    matchList() {
      let { list: matchData } = this
      return matchData.map(item => {
        let isLive = this.$date(item.UTCTimeStartInt * 1000).isBefore(
          this.$date()
        )
        return {
          ...item,
          title: item.League,
          HomeScore: isLive
            ? item.HomeScore !== ''
              ? setScores(item.HomeScore, item.Type)
              : '-'
            : '-',
          AwayScore: isLive
            ? item.AwayScore !== ''
              ? setScores(item.AwayScore, item.Type)
              : '-'
            : '-',
          list: [
            {
              icon: item.HomeLogo,
              name: item.Home,
              score: isLive
                ? item.HomeScore !== ''
                  ? setScores(item.HomeScore, item.Type)
                  : '-'
                : '-'
            },
            {
              icon: item.AwayLogo,
              name: item.Away,
              score: isLive
                ? item.AwayScore !== ''
                  ? setScores(item.AwayScore, item.Type)
                  : '-'
                : '-'
            }
          ],
          start_time: this.$date(item.match_time * 1000).format('MM-DD HH:mm'),
          isLive,
          btnInfo: {
            text: item.subscribed
              ? this.$t(`Module['取消']`)
              : this.$t(`Module['预约']`),
            type: item.subscribed ? 'close' : 'subscribed'
          }
        }
      })
    },
    swiperOptionTop() {
      return {
        slidesPerView: 4,
        freeMode: true
        // autoplay: {
        //   delay: 2000,
        //   disableOnInteraction: false
        // }
      }
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
    this.top_match_listinit()
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  methods: {
    subTopMatch(data) {
      const { index, status } = data
      this.matchList[index].subscribed = status
    },

    async top_match_listinit() {
      try {
        this.pageLoading = true
        let now = this.$date()
        let day = now.add('1', 'day')
        let start = Math.floor(
          this.$date(day.format('YYYY-MM-DD 00:00:00')).valueOf() / 1000
        )
        let end = Math.floor(
          this.$date(day.format('YYYY-MM-DD 59:59:59')).valueOf() / 1000
        )
        const { Code, Data } = await top_match_list({
          page: 1,
          limit: 500,
          start,
          end
        })


        if (Code === 200) {
          this.list = Data.Data
        }
        this.pageLoading = false
      } catch (error) {
        this.pageLoading = false
        throw error
      }
    },

  }
}
</script>

<style lang="scss" scoped>
.m_schedule_warp {
  @apply mb-40px relative h-200px;

  .schedule_item {
    @apply h-223px w-270px rounded-10px bg-lightFirst;

    .item_pad {
      @apply px-20px;

      .v-divider {
        @apply border-accent;
      }

      .schedule_title {
        @apply text-16px h-44px leading-44px font-bold text-dark mb-0px;
      }

      .schedule_vs {
        @apply my-15px flex justify-center;

        .vs_content {
          @apply w-190px flex justify-between items-center;

          .vs_tit {
            @apply text-16px font-bold text-dark;
          }
        }
      }

      .schedule_msg {
        @apply flex items-center justify-between mb-15px;

        .team_text {
          @apply font-kanit max-w-180px text-16px;
        }

        .score_txt {
          @apply text-16px font-sans font-bold text-primaryFirst max-w-80px;
        }
      }

      .schedule_footer {
        @apply text-14px font-bold text-dark flex justify-between items-center h-44px;

        .time_date {
          @apply font-sans;
        }

        box-sizing: border-box;

        .footer_right {
          @apply flex items-center justify-center;
        }

        .is_live {
          @apply flex items-center cursor-pointer;

          .lottie_card {
            @apply w-24px h-24px;
          }

          .live {
            @apply font-bold font-kanit pl-5px;
          }
        }

        .v-btn {
          @apply rounded-6px;
        }

        .subscribed {
          background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
          border-radius: 6px;
          color: #fff;
        }
      }
    }
  }

  .schedule_item_border {
    @apply border-1px border-solid border-warning;
  }

  .v-slide-group__prev {
    position: absolute;

    .v-icon {
      display: none;
    }
  }

  .v-slide-group__next {
    // display: none;
    position: absolute;

    .v-icon {
      display: none;
    }
  }

  .sai_right_fix {
    @apply absolute right-0px top-0px w-80px flex h-223px flex-col justify-center items-center rounded-r-10px rounded-bl-10px z-2;
    background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);

    // border-radius: 0px 10px 10px 0px;
    .fix_txt {
      @apply font-serif text-14px font-normal text-lightFirst mt-5px;
    }
  }

  .swiper-slide {
    filter: none;
    width: 290px !important;
  }
}
</style>