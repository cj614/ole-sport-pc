<template>
  <div
      class="schedule_item"
      :class="{schedule_item_border:item.isLive}"
      @click="handleClickScheduleItem(item)"
  >
    <div class="item_pad">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <p class="schedule_title whiteSpace_nowrap" v-bind="attrs" v-on="on">{{ item.competition }}</p>
        </template>
        <span>{{ item.competition }}</span>
      </v-tooltip>

      <v-divider></v-divider>
      <div class="schedule_vs">
        <div class="vs_content">
          <page-pageLoad :src="item.home_logo" width="40" height="40" :contain="true"></page-pageLoad>
          <span class="vs_tit">VS</span>
          <page-pageLoad :src="item.away_logo" width="40" height="40" :contain="true"></page-pageLoad>
        </div>
      </div>
      <div class="schedule_msg">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" class="whiteSpace_nowrap team_text">{{ item.home }}</span>
          </template>
          <span>{{ item.home }}</span>
        </v-tooltip>
        <span class="score_txt whiteSpace_nowrap">{{ item.HomeScore || (item.isLive ? 0 : '-') }}</span>
      </div>
      <div class="schedule_msg">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" class="whiteSpace_nowrap team_text">{{ item.away }}</span>
          </template>
          <span>{{ item.away }}</span>
        </v-tooltip>
        <span class="score_txt whiteSpace_nowrap">{{ item.AwayScore || (item.isLive ? 0 : '-') }}</span>
      </div>
      <v-divider></v-divider>
      <div class="schedule_footer">
        <span class="time_date">{{ item.start_time }}</span>
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
              v-if="!item.subscribed"
          >{{ $t(`Module['预约']`) }}
          </v-btn>
          <v-btn
              minWidth="44"
              height="29"
              outlined
              depressed
              color="#F9B31F"
              v-if="item.subscribed"
          >{{ $t(`Module['取消']`) }}
          </v-btn>
        </template>
      </div>
    </div>
  </div>
</template>


<script>
import {sub_top_match_list} from '@/api/live'

export default {
  props: {
    itemData: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      item: this.itemData,
      Img: {
        Calendar: require(`@/${this.$img.Page.Home.Calendar}`)
      },
      Lottie: {
        Card: require(`@/${this.$lottie.Live.Card}`)
      },
      pageLoading: false,
      list: [],
      row: {},
    }
  },

  computed: {
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    token() {
      let {token} = this.userInfo
      return token || ''
    }
  },

  methods: {
    handleClickScheduleItem(item) {
      const {isLive} = item
      if (isLive) {
        this.handleGoLive(item)
      } else {
        this.handleSchedule(item)
      }
    },
    handleSchedule(item) {
      const {token} = this
      if (!token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      this.row = item
      let status = 1
      if (item.subscribed) {
        status = 0
      }
      sub_top_match_list({
        all_match_id: item.id,
        match_time: item.match_time,
        status: status,
      }).then(res => {
        const {Code, Data} = res
        if (Code === 200) {
          if (Data) {
            this.item.subscribed =  Data.status === 1
          }
        }
      })
    },

    handleGoLive(item) {
      const {token} = this
      if (!token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      let {isLive, GliveMatchId} = item
      if (isLive) {
        if (GliveMatchId) {
          this.$router.push({
            name: 'officialRoom',
            params: {id: GliveMatchId}
          })
          return
        }
      }
      this.$bus.$emit('snackbar/on', this.$t(`Module['目前暂无直播']`))
    },

  }
}
</script>

<style lang="scss" scoped>
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
</style>