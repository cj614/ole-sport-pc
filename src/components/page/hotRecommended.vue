<template>
  <div class="m-hot-warp">
    <div class="hot-pad" :style="{ maxHeight: maxHeight, padding: paddingTop }">
      <div class="hot-content">
        <div class="herder-content">
          <div :class="[
            'header-left',
            showOdd
              ? type === 'match' ? 'w-570px' : type === 'home' ? 'w-630px' : 'w-650px'
              : 'w-1/1'
          ]">
            <span v-show="getDefaultLogo(match) !== 'no'">
              <page-pageLoad :src="match.competitionLogo" width="40" height="40" :defaultImg="getDefaultLogo(match)"
                :contain="true"></page-pageLoad>
            </span>
            <div class="left-txt">{{ match.competitionName }}</div>
            <div class="item_1_select"
              v-if="type !== 'match' && match.sportType === 'FOOTBALL' && match.downList && match.downList.length">
              <module-menuList type="odds" v-model="match.selVal" :selValue="match.selVal"
                :list="setTypeList(match.downList)"></module-menuList>
            </div>
          </div>
          <!-- <div :class="['header-right', type === 'match' ? 'pl-30px' : 'pl-20px']" v-if="showOdd">
            <ul class="right-list">
              <li class="item" :style="{ width: setGridListWidth(index, match.sportType) }"
                v-for="(c, index) in headGridList(match)" :key="index">{{ c }}</li>
            </ul>
          </div> -->
        </div>
        <div class="table-content" v-for="(mt, index) in match.list || [match]" :key="index">
          <div :class="['table-item table-item-1', isFull ? type === 'search' ? 'w-190px' : 'w-170px' : 'w-150px']">
            <div class="item-pd">
              <div class="item-1-icon">
                <span v-if="mt.status === 1" style="width:24px;height:24px;"></span>
                <span class="lottie_Line" v-if="mt.status === 2" style="width:24px;height:24px;"
                  @click="handleClickItem(mt)">
                  <page-lottie :animationData="Lottie.Card"></page-lottie>
                </span>
                <span v-if="mt.status === 3 || mt.status === 4" @click.stop="subClickItem(mt)">
                  <v-img :src="mt.status === 3 ? Img.Subscribe : Img.SubscribeSuccess" width="20" height="20"></v-img>
                </span>
              </div>

              <div class="item-1-text">
                <span v-if="mt.status == 2" class="StartM">
                  <span :class="['text-dark time_txt', isFull ? 'text-16' : 'text-20px']">{{ day(mt) }}</span>
                  <span class="match_txt text-warning">{{ mt.playTime }}</span>
                </span>
                <span v-else :class="['text-dark time_txt', isFull ? 'text-16px' : 'text-20px']">{{ day(mt) }}</span>
              </div>
            </div>
          </div>

          <template v-if="
            ['FOOTBALL', 'BASKETBALL', 'ANCHOR'].includes(mt.sportType) ||
            sport_type === 'ANCHOR'
          ">
            <div class="table-item table-item-2" :class="isOther ? 'table-item-2-match' : ''">
              <div class="item-pd">
                <div class="team-content">
                  <div class="item2-team">
                    <div class="mr-10px" v-show="mt.homeLogo">
                      <page-pageLoad :src="mt.homeLogo" width="40" height="40" :defaultImg="getDefaultLogo(mt)"
                        :contain="true"></page-pageLoad>
                    </div>
                    <div class="team-txt">{{ mt.homeName }}</div>
                  </div>
                  <div class="item2-count">
                    <span class="number1">{{ setScoreByCode(mt.homeScores, mt) }}</span>
                    <span class="abc">VS</span>
                    <span class="number1">{{ setScoreByCode(mt.awayScores, mt) }}</span>
                  </div>
                  <div class="item2-team justify-end">
                    <div class="team-txt team-txt-r">{{ mt.awayName }}</div>
                    <div class="ml-10px" v-show="mt.awayLogo">
                      <page-pageLoad :src="mt.awayLogo" width="40" height="40" :defaultImg="getDefaultLogo(mt)"
                        :contain="true"></page-pageLoad>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="table-item table-item-3"
              :class="type === 'match' ? 'table-item-3-match' : type === 'personage' ? 'table-item-3-match_p' : ''">
              <!-- <div class="item-pd anchor_box">
                <page-anchorSwiper :anchorList="mt.anchorList" :data="mt"
                  @handleClickItemItem="handleClickItemItem"></page-anchorSwiper>
              </div> -->
              <!-- <div class="item-pd" v-else-if="match.downList && match.downList.length">
                <div v-for="(ci, index) in contentList(match, mt)" :key="index" :style="{ width: ci.width + 'px' }"
                  :class="[match.sportType === 'FOOTBALL' ? 'num_item' : 'num_item_f', ci.other]">
                  <template v-if="match.sportType === 'FOOTBALL'">
                    <span v-if="ci.point" :class="[ci.pointClass, ci.pointType]">{{ ci.point }}</span>
                    <span v-if="ci.price" :class="[ci.priceClass, ci.priceType]">{{ ci.price }}</span>
                  </template>
