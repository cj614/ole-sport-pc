<template>
  <div class="page_home">
    <div class="m_home_img" v-show="home.headerBanner">
      <page-ImgSwiper
        height="300"
        typeName="Pc-Homepage header banner"
        @show="(res) => home.headerBanner = res"
      ></page-ImgSwiper>
    </div>

    <div class="home_content content-bg">
      <div class="bg_color">
        <div class="content_two">
          <!-- 首页通知 -->
          <div class="notice" v-if="noticeList.length">
            <div class="notice-details">
              <v-img :src="Img.Notify" class="msgImg" width="20" height="20"></v-img>
              <!-- -->
              <page-marquee :msg="noticeList">
                <div v-for="(item, index) in noticeList" class="item_notice" :key="index">
                  <span class="item_notice_msg">{{ item.content }}</span>
                  <a class="link" :href="item.onclick_url" target="_blank">{{ item.onclick_url }}</a>
                </div>
              </page-marquee>
            </div>
          </div>

          <!-- 赛程 -->
          <page-schedule ref="scheduleRef"></page-schedule>

          <!-- banner 广告 -->
          <div class="middle_banner_adv" v-show="home.middleBanner">
            <page-ImgSwiper
              height="150"
              typeName="Pc-Homepage middle banner"
              @show="(res) => home.middleBanner = res"
            ></page-ImgSwiper>
          </div>

          <module-homeTitle :title="$t(`Module['精彩推荐']`)" iconName="topMoment" type="1"></module-homeTitle>
          <page-3DSwiper ref="homeLiveSwiper"></page-3DSwiper>

          <module-homeTitle :title="$t(`Page['赛事比分']`)" iconName="topScore" @change="handleChange"></module-homeTitle>
          <div class="home_match_score no_scrollbar" v-scroll.self="onScroll">
            <template v-if="listData.length">
              <page-hotRecommended v-for="(item, key) in listData" :key="key" :match="item"></page-hotRecommended>
            </template>
            <template v-else>
              <module-skeletonCard v-if="loading" :height="510" :width="1280" skeleton="match"></module-skeletonCard>
              <page-empty v-else :top="60" class="mb-20px py-20px" :title="$t(`Module['暂无数据']`)"></page-empty>
            </template>
            <template v-if="listData.length && loading">
              <div class="flex justify-center w-full h-40px">
                <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
              </div>
            </template>
          </div>

          <module-homeTitle :title="$t(`Module['热门主播']`)" iconName="topAnchor"></module-homeTitle>
          <page-hotAnchor ref="homeHot"></page-hotAnchor>

          <module-homeTitle :title="$t(`Module['最新资讯']`)" iconName="toNews"></module-homeTitle>
          <div class="home_hot">
            <template v-if="newsList.length">
              <page-competitionCard
                type="home"
                :List="newsList"
                @handleClickItem="handleNewsClickItem"
              ></page-competitionCard>
            </template>
            <template v-else>
              <module-skeletonCard
                v-if="videoLoading"
                type="card-avatar,article@2"
                skeletonClass="mx-auto"
                :forIt="4"
              ></module-skeletonCard>
              <page-empty v-else :top="0" class="mb-20px py-20px" :title="$t(`Module['暂无数据']`)"></page-empty>
            </template>
          </div>

          <module-homeTitle :title="$t(`Module['精选影片']`)" v-if="showVideo" iconName="topVideo"></module-homeTitle>
          <div class="home_hot" v-if="showVideo">
            <template v-if="videoList.length">
              <page-competitionCard
                type="home"
                :isVideo="true"
                :List="videoList"
                @handleClickItem="handleVideoClickItem"
              ></page-competitionCard>
            </template>
            <template v-else>
              <module-skeletonCard
                v-if="videoLoading"
                skeletonClass="mx-auto"
                type="card-avatar,article@2"
                :forIt="4"
              ></module-skeletonCard>
              <page-empty
                v-else
                :top="0"
                type="video"
                class="mb-20px py-20px"
                :title="$t(`Module['暂无数据']`)"
              ></page-empty>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="m-toolbar-left">
      <ul class="left-link">
        <li v-for="(item, index) in toolbarLeft" class="left-item" :key="index">
          <ShareNetwork
            :network="item.network"
            :key="index"
            :style="{ backgroundColor: 'transparent' }"
            :url="item.url"
            :title="item.title"
            :description="item.description"
            :quote="item.quote"
            :hashtags="item.hashtags"
            :twitterUser="item.twitterUser"
          >
            <div class="flex items-center">
              <v-img :src="item.icon" width="28" min-width="28" height="28"></v-img>
            </div>
          </ShareNetwork>
        </li>
      </ul>
    </div>

    <div
      class="m-toolbar-right"
      v-for="(item, index) in toolbarRight"
      :key="index"
      :style="{ top: index == 0 ? '50%' : 'calc(50% + 78px)',transform:index == 0 ? 'translatey(-50%)' : 'translatey(-50%)' }"
    >
      <div
        class="right_item"
        :class="{ right_item_active: rightIndex === index }"
        @mouseover="handleOverRightLink(item, index)"
        @mouseout="handleOutRightLink(item, index)"
        @click="handleClickLink(item)"
      >
        <template v-if="item.carousel">
          <v-carousel
            :show-arrows="false"
            cycle
            height="28"
            :style="{width:'28px'}"
            hide-delimiter-background
            hide-delimiters
            @change="handlerightchange"
          >
            <v-carousel-item
              v-for="(ca,key) in item.list"
              :key="key"
              :src="ca.contact_app_logo_url"
              contain
            ></v-carousel-item>
          </v-carousel>
          <span class="right_er" v-show="rightIndex === index && usQRCode">
            <v-img :src="usQRCode" width="160" height="160" contain></v-img>
          </span>
        </template>
        <template v-else>
          <span>
            <v-img :src="item.icon" width="28" height="28" contain></v-img>
          </span>
          <span class="right_er" v-show="rightIndex === index && item.QRCode">
            <v-img :src="item.QRCode" width="160" height="160" contain></v-img>
          </span>
        </template>
      </div>
    </div>

    <page-adv left="Pc-Homepage left side banner" right="Pc-Homepage right side banner"></page-adv>
    <page-footeradv footer="Pc-Homepage footer banner"></page-footeradv>

    <page-ImgSwiper
      v-show="0"
      typeName="Pc-Homepage pop-up banner"
      @show="value => home.dialog = value"
    ></page-ImgSwiper>
    <module-dialog :dialog.sync="home.dialog" v-show="home.dialog" :hideHeader="false" width="1000">
      <template v-slot:content>
        <div class="w-1000px relative">
          <page-ImgSwiper
            height="599"
            typeName="Pc-Homepage pop-up banner"
            @show="value => home.dialog = value"
          ></page-ImgSwiper>
          <span
            class="absolute top-20px right-20px cursor-pointer"
            @click.stop="home.dialog = false"
          >
            <v-img :src="Img.AdvClose" width="40" height="40"></v-img>
          </span>
        </div>
      </template>
    </module-dialog>
  </div>
