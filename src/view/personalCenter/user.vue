<template>
  <module-self>
    <div class="m_personal_center">
      <div class="personal_menu">
        <div class="menu_header">
          <div class="header_user">
            <v-avatar size="80">
              <v-img :src="userInfo.img_url || 'https://cdn.vuetifyjs.com/images/john.jpg'" />
            </v-avatar>
            <span class="user_name">{{ userInfo.user_name }}</span>
          </div>

          <div class="header_user_count">
            <div class="count_item" @click="go('attention')">
              <span class="count_num">{{ info.focus_count }}</span>
              <span class="count_txt">{{ $t(`Module['关注']`) }}</span>
            </div>
            <div class="count_item" @click="go('store')">
              <span class="count_num">{{ info.store_count }}</span>
              <span class="count_txt">{{ $t(`Module['收藏']`) }}</span>
            </div>
            <div class="count_item" @click="go('message')">
              <span class="count_num">{{ info.notice_count }}</span>
              <span class="count_txt">{{ $t(`Module['消息']`) }}</span>
            </div>
          </div>
          <div class="moneybox" :style="{ backgroundImage: `url(${Img.DBg})` }">
            <div class="diamondbox">
              <!-- <div class="diamond-text">{{ $t(`Module['钻石']`) }}</div>  -->
              <v-img class="diamond-img" :src="Img.Diamond"></v-img>
              <div class="balance">{{ userInfo.balance }}</div>
            </div>
            <div class="rechargebox" @click="goLive">
              <span>{{ $t(`Module['看直播得钻石']`) }}</span>
            </div>
          </div>
          <div class="task-box">
            <div class="task-item">
              <div class="left">
                <div class="title">{{ $t(`Module['每日一签']`) }}</div>
                <div class="desc">{{ $t(`Module['送钻石奖励']`) }}</div>
                <div class="bt" @click="signUp">{{ isSignUp ? $t(`Module['已签到']`) : $t(`Module['去签到']`) }}</div>
              </div>
              <div class="task-item-right">
                <img class="icon" :src="Img.Calendar" />
              </div>
            </div>
            <div class="task-item" style="background: linear-gradient(128deg, #E18B38 0%, #EFE7AF 100%);">
              <div class="left">
                <div class="title">{{ $t(`Module['邀请好友']`) }}</div>
                <div class="desc">{{ $t(`Module['赢钻石大奖']`) }}</div>
                <div class="bt" @click="doShowShare">{{ $t(`Module['去邀请']`) }}</div>
              </div>
              <div class="task-item-right">
                <img class="icon" :src="Img.Letter" />
              </div>
            </div>
          </div>
        </div>
        <ul class="user_nav_list">
          <li v-for="(item, index) in userNavList" :key="index" class="user_nav_item"
            :class="{ user_nav_item_active: navIndex === index }" @click="handleUserNavClick(item, index)">
            <span>
              <v-img :src="navIndex === index ? item.activeIcon : item.icon" width="20" height="20"></v-img>
            </span>
            <span class="item_title">{{ item.title }}</span>
          </li>
        </ul>
      </div>
      <div class="personal_content">
        <components :is="activeName"></components>
      </div>
    </div>
    <!--签到成功弹窗-->
    <v-dialog v-model="showSign" max-width="280" class="no_scrollbar">
      <div class="signBg" :style="{ backgroundImage: `url('${Img.Sign}')` }">
        <div class="signtitle">{{ $t(`Module['签到成功']`) }}</div>
        <div class="signdiamond">
          <span class="num">+1</span>
          {{ $t(`Module['钻石']`) }}
        </div>
      </div>
    </v-dialog>
    <!--邀请弹窗-->
    <v-dialog v-model="showInvite" max-width="335" class="no_scrollbar">
      <div class="inviteBg" ref="captureArea" :style="{ backgroundImage: `url('${Img.Invite}')` }">
        <div class="invitetitle">
          {{ $t(`Module['邀请好友']`) }}<br>
          {{ $t(`Module['赢钻石大奖']`) }}
        </div>
        <div class="codeBox">
          <div class="codeBoxTop">
            <span class="codeTitle">{{ $t(`Module['我的邀请码']`) }}</span>
            <span class="codeCode">{{ inviteCode }}</span>
          </div>
          <div class="codeBoxBottom">
            <div class="ewm">
              <vue-qrcode :value="qrcodeUrl" :options="{
                width: 100, color: {
                  dark: '#F9F0BA',   // 前景色
                  light: '#000'   // 背景色
                }
              }"></vue-qrcode>
            </div>
            <span class="tips">{{ $t(`Module['扫码下载，注册得钻石']`) }}</span>
          </div>
        </div>
      </div>
      <div class="sharetTips">
        <div class="Lineleft"></div>
        <div style="margin: 0 15px;">{{ $t(`Module['分享至']`) }}</div>
        <div class="Lineright"></div>
      </div>
      <div class="share_icon">
        <!-- <div > -->
        <ShareNetwork v-for="(item, key) in shareList" :key="key" :network="item.network"
          :style="{ backgroundColor: 'transparent' }" :url="shareInfo.url" :title="shareInfo.title"
          :description="shareInfo.description" :quote="shareInfo.quote" :hashtags="shareInfo.hashtags"
          :twitterUser="shareInfo.twitterUser">
          <div class="share_icon_item">
            <v-img width="48" height="48" :src="item.img"></v-img>
            <div class="network">{{ item.network }}</div>
          </div>

        </ShareNetwork>
        <div class="share_icon_item" @click="downloadImage">
          <v-img width="48" height="48" :src="Img.SaveIcon"></v-img>
          <div class="network">{{ $t(`Module['保存']`) }}</div>
        </div>
      </div>
    </v-dialog>
  </module-self>