<template v-else>
                    <div v-for="(lt, indexLt) in ci.list" :key="indexLt" class="type_back">
                      <span v-show="lt.point" :class="[lt.pointClass, lt.pointType]">
                        <span v-show="lt.col && lt.point !== '-'">{{ indexLt === 0 ? 'O' : 'U' }}</span>
                        {{ lt.point }}
                      </span>
                      <span v-show="lt.price" :class="[lt.priceClass, lt.priceType]">{{ lt.price }}</span>
                    </div>
                  </template>
</div>
</div> -->
            </div>
          </template>
          <template v-else>
            <div class="table-item table-item-5">
              <div class="item-pd">
                <div class="team-content">
                  <div class="item2-team justify-end">
                    <div class="team-txt">{{ mt.homeName }}</div>
                  </div>
                  <div class="item2-count">
                    <span class="abc">VS</span>
                  </div>
                  <div class="item2-team">
                    <div class="team-txt">{{ mt.awayName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div class="table-item table-item-6" :class="{ ['table-item-6_s']: type === 'search' }" v-if="isFull">
            <page-anchorSwiper :anchorList="mt.anchorList" :data="mt"
              @handleClickItemItem="handleClickItemItem"></page-anchorSwiper>
          </div>

          <div :class="['table-item', isFull ? 'table-item-4' : 'table-item-4_']">
            <div class="item-pd !flex-none w-full justify-center">
              <v-btn :min-width="isFull ? 150 : 130" height="40" v-if="mt.status == 1" depressed outlined
                :color="!['FT', 'AP', 'AET'].includes(mt.endStatus) ? 'error' : 'info'"
                :class="!['FT', 'AP', 'AET'].includes(mt.endStatus) ? '' : 'live_btn_ft'">{{
                  $t(`Module['${mt.endStatus
                    ||
                    "FT"}']`)
                }}
              </v-btn>
              <template v-else-if="mt.status == 2">
                <v-btn v-if="sport_type === 'ANCHOR'" :min-width="isFull ? 150 : 130" height="40" color="#fff"
                  class="live_btn_blue" depressed outlined @click="handleClickItem(mt)">{{
                    $t(`Module['观看直播']`)
                  }}...
                </v-btn>
                <v-btn v-else-if="mt.livePlayId > 0 || mt.liveRoomId > 0" :min-width="isFull ? 150 : 130" height="40"
                  color="#fff" class="live_btn" depressed outlined @click="handleClickItem(mt)">{{ $t(`Module['观看直播']`)
                  }}
                </v-btn>
                <span class="no_live_btn" v-else>{{ $t(`Module['直播中']`) }}...</span>
              </template>

              <template v-else-if="mt.status == 3 || mt.status == 4">
                <template>
                  <v-btn :minWidth="isFull ? 150 : 130" height="40" color="#1862C8" depressed outlined
                    @click.stop="handleClickItem(mt)">{{ $t(`Module['未开赛']`) }}
                  </v-btn>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-subDialog ref="subRef" type="match" :row="row" @subSuccess="subSuccess"></page-subDialog>
    <module-liveDialog ref="liveRef" @anchorClick="anchorClick" :anchorList="anchorList"></module-liveDialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { matchFocus } from "@/api/matchScore";

export default {
  props: {
    match: {
      type: Object,
      default: () => ({})
    },

    maxHeight: {
      type: String,
      default: 'auto'
    },

    type: {
      type: String,
      default: 'home'
    },

    sport_type: {
      type: String,
      default: ''
    },

    paddingTop: {
      type: String,
      default: '20px'
    }
  },

  data() {
    return {
      Lottie: {
        Card: require(`@/${this.$lottie.Live.Card}`),
        Head: require(`@/${this.$lottie.Live.Head}`)
      },

      Img: {
        HomeAnchorLive: require(`@/${this.$img.Page.Home.HomeAnchorLive}`),
        Living: require(`@/${this.$img.Page.Home.Living}`),
        Subscribe: require(`@/${this.$img.Page.Live.Subscribe}`),
        SubscribeSuccess: require(`@/${this.$img.Page.Live.SubscribeSuccess}`),
        FT: require(`@/${this.$img.Page.Live.FT}`),
        LiveLogo: require(`@/${this.$img.Page.Live.LiveLogo}`)
      },
      anchorList: [],
      row: {}
    }
  },

  computed: {
    showOdd() {
      let flag = false
      const { match, type, sport_type } = this

      if (type !== 'match') {
        if (match.downList && match.downList.length) {
          flag = true
        }
      } else {
        if (match.downList && match.downList.length) {
          if (sport_type !== 'ANCHOR') {
            flag = true
          }
        }
      }

      return flag
    },
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    },

    isFull() {
      return ['home', 'search'].includes(this.type)
    },

    isOther() {
      return ['personage', 'match'].includes(this.type)
    }
  },

  methods: {
    setScoreByCode(score, mt) {
      //未開賽 :延期.取消.異常.待定.未开
      let filterStatusCode = ['Postp.', 'Canc.', 'Excep.', 'TBD']
      let { sportType } = mt
      const { status, endStatus } = mt
      if (!['FOOTBALL', 'BASKETBALL'].includes(sportType)) {
        return ''
      }
      if (status == 1) {
        return filterStatusCode.includes(endStatus) ? '-' : score
      } else return score
    },

    getDefaultLogo(mt) {
      const { sportType } = mt
      let type = ['FOOTBALL', 'BASKETBALL']
      let str = 'no'
      if (type.includes(sportType)) {
        str = 'MatchDefault'
      }
      return str
    },

    subSuccess(status) {
      this.$set(this.row, 'status', status)
      this.$emit('subSuccess', status)
    },

    matchClickItem(item, data) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }

      const { live_room_id, live_room_user_id, glive_match_id, is_live } = data

      if (live_room_id) {
        if ((item.status === 2 || is_live) && live_room_id) {
          this.$router.push({
            name: 'anchorRoom',
            params: { id: live_room_id }
          })
        }
      } else if (live_room_user_id) {
        this.$router.push({
          name: 'anchorSchedule',
          params: { id: live_room_user_id }
        })
      } else if (is_live && glive_match_id) {
        this.$router.push({
          name: 'officialRoom',
          params: { id: glive_match_id }
        })
      }
    },

    subClickItem(item) {
      if (item.status === 3 || item.status === 4) {
        this.row = item
        matchFocus({
          all_match_id: item.allMatchId,
          status: item.status === 3 ? 1 : 0,
        }).then(res => {
          const { Code, Data } = res
          if (Code === 200) {
            this.$set(this.row, 'status', Data.status === 1 ? 4 : 3)
          }
        })
      }
    },

    handleClickItem(item) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }

      if (item.status === 2) {
        let { livePlayId, liveRoomId, allMatchId } = item
        if (liveRoomId) {
          this.$router.push({ name: 'anchorRoom', params: { id: liveRoomId, all_match_id: allMatchId, type: 0 } })
        } else if (livePlayId) {
          this.$router.push({ name: 'anchorRoom', params: { id: livePlayId, all_match_id: allMatchId, type: 1 } })
        }
      }

    },

    matchClick(item) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      console.log('aaaaa', item)
      this.row = item
      let analysisAnchorList = this.analysisAnchorList(item)
      this.anchorList = analysisAnchorList
      if (item.status === 2) {
        let { liveId } = item
        if (analysisAnchorList.length > 0) {
          this.$refs.liveRef.setDialog()
          return
        }
        if (liveId) {
          this.$router.push({ name: 'officialRoom', params: { id: liveId } })
        } else {
          this.$bus.$emit('snackbar/on', this.$t(`Module['目前暂无直播']`))
        }
      }
      if (item.status === 3 || item.status === 4) {
        this.handleSchedule(item)
      }
    },

    analysisAnchorList(mt) {
      let { Img } = this
      let { liveId, anchorList, status } = mt
      let list = []

      if (anchorList && anchorList.length > 0) {
        if (liveId && status === 2) {
          list.push({
            type: 'official',
            user_img_url: Img.LogoThere,
            is_live: true,
            user_name: this.$t(`Module['OLE 官方']`)
          })
        }
        let diffAnchor = anchorList.filter(item => {
          return item.sub_type !== 1
        })
        return [...list, ...diffAnchor]
      } else {
        return list
      }
    },

    setGridListWidth(index, type) {
      let isHome = this.isFull
      if (type === 'FOOTBALL') {
        return isHome ? '80px' : '70px'
      } else {
        switch (index) {
          case 0:
            return isHome ? '50px' : '50px'
            break
          case 1:
            return isHome ? '80px' : '70px'
            break
          case 2:
            return isHome ? '110px' : '90px'
            break
        }
      }
    },

    headGridList(match) {
      let cellList = []
      let { selVal, sportType } = match
      switch (sportType) {
        case 'FOOTBALL':
          switch (selVal) {
            case '1 X 2':
              cellList = ['1', 'X', '2']
              break
            case '亚盘':
              cellList = ['1', '', '2']
              break
            case '大小球':
              cellList = [
                '',
                this.$t(`Module['大球']`),
                this.$t(`Module['小球']`)
              ]
              break
            case '角球':
              cellList = [
                '',
                this.$t(`Module['高于']`),
                this.$t(`Module['低于']`)
              ]
              break
          }
          break
        case 'BASKETBALL':
          cellList = [
            this.$t(`Module['获胜']`),
            this.$t(`Module['让分']`),
            this.$t(`Module['总分']`)
          ]
          break
      }
      return cellList
    },

    day(mt) {
      return this.type === 'search'
        ? dayjs(mt.matchTime * 1000).format('MM-DD HH:mm')
        : dayjs(mt.matchTime * 1000).format('HH:mm')
    },

    setTypeList(list) {
      return list.map(l => ({
        text: l,
        label: l === '1 X 2' ? l : this.$t(`Module['${l}']`)
      }))
    },

    contentList(match, mt) {
      let { marketList, sportType } = mt

      const { selVal: current } = match
      let isHome = this.isFull
      let info = []
      let gridList = []
      let markets = {}
      if (marketList && marketList.length) {
        if (sportType === 'FOOTBALL') {
          markets = marketList[0]
          info = markets[current] ? markets[current] : []
          switch (current) {
            case '1 X 2':
              gridList = info.map((item, key) => {
                return {
                  price: item.price || '-',
                  priceType: item.priceType
                    ? item.priceType === 'success'
                      ? 'content_grid_success'
                      : 'content_grid_error'
                    : '',
                  width: isHome ? 80 : 70
                }
              })
              break
            case '亚盘':
              info.forEach(item => {
                gridList.push({
                  price: item.price || '-',
                  priceType: item.priceType
                    ? item.priceType === 'success'
                      ? 'content_grid_success'
                      : 'content_grid_error'
                    : '',
                  pointClass: 'point',
                  point: item.point || '-',
                  pointType: item.pointType
                    ? item.pointType === 'success'
                      ? 'content_grid_success'
                      : 'content_grid_error'
                    : '',
                  width: isHome ? 120 : 105,
                  other: '!justify-evenly'
                })
              })
              break
            case '大小球':
            case '角球':
              info.forEach((item, key) => {
                if (key === 0) {
                  gridList.push({
                    point: item.point || '-',
                    pointType: item.pointType
                      ? item.pointType === 'success'
                        ? 'content_grid_success'
                        : 'content_grid_error'
                      : '',
                    pointClass: 'point',
                    width: isHome ? 80 : 70
                  })
                }
                gridList.push({
                  price: item.price || '-',
                  priceType: item.priceType
                    ? item.priceType === 'success'
                      ? 'content_grid_success'
                      : 'content_grid_error'
                    : '',
                  width: isHome ? 80 : 70
                })
              })
          }
        } else {
          markets = marketList[0]
          let arr = ['获胜', '让分', '总分']

          for (let i = 0; i < 3; i++) {
            let ct = arr[i]
            info = markets[ct] ? markets[ct] : []
            switch (ct) {
              case '获胜':
                gridList = [{ list: [], width: isHome ? 50 : 50 }]
                info.forEach((item, key) => {
                  gridList[0].list.push({
                    price: item.price || '-',
                    priceType: item.priceType
                      ? item.priceType === 'success'
                        ? 'content_grid_success'
                        : 'content_grid_error'
                      : ''
                  })
                })
                break
              case '让分':
                gridList.push({ list: [], width: isHome ? 80 : 70 })
                info.forEach(item => {
                  gridList[1].list.push({
                    price: item.price || '-',
                    priceType: item.priceType
                      ? item.priceType === 'success'
                        ? 'content_grid_success'
                        : 'content_grid_error'
                      : '',
                    pointClass: 'point',
                    point: item.point || '-',
                    pointType: item.pointType
                      ? item.pointType === 'success'
                        ? 'content_grid_success'
                        : 'content_grid_error'
                      : ''
                  })
                })
                break
              case '总分':
                gridList.push({ list: [], width: isHome ? 110 : 90, col: true })
                info.forEach((item, key) => {
                  gridList[2].list.push({
                    price: item.price || '-',
                    priceType: item.priceType
                      ? item.priceType === 'success'
                        ? 'content_grid_success'
                        : 'content_grid_error'
                      : '',
                    pointClass: 'point',
                    point: item.point || '-',
                    pointType: item.pointType
                      ? item.pointType === 'success'
                        ? 'content_grid_success'
                        : 'content_grid_error'
                      : ''
                  })
                })
            }
          }
        }
      }

      return gridList
    },

    anchorClick(anchor) {
      let { row } = this
      let { type } = anchor
      if (type === 'official') {
        let { liveId } = row
        if (liveId) {
          this.$router.push({ name: 'officialRoom', params: { id: liveId } })
        }
      } else {
        let { live_room_id, live_room_user_id } = anchor
        if (live_room_id) {
          this.$router.push({
            name: 'anchorRoom',
            params: { id: live_room_id }
          })
        } else {
          this.$router.push({
            name: 'anchorSchedule',
            params: { id: live_room_user_id }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m-hot-warp {
  @apply flex bg-lightFirst rounded-l-10px overflow-y-auto overflow-x-hidden mb-20px w-full;

  .hot-pad {
    @apply w-full;

    .hot-content {
      @apply flex flex-col;

      .herder-content {
        @apply h-40px flex items-center mb-20px;

        .header-left {
          @apply flex items-center;

          .left-txt {
            @apply text-16px font-bold text-dark mr-20px ml-5px;
          }

          .item_1_select {
            @apply h-37px min-w-110px leading-37px;

            .v-input__slot {
              @apply mb-0px min-h-37px shadow-none border-1px border-solid border-warning;
              border-radius: 21px;

              fieldset {
                @apply border-1px border-solid border-warning;
              }

              .v-input__append-inner {
                .v-input__icon {
                  .v-icon {
                    @apply text-warning;
                  }
                }
              }

              .v-select__selection {
                @apply pl-10px text-warning;
              }
            }

            .v-text-field__details {
              display: none;
            }
          }
        }

        .header-right {
          @apply w-4/10;

          .right-list {
            @apply flex ml-0px pl-0px;

            .item {
              @apply text-center text-14px font-normal;
            }
          }
        }
      }

      .table-content {
        @apply flex items-center w-1/1 rounded-10px mb-5px cursor-pointer relative;

        .table-item {
          @apply h-64px flex items-center;

          .item-pd {
            @apply flex items-center flex-1 overflow-hidden;

            .v-btn {
              @apply rounded-20px;
            }

            .live_btn {
              background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
            }

            .live_btn_blue {
              background: #2BA5FF;
            }

            .live_btn_ft {
              @apply bg-tertiary border-none;
            }

            .live_btn_ex {}

            .no_live_btn {
              @apply w-130px h-40px flex justify-center items-center font-bold font-kanit text-warning;
            }
          }

          .anchor_box {
            @apply justify-center overflow-hidden w-full h-full;

            .anchor_list {
              @apply overflow-auto h-full max-w-full justify-start;

              .anc_item {
                @apply mr-10px relative;

                .lottie_head {
                  width: 120%;
                  height: 120%;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  @apply absolute;
                }

                .flag_live {
                  @apply absolute left-9px;
                  bottom: -4px;
                }
              }
            }
          }
        }

        .table-item-1 {
          @apply pr-20px;

          .item-1-icon {
            @apply flex px-20px items-center relative;

            .lottie_Line {}
          }

          .item-1-text {
            @apply flex-1 text-center;

            .StartM {
              @apply flex flex-col items-center justify-center;

              .match_txt {
                @apply text-14px font-bold font-sans mt-6px;
              }
            }

            .time_txt {
              @apply font-bold font-sans;
            }
          }

          >div {
            @apply flex items-center justify-center;
          }
        }

        .table-item-pad {
          .item-1-icon {
            @apply px-10px;
          }
        }

        .table-item-2 {
          @apply w-460px;

          .team-content {
            @apply flex items-center justify-between w-full;

            .item2-team {
              @apply flex items-center w-174px flex-1 overflow-hidden;

              .team-txt {
                @apply text-dark leading-20px;

              }

              .team-txt-r {
                text-align: right;
              }
            }

            .item2-count {
              @apply min-w-90px mx-20px flex items-center justify-between;

              .number1 {
                @apply font-sans text-20px font-bold text-primaryFirst;
              }

              .abc {
                @apply text-14px font-normal text-dark mx-15px;
              }
            }
          }
        }

        .table-item-2-match {
          @apply w-420px;

          .team-content {
            .item2-team {
              @apply w-154px;
            }
          }
        }

        .table-item-3 {
          @apply overflow-hidden pl-20px pr-20px w-280px;

          .item-pd {
            @apply px-0px;

            >div {
              @apply flex items-center justify-center font-sans text-14px font-bold;
            }

            .num_item {
              @apply font-sans;

              span {
                @apply w-full text-center;
              }
            }

            .num_item_f {
              @apply font-sans flex-col;

              .type_back {
                @apply flex w-full justify-around;
              }

              .type_back:first-child {
                @apply mb-20px;
              }
            }

            .success_point {
              @apply text-success;
            }

            .error_point {
              @apply text-error;
            }

            .point {
              @apply text-primaryFirst;
            }

            @keyframes changeError {
              0% {
                @apply text-error opacity-100;
              }

              100% {
                @apply text-error opacity-100;
              }
            }

            @keyframes changeSuccess {
              0% {
                @apply text-success opacity-100;
              }

              100% {
                @apply text-success opacity-100;
              }
            }

            .content_grid_success {
              // @apply text-success;
              animation-name: changeSuccess;
              animation-duration: 5s;
              animation-iteration-count: 1;
              animation-fill-mode: none;
              animation-timing-function: ease-in-out;
            }

            .content_grid_error {
              // @apply text-error;
              animation-name: changeError;
              animation-duration: 5s;
              animation-iteration-count: 1;
              animation-fill-mode: none;
              animation-timing-function: ease-in-out;
            }
          }
        }

        .table-item-6 {
          @apply w-132px mx-4px;

          .item-pd {
            @apply px-0px;

            >div {
              @apply flex items-center justify-center font-sans text-14px font-bold;
            }
          }
        }

        .table-item-6_s {
          @apply w-102px;
        }

        .table-item-3-match {
          @apply pl-30px pr-20px w-260px;
        }

        .table-item-3-match_p {
          @apply pl-30px pr-20px w-190px;
        }

        .table-item-4 {
          @apply px-20px;
        }

        .table-item-4_ {
          @apply pl-0px pr-20px;
        }

        .table-item-5 {
          @apply flex-1 overflow-hidden;

          .team-content {
            @apply flex items-center justify-between w-full;

            .v-image {
              background: rgba(249, 179, 31, 0.3);
            }

            .item2-team {
              @apply flex items-center w-2/5;

              .team-txt {
                @apply text-12px font-normal text-dark leading-20px;
                word-break: break-all;
              }
            }

            .item2-count {
              @apply px-20px flex items-center justify-between;

              .number1 {
                @apply font-sans text-20px font-bold text-primaryFirst;
              }

              .abc {
                @apply text-14px font-normal text-dark;
              }
            }
          }
        }
      }

      .table-content:nth-child(even) {
        @apply bg-accentSecond;
      }

      .table-content:last-child {
        @apply mb-0px;
      }

      .table-content-active {}

      .table-content:hover {
        background: rgba(249, 179, 31, 0.15);
      }
    }
  }
}

@keyframes breathe {
  0% {
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transform: scale(0.88);
  }

  50% {
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
    transform: scale(1);
  }

  100% {
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transform: scale(0.88);
  }
}

.breathing-element {
  @apply border-2px border-solid border-warning rounded-2/1;
  /* 圆形元素 */
  animation: breathe 2s ease infinite;
  /* 应用关键帧，每2秒执行一次，无限循环 */
}
</style>
