<template>
  <div class="m_home_search_warp">
    <!-- <div class="m_home_search_input">
      <v-text-field
        v-model="keyword"
        :placeholder="`${$t(`Module['直播']`)}/${$t(`Module['赛事']`)}/${$t(`Module['主播']`)}/${$t(`Module['最新资讯']`)}/${$t(`Module['精选影片']`)}`"
        single-line
        outlined
        dense
        hide-spin-buttons
        autocomplete="off"
        height="50"
        class="input_item"
        @keydown="handleKeydown"
        @click:prepend-inner="homeSearch"
      >
        <template v-slot:prepend-inner>
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
</v-text-field>
</div>-->
    <div class="home_search_nav">
      <ul class="home_search_list">
        <li v-for="(item, index) in searchNav" :key="index" class="home_search_item"
          :class="{ home_search_item_active: activeIdex === index }" @click="handleTab(index)">{{ item.text }}</li>
      </ul>
    </div>
    <module-self>
      <div class="home_search_content">
        <template v-if="activeIdex === 0">
          <!-- <module-homeTitle :title="$t(`Module['直播']`)" iconName="topLiving" type="1"></module-homeTitle> -->
          <template v-if="matchLiveList.length">
            <page-competitionCardnew type="live" :Anchor="true" :List="matchLiveList"
              @handleClickItem="handleClickItem"></page-competitionCardnew>

            <module-pagination :paddingTop="20" :page="page.page" :count="page.count" :limit="page.limit"
              @pageList="pageList"></module-pagination>
          </template>
          <template v-else>
            <module-skeletonCard v-if="loading" skeleton="live"></module-skeletonCard>
            <page-empty type="search" v-else :top="60" :title="$t(`Module['抱歉,我们找不到任何相关内容。']`)"></page-empty>
          </template>
        </template>

        <template v-else-if="activeIdex === 1">
          <module-homeTitle :title="$t(`Module['赛事']`)" iconName="topScore" type="1"></module-homeTitle>
          <template v-if="listData.length">
            <page-hotRecommended v-for="(item, key) in listData" :key="key" :match="item"
              type="search"></page-hotRecommended>
            <module-pagination :paddingTop="20" :page="page.page" :count="page.count" :limit="page.limit"
              @pageList="pageList"></module-pagination>
          </template>
          <template v-else>
            <module-skeletonCard v-if="loading" :height="510" :width="1280" skeleton="match"></module-skeletonCard>
            <page-empty type="search" v-else :top="60" :title="$t(`Module['抱歉,我们找不到任何相关内容。']`)"></page-empty>
          </template>
        </template>

        <template v-else-if="activeIdex === 2">
          <module-homeTitle :title="$t(`Module['主播']`)" iconName="topAnchor" type="1"></module-homeTitle>
          <page-hotAnchor :keyword="keyword"></page-hotAnchor>
        </template>

        <template v-else-if="activeIdex === 3">
          <module-homeTitle :title="$t(`Module['最新资讯']`)" iconName="toNews" type="1"></module-homeTitle>
          <template v-if="newsList.length">
            <page-competitionCard type="home" :List="newsList"
              @handleClickItem="handleNewsClickItem"></page-competitionCard>
            <module-pagination :paddingTop="20" :page="page.page" :count="page.count" :limit="page.limit"
              @pageList="pageList"></module-pagination>
          </template>
          <template v-else>
            <module-skeletonCard v-if="loading" skeleton="live"></module-skeletonCard>
            <page-empty type="search" v-else :top="60" :title="$t(`Module['抱歉,我们找不到任何相关内容。']`)"></page-empty>
          </template>
        </template>

        <template v-else-if="activeIdex === 4">
          <module-homeTitle :title="$t(`Module['精选影片']`)" iconName="topVideo" type="1"></module-homeTitle>
          <template v-if="videoList.length">
            <page-competitionCard type="home" :isVideo="true" :List="videoList"
              @handleClickItem="handleVideoClickItem"></page-competitionCard>
            <module-pagination :paddingTop="20" :page="page.page" :count="page.count" :limit="page.limit"
              @pageList="pageList"></module-pagination>
          </template>
          <template v-else>
            <module-skeletonCard v-if="loading" skeleton="live"></module-skeletonCard>
            <page-empty type="search" v-else :top="60" :title="$t(`Module['抱歉,我们找不到任何相关内容。']`)"></page-empty>
          </template>
        </template>
      </div>
    </module-self>
  </div>
