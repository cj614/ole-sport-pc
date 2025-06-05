<template>
  <div class="m_event_warp">
    <div class="event_header">
      <div class="team_item">
        <span class="mr-10px">
          <v-img width="40" height="40" :src="matchInfo.leftInfo.img" contain></v-img>
        </span>
        <span class="name">{{ matchInfo.leftInfo.name }}</span>
      </div>
      <div class="team_item">
        <span class="mr-10px">
          <v-img width="40" height="40" :src="matchInfo.rightInfo.img" contain></v-img>
        </span>
        <span class="name">{{ matchInfo.rightInfo.name }}</span>
      </div>
    </div>
    <div class="event_time_line_content" v-if="incidentsListData.length">
      <div
        :class="index===0?'first_half':'last_half'"
        v-for="(item,index) in incidentsListData"
        :key="index"
      >
        <span class="mt-30px" v-if="index===0 && !item.hide">
          <v-img :src="Img.Time" width="10" height="10" :contain="true"></v-img>
        </span>

        <v-timeline align-top v-if="item.list.length">
          <v-timeline-item
            color="#F9B31F"
            icon-color="#fff"
            fill-dot
            v-for="(lt,Lindex) in item.list"
            :left="lt.position==='left'"
            :right="lt.position==='right'"
            :class="{incident_item_left:lt.position==='left'}"
            :key="Lindex"
          >
            <template v-slot:icon>
              <v-avatar height="38" width="38" min-width="38">
                <div class="time">
                  <template v-if="lt.type == 29 || lt.type == 30">PK</template>
                  <template v-else>{{ lt.timeText}}</template>
                </div>
              </v-avatar>
            </template>

            <div
              class="time_line_content_po"
              :style="{height:lt.inPlayerName || lt.assistPlayerName?'58px':'36px'}"
            >
              <div class="time_line_content">
                <template v-if="lt.inPlayerName">
                  <div class="time_item">
                    <span>
                      <v-img
                        :src="require(`@/${$img.Page.Incidents.Up}`)"
                        width="16"
                        height="16"
                        :contain="true"
                      ></v-img>
                    </span>
                    <span class="text-12px leading-18px mx-10px">{{lt.inPlayerName}}</span>
                  </div>
                  <div class="time_item mt-4px">
                    <span>
                      <v-img
                        :src="require(`@/${$img.Page.Incidents.Down}`)"
                        width="16"
                        height="16"
                        :contain="true"
                      ></v-img>
                    </span>
                    <span class="text-12px leading-18px mx-10px">{{lt.outPlayerName}}</span>
                  </div>
                </template>
                <template v-else-if="lt.assistPlayerName">
                  <div class="time_item">
                    <span>
                      <v-img :src="require(`@/${lt.img}`)" width="16" height="16" :contain="true"></v-img>
                    </span>
                    <span class="text-12px leading-18px mx-10px">{{lt.playerName}}</span>
                  </div>
                  <div class="time_item mt-4px">
                    <span>
                      <v-img
                        :src="require(`@/${$img.Page.Incidents.Assist}`)"
                        width="16"
                        height="16"
                        :contain="true"
                      ></v-img>
                    </span>
                    <span class="text-12px leading-18px mx-10px">{{lt.assistPlayerName}}</span>
                  </div>
                </template>
                <template v-else>
                  <div class="time_item">
                    <span v-if="lt.img">
                      <v-img :src="require(`@/${lt.img}`)" width="16" height="16" :contain="true"></v-img>
                    </span>
                    <div v-if="lt.typeMsg" class="typeMsg">{{lt.typeMsg}}</div>
                    <span class="text-12px leading-18px mx-5px name">{{lt.playerName }}</span>
                  </div>
                </template>
              </div>
            </div>
          </v-timeline-item>
          <v-timeline-item
            color="#F9B31F"
            class="time_start"
            icon-color="#fff"
            small
            fill-dot
            v-if="index===0"
          >
            <template v-slot:icon>
              <v-avatar size="10"></v-avatar>
            </template>
          </v-timeline-item>
        </v-timeline>
        <div class="end" v-if="item.list.length && !item.hide">{{item.name}}</div>
      </div>
    </div>
    <div class="empty_box" v-else>
      <page-empty type="room" :top="0" :title="$t(`Module['暂无数据']`)"></page-empty>
    </div>
    <div class="legend_content">
      <div class="leg_title">{{$t(`Module['图例']`)}}：</div>
      <ul class="leg_list">
        <li v-for="(item,index) in legendList" :key="index" class="leg_item">
          <span>
            <v-img width="15" height="15" :src="item.icon" :contain="true"></v-img>
          </span>
          <span class="txt">{{item.name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getIncidents } from '@/api/live'
export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    },

    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      Img: {
        Time: require(`@/${this.$img.Page.Room.Time}`)
      },
      incidentsData: {}
    }
  },
  computed: {
    legendList() {
      const {
        Goal,
        OwnGoal,
        Penalty,
        MissedPenalty,
        Assist,
        YellowCard,
        RedCard,
        SecondYellowCard,
        Substitution,
        VAR
      } = this.$img.Page.Incidents
      return [
        {
          name: this.$t(`Module['进球']`),
          icon: require(`@/${Goal}`)
        },
        {
          name: this.$t(`Module['乌龙球']`),
          icon: require(`@/${OwnGoal}`)
        },
        {
          name: this.$t(`Module['点球']`),
          icon: require(`@/${Penalty}`)
        },
        {
          name: this.$t(`Module['点球罚失']`),
          icon: require(`@/${MissedPenalty}`)
        },
        {
          name: this.$t(`Module['助攻']`),
          icon: require(`@/${Assist}`)
        },
        {
          name: this.$t(`Module['黄牌']`),
          icon: require(`@/${YellowCard}`)
        },
        {
          name: this.$t(`Module['红牌']`),
          icon: require(`@/${RedCard}`)
        },
        {
          name: this.$t(`Module['两黄变一红']`),
          icon: require(`@/${SecondYellowCard}`)
        },
        {
          name: this.$t(`Module['换人']`),
          icon: require(`@/${Substitution}`)
        },
        {
          name: 'VAR',
          icon: require(`@/${VAR}`)
        }
      ]
    },

    Incidents() {
      return this.$img.Page.Incidents
    },

    incidentsListData() {
      let { incidentsData } = this
      let { incidents, ht_score, ft_score } = incidentsData
      let list = []
      if (Object.keys(incidentsData).length > 0) {
        let HTArr = []
        let FTArr = []
        let overTimeArr = []
        let penaltyArr = []
        let htKey = ''
        let ftKey = ''
        let overTimeKey = ''
        let penaltyKey = ''
        incidents.forEach((item, key) => {
          if (item.type === 11) {
            htKey = key
          }
          if (item.type === 12) {
            ftKey = key
          }
          if (item.type === 26) {
            overTimeKey = key
          }
          if (item.type === 27) {
            penaltyKey = key
          }
        })
        incidents.forEach((item, key) => {
          if (htKey !== '') {
            if (key < htKey) {
              HTArr.push(item)
            }
            if (ftKey !== '') {
              if (key > htKey && key < ftKey) {
                FTArr.push(item)
              }
              if (key > ftKey) {
                if (item.type == 29 || item.type == 30) {
                  penaltyArr.push(item)
                } else {
                  if (key !== overTimeKey && key !== penaltyKey) {
                    overTimeArr.push(item)
                  }
                }
              }
            } else {
              if (key > htKey) {
                FTArr.push(item)
              }
            }
          } else {
            HTArr.push(item)
          }
        })
        HTArr.reverse()
        FTArr.reverse()
        overTimeArr.reverse()
        penaltyArr.reverse()
        list = [
          {
            name: `HT ${ht_score}`,
            hide: htKey === '' ? true : false,
            list: this.setIncidentsItem(HTArr)
          },
          {
            name: `FT ${ft_score}`,
            hide: ftKey === '' ? true : false,
            list: this.setIncidentsItem(FTArr)
          }
        ]
        if (overTimeArr.length > 0) {
          let diffArr = overTimeArr.filter(item => {
            return item.type === 1
          })
          list.push({
            name:
              diffArr.length > 0 &&
              diffArr[0].home_score !== undefined &&
              diffArr[0].away_score !== undefined
                ? `AET ${diffArr[0].home_score}-${diffArr[0].away_score}`
                : `AET`,
            hide: overTimeKey === '' ? true : false,
            list: this.setIncidentsItem(overTimeArr)
          })
        }
        if (penaltyArr.length > 0) {
          list.push({
            name:
              penaltyArr[0].home_score !== undefined &&
              penaltyArr[0].away_score !== undefined
                ? `PEN ${penaltyArr[0].home_score}-${penaltyArr[0].away_score}`
                : `PEN`,
            list: this.setIncidentsItem(penaltyArr)
          })
        }
      }
      return list
    },

    matchInfo() {
      let { item } = this
      return {
        leftInfo: {
          img: item.HomeLogo || '',
          name: item.Home || ''
        },
        rightInfo: {
          img: item.AwayLogo || '',
          name: item.Away || ''
        }
      }
    },

    incidentsList() {
      return this.$store.state.app.incidentsList
    }
  },
  methods: {
    setIncidentsItem(arr) {
      let { incidentsList, Incidents, incidentsData } = this
      let { players, type_code } = incidentsData
      return arr
        .map(item => {
          let diff = incidentsList.filter(cell => {
            return cell.id === item.type
          })

          return {
            type: item.type,
            timeText: `${item.time}`,
            imgInfo: diff.length > 0 ? diff[0] : {},
            img: diff.length > 0 ? Incidents[diff[0].type] : '',
            position: item.position === 1 ? 'left' : 'right',
            incidentsText: type_code[item.type],
            playerName: item.player_id ? players[item.player_id].name : '',
            inPlayerName: item.in_player_id
              ? players[item.in_player_id].name
              : '',
            outPlayerName: item.out_player_id
              ? players[item.out_player_id].name
              : '',
            assistPlayerName:
              item.type === 1 && item.assist1_id
                ? players[item.assist1_id].name
                : '',
            typeMsg:
              item.type === 1 ? `${item.home_score}-${item.away_score}` : ''
          }
        })
        .filter(r => r.type !== 19)
    },
    liveMatchIncidents() {
      let { id } = this
      getIncidents({
        glive_match_id: id
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          this.incidentsData = Data || {}
        }
      })
    }
  },
  mounted() {
    this.liveMatchIncidents()
    this.$bus.$on(`liveScore`, this.liveMatchIncidents)
  },
  destroyed() {
    this.$bus.$off(`liveScore`, this.liveMatchIncidents)
  }
}
</script>