</template>

<script>
import personalData from './personalData'
import attention from './attention'
import fans from './fans'
import store from './store'
import personage from './personage'
import RewardDetail from './rewardDetail'
import PayDetail from './payDetail'
import Reward from './reward'
import goLive from './goLive'
import AnchorAuth from './AnchorAuth'
import message from './message'
import Pay from './pay'
import LiveRecord from './liveRecord'

import { getAnchorDetail } from '@/api/anchor'
import { getCount } from '@/api/follow'
import { isSignUpApi, signUpApi } from "@/api/user";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import html2canvas from 'html2canvas'; //保存图片
export default {
  components: {
    personalData,
    attention,
    fans,
    store,
    personage,
    RewardDetail,
    goLive,
    AnchorAuth,
    message,
    Pay,
    PayDetail,
    Reward,
    LiveRecord,
    VueQrcode
  },

  data() {
    return {
      qrcodeUrl: 'https://example.com',
      Img: {
        DollarMall: require(`@/${this.$img.Page.User.Dollar}`),
        Follow: require(`@/${this.$img.Page.User.Follow}`),
        Bg: require(`@/${this.$img.Page.User.Bg}`),
        DBg: require(`@/${this.$img.Page.User.DBg}`),
        Calendar: require(`@/${this.$img.Page.User.Calendar}`),
        Letter: require(`@/${this.$img.Page.User.Letter}`),
        Sign: require(`@/${this.$img.Page.User.Sign}`),
        Invite: require(`@/${this.$img.Page.User.Invite}`),
        SaveIcon: require(`@/${this.$img.Page.User.SaveIcon}`),
        Diamond: require(`@/${this.$img.Page.User.Diamond}`)
      },
      navIndex: 0,
      info: {},
      isSignUp: false, // 是否签到
      showSign: false, // 签到成功弹窗
      showInvite: false, // 邀请弹窗
      // follow_num: 0,
      activeName: 'personalData',
      inviteCode: 'BCPK90',
      shareInfo: {
        url: window.location.href,
        title: '',
        description: '',
        quote: '',
        hashtags: '',
      },
      shareList: [
        {
          network: 'facebook',
          img: require(`@/${this.$img.Page.Room.Facebook}`),
        },
        {
          network: 'line',
          img: require(`@/${this.$img.Page.Room.Line}`),
        },
        {
          network: 'whatsapp',
          img: require(`@/${this.$img.Page.Room.WhactApp}`),
        },
        // {
        //   network: this.$t(`Module['保存']`),
        //   img: require(`@/${this.$img.Page.User.SaveIcon}`),
        // }
      ]
    }
  },

  mounted() {
    this.$nextTick(() => {

      this.setActiveName()
      this.checkSignUp()
      this.getCounts()
    })
  },

  watch: {
    '$route.params': {
      handler() {
        this.setActiveName()
      }
    },
    'userNavList.length': {
      handler() {
        this.setActiveName()
      }
    }
  },

  computed: {
    userInfo() {
      let info = JSON.parse(this.$store.state.user.userInfo).user
      return {
        ...info
      }
    },

    AnchorAuthStatus() {
      return this.$store.state.app.globalAnchorDetail.status
    },

    userNavList() {
      const {
        PersonalData,
        ActivePersonalData,
        Personage,
        ActivePersonage,
        Message,
        ActiveMessage,
        AnchorAuth,
        ActiveAnchorAuth,
        Attention,
        ActiveAttention,
        Pay,
        ActivePay,
        PayDetail,
        ActivePayDetail,
        Reward,
        ActiveReward,
        RewardDetail,
        ActiveRewardDetail,
        LiveRecord,
        ActiveLiveRecord,
        GoLive,
        ActiveGoLive
      } = this.$img.Page.User

      let list = [
        {
          name: 'personalData',
          icon: require(`@/${PersonalData}`),
          activeIcon: require(`@/${ActivePersonalData}`),
          title: this.$t(`Module['个人资料']`)
        },
        // {
        //   name: 'attention',
        //   icon: require(`@/${Attention}`),
        //   activeIcon: require(`@/${ActiveAttention}`),
        //   title: this.$t(`Page['我的关注']`)
        // },
        // {
        //   name: 'fans',
        //   icon: require(`@/${Attention}`),
        //   activeIcon: require(`@/${ActiveAttention}`),
        //   title: this.$t(`Module['我的粉丝']`)
        // },
        // {
        //   name: 'personage',
        //   icon: require(`@/${Personage}`),
        //   activeIcon: require(`@/${ActivePersonage}`),
        //   title: this.$t(`Page['我的预约']`)
        // },
        // {
        //   name: 'Pay',
        //   icon: require(`@/${Pay}`),
        //   activeIcon: require(`@/${ActivePay}`),
        //   title: this.$t(`Page['充值']`)
        // },
        // {
        //   name: 'PayDetail',
        //   icon: require(`@/${PayDetail}`),
        //   activeIcon: require(`@/${ActivePayDetail}`),
        //   title: this.$t(`Module['充值记录']`)
        // },
        {
          name: 'Reward',
          icon: require(`@/${Reward}`),
          activeIcon: require(`@/${ActiveReward}`),
          title: this.$t(`Module['打赏记录']`)
        },
        {
          name: 'RewardDetail',
          icon: require(`@/${RewardDetail}`),
          activeIcon: require(`@/${ActiveRewardDetail}`),
          title: this.$t(`Module['打赏明细']`)
        },
        // {
        //   name: 'message',
        //   icon: require(`@/${Message}`),
        //   activeIcon: require(`@/${ActiveMessage}`),
        //   title: this.$t(`Page['消息中心']`)
        // },
        {
          name: 'LiveRecord',
          icon: require(`@/${LiveRecord}`),
          activeIcon: require(`@/${ActiveLiveRecord}`),
          title: this.$t(`Module['直播记录']`)
        }
      ]
      if (this.AnchorAuthStatus == 2) {
        list.splice(7, 0, {
          name: 'goLive',
          icon: require(`@/${GoLive}`),
          activeIcon: require(`@/${ActiveGoLive}`),
          title: this.$t(`Module['去直播']`)
        })
      } else if (this.AnchorAuthStatus == 1 || this.AnchorAuthStatus == 0) {
        list.splice(7, 0, {
          name: 'AnchorAuth',
          icon: require(`@/${AnchorAuth}`),
          activeIcon: require(`@/${ActiveAnchorAuth}`),
          title: this.$t(`Module['主播认证']`)
        })
      }

      return list
    }
  },
  methods: {
    // 查询关注数量
    async getCounts() {
      const { Code, Data } = await getCount()
      if (Code) {
        // console.log('shuliang', Data)
        this.info = Data
      }
    },
    // 去看直播
    goLive() {

    },
    // 检查是否签到
    checkSignUp() {
      isSignUpApi().then((res) => {
        this.isSignUp = res.Data
      })
    },
    // 签到
    signUp() {
      if (!this.isSignUp) {
        signUpApi().then((res) => {
          if (res.Code === 200 && res.Data) {
            this.isSignUp = true
          }
        })
      }
    },
    // 邀请
    doShowShare() {
      this.showInvite = true
    },
    go(name) {
      this.$router.push({
        name: 'personalCenter',
        params: { source: name }
      })
    },
    setActiveName() {
      const { params } = this.$route
      if (params.source) {
        this.navIndex = this.userNavList.findIndex(
          r => r.name === params.source
        )
        this.activeName = params.source
      }
    },
    handleUserNavClick(item, index) {
      if (this.activeName !== item.name) {
        this.navIndex = index
        this.activeName = item.name
        this.$router.push({
          name: 'personalCenter',
          params: { source: item.name }
        })
      }
    },
    async getAnchorDetail() {
      const { Code, Data } = await getAnchorDetail()
      if (Code === 200) {
        const { data } = Data
        if (data.user_id > 0) {
          this.anchor = data
        }
      }
    },
    // 保存图片
    async downloadImage() {
      const el = this.$refs.captureArea;
      if (!el) return;

      try {
        const canvas = await html2canvas(el, {
          useCORS: true, // 如果有跨域图片
          backgroundColor: null, // 保持透明背景
        });
        const link = document.createElement('a');
        link.download = `screenshot_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('截图失败:', error);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.signBg {
  width: 280px;
  height: 320px;
  background-size: cover;
  text-align: center;

  .signtitle {
    font-size: 28px;
    font-weight: 500px;
    color: #fff;
    padding-top: 190px;
  }

  .signdiamond {
    color: #FFEB3B;

    .num {
      font-size: 36px;
      font-weight: 500;
      margin-right: 5px;
    }
  }


  // .font-num
}

.inviteBg {
  width: 335px;
  height: 524px;
  background-size: cover;
  text-align: center;
  color: #fff;

  .invitetitle {
    width: 260px;
    height: 100px;
    margin: 0 auto;
    font-size: 34px;
    color: #ffd026;

    text-shadow: 0px 2.4px 2.4px rgba(0, 0, 0, 0.1);
    font-weight: bold;
    line-height: 43px;
    padding-top: 15px;
  }

  .codeBox {
    width: 217px;
    margin: 0 auto;
    margin-top: 100px;

    .codeBoxTop,
    .codeBoxBottom {
      width: 217px;
      background: rgba(51, 51, 51, .7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 6px;
    }

    .codeBoxTop {
      height: 100px;
      clip-path: path('M0 0 H217 V80 A20 20 0 0 0 197 100 H20 A20 20 0 0 0 0 80 Z');
      border-bottom: 3px dashed #1A1A1A;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;

      .codeTitle {
        font-size: 18px;
      }

      .codeCode {
        margin-top: 5px;
        font-size: 24px;
        color: #FFD026;
      }
    }

    .codeBoxBottom {
      height: 200px;
      clip-path: path('M20 0 A20 20 0 0 1 0 20 V200 H217 V20 A20 20 0 0 1 197 0 Z');
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;

      .ewm {
        width: 100px;
        height: 100px;
        background: #000;
        margin-bottom: 20px;
      }


    }
  }
}

.sharetTips {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  margin: 25px 0;

  .Lineleft,
  .Lineright {
    flex: 1;
    height: 1px;
  }

  .Lineleft {

    background: linear-gradient(244deg, #fff 50%, rgba(255, 255, 255, 0) 100%);
  }

  .Lineright {

    background: linear-gradient(244deg, rgba(255, 255, 255, 0) 0%, #fff 50%);
  }
}

.share_icon {
  @apply flex items-center mb-20px;
  justify-content: space-between;

  .share_icon_item {
    @apply flex flex-col items-center justify-center;
    cursor: pointer;

    .network {
      color: #fff;
      margin-top: 5px;
    }
  }
}

.m_personal_center {
  @apply pt-20px pb-40px flex;

  .personal_menu {
    @apply w-368px h-940px bg-hex-191B1F rounded-10px mr-20px;

    .menu_header {
      @apply w-full py-20px mb-20px;

      .header_user {
        @apply flex flex-col items-center justify-center;

        .user_name {
          @apply text-16px font-bold text-white mt-10px;
        }

        .user_id {
          @apply font-sans text-14px font-bold text-secondary;
        }
      }

      .header_user_count {
        @apply flex items-center justify-center;

        .count_item {
          @apply w-1/2 flex flex-col items-center justify-center;
          cursor: pointer;

          .count_txt {
            @apply my-2px font-normal text-14px text-hex-79715E;

          }

          .count_num {
            margin-top: 25px;
            text-align: center;
            font-size: 20px;
            background: linear-gradient(90deg, #DEC097 0%, #E5C189 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 500;
          }
        }
      }

      .moneybox {
        width: 336px;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        background-size: cover;
        height: 70px;
        line-height: 70px;
        color: #fff;
        display: flex;
        align-content: center;
        justify-content: space-between;
        padding: 0 16px;
        margin: 0 16px;
        margin-top: 20px;

        .diamondbox {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 70px;
          line-height: 70px;

          .diamond-img {
            width: 29px;
            height: 29px;
            margin-right: 5px;
            // margin: 0 12px;
          }

          .diamond-text {
            font-size: 14px;
            color: #FFE5A3;

          }

          .balance {
            font-size: 30px;
            font-weight: 600;
            line-height: 48px;
          }
        }

        .rechargebox {
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 14px 0px 14px 10px;
          line-height: 18px;
          border-radius: 133px;
          padding: 0 10px;
          background: linear-gradient(90deg, rgba(240, 179, 72, 1) 0%, rgba(255, 249, 139, 1) 60.43%, rgba(255, 208, 115, 1) 100%);
          color: #6b4724;
        }
      }
    }

    .task-box {
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      margin-top: 30px;
      gap: 15px;

      .task-item {
        display: flex;
        border-radius: 12px;
        width: 336px;
        justify-content: space-between;
        padding: 10px;
        box-sizing: border-box;
        min-height: 105px;
        align-items: center;
        background: linear-gradient(128deg, #DE5A6E 0%, #E4ACB9 100%);

        .left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .title {
            font-size: 20px;
            font-weight: 500;
            color: #FFFFFF;
            // margin-bottom: 8px;
          }

          .desc {
            font-size: 12px;
            color: #FFFFFF;
            // margin-bottom: 16px;
          }

          .bt {
            margin-top: 14px;
            border-radius: 104px;
            background: linear-gradient(90deg, #F5CD9F 0%, #F7DBBF 100%);
            font-size: 14px;
            color: #5C330A;
            text-align: center;
            padding: 4px 15px;
            cursor: pointer;
            transition: background 0.2s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            user-select: none;
          }

          .bt:hover {
            background: linear-gradient(90deg, #F7DBBF 0%, #F5CD9F 100%);
          }
        }

        .task-item-right {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;

          .icon {
            width: 56px;
            height: 60px;
            object-fit: contain;
          }
        }
      }
    }

    .user_nav_list {
      @apply pl-0px flex flex-col;

      .user_nav_item {
        @apply flex items-center pl-40px h-49px relative cursor-pointer;

        .item_title {
          @apply text-16px font-normal text-white ml-10px;
        }
      }

      .user_nav_item_active {
        background: linear-gradient(90deg, #191B1F 0%, #D7B47E 100%);

        .item_title {
          @apply text-lightFirst;
        }
      }

      .user_nav_item_active::before {
        content: '';
        @apply w-4px h-49px bg-hex-E2BD50 absolute left-0px;
      }
    }
  }

  .personal_content {
    @apply w-980px min-h-940px bg-hex-191B1F rounded-10px py-20px px-30px;
  }
}
</style>