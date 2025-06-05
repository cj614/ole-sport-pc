<template>
  <div class="m_team_line_up_warp">
    <div v-if="teamData.home"
      style="background-color:white;padding: 30px 20px; display: flex;justify-content: space-between;align-items: center;">
      <div style="display: flex;align-items: center;">
        <el-image style="width: 40px;height: 40px;" :src="teamData.home_logo">
        </el-image>
        <span style="margin-left: 10px;font-weight: bold">{{ teamData.home }}</span>
      </div>
      <div style="display: flex;align-items: center;">
        <span style="margin-right: 10px;font-weight: bold">{{ teamData.away }}</span>
        <el-image style="width: 40px;height: 40px;" :src="teamData.away_logo">
        </el-image>
      </div>
    </div>
    <template v-if="type === 'FOOTBALL' && FOOTBALLLineupList.length">
      <module-footballOrder class="mb-20px" :matchAddressInfo="matchAddressInfo" :lineupData="lineupData"
        :list="FOOTBALLLineupList" :homeClass="homeClass" :awayClass="awayClass" :id="id"></module-footballOrder>
      <div class="flex">
        <module-teamCard :type="type" class="mr-20px" :item="FOOTBALLLineupList[0]" :id="id"></module-teamCard>
        <module-teamCard :type="type" :item="FOOTBALLLineupList[1]" :teamIndex="1" :id="id"></module-teamCard>
      </div>
      <!-- 标注 -->
      <div class="logobox">
        <div class="logoitem" v-for="(item, index) in logoList" :key="index">
          <el-image style="width: 12px;height:12px" :src="item.src"></el-image>
          <span class="logotitle">{{ item.title }}</span>
        </div>
      </div>
    </template>
    <template v-else-if="type === 'BASKETBALL' && BASKETBALLLineupList.length">
      <div class="flex">
        <module-teamCard :type="type" class="mr-20px" :item="BASKETBALLLineupList[0]" :id="id"></module-teamCard>
        <module-teamCard :type="type" :item="BASKETBALLLineupList[1]" :teamIndex="1" :id="id"></module-teamCard>
      </div>
    </template>
    <template v-else>
      <page-empty type="room" :top="60" :title="$t(`Module['暂无数据']`)"></page-empty>
    </template>
    <!-- 天气 -->
    <div v-if="lineupData.environment">
      <div class="weatherbox" :class="[lineupData.environment.weather == 5 ? 'qing' : 'yin']">
        <el-image v-if="lineupData.environment.weather == 5"
          style="position: absolute;top:30px;right:0px;width: 120px;height: 120px;"
          :src="require('@/static/image/live/sun.png')"></el-image>
        <el-image v-if="lineupData.environment.weather !== 5"
          style="position: absolute;top:30px;right:0px;width: 120px;height: 120px;"
          :src="require('@/static/image/live/cloudy.png')"></el-image>

        <div class="weatherboxtitle">
          <div class="dsa">
            <el-image class="img" :src="require('@/static/image/live/hum.png')" mode=""></el-image>
            <span>{{ $t(`Module['湿度']`) }}: {{ lineupData.environment.humidity }}</span>
          </div>

          <div class="dsa">
            <el-image class="img" :src="require('@/static/image/live/Group.png')" mode=""></el-image>
            <span>{{ $t(`Module['温度']`) }}:
              {{
                lineupData.environment.temperature.indexOf("u") !== -1 ?
                  lineupData.environment.temperature.split("u")[0] + '°c' : ''
              }}
            </span>
          </div>

          <div class="dsa">
            <span>{{ $t(`Module['天气']`) }}: {{ returnweather(lineupData.environment.weather) }}</span>
          </div>
        </div>
        <div class="weatherboxtitle">
          <div class="dsa">
            <el-image class="img" :src="require('@/static/image/live/carbon_location-current.png')" mode="">
            </el-image>
            <span>{{ $t(`Module['风速']`) }}: {{ lineupData.environment.wind }}</span>
          </div>

          <div class="dsa">
            <el-image class="img" :src="require('@/static/image/live/windy.png')" mode=""></el-image>
            <span>{{ $t(`Module['气压']`) }}: {{ lineupData.environment.pressure }}</span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIncidents, live_room_score, liveMatchLineup } from '@/api/live'

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
      teamData: {},
      lineupData: {},
      incidentsData: {},
      homeClass: false,
      awayClass: false,
      logoList: [
        {
          title: this.$t('Module["进球"]'),
          src: require('@/static/image/live/jinqiu.png')
        },
        {
          title: this.$t('Module["点球"]'),
          src: require('@/static/image/live/dianqiu.png')
        },
        {
          title: this.$t('Module["点球不进"]'),
          src: require('@/static/image/live/dianbu.png')
        },
        {
          title: this.$t('Module["乌龙球"]'),
          src: require('@/static/image/live/wulong.png')
        },
        {
          title: this.$t('Module["角球"]'),
          src: require('@/static/image/live/jiaoqiu.png')
        },
        {
          title: this.$t('Module["助攻"]'),
          src: require('@/static/image/live/zhugong.png')
        },
        {
          title: this.$t('Module["黄牌"]'),
          src: require('@/static/image/live/huangpai.png')
        },
        {
          title: this.$t('Module["红牌"]'),
          src: require('@/static/image/live/hongpai.png')
        },
        {
          title: this.$t('Module["两黄一红"]'),
          src: require('@/static/image/live/honghuang.png')
        },
        {
          title: this.$t('Module["换人"]'),
          src: require('@/static/image/live/huanren.png')
        },
        {
          title: this.$t('Module["受伤"]'),
          src: require('@/static/image/live/shoushang.png')
        },
        {
          title: 'VAR',
          src: require('@/static/image/live/VAR.png')
        },
      ],
    }
  },
  computed: {
    matchAddressInfo() {
      let { lineupData } = this
      let str = ''
      if (Object.keys(lineupData)) {
        let { environment } = lineupData
        if (environment && Object.keys(environment).length) {
          let { temperature, weather } = environment
          if (temperature) {
            temperature =
              temperature.indexOf('u') !== -1
                ? `${temperature.split('u')[0]}°c`
                : temperature
          }
          if (weather) {
            switch (weather) {
              case 1:
                weather = this.$t(`Module['局部有云']`)
                break
              case 2:
                weather = this.$t(`Module['多云']`)
                break
              case 3:
                weather = this.$t(`Module['局部有云/雨']`)
                break
              case 4:
                weather = this.$t(`Module['雪']`)
                break
              case 5:
                weather = this.$t(`Module['晴']`)
                break
              case 6:
                weather = this.$t(`Module['阴有雨/局部有雷暴']`)
                break
              case 7:
                weather = this.$t(`Module['阴']`)
                break
              case 8:
                weather = this.$t(`Module['薄雾']`)
                break
              case 9:
                weather = this.$t(`Module['阴有雨']`)
                break
              case 10:
                weather = this.$t(`Module['多云有雨']`)
                break
              case 11:
                weather = this.$t(`Module['多云有雨/局部有雷暴']`)
                break
              case 12:
                weather = this.$t(`Module['局部有云/雨和雷暴']`)
                break
              case 13:
                weather = this.$t(`Module['雾']`)
                break
            }
          }
          str = `${weather || ''}  ${temperature || ''}`
        }
      }

      return str
    },
    localConfig() {
      return this.$store.state.app.localConfig
        ? JSON.parse(this.$store.state.app.localConfig)
        : {}
    },
    FOOTBALLLineupList() {
      let { lineupData, incidentsData, mapIncidentsList } = this
      let { Lineup, home_coach, away_coach } = lineupData
      let { incidents } = incidentsData
      let { Incidents } = this.$img.Page
      let lineupArr = Object.keys(lineupData)
      let incidentsArr = Object.keys(incidentsData)
      let list = []
      if (lineupArr.length) {
        // 首发 替补
        let homeStaffList = this.setStaffList(Lineup.home, 1)
        let homeSubstituteList = this.setStaffList(Lineup.home, 0)
        let awayStaffList = this.setStaffList(Lineup.away, 1)
        let awaySubstituteList = this.setStaffList(Lineup.away, 0)
        if (incidentsArr.length > 0 && incidents.length > 0) {
          let diffList = []
          // 有没有 player_id 且在 incidentsList 中有的事件
          incidents.forEach(item => {
            mapIncidentsList.forEach(incident => {
              if (
                item.type === incident.id &&
                (item.player_id || item.in_player_id || item.out_player_id)
              ) {
                diffList.push({
                  ...item,
                  num: 1
                })
              }
            })
          })

          let diff2List = []
          // 同一队员的事件集合与累加
          diffList.forEach((item) => {
            let diff = diff2List.filter(child => {
              return child.type === 9
                ? (child.player_id === item.in_player_id ||
                  child.player_id === item.out_player_id) &&
                item.type === child.type
                : child.player_id === item.player_id && item.type === child.type
            })
            if (diff.length) {
              diff2List.forEach((child, key) => {
                if (
                  (child.player_id === diff[0].player_id ||
                    child.player_id === diff[0].in_player_id ||
                    child.player_id === diff[0].out_player_id) &&
                  child.type === diff[0].type
                ) {
                  if (item.time > diff[0].time) {
                    diff2List[key] = {
                      ...item,
                      num: child.num + 1
                    }
                  } else {
                    diff2List[key] = {
                      ...diff[0],
                      num: child.num + 1
                    }
                  }
                }
              })
            } else {
              diff2List.push(item)
            }
          })
          diff2List = diff2List.map(item => {
            let diff = mapIncidentsList.filter(child => {
              return child.id === item.type
            })
            return {
              ...item,
              ...diff[0],
              img: Incidents[diff[0].type],
              isH: diff[0].type === 'Substitution'
            }
          })

          diff2List.forEach(item => {
            this.setStaffListTwo(homeStaffList, item)
            this.setStaffListTwo(homeSubstituteList, item)
            this.setStaffListTwo(awayStaffList, item)
            this.setStaffListTwo(awaySubstituteList, item)
          })
          homeStaffList = this.setStaffListThere(homeStaffList)
          homeSubstituteList = this.setStaffListThere(homeSubstituteList)
          awayStaffList = this.setStaffListThere(awayStaffList)
          awayStaffList = this.setStaffListThere(awayStaffList)
        }
        list = [
          {
            formation: Lineup.home_formation,
            mapList: this.setStaffPosition(
              homeStaffList,
              Lineup.home_formation
            ),
            substitute: homeSubstituteList,
            coach: home_coach || ''
          },
          {
            formation: Lineup.away_formation,
            mapList: this.setStaffPosition(
              awayStaffList,
              Lineup.away_formation,
              false
            ),
            substitute: awaySubstituteList,
            coach: away_coach || ''
          }
        ]
      }
      return list
    },
    BASKETBALLLineupList() {
      let { lineupData } = this
      let { home_coach, away_coach, away, home } = lineupData
      let list = []
      if (home) {
        let homeSubstituteList = home || []
        let awaySubstituteList = away || []
        let substitute1 = (list = [
          {
            coach: home_coach || '',
            substitute: homeSubstituteList
              .map(item => {
                return {
                  ...item
                }
              })
              .sort((a, b) => a.shirt_number - b.shirt_number)
          },
          {
            coach: away_coach || '',
            substitute: awaySubstituteList
              .map(item => {
                return {
                  ...item
                }
              })
              .sort((a, b) => a.shirt_number - b.shirt_number)
          }
        ])
      }
      return list
    },
    incidentsList() {
      return this.$store.state.app.incidentsList
    },
    mapIncidentsList() {
      let { incidentsList } = this
      let list = [1, 17, 8, 3, 4, 15, 9]
      return incidentsList.filter(item => {
        return list.indexOf(item.id) !== -1
      })
    }
  },
  mounted() {
    this.getLineUp()
    this.live_room_score()
  },
  methods: {
    setStaffPosition(arr, temp, flag = true) {
      let xt = temp || (flag ? '3-3-3-2' : '2-3-3-3')
      xt = xt.split('-')
      let list = []
      let num1 = Number(xt[0])
      let num2 = Number(xt[1])
      let num3 = Number(xt[2])
      let num4 = Number(xt[3])

      let xRrr = ['staff_G', 'staff_D', 'staff_M', 'staff_F', 'staff_F2']
      let key = flag ? '' : '_a'
      let xrr = []
      let data = {}
      let num = [1, 3, 5, 7]
      for (let a of arr) {
        if (a.y && !xrr.includes(a.y)) {
          xrr.push(a.y)
        }
      }
      xrr.sort((a, b) => a - b)

      arr.forEach((el, i) => {
        let index = i
        if (!temp) {
          index = i + 1
          this[flag ? 'homeClass' : 'awayClass'] = true
          let len = num1
          if (index <= len) {
            el.y = 32
            if (!data[el.y]) {
              data[el.y] = {
                name: 'staff_D' + key,
                list: [],
                num: 0,
                len: 1
              }
            }
            el.x = 12.5 * num[data[el.y].num]
            data[el.y].num++
          }
          len = num1 + num2
          if (index > num1 && index <= len) {
            el.y = 50
            if (!data[el.y]) {
              data[el.y] = {
                name: 'staff_M' + key,
                list: [],
                num: 0,
                len: 2
              }
            }
            el.x = 12.5 * num[data[el.y].num]
            data[el.y].num++
          }
          len = num1 + num2 + num3
          if (index > num2 + num1 && index <= len) {
            el.y = 70
            if (!data[el.y]) {
              data[el.y] = {
                name: 'staff_F' + key,
                list: [],
                num: 0,
                len: 3
              }
            }
            el.x = 12.5 * num[data[el.y].num]
            data[el.y].num++
          }
          len = num1 + num2 + num3 + num4
          if (index > num2 + num1 + num3 && index <= len) {
            el.y = 90
            if (!data[el.y]) {
              data[el.y] = {
                name: 'staff_F1' + key,
                list: [],
                num: 0,
                len: 4
              }
            }
            el.x = 12.5 * num[data[el.y].num]
            data[el.y].num++
          }
        } else {
          this[flag ? 'homeClass' : 'awayClass'] = false
          let { x, y } = el

          if (!x && !y) {
            // <!-- F前锋、M中场、D后卫、G守门员 -->
            if (index === 0) {
              el.x = 50
              el.y = 12
              if (!data[el.y]) {
                data[el.y] = {
                  name: 'staff_G' + key,
                  list: [],
                  num: 0,
                  len: 0
                }
              }
            } else {
              let len = num1
              if (index <= len) {
                el.y = 32
                if (!data[el.y]) {
                  data[el.y] = {
                    name: 'staff_D' + key,
                    list: [],
                    num: 0,
                    len: 1
                  }
                }
                el.x = 12.5 * num[data[el.y].num]
                data[el.y].num++
              }
              len = num1 + num2
              if (index > num1 && index <= len) {
                el.y = 50
                if (!data[el.y]) {
                  data[el.y] = {
                    name: 'staff_M' + key,
                    list: [],
                    num: 0,
                    len: 2
                  }
                }
                el.x = 12.5 * num[data[el.y].num]
                data[el.y].num++
              }
              len = num1 + num2 + num3
              if (index > num2 + num1 && index <= len) {
                el.y = 70
                if (!data[el.y]) {
                  data[el.y] = {
                    name: 'staff_F' + key,
                    list: [],
                    num: 0,
                    len: 3
                  }
                }
                el.x = 12.5 * num[data[el.y].num]
                data[el.y].num++
              }
              len = num1 + num2 + num3 + num4
              if (index > num2 + num1 + num3 && index <= len) {
                el.y = 90
                if (!data[el.y]) {
                  data[el.y] = {
                    name: 'staff_F2' + key,
                    list: [],
                    num: 0,
                    len: 4
                  }
                }
                el.x = 12.5 * num[data[el.y].num]
                data[el.y].num++
              }
            }
          }
        }

        if (!data[el.y]) {
          let len = xrr.findIndex(f => f === el.y)
          data[el.y] = {
            name: xRrr[len] + key,
            list: [],
            len: len
          }
        }
        if (!temp) {
          if (flag && i == 9) {
            data[el.y]?.list.push({ isNull: true })
          }
          if (!flag && i == 0) {
            data[el.y]?.list.push({ isNull: true })
          }
        }
        data[el.y]?.list.push(el)
      })
      for (let da in data) {
        data[da].list.sort((a, b) => b.x - a.x)
      }

      list.push(...Object.values(data))

      return list.reverse()
    },
    setStaffListFour(arr, str) {
      return arr.filter(item => {
        return item.position === str
      })
    },
    setStaffListThere(arr) {
      return arr.map(item => {
        let sortArr = item.incidents.sort((a, b) => {
          return b.time - a.time
        })
        return {
          ...item,
          incidents: sortArr.map(msg => {
            return {
              ...msg
            }
          })
        }
      })
    },
    setStaffListTwo(arr, item) {
      arr.forEach(child => {
        if (
          item.player_id === child.id ||
          item.in_player_id === child.id ||
          item.out_player_id === child.id
        ) {
          child.incidents.push(item)
        }
      })
    },
    setStaffList(arr, num) {
      let { lineupData } = this
      let { players } = lineupData
      return arr
        .filter(item => {
          return item.first === num
        })
        .map(item => {
          return {
            ...item,
            name: players[item.id]?.name,
            incidents: []
          }
        })
        .sort((a, b) => {
          return a.shirt_number - b.shirt_number
        })
    },
    async getLineUp() {
      const { id } = this
      const { Data, Code } = await liveMatchLineup({ all_match_id: id })
      if (Code === 200) {
        this.lineupData = Data || {}
      }
    },

    async live_room_score() {
      const {
        Code,
        Data
      } = await live_room_score({
        all_match_id: this.id
      })
      if (Code === 200) {
        if (Data) {
          this.teamData = Data
        }
      }
    },


    async getIncidents() {
      const { id } = this
      const { Code, Data } = await getIncidents({ glive_match_id: id })
      if (Code === 200) {
        this.incidentsData = Data || {}
      }
    },

    globalNoticeType() {
      this.$bus.$on(`liveScore`, () => {
        if (this.type === 'FOOTBALL') {
          this.getIncidents()
        }
      })
    },
    // 天气
    returnweather(weather) {
      if (weather) {
        switch (weather) {
          case 1:
            weather = this.$t(`Module['局部有云']`)
            break
          case 2:
            weather = this.$t(`Module['多云']`)
            break
          case 3:
            weather = this.$t(`Module['局部有云/雨']`)
            break
          case 4:
            weather = this.$t(`Module['雪']`)
            break
          case 5:
            weather = this.$t(`Module['晴']`)
            break
          case 6:
            weather = this.$t(`Module['阴有雨/局部有雷暴']`)
            break
          case 7:
            weather = this.$t(`Module['阴']`)
            break
          case 8:
            weather = this.$t(`Module['薄雾']`)
            break
          case 9:
            weather = this.$t(`Module['阴有雨']`)
            break
          case 10:
            weather = this.$t(`Module['多云有雨']`)
            break
          case 11:
            weather = this.$t(`Module['多云有雨/局部有雷暴']`)
            break
          case 12:
            weather = this.$t(`Module['局部有云/雨和雷暴']`)
            break
          case 13:
            weather = this.$t(`Module['雾']`)
            break
        }
      }
      return weather
    },
  }
}
</script>

<style lang="scss" scoped>
.m_team_line_up_warp {
  @apply min-h-430px p-20px bg-lightFirst;
}

.logobox {
  display: flex;
  flex-wrap: wrap;
  /* 容器宽度 */
  background: #fff;
  padding: 40px 20px;
  justify-content: center;

  .logoitem {
    display: flex;
    justify-content: start;
    align-items: center;

    .logotitle {
      color: #000;
      font-size: 15px;
      font-weight: 600;
      margin: 0 6px;
    }
  }
}

// 天气
.yin {
  background-image: url('../../static/image/live/yin.png');
  background-size: cover;
}

.qing {
  background-image: url('../../static/image/live/qing.png');
  background-size: cover;

}

.dsa {
  display: flex;
  align-items: center;
  margin-right: 40px;
  color: #fff;

  .img {
    height: 28px;
    margin-right: 10px;
  }
}

.weatherbox {
  width: 100%;
  height: 140px;
  position: relative;
  margin: 0 auto;

  .weatherboxtitle {
    display: flex;
    margin-left: 20px;
    padding: 20px 0;

    text {
      width: 33%;
      margin: 25px 0 0 0;
      color: #fff;
    }
  }
}
</style>