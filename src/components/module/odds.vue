<template>
  <div class="m_odds_warp">
    <div class="odds_header">
      <ul class="odds_list">
        <li
          v-for="(item, index) in odds"
          class="odds_item"
          :style="{ borderColor: item.color }"
          :key="index"
        >{{ item.text }}</li>
      </ul>
    </div>
    <div class="odds_content">
      <v-container no-gutters v-if="tableCell.length">
        <div class="flex w-full">
          <div
            v-for="(item, index) in tableHeader"
            :style="{width:setCols(item,true)+'px'}"
            :key="index"
          >
            <div
              class="odds_tit"
              :class="{ odds_right: tableHeader.length === index + 1 }"
            >{{ item }}</div>
          </div>
        </div>

        <div
          class="flex w-full"
          :class="'odds_item_' + (index + 1)"
          v-for="(item, index) in tableCell"
          :key="index"
        >
          <div
            :style="{width:setCols(it.name) + 'px'}"
            v-for="(it, cindex) in item"
            class="colxx"
            :key="cindex"
          >
            <div
              class="odds_tit odds_value"
              :class="[
                { odds_right: item.length === cindex + 1 }
              ]"
            >
              <span
                v-if="it.point"
                class="point value_"
                :class="{['text-primaryFirst']:it.pointClass,odds_success:it.pointType === 'success',odds_error: it.pointType === 'error'}"
              >
                {{ it.point }}
                <span class="icon" v-if="it.pointType">
                  <v-img
                    width="12"
                    height="12"
                    min-width="12"
                    :src="
                       it.pointType === 'success' 
                        ? require(`@/${Img.OddsUp}`) :it.pointType === 'error'?require(`@/${Img.OddsDown}`)
                        : ''
                    "
                  ></v-img>
                </span>
              </span>

              <span
                v-if="it.value"
                class="value value_"
                :class="{odds_success:it.valueType === 'success',odds_error: it.valueType === 'error'}"
              >
                {{ it.value }}
                <span class="icon" v-if="it.valueType">
                  <v-img
                    width="12"
                    height="12"
                    min-width="12"
                    :src=" it.valueType === 'success' 
                        ? require(`@/${Img.OddsUp}`) :it.valueType === 'error'?require(`@/${Img.OddsDown}`)
                        :''
            
                    "
                  ></v-img>
                </span>
              </span>

              <span v-if="it.img">
                <v-img :src="require(`@/${it.img}`)" width="20" height="20"></v-img>
              </span>
            </div>
          </div>
        </div>
      </v-container>
      <div class="empty_box" v-else>
        <page-empty type="room" :top="0" :title="$t(`Module['暂无数据']`)"></page-empty>
      </div>
    </div>
  </div>
</template>

