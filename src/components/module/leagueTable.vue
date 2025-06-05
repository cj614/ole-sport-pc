<template>
  <div class="m_league_table">
    <module-team :id="id" :type="type"></module-team>
    <div class="m_team_tab" v-if="tableCell.length">
      <div
        class="tab"
        @click="tabsCurrent = item.value"
        :class="{tab_active:tabsCurrent===item.value}"
        v-for="(item,index) in tabsList"
        :key="index"
      >{{item.name}}</div>
    </div>
    <div class="league_table_content" v-if="tableCell.length">
      <ul class="table_list">
        <li class="table_item table_header">
          <div class="item_team">
            <div class="serial">
              <div class="text font-bold">#</div>
            </div>
            <div class="team_tit font-bold">{{$t(`Module['球队']`)}}</div>
          </div>
          <div class="item_count">
            <div class="count">P</div>
            <div class="count">W</div>
            <div class="count">D</div>
            <div class="count">L</div>
            <div class="count">F</div>
            <div class="count">A</div>
            <div class="count">GB</div>
            <div class="count">PTS</div>
          </div>
        </li>
        <li class="table_item" v-for="(item,index) of tableCell" :key="index">
          <div class="item_team" :style="{backgroundColor: item.position.bg}">
            <div class="serial">
              <div
                class="text"
                :style="{
                backgroundColor: item.position.labelBg,
                color: item.position.labelBg ? '#fff' : '#9A9A9A',
              }"
              >{{item.position.name}}</div>
            </div>
            <div class="team_tit">
              <span class="mr-20px">
                <v-img width="24" height="24" :src="item.team.img" contain></v-img>
              </span>
              <span class="font-bold">{{item.team.name}}</span>
            </div>
          </div>
          <div class="item_count">
            <div
              class="count count_p"
              :style="{color:item.total.color||'block'}"
            >{{item.total.name}}</div>
            <div class="count count_W" :style="{color:item.total.color||'block'}">{{item.won.name}}</div>
            <div class="count count_D" :style="{color:item.draw.color||'block'}">{{item.draw.name}}</div>
            <div class="count count_L" :style="{color:item.loss.color||'block'}">{{item.loss.name}}</div>
            <div
              class="count count_F"
              :style="{color:item.goals.color||'block'}"
            >{{item.goals.name}}</div>
            <div
              class="count count_A"
              :style="{color:item.goals_against.color||'block'}"
            >{{item.goals_against.name}}</div>
            <div
              class="count count_GB"
              :style="{color:item.goal_diff.color||'block'}"
            >{{item.goal_diff.name}}</div>
            <div
              class="count count_PTS"
              :style="{color:item.points.color||'block'}"
            >{{item.points.name}}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="empty_box" v-else>
      <page-empty type="room" :top="0" :title="$t(`Module['暂无数据']`)"></page-empty>
    </div>
    <div class="league_type_content">
      <ul class="league_type_list">
        <li v-for="(item,index) in promotions" class="league_type_item" :key="index">
          <div :style="{background:item.bg}" class="dot"></div>
          <span class="txt">{{item.name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getFootballPoint } from '@/api/live'
export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
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
      ballPointData: {},
      tabsCurrent: 0,
      Img: {
        Lock: this.$img.Page.Room.Lock
      }
    }
  },
  computed: {
    leagueTypeList() {
      return [
        {
          text: 'Champions League',
          color: '#0275FF'
        },
        {
          text: 'Champions League qualification',
          color: '#6001EE'
        },
        {
          text: 'Europa League league stage',
          color: '#AB5E03'
        },
        {
          text: 'UEFA ECL Playoffs ',
          color: '#AB9A02'
        },
        {
          text: 'Relegation Playoffs ',
          color: '#ABAAAA'
        },
        {
          text: 'Relegation',
          color: '#961A3D'
        }
      ]
    },

    promotions() {
      let { ballPointData } = this
      let { promotions } = ballPointData
      let list = []
      if (promotions && promotions.length) {
        list = promotions.map(item => {
          return {
            name: item.name,
            bg: item.color
          }
        })
      }
      return list
    },

    tabsList() {
      let { ballPointData } = this
      let list = []
      if (Object.keys(ballPointData).length) {
        list = [
          {
            name: this.$t(`Module['全部']`),
            type: 'all',
            value: 0
          },
          {
            name: this.$t(`Module['主队']`),
            type: 'home',
            value: 1
          },
          {
            name: this.$t(`Module['客队']`),
            type: 'away',
            value: 2
          }
        ]
      }
      return list
    },
    tableCell() {
      let { tabsList, item, tabsCurrent, ballPointData, tableHeader } = this
      let list = []
      if (tabsList.length) {
        let tabsName = tabsList[tabsCurrent].type
        let ballPointItem = ballPointData[tabsName]
        ballPointItem.forEach(ball => {
          let info = {}
          tableHeader.forEach(cell => {
            info[cell.key] = {
              name: ball[cell.key],
              key: cell.key,
              bg: cell.bg
            }

            switch (cell.key) {
              case 'goal_diff':
                info[cell.key].color =
                  ball[cell.key] > 0 ? '#5DB401' : '#E43433'
                break
              case 'position':
                info[cell.key].bg =
                  ball.team_name === item.Home
                    ? '#f9b31f26'
                    : ball.team_name === item.Away
                    ? '#1862c826'
                    : ''
                info[cell.key].labelBg = ball.promotion_color
                break
              case 'team':
                info[cell.key].name = ball.team_name
                info[cell.key].img = ball.team_logo_url
                info[cell.key].col = cell.col
                info[cell.key].bg =
                  ball.team_name === item.Home
                    ? '#f9b31f26'
                    : ball.team_name === item.Away
                    ? '#1862c826'
                    : ''
                break
            }
          })
          list.push(info)
        })
      }
      return list
    },

    tableHeader() {
      let { tabsList } = this
      let list = []
      if (tabsList.length) {
        list = [
          {
            name: '#',
            key: 'position'
          },
          {
            name: this.$t(`Module['球队']`),
            col: 7,
            key: 'team'
          },
          {
            name: 'P',
            key: 'total',
            bg: '#EFF6FC'
          },
          {
            name: 'W',
            key: 'won',
            bg: '#EFF6FC'
          },
          {
            name: 'D',
            key: 'draw',
            bg: '#EFF6FC'
          },
          {
            name: 'L',
            key: 'loss',
            bg: '#EFF6FC'
          },
          {
            name: 'F',
            key: 'goals',
            bg: '#F6F6F8'
          },
          {
            name: 'A',
            key: 'goals_against',
            bg: '#F6F6F8'
          },
          {
            name: 'GD',
            key: 'goal_diff',
            bg: '#F6F6F8'
          },
          {
            name: 'PTS',
            key: 'points',
            bg: '#FFF5E3'
          }
        ]
      }
      return list
    }
  },
  methods: {
    liveMatchFootballPoint() {
      let { id } = this
      getFootballPoint({
        glive_match_id: id
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          this.ballPointData = Data || {}
        }
      })
    }
  },
  mounted() {
    this.liveMatchFootballPoint()
  }
}
</script>

