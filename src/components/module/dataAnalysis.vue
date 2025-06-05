<template>
  <div class="m_data_analysis">
    <module-team :id="id" :type="type" @liveMatchScore="setLiveMatchScore"></module-team>
    <template v-if="type === 'FOOTBALL' && FOOTBALLDataAnalysisInfo.list">
      <div class="data_football">
        <ul
          class="data_home"
          :class="{['mr-120px']:index===0,['flex-row-reverse']:index===1}"
          v-for="(item,index) in FOOTBALLDataAnalysisInfo.header"
          :key="index"
        >
          <li v-for="(ft,gindex) in item" class="home_item" :key="gindex">
            <span class="num">{{ft.value}}</span>
            <span>
              <v-img width="24" height="24" :src="require(`@/${ft.icon}`)"></v-img>
            </span>
          </li>
        </ul>
      </div>
      <ul class="data_analysis">
        <li
          class="analysis_content"
          v-for="(item,index) in FOOTBALLDataAnalysisInfo.list"
          :key="index"
        >
          <template v-if="item.text==='射偏'">
            <div class="text">
              <div class="text_t">{{item.name}}</div>
            </div>
            <div class="home_item item deviate_home">
              <div class="deviate fast">{{item.leftText}}</div>
            </div>
            <div class="awy_item item deviate_awy">
              <div class="deviate fast">{{item.rightText}}</div>
            </div>
          </template>
          <template v-else-if="item.text==='射正'">
            <div class="text">
              <div class="text_t">{{item.name}}</div>
            </div>
            <div class="home_item item just_home">
              <div class="just">
                <div class="fast">{{item.leftText}}</div>
              </div>
            </div>
            <div class="awy_item item just_awy">
              <div class="just">
                <div class="fast">{{item.rightText}}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="text">
              <div class="text_t">{{item.name}}</div>
            </div>
            <div class="home_item item">
              <div class="num">{{item.leftText}}</div>
              <div class="progress">
                <div class="speed" :style="{width:item.leftPercentage+'px'}"></div>
              </div>
            </div>
            <div class="awy_item item">
              <div class="progress">
                <div class="speed" :style="{width:item.rightPercentage+'px'}"></div>
              </div>
              <div class="num">{{item.rightText}}</div>
            </div>
          </template>
        </li>
      </ul>
    </template>
    <template v-else-if="type === 'BASKETBALL' && BASKETBALLDataAnalysisInfo.list">
      <v-container class="px-20px">
        <v-row no-gutters>
          <v-col
            :cols="12/BASKETBALLDataAnalysisInfo.header.length"
            v-for="(item,index) in BASKETBALLDataAnalysisInfo.header"
            :key="index"
          >
            <template v-if="item.name">
              <div class="basket_item">{{item.name}}</div>
            </template>
          </v-col>
        </v-row>
        <v-row no-gutters v-for="(item,index) in BASKETBALLDataAnalysisInfo.tableData" :key="index">
          <v-col :cols="12/item.length" v-for="(it,cindex) in item" :key="cindex">
            <div class="basket_item">{{it.name}}</div>
          </v-col>
        </v-row>
      </v-container>
      <ul class="data_analysis">
        <li
          class="analysis_content"
          v-for="(item,index) in BASKETBALLDataAnalysisInfo.list"
          :key="index"
        >
          <div class="text">
            <div class="text_t">{{item.name}}</div>
          </div>
          <div class="home_item item">
            <div class="num">{{item.leftText}}</div>
            <div class="progress">
              <div class="speed" :style="{width:item.leftPercentage+'px'}"></div>
            </div>
          </div>
          <div class="awy_item item">
            <div class="progress">
              <div class="speed" :style="{width:item.rightPercentage+'px'}"></div>
            </div>
            <div class="num">{{item.rightText}}</div>
          </div>
        </li>
      </ul>
    </template>
    <div class="empty_box" v-else>
      <page-empty type="room" :top="0" :title="$t(`Module['暂无数据']`)"></page-empty>
    </div>
  </div>