<script>
import { getMarket } from '@/api/live'
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
        Lock: this.$img.Page.Room.Lock,
        OddsUp: this.$img.Page.Incidents.OddsUp,
        OddsDown: this.$img.Page.Incidents.OddsDown
      },
      marketData: {},
      tabsCurrent: 0
    }
  },
  computed: {
    prefix() {
      return JSON.parse(this.$store.state.app.localConfig).prefix || ''
    },

    odds() {
      return [
        {
          color: '#1189ED',
          text: this.$t(`Module['初始赔率']`)
        },
        {
          color: '#E2830D',
          text: this.$t(`Module['赛前赔率']`)
        },
        {
          color: '#81DC13',
          text: this.$t(`Module['赛中赔率']`)
        }
      ]
    },

    tableCell() {
      let { tabsList, marketData } = this
      let list = []
      let data = {}
      if (tabsList.length) {
        for (let lt of tabsList) {
          let { market } = marketData
          let tabsName = lt.name
          let item = market[tabsName]
          if (!data.init) {
            data.init = []
            data.before = []
            data.live = []
          }
          data.init.push(...this.setCell(item, 'init', tabsName))
          data.before.push(...this.setCell(item, 'before', tabsName))
          data.live.push(...this.setCell(item, 'live', tabsName))
        }

        for (let da in data) {
          list.push(data[da])
        }
      }

      return list
    },

    tableHeader() {
      let { type, tabsList, marketData } = this
      let list = []
      if (tabsList.length) {
        switch (type) {
          case 'FOOTBALL':
            for (let tl of tabsList) {
              switch (tl.name) {
                case '1 X 2':
                  list.push(...['1', 'X', '2'])
                  break
                case '亚盘':
                  list.push(this.$t(`Module['亚盘']`))
                  break
                case '大小球':
                  list.push(
                    ...[
                      this.$t(`Module['进球']`),
                      this.$t(`Module['大球']`),
                      this.$t(`Module['小球']`)
                    ]
                  )
                  break
                case '角球':
                  list.push(
                    ...[
                      this.$t(`Module['角球']`),
                      this.$t(`Module['高于']`),
                      this.$t(`Module['低于']`)
                    ]
                  )
                  break
              }
            }

            break
          case 'BASKETBALL':
            for (let tl of tabsList) {
              switch (tl.name) {
                case '获胜': //...['1', '2']
                  list.push(this.$t(`Module['获胜']`))
                  break
                case '让分': //...[home, away]
                  list.push(this.$t(`Module['让分']`))
                  break
                case '总分':
                  list.push(this.$t(`Module['总分']`))
                  break
              }
            }

            break
        }
      }

      return list
    },

    tabsSortList() {
      let { type } = this
      let list = []
      switch (type) {
        case 'FOOTBALL':
          list = [
            {
              text: '1 X 2',
              value: '1 X 2'
            },
            {
              text: this.$t(`Module['亚盘']`),
              value: '亚盘'
            },
            {
              text: this.$t(`Module['大小球']`),
              value: '大小球'
            },
            {
              text: this.$t(`Module['角球']`),
              value: '角球'
            }
          ]
          break
        case 'BASKETBALL':
          list = [
            {
              text: this.$t(`Module['获胜']`),
              value: '获胜'
            },
            {
              text: this.$t(`Module['让分']`),
              value: '让分'
            },
            {
              text: this.$t(`Module['总分']`),
              value: '总分'
            }
          ]
          break
      }
      return list
    },

    tabsList() {
      let { marketData, tabsSortList } = this
      let list = []
      if (Object.keys(marketData).length) {
        let { market } = marketData
        let arr = Object.keys(market)
        tabsSortList.forEach(item => {
          let isOk = false
          arr.forEach(child => {
            if (item.value === child) {
              let info = {}
              info.text = item.text
              info.name = child
              info.value = item.value
              list.push(info)
              isOk = true
            }
          })
          if (!isOk) {
            list.push({ text: item.text, name: item.value, value: item.value })
          }
        })
      }

      return list
    }
  },

  methods: {
    globalNoticeType() {
      let { prefix } = this
      this.$bus.$on(`liveOdds`, data => {
        let { markets, is_live } = data
        let marketObj = markets[prefix]
        marketObj = marketObj || markets['default']
        if (marketObj && Object.keys(marketObj).length) {
          Object.keys(marketObj).forEach(market => {
            let newArr = []
            marketObj[market].forEach(msg => {
              let info = {}
              info.key = msg.key
              info.price = (msg.oddsPrice && msg.oddsPrice.decimalPrice) || 0
              info.point = msg.point || 0
              info.priceType = ''
              info.pointType = ''
              newArr.push(info)
            })
            let oldArr = {}
            if (is_live) {
              oldArr = this.marketData.market[market].live
            } else {
              oldArr = this.marketData.market[market].before
            }
            oldArr = JSON.parse(JSON.stringify(oldArr))
            newArr = newArr.map((newItem, num) => {
              let oldItem = oldArr[num]
              return {
                ...newItem,
                priceType: oldItem.price
                  ? newItem.price - oldItem.price === 0
                    ? ''
                    : newItem.price - oldItem.price > 0
                    ? 'success'
                    : 'error'
                  : '',
                pointType: oldItem.point
                  ? newItem.point - oldItem.point === 0
                    ? ''
                    : newItem.point - oldItem.point > 0
                    ? 'success'
                    : 'error'
                  : '',
                time: Math.floor(new Date().valueOf() / 1000)
              }
            })
            if (is_live) {
              this.$set(this.marketData.market[market], 'live', newArr)
            } else {
              this.$set(this.marketData.market[market], 'before', newArr)
            }
          })
        }
      })
      this.$bus.$on(`liveScore`, () => {
        let { market } = this.marketData
        if (market && Object.keys(market).length) {
          Object.keys(market).forEach(child => {
            if (child && Object.keys(child).length) {
              Object.keys(market[child]).forEach(msg => {
                let newItem = market[child][msg].map(item => {
                  let time = item.time
                  let newTime = Math.floor(new Date().valueOf() / 1000)
                  if (time && newTime - time > 6) {
                    return {
                      ...item,
                      priceType: '',
                      pointType: '',
                      time: ''
                    }
                  } else {
                    return {
                      ...item
                    }
                  }
                })
                this.$set(this.marketData.market[child], msg, newItem)
              })
            }
          })
        }
      })
    },

    setCell(item, name, tabsName) {
      let { Img, tableHeader } = this
      let arr = []
      if (item && item[name]) {
        switch (tabsName) {
          case '1 X 2':
            item[name].forEach(child => {
              if (child.price !== 0 || child.price !== '') {
                arr.push({
                  value: child.price,
                  valueType: child.priceType,
                  name: tabsName
                })
              } else {
                arr.push({
                  img: Img.Lock,
                  name: tabsName
                })
              }
            })
            break
          case '亚盘':
          case '让分':
          case '获胜':
            item[name].forEach(child => {
              if (child.price !== 0 || child.price !== '') {
                arr.push({
                  point: child.point,
                  pointType: child.pointType,
                  pointClass: 'text-primaryFirst',
                  value: child.price,
                  valueType: child.priceType,
                  name: tabsName
                })
              } else {
                arr.push({
                  img: Img.Lock,
                  name: tabsName
                })
              }
            })
            break
          case '大小球':
          case '角球':
          case '总分':
            let point = item[name][0].point
            let pointType = item[name][0].pointType
            if (item[name][0].price !== 0 || item[name][0].price !== '') {
              arr.push({
                point: point,
                pointType: pointType,
                pointClass: 'text-primaryFirst',
                name: tabsName
              })
            } else {
              arr.push({
                img: Img.Lock,
                name: tabsName
              })
            }
            item[name].forEach(child => {
              if (child.price !== 0 || child.price !== '') {
                arr.push({
                  value: child.price,
                  valueType: child.priceType,
                  name: tabsName
                })
              } else {
                arr.push({
                  img: Img.Lock,
                  name: tabsName
                })
              }
            })
            break
        }
      } else {
        switch (tabsName) {
          case '1 X 2':
          case '大小球':
          case '角球':
          case '总分':
            arr.push(
              {
                img: Img.Lock,
                name: tabsName
              },
              {
                img: Img.Lock,
                name: tabsName
              },
              {
                img: Img.Lock,
                name: tabsName
              }
            )
            break
          default:
            arr.push(
              {
                img: Img.Lock,
                name: tabsName
              },
              {
                img: Img.Lock,
                name: tabsName
              }
            )
            break
        }
      }
      return arr
    },

    liveMatchMarket() {
      let { id } = this
      getMarket({
        glive_match_id: id
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          if (Object.keys(Data).length) {
            let { away, home, market_data } = Data
            let info = {}
            if (Object.keys(market_data).length) {
              Object.keys(market_data).forEach(item => {
                info[item] = {}
                if (Object.keys(market_data[item]).length) {
                  Object.keys(market_data[item]).forEach(child => {
                    info[item][child] = []
                    if (
                      market_data[item][child] &&
                      market_data[item][child].length
                    ) {
                      market_data[item][child].forEach(msg => {
                        let msgInfo = {}
                        msgInfo.key = msg.key
                        msgInfo.price =
                          (msg.oddsPrice && msg.oddsPrice.decimalPrice) || 0
                        msgInfo.point = msg.point || 0
                        msgInfo.priceType = ''
                        msgInfo.pointType = ''
                        msgInfo.time = Math.floor(new Date().valueOf() / 1000)
                        info[item][child].push(msgInfo)
                      })
                    } else {
                      let msgInfo = {}
                      msgInfo.key = ''
                      msgInfo.price = 0
                      msgInfo.point = 0
                      msgInfo.priceType = ''
                      msgInfo.pointType = ''
                      msgInfo.time = Math.floor(new Date().valueOf() / 1000)
                      info[item][child].push(msgInfo)
                      info[item][child].push(msgInfo)
                    }
                  })
                }
              })
            }
            this.marketData = {
              away,
              home,
              market: info
            }
          }
        }
      })
    },

    setCols(item, header) {
      const { type } = this
      let num = 0
      switch (type) {
        case 'FOOTBALL':
          if (header) {
            if (item === this.$t(`Module['亚盘']`)) {
              num = 226
            } else {
              num = 76
            }
          } else {
            if (item === '亚盘') {
              num = 113
            } else {
              num = 76
            }
          }

          break
        case 'BASKETBALL':
          if (header) {
            if (item === this.$t(`Module['总分']`)) {
              num = 320
            } else {
              num = 291
            }
          } else {
            if (item === '总分') {
              num = 107
            } else {
              num = 146
            }
          }
          break
      }

      return num
    }
  },

  mounted() {
    this.globalNoticeType()
    this.liveMatchMarket()
  },

  destroyed() {
    this.$bus.$off(`liveOdds`)
    this.$bus.$off(`liveScore`)
  }
}
</script>

