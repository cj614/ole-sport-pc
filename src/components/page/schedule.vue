<template>
  <div class="m_schedule_warp">
    <swiper class="swiper" :options="swiperOptionTop" v-if="matchList.length">
      <swiper-slide class="slide" v-for="(item,index) in matchList" :key="index">
        <div
          class="schedule_item"
          :class="{schedule_item_border:item.isLive}"
          @click="handleClickScheduleItem(item)"
        >
          <div class="item_pad">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <p class="schedule_title whiteSpace_nowrap" v-bind="attrs" v-on="on">{{item.title}}</p>
              </template>
              <span>{{item.title}}</span>
            </v-tooltip>

            <v-divider></v-divider>
            <div class="schedule_vs">
              <div class="vs_content">
                <page-pageLoad :src="item.HomeLogo" width="40" height="40" :contain="true"></page-pageLoad>
                <span class="vs_tit">VS</span>
                <page-pageLoad :src="item.AwayLogo" width="40" height="40" :contain="true"></page-pageLoad>
              </div>
            </div>
            <div class="schedule_msg">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on" class="whiteSpace_nowrap team_text">{{item.Home}}</span>
                </template>
                <span>{{item.Home}}</span>
              </v-tooltip>
              <span class="score_txt whiteSpace_nowrap">{{item.HomeScore || (item.isLive?0:'-')}}</span>
            </div>
            <div class="schedule_msg">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on" class="whiteSpace_nowrap team_text">{{item.Away}}</span>
                </template>
                <span>{{item.Away}}</span>
              </v-tooltip>
              <span class="score_txt whiteSpace_nowrap">{{item.AwayScore || (item.isLive?0:'-')}}</span>
            </div>
            <v-divider></v-divider>
            <div class="schedule_footer">
              <span class="time_date">{{item.date}}</span>
              <template v-if="item.isLive">
                <div class="is_live">
                  <div class="lottie_card">
                    <page-lottie :animationData="Lottie.Card"></page-lottie>
                  </div>
                  <div class="live">{{ $t(`Module['直播中']`) }}...</div>
                </div>
              </template>
              <template v-else>
                <v-btn
                  minWidth="44"
                  height="29"
                  outlined
                  depressed
                  small
                  class="subscribed"
                  v-if="!item.Subscribed"
                >{{$t(`Module['预约']`)}}</v-btn>
                <v-btn
                  minWidth="44"
                  height="29"
                  outlined
                  depressed
                  color="#F9B31F"
                  v-if="item.Subscribed"
                >{{$t(`Module['取消']`)}}</v-btn>
              </template>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <template v-else>
      <module-skeletonCard
        v-if="pageLoading"
        width="270"
        height="290"
        skeletonClass="mr-30px"
        :forIt="4"
        type="list-item-avatar, divider, list-item-three-line, card-heading,divider,list-item-avatar"
      ></module-skeletonCard>
      <page-empty v-else :top="0" :title="$t(`Module['暂无数据']`)"></page-empty>
    </template>
    <div class="sai_right_fix cursor-pointer" @click.stop="toPage()">
      <span>
        <v-img :src="Img.Calendar" width="32" height="32"></v-img>
      </span>
      <span class="fix_txt">{{$t(`Module['赛程']`)}}</span>
    </div>
    <page-subDialog ref="subRef" type="tomorrow" :row="row" @subSuccess="subSuccess"></page-subDialog>
  </div>
</template>


<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import { getLiveSubscribeMatchList } from '@/api/live'
import { setScores } from '@/libs/util.js'
export default {
  components: { Swiper, SwiperSlide },

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
          date: this.$date(item.UTCTimeStartInt * 1000).format('MM-DD HH:mm'),
          isLive,
          btnInfo: {
            text: item.Subscribed
              ? this.$t(`Module['取消']`)
              : this.$t(`Module['预约']`),
            type: item.Subscribed ? 'close' : 'subscribed'
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
    this.getLiveSubscribeMatchList()

    // this.timer = setInterval(() => {
    //   this.getLiveSubscribeMatchList()
    // }, 20000)
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  methods: {
    handleClickScheduleItem(item) {
      const { isLive } = item
      if (isLive) {
        this.handleGoLive(item)
      } else {
        this.handleSchedule(item)
      }
    },
    handleSchedule(item) {
      const { token } = this
      if (!token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      this.row = item
      this.$refs.subRef.setDialog()
    },

    handleGoLive(item) {
      const { token } = this
      if (!token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      let { isLive, GliveMatchId } = item
      if (isLive) {
        if (GliveMatchId) {
          this.$router.push({
            name: 'officialRoom',
            params: { id: GliveMatchId }
          })
          return
        }
      }
      this.$bus.$emit('snackbar/on', this.$t(`Module['目前暂无直播']`))
    },

    toPage() {
      this.$router.push({ name: 'matchScore' })
    },

    handleCancel(item) {
      const { token } = this
      if (!token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      this.row = item
      this.$refs.subRef.setDialog()
    },

    subSuccess() {
      this.getLiveSubscribeMatchList()
    },

    async getLiveSubscribeMatchList() {
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
        const { Code, Data } = await getLiveSubscribeMatchList({
          page: 1,
          limit: 500,
          start,
          end
        })
        if (Code === 200) {
          const { Data: List } = Data
          this.list = List
        }
        this.pageLoading = false
      } catch (error) {
        this.pageLoading = false
        throw error
      }
    },

    getTime(item) {
      return this.$date(item.UTCTimeStartInt * 1000).format('MM-DD HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.m_schedule_warp {
  @apply mb-40px relative h-223px;
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
            @apply font-bold font-kanit  pl-5px;
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