<style lang="scss" scoped>
.m_event_warp {
  @apply bg-lightFirst;
  .event_header {
    @apply flex items-center justify-between px-20px py-5px;
    background: rgba(249, 179, 31, 0.25);
    .team_item {
      @apply flex items-center;
    }
  }
  .event_time_line_content {
    @apply pt-40px pb-20px flex flex-col-reverse;
    .first_half {
      @apply flex flex-col-reverse items-center mt-10px;
      .v-timeline {
        @apply min-w-525px;
        .time_start {
          @apply pb-0px;
          .v-timeline-item__dot {
            @apply w-10px h-10px;
          }
        }
        .time_line_content {
          @apply rounded-tr-10px rounded-b-10px py-8px px-16px border-1px border-solid border-primaryFirst bg-accentSecond;
          .time_item {
            @apply flex items-center;
            .typeMsg {
              @apply bg-primaryFirst rounded-4px mx-5px px-5px h-18px font-sans font-bold text-12px text-light text-center leading-18px;
            }
          }
        }
      }
      .incident_item_left {
        .time_line_content {
          @apply rounded-tl-10px rounded-tr-0px;
          .time_item {
            flex-direction: row-reverse;
          }
        }
      }
      .v-timeline::before {
        background: #f9b31f;
      }
      .time {
        @apply text-lightFirst relative;
        .sub_m {
          @apply absolute;
        }
      }
      .end {
        @apply w-81px h-31px flex items-center justify-center bg-accent font-bold text-16px mb-10px;
      }
    }
    .last_half {
      @apply flex flex-col-reverse items-center;
      .v-timeline {
        @apply min-w-525px;
        .time_line_content {
          @apply rounded-tr-10px rounded-b-10px py-8px px-16px border-1px border-solid border-primaryFirst bg-accentSecond;
          .time_item {
            @apply flex items-center;
            .typeMsg {
              @apply bg-primaryFirst mx-5px rounded-4px px-5px h-18px font-sans font-bold text-12px text-light text-center leading-18px;
            }
          }
        }
      }
      .v-timeline::before {
        background: #f9b31f;
      }

      .incident_item_left {
        .time_line_content {
          @apply rounded-tl-10px rounded-tr-0px;
          .time_item {
            flex-direction: row-reverse;
          }
        }
      }
      .time {
        @apply text-lightFirst relative;
        .sub_m {
          @apply absolute;
        }
      }
      .end {
        @apply w-81px h-31px flex items-center justify-center bg-accent font-bold text-16px mb-10px;
      }
    }
    .time_line_content_po {
      @apply relative;
      .time_line_content {
        @apply absolute;
      }
    }
    .incident_item_left {
      .time_line_content {
        right: 0px;
      }
    }
  }
  .empty_box {
    @apply h-400px flex justify-center items-center;
  }
  .legend_content {
    @apply p-20px;
    .leg_title {
      @apply text-16px mb-10px;
    }
    .leg_list {
      @apply pl-0px flex flex-wrap rounded-10px bg-accent;
      .leg_item {
        @apply w-1/5 flex h-40px px-20px items-center;
        .txt {
          @apply text-12px ml-10px;
        }
      }
    }
  }
}
</style>