<style lang="scss" scoped>
.m_odds_warp {
  @apply min-h-430px bg-lightFirst;
  .odds_header {
    @apply py-20px flex justify-end;
    .odds_list {
      @apply pl-0px flex;
      .odds_item {
        @apply px-10px min-w-100px border-l-4px border-solid text-info;
      }
    }
  }
  .odds_content {
    .odds_tab {
      @apply my-10px pl-20px flex;
      .tab {
        @apply mr-20px min-w-56px px-10px h-36px flex items-center justify-center bg-accentFirst rounded-l-8px rounded-1-r-16px text-12px cursor-pointer;
      }
      .tab_active,
      .tab:hover {
        @apply text-lightFirst;
        background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
      }
    }
    .odds_tit {
      @apply flex justify-center items-center h-50px font-bold border-l-1px border-t-1px border-solid border-accent cursor-pointer;
      .point {
        @apply flex-1 flex items-center justify-center h-full font-sans relative;
        .icon {
          @apply absolute opacity-0 right-0px;
          transform: translateX(8px);
        }
      }
      .value {
        @apply flex-1 flex items-center justify-center h-full font-sans relative;
        .icon {
          @apply absolute opacity-0 right-0px;
          transform: translateX(8px);
        }
      }
    }
    .odds_value {
      @apply h-70px;
    }
    .odds_value:hover {
      @apply bg-accentFourth;
    }
    .odds_right {
      @apply border-r-1px border-t-1px border-solid;
    }

    @keyframes changeErrorOdds {
      0% {
        @apply text-errorSecond opacity-100;
      }
      100% {
        @apply text-errorSecond opacity-100;
      }
    }
    @keyframes changeSuccessOdds {
      0% {
        @apply text-successSecond opacity-100;
      }
      100% {
        @apply text-successSecond opacity-100;
      }
    }

    .odds_success,
    .odds_success .icon {
      animation-name: changeSuccessOdds;
      animation-duration: 5s;
      animation-iteration-count: 1;
      animation-fill-mode: none;
      animation-timing-function: ease-in-out;
    }

    .odds_error,
    .odds_error .icon {
      animation-name: changeErrorOdds;
      animation-duration: 5s;
      animation-iteration-count: 1;
      animation-fill-mode: none;
      animation-timing-function: ease-in-out;
    }

    _rig {
      @apply border-r-1px;
    }
    .odds_item_1 {
      @apply bg-hex-F4FAFF relative;
      .colxx:first-child::before {
        content: '';
        background-color: #1189ed;
        @apply w-4px h-full absolute left-2px top-0;
      }
      .item_1 {
        @apply border-l-4px border-solid border-hex-1189ED;
      }
    }
    .odds_item_2 {
      @apply bg-hex-FFFBF6 relative;
      .colxx:first-child::before {
        content: '';
        background-color: #e2830d;
        @apply w-4px h-full absolute left-2px top-0;
      }
      .item_2 {
        @apply border-l-4px border-solid border-hex-E2830D;
      }
    }
    .odds_item_3 {
      @apply bg-hex-FAFFF4 border-b-1px border-accent relative;
      .colxx:first-child::before {
        content: '';
        background-color: #81dc13;
        @apply w-4px h-full absolute left-2px top-0;
      }
      .item_3 {
        @apply border-l-4px border-solid border-hex-81DC13;
      }
    }
    .empty_box {
      @apply h-400px flex justify-center items-center;
    }
  }
}
</style>