</template>

<script>
import { getStats } from '@/api/live'
export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Img: {
        CornerKick: this.$img.Page.Room.CornerKick,
        YellowCard: this.$img.Page.Room.YellowCard,
        RedCard: this.$img.Page.Room.RedCard
      },
      dataAnalysis: {},
      liveMatchScore: {}
    }
  },

  computed: {
    BASKETBALLDataAnalysisInfo() {
      let { dataAnalysis, liveMatchScore } = this
      if (
        Object.keys(dataAnalysis).length &&
        Object.keys(liveMatchScore).length
      ) {
        let { away, home } = dataAnalysis
        let { matchData, matchNami } = liveMatchScore
        let header = [
          {
            name: '',
            col: 2,
            key: 'team'
          },
          {
            name: '1',
            key: 0
          },
          {
            name: '2',
            key: 1
          },
          {
            name: '3',
            key: 2
          },
          {
            name: '4',
            key: 3
          },
          {
            name: 'OT',
            key: 4
          }
        ]
        let { home_scores, away_scores } = matchNami

        let tableData = []
        let homeArr = []
        header.forEach(item => {
          if (item.key === 'team') {
            homeArr.push({
              ...item,
              name: matchData.homeName || ''
            })
          } else {
            homeArr.push({
              ...item,
              name: home_scores[item.key]
            })
          }
        })
        tableData.push(homeArr)
        let awayArr = []
        header.forEach(item => {
          if (item.key === 'team') {
            awayArr.push({
              ...item,
              name: matchData.awayName || ''
            })
          } else {
            awayArr.push({
              ...item,
              name: away_scores[item.key]
            })
          }
        })
        tableData.push(awayArr)

        return {
          header,
          tableData,
          list: [
            {
              name: this.$t(`Module['三分球']`),
              leftPercentage: Number(
                (home.three_pointer /
                  (home.three_pointer + away.three_pointer)) *
                  100
              ),
              rightPercentage: Number(
                (away.three_pointer /
                  (home.three_pointer + away.three_pointer)) *
                  100
              ),
              leftText: `${home.three_pointer}`,
              rightText: `${away.three_pointer}`
            },
            {
              name: this.$t(`Module['两分球']`),
              leftPercentage: Number(
                (home.two_pointer / (home.two_pointer + away.two_pointer)) * 100
              ),
              rightPercentage: Number(
                (away.two_pointer / (home.two_pointer + away.two_pointer)) * 100
              ),
              leftText: `${home.two_pointer}`,
              rightText: `${away.two_pointer}`
            },
            {
              name: this.$t(`Module['罚球']`),
              leftPercentage: Number(
                (home.free_throw / (home.free_throw + away.free_throw)) * 100
              ),
              rightPercentage: Number(
                (away.free_throw / (home.free_throw + away.free_throw)) * 100
              ),
              leftText: `${home.free_throw}`,
              rightText: `${away.free_throw}`
            },
            {
              name: this.$t(`Module['剩余暂停']`),
              leftPercentage: Number(
                (home.remaining_timeout /
                  (home.remaining_timeout + away.remaining_timeout)) *
                  100
              ),
              rightPercentage: Number(
                (away.remaining_timeout /
                  (home.remaining_timeout + away.remaining_timeout)) *
                  100
              ),
              leftText: `${home.remaining_timeout}`,
              rightText: `${away.remaining_timeout}`
            },
            {
              name: this.$t(`Module['犯规']`),
              leftPercentage: Number(
                (home.fouls / (home.fouls + away.fouls)) * 100
              ),
              rightPercentage: Number(
                (away.fouls / (home.fouls + away.fouls)) * 100
              ),
              leftText: `${home.fouls}`,
              rightText: `${away.fouls}`
            },
            {
              name: this.$t(`Module['罚球命中率']`),
              leftPercentage: Number(
                (home.free_throw_percentage /
                  (home.free_throw_percentage + away.free_throw_percentage)) *
                  100
              ),
              rightPercentage: Number(
                (away.free_throw_percentage /
                  (home.free_throw_percentage + away.free_throw_percentage)) *
                  100
              ),
              leftText: `${home.free_throw_percentage}`,
              rightText: `${away.free_throw_percentage}`
            }
          ]
        }
      } else {
        return {}
      }
    },
    FOOTBALLDataAnalysisInfo() {
      let { dataAnalysis, Img } = this
      if (Object.keys(dataAnalysis).length) {
        let { away, home } = dataAnalysis
        let header = [
          [
            {
              icon: Img.CornerKick,
              value: home.corner_kicks
            },
            {
              icon: Img.RedCard,
              value: home.red_cards
            },
            {
              icon: Img.YellowCard,
              value: home.yellow_cards
            }
          ],
          [
            {
              icon: Img.CornerKick,
              value: away.corner_kicks
            },
            {
              icon: Img.RedCard,
              value: away.red_cards
            },
            {
              icon: Img.YellowCard,
              value: away.yellow_cards
            }
          ]
        ]
        return {
          header,
          list: [
            {
              name: this.$t(`Module['控球率']`),
              leftPercentage: Number(home.ball_possession),
              rightPercentage: Number(away.ball_possession),
              leftText: `${home.ball_possession}%`,
              rightText: `${away.ball_possession}%`
            },
            {
              name: this.$t(`Module['进攻']`),
              leftPercentage: Number(
                (home.attack / (home.attack + away.attack)) * 100
              ),
              rightPercentage: Number(
                (away.attack / (home.attack + away.attack)) * 100
              ),
              leftText: `${home.attack}`,
              rightText: `${away.attack}`
            },
            {
              name: this.$t(`Module['危险进攻']`),
              leftPercentage: Number(
                (home.dangerous_attack /
                  (home.dangerous_attack + away.dangerous_attack)) *
                  100
              ),
              rightPercentage: Number(
                (away.dangerous_attack /
                  (home.dangerous_attack + away.dangerous_attack)) *
                  100
              ),
              leftText: `${home.dangerous_attack}`,
              rightText: `${away.dangerous_attack}`
            },
            {
              name: this.$t(`Module['射门']`),
              leftPercentage: Number(
                (home.shots / (home.shots + away.shots)) * 100
              ),
              rightPercentage: Number(
                (away.shots / (home.shots + away.shots)) * 100
              ),
              leftText: `${home.shots}`,
              rightText: `${away.shots}`
            },
            {
              name: this.$t(`Module['射偏']`),
              text: '射偏',
              leftText: `${home.shots - home.shots_on_target}`,
              rightText: `${away.shots - away.shots_on_target}`
            },
            {
              name: this.$t(`Module['射正']`),
              text: '射正',
              leftText: `${home.shots_on_target}`,
              rightText: `${away.shots_on_target}`
            },
            {
              name: this.$t(`Module['点球']`),
              leftPercentage: Number(
                (home.penalty / (home.penalty + away.penalty)) * 100
              ),
              rightPercentage: Number(
                (away.penalty / (home.penalty + away.penalty)) * 100
              ),
              leftText: `${home.penalty}`,
              rightText: `${away.penalty}`
            },
            {
              name: this.$t(`Module['越位']`),
              leftPercentage: Number(
                (home.offsides / (home.offsides + away.offsides)) * 100
              ),
              rightPercentage: Number(
                (away.offsides / (home.offsides + away.offsides)) * 100
              ),
              leftText: `${home.offsides}`,
              rightText: `${away.offsides}`
            },
            {
              name: this.$t(`Module['射门被堵']`),
              leftPercentage: Number(
                (home.blocked_shots /
                  (home.blocked_shots + away.blocked_shots)) *
                  100
              ),
              rightPercentage: Number(
                (away.blocked_shots /
                  (home.blocked_shots + away.blocked_shots)) *
                  100
              ),
              leftText: `${home.blocked_shots}`,
              rightText: `${away.blocked_shots}`
            },
            {
              name: this.$t(`Module['传球次数']`),
              leftPercentage: Number(
                (home.passes / (home.passes + away.passes)) * 100
              ),
              rightPercentage: Number(
                (away.passes / (home.passes + away.passes)) * 100
              ),
              leftText: `${home.passes}`,
              rightText: `${away.passes}`
            },
            {
              name: this.$t(`Module['关键传球']`),
              leftPercentage: Number(
                (home.key_passes / (home.key_passes + away.key_passes)) * 100
              ),
              rightPercentage: Number(
                (away.key_passes / (home.key_passes + away.key_passes)) * 100
              ),
              leftText: `${home.key_passes}`,
              rightText: `${away.key_passes}`
            },
            {
              name: this.$t(`Module['成功传球']`),
              leftPercentage: Number(
                (home.passes_accuracy / (home.passes_accuracy + away.shots)) *
                  100
              ),
              rightPercentage: Number(
                (away.passes_accuracy /
                  (home.passes_accuracy + away.passes_accuracy)) *
                  100
              ),
              leftText: `${home.passes_accuracy}`,
              rightText: `${away.passes_accuracy}`
            },
            {
              name: this.$t(`Module['成功传中']`),
              leftPercentage: Number(
                (home.crosses_accuracy /
                  (home.crosses_accuracy + away.crosses_accuracy)) *
                  100
              ),
              rightPercentage: Number(
                (away.crosses_accuracy /
                  (home.crosses_accuracy + away.crosses_accuracy)) *
                  100
              ),
              leftText: `${home.crosses_accuracy}`,
              rightText: `${away.crosses_accuracy}`
            },
            {
              name: this.$t(`Module['成功长传']`),
              leftPercentage: Number(
                (home.long_balls_accuracy /
                  (home.long_balls_accuracy + away.long_balls_accuracy)) *
                  100
              ),
              rightPercentage: Number(
                (away.long_balls_accuracy /
                  (home.long_balls_accuracy + away.long_balls_accuracy)) *
                  100
              ),
              leftText: `${home.long_balls_accuracy}`,
              rightText: `${away.long_balls_accuracy}`
            },
            {
              name: this.$t(`Module['抢断']`),
              leftPercentage: Number(
                (home.tackles / (home.tackles + away.tackles)) * 100
              ),
              rightPercentage: Number(
                (away.tackles / (home.tackles + away.tackles)) * 100
              ),
              leftText: `${home.tackles}`,
              rightText: `${away.tackles}`
            },
            {
              name: this.$t(`Module['拦截']`),
              leftPercentage: Number(
                (home.interceptions /
                  (home.interceptions + away.interceptions)) *
                  100
              ),
              rightPercentage: Number(
                (away.interceptions /
                  (home.interceptions + away.interceptions)) *
                  100
              ),
              leftText: `${home.interceptions}`,
              rightText: `${away.interceptions}`
            },
            {
              name: this.$t(`Module['解围']`),
              leftPercentage: Number(
                (home.clearances / (home.clearances + away.clearances)) * 100
              ),
              rightPercentage: Number(
                (away.clearances / (home.clearances + away.clearances)) * 100
              ),
              leftText: `${home.clearances}`,
              rightText: `${away.clearances}`
            },
            {
              name: this.$t(`Module['扑救']`),
              leftPercentage: Number(
                (home.saves / (home.saves + away.saves)) * 100
              ),
              rightPercentage: Number(
                (away.saves / (home.saves + away.saves)) * 100
              ),
              leftText: `${home.saves}`,
              rightText: `${away.saves}`
            }
          ],
          shotsInfo: {
            homeShotsTarget: home.shots_on_target,
            homeInclined: home.shots - home.shots_on_target,
            awayShotsTarget: away.shots_on_target,
            awayInclined: away.shots - away.shots_on_target
          }
        }
      } else {
        return {}
      }
    }
  },

  methods: {
    setLiveMatchScore(data) {
      this.liveMatchScore = data
    },
    liveMatchDataAnalysis() {
      let { id } = this
      getStats({
        glive_match_id: id
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          this.dataAnalysis = Data || {}
        }
      })
    }
  },
  mounted() {
    this.liveMatchDataAnalysis()
    this.$bus.$on('liveScore', this.liveMatchDataAnalysis)
  },
  destroyed() {
    this.$bus.$off(`liveScore`, this.liveMatchDataAnalysis)
  }
}
</script>