</template>

<script>
import { getMatchLiveListPage, liveRecommend } from '@/api/live'
import {
  everySimpleMatchScore,
  matchAnchor,
  matchMarket
} from '@/api/matchScore'
import { sportNewList } from '@/api/sportNews'
import { sportVideoList } from '@/api/sportVideo'

import {
  analysisMatches,
  analysisAnchor,
  analysisMarket,
  analysisMQTTMarketMatches
} from '@/libs/util.js'
export default {
  data() {
    return {
      activeIdex: 0,
      Img: {
        OleLogo: require(`@/${this.$img.Page.Layout.OleLogo}`),
        GlobalSearch: require(`@/${this.$img.Page.Layout.GlobalSearch}`),
        MenuDown: require(`@/${this.$img.Page.Layout.MenuDown}`)
      },

      page: {
        page: 0,
        limit: 20,
        count: 0
      },
      matchLiveList: [],
      listData: [],
      newsList: [],
      videoList: [],
      keyword: '',
      loading: false
    }
  },

  computed: {
    localConfig() {
      return this.$store.state.app.localConfig
        ? JSON.parse(this.$store.state.app.localConfig)
        : {}
    },

    showVideo() {
      const { localConfig } = this
      let localName = localConfig?.lang || 'zh-CN'
      return ['zh-CN', 'en-US', 'vi-VN'].includes(localName)
    },

    searchNav() {
      const { showVideo } = this
      let nav = [
        {
          text: this.$t(`Module['直播']`),
          value: 1
        },
        // {
        //   text: this.$t(`Module['赛事']`),
        //   value: 2
        // },
        // {
        //   text: this.$t(`Module['主播']`),
        //   value: 3
        // },
        // {
        //   text: this.$t(`Module['最新资讯']`),
        //   value: 4
        // },
        // {
        //   text: this.$t(`Module['精选影片']`),
        //   value: 5
        // }
      ]
      if (showVideo) {
        nav = nav.filter(r => r.value !== 5)
      }
      return nav
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
    const { query } = this.$route
    if (query?.keyword) {
      this.keyword = query?.keyword || ''
    }
    this.$bus.$on('all/search', this.homeSearchon)
    this.handleTab(0)
    this.globalNoticeType()
  },

  destroyed() {
    this.$bus.$off(`subscribeConfirm`)
    this.$bus.$off('all/search', this.homeSearchon)
  },

  methods: {
    handleKeydown(e) {
      if (e.keyCode == 13) {
        this.homeSearch()
      }
    },

    handleClickItem(item) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }

      let { live_play_id, live_room_id, all_match_id } = item
      if (live_room_id) {
        this.$router.push({ name: 'anchorRoom', params: { id: live_room_id, all_match_id: all_match_id, type: 0 } })
      } else if (live_play_id) {
        this.$router.push({ name: 'anchorRoom', params: { id: live_play_id, all_match_id: all_match_id, type: 1 } })
      }
    },

    homeSearchon(e) {
      this.keyword = e
      this.homeSearch()
    },

    homeSearch() {
      this.pageList(1)
    },

    handleTab(index) {
      this.activeIdex = index
      this.pageList(1)
    },

    pageList(page) {
      this.page.page = page
      const { activeIdex } = this
      switch (activeIdex) {
        case 0:
          this.getMatchLiveListPage()
          break
        case 1:
          this.getMatchDairyList()
          break
        case 2:
          break
        case 3:
          this.getSportNewList()
          break
        case 4:
          this.getVideoList()
          break
      }
    },

    async getMatchLiveListPage() {
      try {
        this.matchLiveList = []
        this.loading = true
        const param = {
          page: this.page.page,
          limit: this.page.limit,
          key_word: this.keyword
        }
        const { Code, Data } = await liveRecommend(param)
        if (Code === 200) {
          const { Data: List, Count, Page } = Data
          let live = this.$img.Page.Live
          this.matchLiveList = List.map(r => ({
            ...r,
            liveImg: live[r.Type] ? require(`@/${live[r.Type]}`) : ''
          }))
          this.page.page = Page
          this.page.count = Count
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    globalNoticeType() {
      this.$bus.$off(`ole/global`)
      this.$bus.$off(`subscribeConfirm`)
      this.$bus.$on(`ole/global`, res => {
        let { notice_type } = res
        if (notice_type === 1 || notice_type === 2) {
          analysisMQTTMarketMatches(res, this)
        } else if (notice_type === 5 || notice_type === 6) {
          let ids = []
          this.listData.forEach(item => {
            item.list.forEach(matches => {
              ids.push({
                id: matches.id,
                sport_type: matches.sportType
              })
            })
          })
          this.matchAnchor(ids)
        }
      })
      this.$bus.$on(`subscribeConfirm`, res => {
        let { id, sport_type, status } = res
        let { listData } = this
        let { activeIdex } = this
        if (activeIdex === 2) {
          listData.forEach((item, key) => {
            item.list.forEach((matches, index) => {
              if (matches.id === id && matches.sportType === sport_type) {
                this.$set(listData[key].list[index], 'status', status)
              }
            })
          })
        }
      })
    },

    async getMatchDairyList() {
      try {
        this.listData = []
        const { page } = this
        this.loading = true
        const { Data, Code } = await everySimpleMatchScore({
          page: page.page,
          limit: page.limit,
          key_word: this.keyword
        })
        if (Code === 200) {
          const { Data: competition, Count } = Data
          page.count = Count
          let list = competition.MatchList
          let { ids, arr } = analysisMatches(list)
          this.listData = arr
          this.matchAnchor(ids)
          this.matchMarket(ids)
          // this.listData = competition.MatchList.map(m => ({
          //   ...m,
          //   selVal: m.bet_type.length ? m.bet_type[0] : undefined
          // }))
          this.loading = false
        } else this.loading = false
      } catch (error) {
        this.loading = false
      }
    },

    matchAnchor(list) {
      matchAnchor({
        matches: list
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          if (Data) {
            analysisAnchor(Data, this)
          }
        }
      })
    },

    matchMarket(list) {
      matchMarket({
        matches: list
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          if (Data) {
            analysisMarket(Data, this)
          }
        }
      })
    },

    async getSportNewList() {
      try {
        this.newsList = []
        this.loading = true
        const param = {
          page: this.page.page,
          limit: this.page.limit,
          key_word: this.keyword
        }
        const { Code, Data } = await sportNewList(param)
        if (Code === 200) {
          const { Data: List, Count, Page } = Data
          this.newsList = List
          this.page.page = Page
          this.page.count = Count
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    handleLiveClickItem(item) {
      const { Id, Type, LiveRoomId } = item
      if (Type === 'ANCHOR' || LiveRoomId) {
        this.$router.push({ name: 'anchorRoom', params: { id: LiveRoomId } })
      } else {
        this.$router.push({ name: 'officialRoom', params: { id: Id } })
      }
    },

    handleNewsClickItem(item) {
      this.$router.push({ name: 'sportNewsDetails', params: { id: item.id } })
    },

    handleVideoClickItem(item) {
      this.$router.push({ name: 'sportVideoDetails', params: { id: item.id } })
    },

    async getVideoList() {
      try {
        this.videoList = []
        this.loading = true
        const param = {
          page: this.page.page,
          limit: this.page.limit,
          key_word: this.keyword
        }
        const { Code, Data } = await sportVideoList(param)
        if (Code === 200) {
          const { Data: List, Count, Page } = Data
          this.videoList = List
          this.page.page = Page
          this.page.count = Count
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_home_search_warp {
  @apply w-full h-full flex flex-col;

  .m_home_search_input {
    @apply py-20px pb-10px mx-auto w-400px;

    .input_item {
      .v-input__slot {
        @apply rounded-20px;
        border: 1px solid #f9b31f !important;

        fieldset {
          border: none;
        }
      }

      .v-text-field__details {
        display: none;
      }
    }
  }

  .home_search_nav {
    @apply w-full h-80px bg-black;

    .home_search_list {
      @apply flex w-1280px h-full pl-0px my-0px mx-auto items-center;

      .home_search_item {
        @apply text-16px font-bold flex items-center mr-60px cursor-pointer relative;
      }

      .home_search_item_active {
        @apply text-hex-E6CCAE text-20px;
      }

      .home_search_item_active::after {
        content: '';
        height: 6px;
        position: absolute;
        bottom: -20px;
        left: 0px;
        width: 100%;
        border-radius: 10px;
        background-color: #E6CCAE;
      }
    }
  }

  .home_search_content {
    @apply pt-20px pb-40px;
  }
}
</style>