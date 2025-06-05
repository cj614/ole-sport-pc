<template>
  <module-self>

    <div class="m_live_room_warp" :key="key">
      <div class="living_box">
        <div class="left_live_room">
          <div class="live_room_header">
            <div class="room_txt">
              <div class="live_title">
                <span class="match_name">{{ detailData.title || $t(`Module['OLE 官方']`) }}</span>
              </div>
              <div class="live_icon">
                <div class="hot_btn">
                  <v-img :src="Img.Videoicon" width="16" height="14"></v-img>
                  <span style=" margin-left: 10px;">{{ detailData.view_num }}</span>
                  <span style="margin:0 10px;">{{ detailData.created_at }}</span>
                  <v-img :src="Img.Watchicon" width="16" height="14"></v-img>
                  <span style="margin-left: 6px;">{{ detailData.viewer_num }}</span>
                </div>
              </div>
            </div>
            <page-share type="video" :shareInfo="shareInfo"></page-share>
          </div>
          <div class="living_video" :style="{ backgroundImage: `url('${Img.LiveBackground}')` }">
            <div class="video_box" v-if="videoInfo.video">
              <div class="danmku_box">
                <module-danmaku ref="danmakuRef" :danmakuList="messageList"></module-danmaku>
              </div>
              <MyDplayer :key="videoKey" :movie="videoInfo" v-if="videoInfo.video"></MyDplayer>
            </div>

            <div class="wait" v-else>
              <div class="text">{{ $t(`Module['等待开播']`) }}</div>
            </div>

          </div>

        </div>
        <div class="right_live_room">
          <div class="profile-card">
            <v-avatar width="50" height="50" min-width="50">
              <v-img :src="anchorData.img_url || Img.LiveLogo"></v-img>
            </v-avatar>
            <div class="infobox">
              <div class="top-row">
                <span class="nickname">{{ anchorData.user_name }}</span>
                <!-- <span class="tag">形容词</span> -->
              </div>
              <div class="stats">
                <span>{{ anchorData.follow_num }}{{ $t(`Module['粉丝']`) }}</span>
                <span>{{ anchorData.count_video }}{{ $t(`Module['视频']`) }}</span>
              </div>
              <button :class="isFocusStatus ? 'nofollow-btn ' : 'follow-btn'" @click="focusAnchor">
                <span>{{
                  isFocusStatus ? $t(`Module['取消关注']`) : '+ ' + $t(`Module['关注']`)
                }}</span>

              </button>
            </div>

          </div>
          <h1 style="color: #A6A6A6; font-size: 20px; margin: 12px 0;">{{ $t(`Module['直播回放']`) }}</h1>
          <div class="video_box">
            <page-competitionCard :List="playBackList" @handleClickItem="handleClickItem"></page-competitionCard>
          </div>
        </div>

      </div>

      <div class="room_footer">
        <template>
          <chat-roomChat v-if="anchorData.id && isFirst !== null" :isFirst="isFirst" :anchorid="anchorData.id"
            @showedShield="showedShield" @setChatList="list => (messageList = list)"></chat-roomChat>
        </template>

      </div>
    </div>
  </module-self>
</template>

<script>
import {
  playback
} from '@/api/live'
import { getRoomDetailV2 } from '@/api/room'
import { followStatusV2, liveFollowV2 } from '@/api/follow'
import MyDplayer from "_c/module/myDplayer.vue";