<style lang="scss" scoped>
.m_data_analysis {
  @apply bg-lightFirst min-h-430px;

  .data_football {
    @apply flex justify-center;
    .data_home {
      @apply pl-0px flex items-center;
      .home_item {
        @apply flex items-center h-60px mx-15px;
        .num {
          @apply mr-10px;
        }
      }
    }
  }
  .data_analysis {
    @apply w-full pl-0px flex flex-col;
    .analysis_content {
      @apply flex w-full h-50px relative;
      .text {
        @apply absolute h-50px w-full flex justify-center items-center;
        .text_t {
          width: 120px;
          padding: 0px 10px;
          word-break: break-all;
          text-align: center;
          font-family: Kanit;
          line-height: 21px;
        }
      }
      .item {
        .progress {
          @apply w-100px h-8px bg-hex-CCCCCC relative flex;
          .speed {
            @apply h-8px;
            animation: progress-bar-animation 1s linear infinite;
            animation-iteration-count: 1;
          }
        }
        .fast {
          @apply w-18px h-17px text-lightFirst font-sans font-bold text-12px  rounded-4px text-center leading-18px;
        }
        .num {
          @apply font-sans;
        }
      }
      .home_item {
        @apply flex justify-end items-center w-1/2 pr-60px;
        .progress {
          @apply rounded-tl-4px rounded-bl-4px justify-end;
          .speed {
            @apply rounded-tl-4px rounded-bl-4px bg-warning;
            animation: progress-bar-animation 1s linear infinite;
            animation-iteration-count: 1;
          }
        }
        .num {
          @apply mr-10px;
        }
      }
      .awy_item {
        @apply flex items-center w-1/2 pl-60px;
        .progress {
          @apply rounded-tr-4px rounded-br-4px;
          .speed {
            @apply rounded-tr-4px rounded-tr-4px h-8px bg-primaryFirst;
            animation: progress-bar-animation 1s linear infinite;
            animation-iteration-count: 1;
          }
        }
        .num {
          @apply ml-10px;
        }
      }
      .deviate_home {
        background: rgba(249, 179, 31, 0.15);
        .deviate {
          @apply bg-warning  mr-100px;
        }
      }
      .deviate_awy {
        background: rgba(24, 98, 200, 0.15);
        .deviate {
          @apply bg-primaryFirst ml-100px;
        }
      }
      .just_home {
        background: rgba(249, 179, 31, 0.15);
        @apply pr-0px;
        .just {
          @apply w-120px h-50px border-t-4px border-l-4px border-solid border-warning flex items-center justify-end;
          .fast {
            @apply bg-warning mr-60px;
          }
        }
      }
      .just_awy {
        background: rgba(24, 98, 200, 0.15);
        @apply pl-0px;
        .just {
          @apply w-120px h-50px border-t-4px border-r-4px border-solid border-primaryFirst flex items-center;
          .fast {
            @apply bg-primaryFirst ml-60px;
          }
        }
      }
    }
  }
  .basket_item {
    @apply h-50px flex justify-center items-center text-16px font-bold;
  }
  .empty_box {
    @apply h-400px flex justify-center items-center;
  }
}
@keyframes progress-bar-animation {
  0% {
    width: 0;
    /* 动画起始时宽度为0 */
  }

  100% {
    width: 100%;
    /* 动画结束时宽度为100% */
  }
}
</style>