</template>

<script>
import { getHomeNotice, setting, homeDownLoad } from '@/api/global'
import {
  everySimpleMatchScore,
  matchAnchor,
  matchMarket
} from '@/api/matchScore'
import { sportNewList } from '@/api/sportNews'
import { sportVideoList } from '@/api/sportVideo'
import { socialAppContact } from '@/api/app'

import {
  analysisMatches,
  analysisAnchor,
  analysisMarket,
  analysisMQTTMarketMatches
} from '@/libs/util.js'

export default {
  name: 'home',

  metaInfo() {
    return {
      title: this.$t(`Page['首页']`)
    }
  },

  data() {
    return {
      index: 2,
      Img: {
        Notify: require(`@/${this.$img.Page.Home.Notify}`),
        QRCode: require(`@/${this.$img.Page.Layout.QRCode}`),
        AdvClose: require(`@/${this.$img.Page.Layout.AdvClose}`)
      },

      home: {
        dialog: false,
        headerBanner: false,
        middleBanner: false
      },

      match: {
        page: 1,
        limit: 10,
        count: 0
      },
      params: {},

      noticeList: [],
      listData: [],
      loading: false,
      videoList: [],
      videoLoading: false,
      newsList: [],
      newsLoading: false,
      rightIndex: -1,
      rightList: [],
      downAppData: {},
      usQRCode: ''
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
      return !['zh-CN', 'en-US', 'vi-VN'].includes(localName)
    },

    toolbarLeft() {
      const {
        FacebookShare,
        TwitterShare,
        MessengerShare,
        WhatAppShare,
        VKontakteShare,
        LineShare,
        SkypeShare,
        TelegramShare
      } = this.$img.Page.Layout
      return [
        {
          network: 'facebook',
          url: window.location.href,
          description: 'OLE LIVE',
          quote: 'OLE LIVE',
          hashtags: 'OLE LIVE',
          title: 'OLE LIVE',
          icon: require(`@/${FacebookShare}`),
          link: ''
        },
        {
          network: 'twitter',
          url: window.location.href,
          description: 'OLE LIVE',
          quote: 'OLE LIVE',
          hashtags: 'OLE LIVE',
          title: 'OLE LIVE',
          icon: require(`@/${TwitterShare}`),
          link: ''
        },
        {
          network: 'email',
          url: window.location.href,
          description: 'OLE LIVE',
          quote: 'OLE LIVE',
          hashtags: 'OLE LIVE',
          title: 'OLE LIVE',
          icon: require(`@/${MessengerShare}`),
          link: ''
        },
        {
          network: 'whatsapp',
          url: window.location.href,
          description: 'OLE LIVE',
          quote: 'OLE LIVE',
          hashtags: 'OLE LIVE',
          title: 'OLE LIVE',
          icon: require(`@/${WhatAppShare}`),
          link: ''
        },
        {
          network: 'vk',
          url: window.location.href,
          description: 'OLE LIVE',
          quote: 'OLE LIVE',
          hashtags: 'OLE LIVE',
          title: 'OLE LIVE',
          icon: require(`@/${VKontakteShare}`),
          link: ''
        },
        {
          network: 'line',
          url: window.location.href,
          description: 'OLE LIVE',
          quote: 'OLE LIVE',
          hashtags: 'OLE LIVE',
          title: 'OLE LIVE',
          icon: require(`@/${LineShare}`),
          link: ''
        },
        {
          network: 'skype',
          url: window.location.href,
          description: 'OLE LIVE',
          quote: 'OLE LIVE',
          hashtags: 'OLE LIVE',
          title: 'OLE LIVE',
          icon: require(`@/${SkypeShare}`),
          link: ''
        },
        {
          network: 'telegram',
          url: window.location.href,
          description: 'OLE LIVE',
          quote: 'OLE LIVE',
          hashtags: 'OLE LIVE',
          title: 'OLE LIVE',
          icon: require(`@/${TelegramShare}`),
          link: ''
        }
      ]
    },

    toolbarRight() {
      const { rightList, downAppData } = this
      const { AppIconGif } = this.$img.Page.Layout
      let list = []
      if (Object.keys(downAppData).length) {
        list.push({
          icon: require(`@/${AppIconGif}`),
          link: 'App',
          QRCode: downAppData.download_qrcode_url
        })
      }

      if (rightList && rightList.length) {
        list.unshift({ carousel: true, list: rightList })
      }
      return list
    }
  },

  mounted() {
    this.getSetting()
    this.homeDownLoad()
    this.getNoticeList()
    this.getSportNewList()
    this.sportVideoList()
    this.globalNoticeType()
  },

  methods: {
    handlerightchange(n) {
      const { toolbarRight } = this
      const [item] = toolbarRight
      if (item) {
        this.usQRCode = item.list[n].contact_qrcode_url
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
    onScroll(e) {
      let than = e.target
      const condition =
        Math.floor(than.scrollHeight - than.scrollTop) <= than.clientHeight

      if (condition) {
        this.loadMore()
      }
    },

    async getCocialAppContact() {
      const { Code, Data } = await socialAppContact()
      if (Code === 200) {
        this.rightList = Data
      }
    },

    loadMore() {
      //容错
      let maxIndex =
        this.match.count % this.match.limit === 0
          ? this.match.count / this.match.limit
          : Math.floor(this.match.count / this.match.limit)
      if (maxIndex <= this.match.page) {
        return
      }

      this.match.page++
      this.getMatchDairyList(this.params)
    },

    async getMatchDairyList(params) {
      try {
        this.params = params
        const { start, end } = params
        if (!start) {
          return
        }
        this.loading = true
        const { Data, Code } = await everySimpleMatchScore({
          status: 0,
          start,
          end,
          page: this.match.page,
          limit: this.match.limit
        })
        if (Code === 200) {
          const { Data: competition, Count } = Data
          let { ids, arr } = analysisMatches(competition.MatchList)
          this.match.count = Count
          this.listData = [...this.listData, ...arr]
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
        console.log(error)
      }
    },

    async getSportNewList() {
      try {
        this.newsList = []
        this.newsLoading = true
        const param = {
          page: 1,
          limit: 4
        }
        const { Code, Data } = await sportNewList(param)
        if (Code === 200) {
          const { Data: List } = Data
          this.newsList = List
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.newsLoading = false
      }
    },

    async sportVideoList() {
      try {
        this.videoList = []
        this.videoLoading = true
        const param = {
          page: 1,
          limit: 4
        }
        const { Code, Data } = await sportVideoList(param)
        if (Code === 200) {
          const { Data: List } = Data
          this.videoList = List
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.videoLoading = false
      }
    },

    handleChange(data) {
      this.listData = []
      this.match.page = 1
      this.getMatchDairyList(data)
    },

    async getNoticeList() {
      const { Data, Code } = await getHomeNotice()
      if (Code === 200) {
        this.noticeList = Data
      }
    },

    handleNewsClickItem(item) {
      this.$router.push({ name: 'sportNewsDetails', params: { id: item.id } })
    },

    handleVideoClickItem(item) {
      this.$router.push({ name: 'sportVideoDetails', params: { id: item.id } })
    },

    handleOverRightLink(item, index) {
      this.homeDownLoad()
      this.rightIndex = index
    },

    handleOutRightLink() {
      this.rightIndex = -1
    },

    handleClickLink(item) {
      const { link } = item
      if (link) {
        this.$router.push({ name: link })
      }else if(item.list){
        //打开一个新的页面
        window.open(item.list[0].contact_url);
      }
    },

    async homeDownLoad() {
      const { Code, Data } = await homeDownLoad()
      if (Code === 200) {
        this.downAppData = Data
        this.getCocialAppContact()
      }
    },

    async getSetting() {
      const { Code } = await setting()
      if (Code === 200) {
        this.home.img = ''
      }
    },

    globalNoticeType() {
      this.$bus.$off(`ole/global`)
      this.$bus.$off(`subscribeConfirm`)

      this.$bus.$on(`ole/global`, res => {
        let { notice_type } = res
        if (notice_type === 1 || notice_type === 2) {
          analysisMQTTMarketMatches(res, this)
        } else if (notice_type === 4) {
          this.$refs.homeLiveSwiper.getMatchLiveListPage()
        } else if (notice_type === 5 || notice_type === 6) {
          this.$refs.homeHot.hotAnchorList()
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
        } else if (notice_type === 10) {
          this.$refs.scheduleRef.getLiveSubscribeMatchList()
        }
      })
      this.$bus.$on(`subscribeConfirm`, res => {
        let { id, sport_type, status } = res
        let { listData } = this
        listData.forEach((item, key) => {
          item.list.forEach((matches, index) => {
            if (matches.id === id && matches.sportType === sport_type) {
              this.$set(listData[key].list[index], 'status', status)
            }
          })
        })
      })
    }
  },

  destroyed() {
    this.$bus.$off(`ole/global`)
    this.$bus.$off(`subscribeConfirm`)
  }
}
</script>

<style lang="scss" scoped>
.m-toolbar-left {
  @apply fixed left-0px rounded-r-10px top-1/2 z-4;
  transform: translatey(-50%);
  background: #2BA5FF;
  .left-link {
    @apply flex flex-col p-10px;
    .left-item {
      @apply cursor-pointer py-10px;
    }
  }
}
.m-toolbar-right {
  @apply fixed right-0px z-4;
  .right_item {
    @apply flex items-center px-15px w-55px h-58px rounded-l-10px cursor-pointer relative;
    background: #2BA5FF;
    .v-window__container {
      width: 28px;
    }
    .right_er {
      @apply absolute  left-48px;
      background-color: #fff;
      border-radius: 20px;
      overflow: hidden;
      top: -137px;
      @apply border-2px border-soild border-warning;
      border-radius: 20px 20px 0px 20px;
      padding: 10px;
      .v-image__image {
      }
    }
  }
  .right_item_active {
    @apply w-286px;
  }
}
.page_home {
  @apply h-full;
  .content-bg {
    @apply min-h-500px bg-no-repeat bg-center bg-hex-f4f6ff;
    background: url(../../static/image/page/layout/image_ole_bg.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    .bg_color {
      // @apply bg-hex-f4f6ff;
      .content_two {
        @apply w-1280px my-0px mx-auto pt-20px pb-40px;
        .notice {
          @apply h-30px mb-10px;
          .notice-details {
            @apply flex items-center h-30px pl-10px rounded-10px bg-lightFirst text-14px font-normal text-dark;
            .item_notice {
              .item_notice_msg {
                @apply text-14px text-dark;
              }
            }
            .link {
              @apply text-primaryFirst ml-6px cursor-pointer text-14px;
            }
            .msgImg {
              @apply mr-10px;
              flex: none !important;
            }
          }
        }
        .home_match_score {
          @apply h-550px rounded-10px overflow-y-auto mb-40px bg-lightFirst;
        }
        .home_hot {
          @apply min-h-232px rounded-10px;
        }
        .home-av {
          @apply mb-20px;
          .v-image {
            @apply rounded-10px;
          }
        }
      }
    }
  }
}
</style>
