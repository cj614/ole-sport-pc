<template>
  <module-self>
    <div class="home-av" v-show="aboveBanner">
      <page-ImgSwiper
        height="150"
        typeName="Pc-Liveroom header banner"
        @show="(res) => aboveBanner = res"
      ></page-ImgSwiper>
    </div>
    <div class="m_live_room_warp" :key="key">
      <div class="living_box">
        <div class="left_live_room">
          <div class="live_room_header">
            <div class="room_img">
              <v-avatar width="50" height="50" min-width="50">
                <v-img :src="Img.LiveLogo"></v-img>
                <!-- <page-pageLoad :src="Img.LiveLogo" width="50" height="50" :contain="true"></page-pageLoad> -->
              </v-avatar>
            </div>

            <div class="room_txt">
              <div class="live_title">
                <span class="match_name">{{ officialInfo.Home }} VS {{ officialInfo.Away }}</span>
              </div>
              <div class="live_icon">
                <span class="user_name">{{ officialInfo.League }}</span>
              </div>
            </div>
            <page-share type="news" :shareInfo="shareInfo"></page-share>
          </div>
          <div class="living_video">
            <module-iframLive ref="liveIframe" :url="officialInfo.PlayerUrl"></module-iframLive>
          </div>
          <ul class="living_tab">
            <li
              v-for="(item, index) in tabList"
              :key="index"
              class="tab_item"
              :class="{ tab_item_active: item.value === activeIndex }"
              :style="{ width: 100 / tabList.length + '%' }"
              @click.stop="changeTab(item)"
            >{{ item.text }}</li>
          </ul>
          <div class="divide_blue"></div>
          <!-- 球队阵容 -->
          <module-teamLineup :id="params.id" :type="officialInfo.Type" v-if="activeIndex === 0"></module-teamLineup>
          <!-- 重要事件 -->
          <module-events :id="params.id" :item="officialInfo" v-if="activeIndex === 1"></module-events>
          <!-- 数据分析 -->
          <module-dataAnalysis v-if="activeIndex === 2" :id="params.id" :type="officialInfo.Type"></module-dataAnalysis>
          <!-- 赔率 -->
          <module-odds v-if="activeIndex === 3" :id="params.id" :type="officialInfo.Type"></module-odds>
          <!-- 积分榜 -->
          <module-leagueTable
            v-if="activeIndex === 4"
            :item="officialInfo"
            :id="params.id"
            :type="officialInfo.Type"
          ></module-leagueTable>
          <!-- <module-anchorSchedule
            v-if="activeIndex === 4"
            :anchorId="12"
            :userId="17"
            class="p-20px"
          ></module-anchorSchedule>-->
        </div>
        <chat-roomChat
          :roomID="params.id"
          topic="chat_match_"
          type="glive_matches"
          @switchChange="setDanmuSw"
          @setChatList="list => (messageList = list)"
          @insert="insert"
          @setDanmus="setDanmus"
        ></chat-roomChat>
      </div>

      <module-homeTitle :title="$t(`Module['精彩推荐']`)" iconName="topMoment" type="1"></module-homeTitle>
      <div class="room_footer">
        <template v-if="matchLiveList.length">
          <page-competitionCard
            type="live"
            :Anchor="true"
            :List="matchLiveList"
            @handleClickItem="handleClickItem"
          ></page-competitionCard>
        </template>

        <template v-else>
          <module-skeletonCard
            v-if="loading"
            :forIt="4"
            type="card-avatar,article@2"
            skeletonClass="mx-auto"
          ></module-skeletonCard>
          <page-empty type="matchLive" v-else :top="0" :title="$t(`Module['目前暂无直播']`)"></page-empty>
        </template>
      </div>
    </div>
    <page-adv left="Pc-Liveroom left side banner" right="Pc-Liveroom right side banner"></page-adv>
    <page-footeradv footer="Pc-Liveroom footer banner"></page-footeradv>
  </module-self>
</template>

