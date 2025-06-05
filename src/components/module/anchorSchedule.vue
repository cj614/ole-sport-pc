<template>
  <div class="m_anchor_warp">
    <template v-if="scheduleList.length">
      <div class="m_anchor_list" v-for="(item,index) in scheduleList" :key="index">
        <div class="anchor_content">
          <div class="apply_time">
            <template v-if="item.Matches.length">
              <div class="apply_h mb-20px" v-for="(mt,index) in item.Matches" :key="index">
                <template v-if="index === 0">
                  <span class="week">{{mt.weekName}}</span>
                  <span class="time">{{mt.day}} {{ mt.times}}</span>
                </template>
                <template v-else>
                  <span class="time">{{ mt.times}}</span>
                </template>
              </div>
            </template>
            <template v-else>
              <div class="apply_h">
                <span class="week">{{item.weekName}}</span>
                <span class="time">{{item.day}}</span>
              </div>
            </template>
          </div>
          <div class="apply_match_content" v-if="item.Matches.length">
            <div class="apply_content" v-for="(mt,index) in item.Matches" :key="index">
              <div class="apply_item_title" :class="{['!w-146px']:type==='room'}">
                <span class="name">{{mt.competition_name}}</span>
              </div>

              <div
                class="apply_item_match"
                :class="{['!w-484px']:type==='room'}"
                :style="{flex:type==='room'?'none':'1'}"
              >
                <div class="item-pd">
                  <div class="team-content">
                    <div class="item2-team">
                      <div class="mr-10px" v-if="mt.home_logo">
                        <page-pageLoad
                          :src="mt.home_logo"
                          width="40"
                          height="40"
                          :defaultImg="getDefaultLogo(mt)"
                          :contain="true"
                        ></page-pageLoad>
                      </div>
                      <div class="team-txt">{{mt.home_name}}</div>
                    </div>
                    <div class="item2-count">
                      <span class="number1">{{setScoreByCode(setHomeScores(mt),mt)}}</span>
                      <span class="abc">VS</span>
                      <span class="number1">{{setScoreByCode(setAwayScores(mt),mt)}}</span>
                    </div>
                    <div class="item2-team justify-end">
                      <div class="team-txt">{{mt.away_name}}</div>
                      <div class="ml-10px" v-if="mt.away_logo">
                        <page-pageLoad
                          :src="mt.away_logo"
                          width="40"
                          :defaultImg="getDefaultLogo(mt)"
                          height="40"
                          :contain="true"
                        ></page-pageLoad>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="apply_item_action"
                :class="type==='room'?'apply_item_action_room':'apply_item_action_other'"
              >
                <v-btn
                  :minWidth="type=='room'?100:150"
                  height="40"
                  v-if="mt.status == 1"
                  depressed
                  outlined
                  :color="!['FT','AP','AET'].includes(mt.end_status)?'error':'info'"
                  :class="!['FT','AP','AET'].includes(mt.end_status)?'':'live_btn_ft'"
                >{{$t(`Module['${mt.end_status || "FT"}']`)}}</v-btn>
                <v-btn
                  :minWidth="type==='room'?100:150"
                  height="40"
                  color="#fff"
                  class="live_btn"
                  v-if="mt.status==3"
                  depressed
                  @click.stop="handleSchedule(mt)"
                >{{$t(`Module['预约']`)}}</v-btn>
                <v-btn
                  :minWidth="type=='room'?100:150"
                  height="40"
                  v-else-if="mt.status==4"
                  color="#F9B31F"
                  depressed
                  outlined
                  @click="handleSchedule(mt)"
                >{{$t(`Module['取消']`)}}</v-btn>
                <v-btn
                  :minWidth="type==='room'?100:150"
                  height="40"
                  v-else-if="mt.status==2"
                  color="#fff"
                  class="live_btn_blue"
                  depressed
                  outlined
                  @click="matchClick(mt)"
                >{{$t(`Module['直播中']`)}}...</v-btn>
              </div>
            </div>
          </div>
          <div class="no_apply_match_content" v-else>{{$t(`Module['暂无赛事']`)}}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <page-empty :top="60" class="h-full" :title="$t(`Module['暂无数据']`)"></page-empty>
    </template>
    <page-subDialog
      :anchor="true"
      :anchorId="anchorId"
      @subSuccess="subSuccess"
      ref="subRef"
      type="match"
      :row="row"
    ></page-subDialog>
  </div>
