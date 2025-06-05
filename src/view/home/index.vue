<template>
  <div class="m_live_warp">
    <div class="liveing">
      <div class="content-wrapper" v-if="livingList.length">
        <!-- 左侧视频播放区域 -->
        <div class="video-section">
          <MyDplayer :movie="videoInfo" v-if="videoInfo.video" :key="playerKey"></MyDplayer>
          <div class="btn"   v-if="videoInfo.videType === 'customHls'"
            @click="goanchorRoom(dataUserList[0])">{{
              $t('Module["进入直播间"]')
            }}
          </div>
        </div>

        <!-- 右侧视频列表 -->
        <div class="video-list">
          <div class="list-content">
            <div v-for="(video, index) in livingList" :key="index" class="video-item"
              :class="{ active: currentIndex === index }" @click="selectVideo(index)">
              <v-img class="imgs" :src="video.bg_img" :alt="video.user_name"></v-img>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--       轮播图-->
    <div v-show="headerBanner" style="padding-top: 20px;background: #000 !important;">
      <page-ImgSwiper height="200" typeName="Pc-Homepage header banner"
        @show="res => (headerBanner = res)"></page-ImgSwiper>
    </div>

    <!-- 正在直播/推荐视频 -->
    <module-self>
      <div class="live_content">
        <div class="title_box">
          <div @click="handle_item(item, index)" class="title_item" :class="[currentTitle == index ? 'active' : '']"
            v-for="(item, index) in titleList" :key="index">
            <span :class="[currentTitle == index ? 'active' : '']" class="title_name">{{
              $t(`Module['${item.name}']`)
            }}</span>
          </div>
        </div>
        <template v-if="matchLiveList.length">
          <div class="pb-40px">
            <page-competitionCardnew :type="liveType" :Anchor="true" :List="matchLiveList"
              @handleClickItem="handleClickItem"></page-competitionCardnew>

            <v-btn class="more_btn" @click="goMore('homeMore')">
              <span>{{ $t('Module["查看更多"]') }}</span>

              <v-icon size="18" style="color: #E4CAAB !important;margin-left: 5px;">mdi-arrow-right
              </v-icon>
            </v-btn>
          </div>
        </template>
        <template v-else>
          <module-skeletonCard v-if="loading" skeleton="live"></module-skeletonCard>
          <page-empty type="matchLive" v-else :top="40" :title="$t(`Module['目前暂无直播']`)"></page-empty>
        </template>
      </div>
    </module-self>

    <!-- 主播展示 -->
    <div class="live">
      <h1 class="title">{{ $t('Module["主播展示"]') }}</h1>
      <div class="live-mainbox">
        <div class="frist" :style="{ backgroundImage: `url(${Img.LiveBg})` }">
          <div class="live-tips" v-if="dataUserList[0]?.is_live">
            <span>{{ $t('Module["正在直播"]') }}</span>
            <v-img class="live-img" :src="Img.Living"></v-img>
          </div>
          <v-img class="img" :src="dataUserList[0]?.img_url"></v-img>
          <v-img class="follwing-img" :src="dataUserList[0]?.is_focused ? Img.Fllowing : Img.NotFllowing"></v-img>
        </div>
        <div class="infos">
          <div class="name-container">
            <span :style="{ maxWidth: dataUserList[0]?.tag ? '200px' : '340px' }" class="card-name">
              {{ dataUserList[0]?.user_name }}
            </span>

            <span v-if="dataUserList[0]?.tag" class="card-tag" v-for="(j, jindex) in parsedTags" :key="jindex">{{ j }}
            </span>
          </div>
          <div class="card-description">{{ dataUserList[0]?.description }}</div>
          <div class="card-info">
            <div class="info-item">
              <span class="top-text">{{ $t('Module["战绩"]') }}</span>
              <div>
                <span>{{ $t('Module["胜"]') }}: </span>
                <span style="margin-right:10px; color: red; font-weight: bold; vertical-align: middle;">{{
                  dataUserList[0]?.standing_win
                }}</span>
                <span>{{ $t('Module["败"]') }}:</span>
                <span style="color: green; font-weight: bold;"> {{ dataUserList[0]?.standing_fail }}</span>
              </div>
            </div>
            <div class="info-item" style="margin-left: 20px;">
              <span class="top-text">{{ $t('Module["每日带车时间"]') }}</span>
              <div style="font-weight: bold;">
                {{ dataUserList[0]?.open_time }}
              </div>
            </div>
          </div>
          <v-btn v-if="dataUserList[0]?.is_live"
            :style="{ background: `url(${Img.ToLive}) !important`, backgroundSize: 'cover', color: '#5C330A !important' }"
            class="btn" @click="goanchorRoom(dataUserList[0])">{{
              $t('Module["进入直播间"]')
            }}
          </v-btn>
          <v-btn v-else @click="goanchorRoom(dataUserList[0])" class="btn">{{ $t('Module["等待开播"]') }}...</v-btn>
        </div>
        <div class="frist" :style="{ backgroundImage: `url(${Img.LiveBg})` }">
          <v-img class="img" :src="dataUserList[1]?.img_url"></v-img>
        </div>
        <div class="frist" :style="{ backgroundImage: `url(${Img.LiveBg})` }">
          <v-img class="img" :src="dataUserList[2]?.img_url"></v-img>
        </div>
      </div>
      <v-btn class="more_btn" @click="goMore('live')">
        <span>{{ $t('Module["查看更多"]') }}</span>

        <v-icon size="18" style="color: #E4CAAB !important;margin-left: 5px;">mdi-arrow-right</v-icon>
      </v-btn>
    </div>

    <!-- 下载app -->
    <div class="download-app">
      <div class="right">
        <div class="main">
          <v-img :src="Img.OleLogo" height="121" width="260"></v-img>
          <p style="margin-top: 20px;">{{ $t('Module["欢迎来到"]') }} CLB Bí kíp Baccarat</p>
          <p style="color: #FFD88A; font-size: 48px; font-weight: 500; ">{{ $t('Module["感受CLB Bí kíp
            Baccarat为您带来的极致体验"]')
          }}</p>
          <p style="color: #878787;">{{ $t('Module["下载APP随时随地体验更多精彩内容，还有更多优惠等你来领"]') }}</p>
          <v-btn class="download_btn" @click="goMore('App')">
            <span>{{ $t('Module["下载"]') + ' APP' }}</span>
            <v-icon size="18" style="color: #fff !important;margin-left: 5px;">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import { HomeLive, liveUserList, getVideoList } from '@/api/live'
import { sportNewList } from '@/api/sportNews'

// import { globalBannerList } from "@/api/global";
import { storageRead, storageSave } from "@/libs/util";
import MyDplayer from "_c/module/myDplayer.vue";

export default {
  components: { MyDplayer },
  data() {
    return {
      headerBanner: false,
      currentIndex: 0,
      currentTitle: 0,
      liveType: 0,
      livingList: [], // 正在直播列表
      matchLiveList: [], // 正在直播 / 精彩推荐
      dataUserList: [], // 主播展示
      articleLoading: false, //文章加载
      articleList: [], // 文章列表
      playerKey: 0, // 用于强制重载播放器

      // swiperList: [],
      titleList: [{ name: '直播中', live_type: 0 }, { name: '精彩推荐', live_type: 1 }],

      loading: false,
      page: {
        page: 1,
        limit: 8,
        count: 0
      },
      sport_type: '',
      aboveBanner: false,
      // competition: '',
      videoInfo: {
        img: '',
        video: '',
        videType: '',
      },
      item: {},
      Img: {
        Living: require(`@/${this.$img.Page.Home.Living}`),
        LiveBg: require(`@/${this.$img.Page.Home.LiveBg}`),
        ToLive: require(`@/${this.$img.Page.Home.ToLive}`),
        Fllowing: require(`@/${this.$img.Page.Home.Fllowing}`),
        NotFllowing: require(`@/${this.$img.Page.Home.NotFllowing}`),
        OleLogo: require(`@/${this.$img.Page.Layout.OleLogo}`),
        Fire: require(`@/${this.$img.Page.Live.Fire}`)
      },

    }
  },

  computed: {

    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    },
    parsedTags() {
      try {
        return this.dataUserList[0]?.tag ? JSON.parse(this.dataUserList[0].tag) : [];
      } catch (e) {
        return [];
      }
    }
  },

  mounted() {
    if (storageRead("isFirst") === '1') {
      storageSave("isFirst", 0)
    }

    this.initMatchLiveList()
    this.getUserList() // 主播列表
    this.getSportArticleList() // 文章列表
  },

  methods: {

    async initMatchLiveList() {
      // 获取视频数据
      await this.getLiving() // 正在直播列表
      console.log(this.matchLiveList.length, 'fresh')
      if (this.matchLiveList.length === 0) {
        await this.handle_item(this.titleList[1], 1)
        this.livingList = this.matchLiveList.map((item) => {
          return {
            ...item,
            bg_img: item.img_url,
            live_play_url: item.video_url,
          }
        })
        this.videoInfo = {
          img: this.livingList[0].bg_img,
          video: this.livingList[0].live_play_url,
          videType: '',
        }
      }
    },

    selectVideo(index) {
      if (this.currentIndex === index) return
      // dplayer 重载
      this.currentIndex = index
      this.videoInfo.img = this.livingList[index].bg_img
      this.videoInfo.video = this.livingList[index].live_play_url
      this.videoInfo.videType = this.livingList[index].live_type
      this.playerKey++ // 增加key值以强制重载播放器
    },
    // 查看更多
    goMore(name) {

      this.$router.push({
        name
      })
    },
    // 主播列表
    async getUserList() {
      let res = await liveUserList({ page: 1, limt: 3 })
      if (res.Code === 200) {
        this.dataUserList = res.Data.Data
      }
    },

    async handle_item(item, index) {
      this.currentTitle = index
      this.liveType = item.live_type
      await this.getMatchLiveListPage()
    },
    handleClickItem(item) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      if (this.liveType !== 0) {
        this.$router.push({
          name: 'videoDetails',
          params: { id: item.id }
        });
        return
      }
      this.goanchorRoom(item)
    },
    goanchorRoom(item) {
      let { live_play_id, live_room_id, all_match_id } = item

      if (live_room_id) {
        this.$router.push({ name: 'anchorRoom', params: { id: live_room_id, all_match_id: all_match_id, type: 0 } })
      } else if (live_play_id) {
        this.$router.push({ name: 'anchorRoom', params: { id: live_play_id, all_match_id: all_match_id, type: 1 } })
      } else {
        let params = {
          anchor: {
            id: item.user_id,
            img_url: item.img_url,
            user_name: item.user_name,
            follow_num: item.follow_num,
            open_time: item.open_time,
          },
          title: item.user_name,
          view_num: item.follow_num,
        }
        this.$router.push({
          name: 'anchorRoom',
          params: {
            info: JSON.stringify(params)
          }
        })
      }
    },

    pageList(page) {
      this.page.page = page
      this.getMatchLiveListPage()
    },


    async getLiving() {
      try {
        this.livingList = []
        this.loading = true
        const param = {
          page: this.page.page,
          limit: this.page.limit,
          live_type: 0
        }
        const { Code, Data } = await HomeLive(param);

        if (Code === 200) {
          const { Data: List } = Data
          this.livingList = List
          this.matchLiveList = List
          this.videoInfo = {
            img: List[0].bg_img,
            video: List[0].live_play_url,
            videType: 'customHls',
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async getMatchLiveListPage() {
      try {
        this.matchLiveList = []
        this.loading = true
        const param = {
          page: this.page.page,
          limit: this.page.limit,
          sport_type: '',
          live_type: this.liveType
        }
        let res;
        switch (this.liveType) {
          case 0:
            res = await HomeLive(param);
            break;
          case 1:
            res = await getVideoList(param);
            break;
          default:
          // uni.showToast({
          //   title: '不支持的类型',
          //   icon: 'none'
          // });
          // return;
        }
        const { Code, Data } = res
        if (Code === 200) {
          const { Data: List, Count } = Data
          this.matchLiveList = List.map(r => ({
            ...r,
            Type: r.sport_type
          }))
          this.page.count = Count
          if (Object.keys(this.item).length) {
            this.$set(this.item, 'count', Count)
          }
          // console.log(this.matchLiveList)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 获取文章列表
    async getSportArticleList() {
      try {
        this.articleList = []
        this.articleLoading = true
        const param = {
          page: 1,
          limit: 4,

        }
        const { Code, Data } = await sportNewList(param)
        if (Code === 200) {
          const { Data: List } = Data
          this.articleList = List

        }
      } catch (error) {
        console.log(error)
      } finally {
        this.articleLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_live_warp {
  @apply w-full h-full flex flex-col;

  .title {
    color: #fff;
    font-size: 30px !important;
    font-weight: 500;
    padding: 40px 0;
    text-align: center
  }

  .more_btn {
    border: 1px solid #ECCD91;
    color: #E4CAAB;
    background: #000 !important;
    display: flex !important;
    align-items: center !important;
    margin: 30px auto;
  }

  .liveing {
    height: 720px;
    background: url(../../static/image/live/bg.png);
    background-position: center center;
    background-repeat: no-repeat;
    // background-attachment: fixed;
    background-size: cover;
    padding: 30px 0;

    .content-wrapper {
      display: flex;
      gap: 2px;
      width: 1280px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 8px;
      overflow: hidden;
    }

    .video-section {
      flex: 1;
      min-width: 0;
      height: 660px;
      position: relative;

      .btn {
        position: absolute;
        top: calc(50% - 15px);
        left: calc(50% - 88px);

        opacity: 0;
        visibility: hidden;
        transition: all 0.5s ease;

        border-radius: 10px;
        background: rgba(255, 87, 51, 1);
        font-size: 30px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        padding: 10px 18px;

      }

      &:hover .btn {
        opacity: 1;
        visibility: visible;
      }
    }

    .video-list {
      width: 200px;
      // background: red;
      // padding-left: 10px;

      .list-content {
        height: 660px;
        overflow-y: auto;
        padding-right: 8px;
        padding-bottom: 8px;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background: #4a4a4a;
          border-radius: 3px;
        }
      }

      .video-item {
        display: flex;
        gap: 12px;
        cursor: pointer;
        margin-top: 8px;
        border-radius: 8px;
        transition: all 0.3s;
        border: 3px solid transparent;
        position: relative;
        margin-left: 10px;

        &.active::before {
          content: "";
          position: absolute;
          left: -11px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 9px solid #EAC78B;
          z-index: 10;
        }

        .imgs {
          width: 180px;
          height: 88px;
          border-radius: 4px;
        }

        &:hover {
          border: 3px solid #EAC78B;
        }

        &.active {
          border: 3px solid #EAC78B;
        }
      }
    }

    .item-info {
      flex: 1;
      min-width: 0;

      .title {
        color: #fff;
        font-size: 14px;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .meta {
        .views {
          color: #9F9F9F;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .streamer {
          display: flex;
          align-items: center;
          gap: 8px;

          .mini-avatar {
            width: 20px;
            height: 20px;
            border-radius: 50%;
          }

          span {
            color: #757575;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}


.live_content {
  @apply pt-20px;

  .title_box {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    // background: #fff;
    padding: 10px;
    margin-bottom: 5px;

    .title_item {
      color: #786B62;
      padding: 5px 15px;
    }

    font-weight: 600;
  }

  .active {
    background: linear-gradient(90deg, #F0B348 0%, #FFF98B 60.43%, #FFD073 100%);
    color: #5C330A !important;
    border-radius: 50px;
    font-weight: 600;

  }
}

.live {
  background: #15161A;

  .live-mainbox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 1280px;
    margin: 0 auto;
  }

  .frist {
    width: 256px;
    height: 290px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;

    .live-tips {
      position: absolute;
      z-index: 2;
      background: rgb(0, 0, 0, 0.4);
      height: 36px;
      display: flex;
      align-items: center;
      justify-items: center;
      color: #FFEB3B;
      border-radius: 6.73px;
      font-size: 16px;
      font-weight: 500;
      padding: 8px 12px;
      top: 10px;
      left: 10px;

      .live-img {
        width: 10px;
        height: 13px;
        margin-left: 10px;
      }
    }

    .follwing-img {
      position: absolute;
      z-index: 2;
      width: 36px;
      height: 36px;
      bottom: 11px;
      right: 21px;
    }

    .img {
      width: 248px;
      height: 282px;
      border-radius: 13px;
      margin-left: 4px;
      margin-top: 4px;
    }
  }

  .infos {
    width: 349px;
    height: 290px;
    margin: 0 24px;

    .name-container {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .card-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #fff;
        font-size: 18px;
      }

      .card-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #C4AB6F;
        font-size: 12px;
        color: #9F9F9F;
        padding: 2px 15px;
        border-radius: 40px;
        margin-left: 13px;
      }
    }

    .card-description {
      margin-top: 10px;
      width: 349px;
      color: #9F9F9F;
      font-size: 28rpx;
      height: 102px;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 349px;
      margin: 18px 0;

      .info-item {
        width: 168px;
        border-radius: 106px;
        text-align: center;
        background: #303030;
        color: #fff;
        font-size: 16px;
        height: 60px;

        .top-text {
          display: block;
          margin: 5px 0;
          font-size: 12px;
          color: #757575;
        }
      }
    }

    .btn {
      width: 100% !important;
      height: 53px !important;
      font-size: 26px !important;
      color: #A18F62;
      background: #71643E;
      border-radius: 193px;
      font-weight: 500;
    }
  }
}

// .article {
//     .article_item {
//         @apply flex items-center p-10px rounded-10px w-630px h-190px mb-20px cursor-pointer border-solid border-1px border-black;
//         transition: all 0.3s;
//     }

//     .article_item:hover {
//         @apply border-solid border-1px border-hex-E4CAAB;
//     }
// }
.download-app {
  background: url(../../static/image/live/bg2.png);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 660px;
  display: flex;
  align-items: center;
  justify-content: center;

  .right {
    width: 1280px;
    display: flex;
    align-items: center;
    justify-content: right;
    background: none;

    .main {
      width: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      color: #fff;

      .download_btn {
        background: #C9A65F;
        color: #fff;
        margin-top: 30px;
      }
    }
  }
}
</style>