<style lang="scss" scoped>
.m_league_table {
  @apply min-h-430px bg-lightFirst;
  .m_team_tab {
    @apply my-10px pl-20px flex;
    .tab {
      @apply mr-20px w-56px h-36px flex items-center justify-center bg-accentFirst rounded-l-8px rounded-1-r-16px text-12px cursor-pointer;
    }
    .tab_active,
    .tab:hover {
      @apply text-lightFirst;
      background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
    }
  }
  .league_table_content {
    @apply pr-20px mb-40px;
    .table_list {
      @apply pl-0px flex flex-col;
      .table_item {
        @apply w-full flex items-center h-40px overflow-hidden border-b-1px border-solid border-accent;
        .item_team {
          @apply w-420/900 h-full flex items-center;
          .serial {
            @apply w-50px pl-20px;
            .text {
              @apply text-info font-bold flex w-20px h-20px rounded-4px items-center justify-center;
            }
          }
          .team_tit {
            @apply text-info flex items-center font-bold;
          }
        }
        .item_count {
          @apply flex-1 flex items-center h-full;
          .count {
            @apply flex w-60/480 justify-center items-center h-full font-bold;
          }
          .count_p {
            background: #eff6fc;
          }
          .count_W {
            background: #eff6fc;
          }
          .count_D {
            background: #eff6fc;
          }
          .count_L {
            background: #eff6fc;
          }
          .count_F {
            background: #f6f6f8;
          }
          .count_A {
            background: #f6f6f8;
          }
          .count_GB {
            background: #f6f6f8;
          }
          .count_PTS {
            background: #fff5e3;
          }
        }
      }
    }
  }
  .league_type_content {
    @apply px-20px pb-30px;
    .league_type_list {
      @apply pl-0px;
      .league_type_item {
        @apply flex items-center h-18px mb-10px;
        .dot {
          @apply w-10px h-10px rounded-1/2;
        }
        .txt {
          @apply text-info text-12px ml-20px;
        }
      }
    }
  }
  .empty_box {
    @apply h-400px flex justify-center items-center;
  }
}
</style>