</template>

<script>
import { anchorScheduleList, getLiveSubscribeMatchList } from '@/api/live'
import dayjs from 'dayjs'
import { setScores, setStartM } from '@/libs/util'
import { weekName } from '@/libs/enumerate'
export default {
  props: {
    userId: {
      type: [String, Number],
      default: ''
    },

    anchorId: {
      type: [String, Number],
      default: ''
    },

    type: {
      type: String,
      default: 'room'
    }
  },
  data() {
    return {
      scheduleList: [],
      row: {}
    }
  },

  computed: {
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    prefix() {
      return JSON.parse(this.$store.state.app.localConfig).prefix || ''
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    }
  },

  mounted() {
    this.anchorScheduleList()
  },

  methods: {
    setScoreByCode(score, mt) {
      //未開賽 :延期.取消.異常.待定.未开
      let filterStatusCode = ['Postp.', 'Canc.', 'Excep.', 'TBD']
      const { status, end_status, sport_type } = mt
      if (!['FOOTBALL', 'BASKETBALL'].includes(sport_type)) {
        return ''
      }
      if (status == 1) {
        return filterStatusCode.includes(end_status) ? '-' : score
      } else return score
    },
    getDefaultLogo(mt) {
      const { sport_type } = mt
      let type = ['FOOTBALL', 'BASKETBALL']
      let str = 'no'
      if (type.includes(sport_type)) {
        str = 'MatchDefault'
      }
      return str
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

    matchClick(item) {
      console.log("单击的数据",item)
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }

      if (item.status === 2) {
        let { live_room_id } = item
        if (live_room_id) {
          this.$router.push({
            name: 'anchorRoom',
            params: { id: live_room_id }
          })
        } else {
          this.$bus.$emit('snackbar/on', this.$t(`Module['目前暂无直播']`))
        }
      }
      if (item.status === 3 || item.status === 4) {
        this.handleSchedule(item)
      }
    },

    hasDay(item, now) {
      const [arr] = item.Matches
      const { match_time } = arr

      return (
        dayjs(
          dayjs(match_time * 1000).format('YYYY-MM-DD 00:00:00')
        ).valueOf() ===
        dayjs(dayjs(now).format('YYYY-MM-DD 00:00:00')).valueOf()
      )
    },

    getWeek2(now) {
      return this.prefix === 'CN'
        ? weekName[`${now.format('ddd')}`]
        : now.format('ddd')
    },

    getDay(item) {
      const [arr] = item.Matches
      const { match_time } = arr
      return this.$date(match_time * 1000).format('DD MMM HH:mm')
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
      this.anchorScheduleList()
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
          limit: 50,
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

    async anchorScheduleList() {
      const { anchorId } = this
      let now = this.$date()
      let now2 = now.add('7', 'day')
      let start = this.$date(now.format('YYYY-MM-DD 00:00:00')).valueOf() / 1000
      let end = this.$date(now2.format('YYYY-MM-DD 23:59:59')).valueOf() / 1000
      const param = {
        anchor_user_id: anchorId,
        start,
        end
      }
      const { Code, Data } = await anchorScheduleList(param)
      if (Code === 200) {
        this.setScheduleList(Data, now)
      }
    },

    setScheduleList(list, now) {
      let scheduleList = []
      for (let i = 0; i < 7; i++) {
        let now2 = now
        if (i != 0) {
          now2 = now.add(i, 'day')
        }
        let weekName = this.getWeek2(now2)
        let day = now2.format('DD MMM')
        scheduleList.push({
          weekName,
          day,
          Matches: []
        })
        for (let sl of list) {
          if (this.hasDay(sl, now2)) {
            let arr = sl.Matches.map(m => ({
              ...m,
              competition_id: sl.competition_id,
              competition_logo: sl.competition_logo,
              competition_name: sl.competition_name,
              sport_type: sl.sport_type,
              weekName,
              day,
              times: this.$date(m.match_time * 1000).format('HH:mm')
            }))

            scheduleList[i].Matches.push(...arr)
          }
        }
      }
      scheduleList.forEach(f => {
        if (f.Matches && f.Matches.length) {
          f.Matches.sort((a, b) => a.match_time - b.match_time)
        }
      })
      this.scheduleList = scheduleList
    },

    setHomeScores({ status, home_scores, sport_type }) {
      return ['BASKETBALL', 'FOOTBALL'].includes(sport_type)
        ? setScores(home_scores, sport_type, status)
        : ''
    },

    setAwayScores({ status, away_scores, sport_type }) {
      return ['BASKETBALL', 'FOOTBALL'].includes(sport_type)
        ? setScores(away_scores, sport_type, status)
        : ''
    },

    setStartM(item) {
      return setStartM(item, item.sport_type)
    }
  }
}
</script>

<style lang="scss" scoped>
.m_anchor_warp {
  @apply w-full bg-lightFirst min-h-430px;
  .m_anchor_list {
    @apply w-full;
    .anchor_content {
      @apply flex;
      .apply_time {
        @apply w-150px;
        .apply_h {
          @apply flex flex-col items-center justify-center h-64px;
          .week {
            @apply font-bold text-16px leading-24px;
          }
          .time {
            @apply font-bold text-info leading-16px mt-4px;
          }
        }
      }
      .apply_match_content {
        @apply flex flex-col flex-1 overflow-hidden;
        .apply_content {
          @apply flex w-full items-center rounded-10px cursor-pointer overflow-hidden h-64px mb-20px bg-accentSecond px-20px;
          .apply_item_title {
            @apply w-170px  flex flex-col justify-center;
            .name {
              @apply font-bold text-16px;
            }
            .time {
              @apply font-bold text-info leading-16px mt-8px;
            }
          }

          .apply_item_match {
            @apply flex items-center px-20px overflow-hidden;
            .item-pd {
              @apply flex w-460px items-center;
            }
            .team-content {
              @apply flex items-center justify-between  w-full;
              .item2-team {
                @apply flex items-center flex-1 overflow-hidden;
                .team-txt {
                  @apply text-12px font-normal text-dark leading-20px;
                  word-break: break-all;
                }
              }
              .item2-count {
                @apply min-w-80px mx-10px flex items-center justify-between;
                .number1 {
                  @apply font-sans text-20px font-bold text-primaryFirst;
                }
                .abc {
                  @apply text-14px font-normal text-dark mx-15px;
                }
              }
            }
          }

          .apply_item_action {
            @apply flex justify-end;
            .v-btn {
              @apply rounded-20px;
            }
            .live_btn {
              background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
              color: #fff;
            }
            .live_btn_ft {
              @apply bg-tertiary border-none;
            }
            .live_btn_blue {
              background: #2BA5FF;
              color: #fff;
            }
            .living {
              background: #2BA5FF;
              color: #fff;
            }
          }
        }
        .apply_item_action_other {
          @apply w-150px;
        }
        .apply_item_action_room {
          @apply w-100px;
        }

        .apply_content:hover {
          background: rgba(249, 179, 31, 0.15);
        }
      }
      .no_apply_match_content {
        @apply flex justify-center items-center flex-1 overflow-hidden h-64px bg-accentSecond text-16px text-info mb-20px rounded-10px;
      }
    }
  }
}
</style>