export default {
  components: { MyDplayer },
  data() {
    return {
      videoKey: 0,
      countdownTimer: null,
      waitTime: {},
      isFirst: true,
      isFocusStatus: null,
      videoInfo: {
        img: '',
        video: '',
        videType: '',
      },
      Img: {
        Fllowing: require(`@/${this.$img.Page.Home.Fllowing}`),
        NotFllowing: require(`@/${this.$img.Page.Home.NotFllowing}`),
        LiveLogo: require(`@/${this.$img.Page.Live.LiveLogo}`),
        Fire: require(`@/${this.$img.Page.Live.Fire}`),
        Videoicon: require(`@/${this.$img.Page.Live.Videoicon}`),
        Watchicon: require(`@/${this.$img.Page.Live.Watchicon}`),
        LiveBackground: require(`@/${this.$img.Page.Live.LiveBackground}`),
      },
      params: {
        roomID: '',
        id: '',
        limit: 100,
        from_time: 0
      },
      shareInfo: {
        url: '',
        title: '',
        description: '',
        quote: '',
        hashtags: '',
        twitterUser: ''
      },
      activeIndex: -1,
      anchorData: {},
      detailData: {},
      matchLiveList: [],
      playBackList: [], //回放列表
      messageList: [],
      loading: false,
      showTabsList: [],
      headerBanner: false,
      key: +new Date()
    }
  },

  watch: {
    '$route.params': {
      handler() {
        this.params.roomID = this.id
        this.key = this.id
        this.getRoomDetail()
        this.getMatchLiveListPage()
      }
    }
  },

  computed: {
    id() {
      return this.$route.params.id
    },
    all_match_id() {
      return this.$route.params.all_match_id
    },
    type() {
      return this.$route.params.type
    },
    videoData() {
      return this.$route.params.videoData
    },
    info() {
      return this.$route.params.info
    },
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    userId() {
      let { id } = this.userInfo
      return id
    },

    user_id() {
      return this.anchorData.user_id
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    },

    topic() {
      if (this.type === 1) {
        return "officail_live_"
      }
      return "anchor_live_"
    },
  },

  mounted() {
    this.params.roomID = this.id
    this.getRoomDetail()
  },

  destroyed() {
    let { id } = this.params
    this.$store.dispatch('mqtt/MQTT_UNSUBSCRIBE', `ole/live_match_${id}`)
    this.$bus.$off(`ole/live_match_${id}`)
  },

  methods: {
    showedShield() {
      this.isFirst = false;
    },

    setDanmus() {
      this.$refs.danmakuRef.setDanmus()
    },

    insert(text) {
      this.$refs.danmakuRef.insert(text)
    },

    handleClickItem(item) {
      this.videoKey += 1
      this.videoInfo = {
        img: item.bg_img,
        video: item.playback,
        videType: '',
      }
      this.detailData.title = item.title
    },

    focusAnchor() {
      liveFollowV2(this.anchorData.id, this.isFocusStatus ? 0 : 1).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          this.isFocusStatus = Data.status === 1 ? true : false
        }
      }).catch(() => {
      })
    },
    isFollow() {
      followStatusV2(this.anchorData.id).then(res => {
        console.log(this.anchorData.id)
        let { Code, Data } = res
        if (Code === 200) {
          this.isFocusStatus = Data
        }
      })
    },


    async getRoomDetail() {
      if (this.videoData) {
        this.videoInfo.video = this.videoData.video
        this.videoInfo.img = this.videoData.img
        this.videoInfo.title = this.videoData.title
        return
      }
      if (this.info) {
        // 未开播
        this.detailData = JSON.parse(this.info)
        this.anchorData = this.detailData.anchor
      } else {
        // 已经开播 拉取直播数据
        let body = {
          all_match_id: this.all_match_id * 1
        }

        if (this.type === 1) {
          // 官方直播
          body.live_play_id = this.id * 1
        } else {
          body.live_room_id = this.id * 1
        }

        const { Data, Code } = await getRoomDetailV2(body)
        if (Code === 200) {
          this.anchorData = Data.anchor
          this.anchorData.hot = Data.view_num
          this.shareInfo.url = window.location.href
          this.shareInfo.title = `${this.anchorData.title} ${Data.Home} VS ${Data.Away}`
          this.shareInfo.description = `${this.anchorData.user_name}`
          this.shareInfo.quote = `${this.anchorData.user_name}`
          this.shareInfo.hashtags = `${this.anchorData.user_name}`
          this.params.id = Data.glive_id
          this.detailData = Data
          this.videoInfo.img = Data.background_img_url
          if (Data.glive_player) {
            this.videoInfo.video = Data.glive_player
          } else if (Data.live_room_player && Data.live_room_player.play_url_m3u8) {
            this.videoInfo.video = Data.live_room_player.play_url_m3u8
            this.videoInfo.videType = 'customHls'
          } else {
            this.videoInfo.video = Data.playback_url
          }
        }
      }

      this.getPlayback()
      this.isFollow()

    },

    async getPlayback() {
      const { Data } = await playback({ anchor_user_id: this.anchorData.id })
      // console.log('精彩回放', Data)
      this.playBackList = Data.Data
    },

    // async getLiveDetail() {
    //   const { id } = this.params
    //   const { Data, Code } = await getLiveDetail({ glive_match_id: id })
    //   if (Code === 200) {
    //     this.detailData = Data
    //     const { Type } = Data
    //     if (Type === 'BASKETBALL' || Type === 'FOOTBALL') {
    //       this.activeIndex = 0
    //     } else {
    //       this.activeIndex = 5
    //     }
    //     if (Type === 'BASKETBALL' || Type === 'FOOTBALL') {
    //       getMarket({
    //         glive_match_id: id
    //       }).then(res => {
    //         let { Code, Data } = res
    //         if (Code === 200) {
    //           if (Data) {
    //             let { market_data } = Data
    //             if (market_data && Object.keys(market_data).length) {
    //               this.showTabsList.push('odds')
    //             }
    //           }
    //         }
    //       })
    //     }

    //     if (Type === 'FOOTBALL') {
    //       getFootballPoint({
    //         glive_match_id: id
    //       }).then(res => {
    //         let { Code, Data } = res
    //         if (Code === 200) {
    //           if (Data && Object.keys(Data).length) {
    //             this.showTabsList.push('scoreboard')
    //           }
    //         }
    //       })
    //     }
    //   }
    // }
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
  // background: red;

  .living_box {
    @apply flex mb-40px;

    .left_live_room {
      @apply width-940px mr-16px;
      background: #202124;
      border-radius: 16px;

      .live_room_header {
        @apply px-20px h-70px flex items-center;
        margin: 10px 0;

        .room_img {
          @apply mr-20px;
        }

        .room_txt {
          @apply flex-1 flex flex-col justify-center;

          .live_title {
            @apply flex items-center;

            .match_name {
              @apply font-bold text-20px text-hex-fff mr-15px mb-5px;
            }

            .now_name {
              @apply font-bold text-16px;
            }
          }

          .live_icon {
            @apply flex items-center mt-6px;

            .user_name {
              @apply text-12px pr-50px;
            }

            .hot_btn {
              @apply flex items-center pr-50px text-hex-999;


            }

            .share_btn {
              @apply flex items-center;

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
        position: relative;
        background-size: cover;
        @apply h-528px w-940px;

        .video_box {
          width: 100%;
          height: 100%;
        }
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

    .right_live_room {
      @apply w-full;

      .profile-card {
        display: flex;
        background: #202124;
        padding: 16px;
        border-radius: 12px;
        color: #fff;
        position: relative;
        box-sizing: border-box;
      }

      .video_box {
        height: 440px;
        overflow-y: auto;
        scrollbar-width: none;
        /* Firefox */
        -ms-overflow-style: none;
      }

      .infobox {
        flex: 1;
        margin-left: 16px;
      }

      .top-row {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
      }

      .nickname {
        font-size: 22px;
        max-width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #E5E5E5;
      }

      .tag {
        display: inline-block;
        margin-left: 10px;
        width: 70px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-radius: 16px;
        background: #333;
        color: #ccc;
        font-size: 14px;
        border: 1px solid #555;
      }

      .stats {
        font-size: 16px;
        color: #aaa;
        margin-bottom: 10px;
      }

      .stats span+span {
        margin-left: 18px;
      }

      .follow-btn {
        width: 100%;
        background: linear-gradient(90deg, #fff7b1, #f5d97c);
        color: #7a5c1b;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        padding: 5px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
      }

      .nofollow-btn {
        width: 100%;
        background: #303030;
        color: #808080;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        padding: 5px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;

      }

      .price {
        margin-left: 6px;
      }
    }
  }

  .room_footer {
    @apply h-340px;
  }
}

.danmku_box {
  top: 30px;
  width: 100%;
  @apply absolute z-50 h-200px left-0;
}

.right {
  display: flex;
  align-items: center;
  color: #999;
  background: #171616;
  border-radius: 119px;
  padding-right: 18px;
}

.room_focuse_base {
  @apply font-bold text-14px text-hex-FFFFFF mr-15px;
  border-radius: 119px;
  padding: 5px;
  display: flex;
  align-items: center;
  background: #000;
  padding-right: 15px;

}

// .room_focuse {
// }

.room_cancel_focuse {
  background: lightgrey;
}

.wait {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .text {
    border-radius: 10px;
    background: rgba(255, 87, 51, 1);
    font-size: 30px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    padding: 10px 18px;
  }
}
</style>