<script>
import {
  getMatchLiveListPage,
  anchorScheduleList,
  getLivePlayerUrl,
  getMarket,
  getFootballPoint
} from '@/api/live'
// import { getLivePlayerUrl } from '@/api/room'
export default {
  data() {
    return {
      shareInfo: {
        url: '',
        title: '',
        description: '',
        quote: '',
        hashtags: '',
        twitterUser: ''
      },
      Img: {
        LiveLogo: require(`@/${this.$img.Page.Live.LiveLogo}`)
      },
      aboveBanner: false,
      params: {
        roomID: '',
        id: '',
        limit: 100,
        from_time: 0
      },
      activeIndex: -1,
      officialInfo: {},
      messageList: [],
      matchLiveList: [],
      matchList: [],
      loading: false,
      showTabsList: [],
      key: +new Date()
    }
  },

  watch: {
    '$route.params': {
      handler() {
        this.params.id = this.id
        this.key = this.id
        this.getLivePlayerUrl()
        this.getMatchLiveListPage()
      }
    }
  },

  computed: {
    id() {
      return this.$route.params.id
    },

    tabList() {
      let { showTabsList } = this
      const { Type } = this.officialInfo
      let list = []
      switch (Type) {
        case 'BASKETBALL':
          list = [
            {
              text: this.$t(`Module['球队阵容']`),
              value: 0
            },

            {
              text: this.$t(`Module['数据分析']`),
              value: 2
            }
            // {
            //   text: this.$t(`Module['赔率']`),
            //   value: 3
            // }
          ]
          if (showTabsList.indexOf('odds') !== -1) {
            list.push({
              text: this.$t(`Module['赔率']`),
              value: 3,
              label: 'odds'
            })
          }
          break
        case 'FOOTBALL':
          list = [
            {
              text: this.$t(`Module['球队阵容']`),
              value: 0
            },
            {
              text: this.$t(`Module['重要事件']`),
              value: 1
            },
            {
              text: this.$t(`Module['数据分析']`),
              value: 2
            }
            // {
            //   text: this.$t(`Module['赔率']`),
            //   value: 3
            // },
            // {
            //   text: this.$t(`Module['积分榜']`),
            //   value: 4
            // }
          ]
          if (showTabsList.indexOf('odds') !== -1) {
            list.push({
              text: this.$t(`Module['赔率']`),
              value: 3,
              label: 'odds'
            })
          }
          if (showTabsList.indexOf('scoreboard') !== -1) {
            list.push({
              text: this.$t(`Module['积分榜']`),
              value: 4,
              label: 'scoreboard'
            })
          }
          break
        default:
          list = []
          break
      }
      return list
    },

    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    userId() {
      let { id } = this.userInfo
      return id
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    }
  },

  mounted() {
    this.params.id = this.id
    this.getLivePlayerUrl()
    this.getMatchLiveListPage()
  },

  destroyed() {
    let { id } = this.params
    this.$store.dispatch('mqtt/MQTT_UNSUBSCRIBE', `ole/live_match_${id}`)
    this.$bus.$off(`ole/live_match_${id}`)
  },

  methods: {
    setDanmuSw(danmuSw) {
      if (danmuSw) {
        this.$refs.liveIframe.show()
      } else {
        this.$refs.liveIframe.hide()
      }
    },

    setDanmus() {
      this.$refs.liveIframe.setDanmus()
    },

    insert(text) {
      this.$refs.liveIframe.insert(text)
    },

    handleClickItem(item) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      const { Id, Type, LiveRoomId } = item
      if (Type === 'ANCHOR') {
        this.$router.push({ name: 'anchorRoom', params: { id: LiveRoomId } })
      } else {
        this.$router.push({ name: 'officialRoom', params: { id: Id } })
      }
    },

    changeTab(item) {
      this.activeIndex = item.value
    },

    async getMatchLiveListPage() {
      try {
        this.matchLiveList = []
        this.loading = true
        const param = {
          page: 1,
          limit: 5
        }
        const { Code, Data } = await getMatchLiveListPage(param)
        if (Code === 200) {
          const { Data: List } = Data
          let live = this.$img.Page.Live
          let arr = List.map(r => ({
            ...r,
            liveImg: live[r.Type] ? require(`@/${live[r.Type]}`) : ''
          }))
          arr = arr.filter(r => r.Id != this.id)

          if (arr.length === 5) {
            arr.pop()
          }
          this.matchLiveList = arr
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async getLivePlayerUrl() {
      const { id } = this
      const { Data, Code } = await getLivePlayerUrl({ match_id: String(id) })
      if (Code === 200) {
        this.officialInfo = Data
        const { Type } = Data
        this.shareInfo.url = window.location.href
        this.shareInfo.title = `${Data.Name} ${Data.Home} VS ${Data.Away}`
        this.shareInfo.description = `${Data.League}`
        this.shareInfo.quote = `${Data.League}`
        this.shareInfo.hashtags = `${Data.League}`
        this.globalNoticeType()
        if (Type === 'BASKETBALL' || Type === 'FOOTBALL') {
          this.activeIndex = 0
        } else {
          this.activeIndex = -1
        }
        if (Type === 'BASKETBALL' || Type === 'FOOTBALL') {
          getMarket({
            glive_match_id: id
          }).then(res => {
            let { Code, Data } = res
            if (Code === 200) {
              if (Data) {
                let { market_data } = Data
                if (market_data && Object.keys(market_data).length) {
                  this.showTabsList.push('odds')
                }
              }
            }
          })
        }

        if (Type === 'FOOTBALL') {
          getFootballPoint({
            glive_match_id: id
          }).then(res => {
            let { Code, Data } = res
            if (Code === 200) {
              if (Data && Object.keys(Data).length) {
                this.showTabsList.push('scoreboard')
              }
            }
          })
        }
        // this.anchorScheduleList(this.room.user_id)
      }
    },

    globalNoticeType() {
      let { id } = this.params
      this.$store.dispatch('mqtt/MQTT_SUBSCRIBE', `ole/live_match_${id}`)
      this.$bus.$on(`ole/live_match_${id}`, res => {
        let { notice_type, data } = res
        if (notice_type === 7) {
          this.$bus.$emit('live/notice')
        }
        if (notice_type === 1) {
          this.$bus.$emit('liveScore', {
            ...data
          })
        }
        if (notice_type === 2) {
          this.$bus.$emit('liveOdds', {
            ...data
          })
        }
      })
    },

    async anchorScheduleList(room_user_id) {
      let now = this.$date().add('7', 'day')

      let start = this.$date(now.format('YYYY-MM-DD 00:00:00')).valueOf() / 1000
      let end = this.$date(now.format('YYYY-MM-DD 23:59:59')).valueOf() / 1000
      const param = {
        room_user_id: room_user_id,
        start,
        end
      }
      const { Code, Data } = await anchorScheduleList(param)
      if (Code === 200) {
        this.matchList = Data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-av {
  @apply pt-20px;
  .v-image {
    @apply rounded-10px;
  }
}
.m_live_room_warp {
  @apply pt-20px pb-40px;
  .living_box {
    @apply flex overflow-hidden mb-40px;
    .left_live_room {
      @apply flex-1 mr-10px;
      .live_room_header {
        @apply px-20px h-70px flex items-center bg-lightFirst;
        .room_img {
          @apply mr-20px;
        }
        .room_txt {
          @apply flex-1 flex flex-col justify-center;
          .live_title {
            @apply flex items-center;
            .match_name {
              @apply font-bold text-16px text-hex-4070FF mr-15px;
            }
            .now_name {
              @apply font-bold text-16px;
            }
          }
          .live_icon {
            @apply flex items-center mt-6px;
            .user_name {
              @apply text-12px min-w-100px;
            }
            .hot_btn {
              @apply flex items-center min-w-100px;
              .v-btn {
                @apply h-14px w-14px;
              }
            }
            .share_btn {
              @apply flex items-center min-w-100px;
              .v-btn {
                @apply h-14px w-14px;
              }
            }
          }
        }
        .room_btn {
          @apply;

          .btn2 {
            @apply ml-10px;
          }
          .btn3 {
            @apply text-lightFirst;
            background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
          }

          .btn {
            @apply rounded-18px font-normal text-12px;
          }
        }
      }
      .living_video {
        @apply w-940px h-528px;
      }
      .living_tab {
        @apply pl-0px flex items-center bg-lightFirst w-940px;
        .tab_item {
          @apply text-center font-bold text-16px h-50px leading-50px cursor-pointer max-w-200px;
        }
        .tab_item_active {
          background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
          color: #fff;
        }
      }
      .divide_blue {
        @apply h-10px bg-primaryFirst;
      }
    }
  }
  .room_footer {
    @apply h-232px;
  }
}
</style>
