<template>
  <div class="m_room_chat_warp" id="chatRoom">
    <div class="chat_content">
      <div class="chat_box">
        <div class="chat_content_" style="flex: 2; margin-right: 12px;">
          <DynamicScroller ref="scroller" class="no_scrollbar chat_right" v-if="chatList.length" :items="chatList"
                           style="height: 100% " :min-item-size="40" v-scroll.self="onScroll" keyField="msg_id">
            <template v-slot:default="{ item, active, index }">
              <DynamicScrollerItem :item="item" :active="active" :data-index="index" :data-active="active">
                <div :key="item.msg_id" class="chat_content_item" @click="doShowOp(item)">
                  <div v-if="item.msg.type === 'text'" class="chat_info_box">
                    <v-img v-if="item.is_anchor" class='avatar' :src="item.msg.img_url"></v-img>
                    <span v-else class="user_name" @click.stop='atSign(item.msg.name)'>{{ item.msg.name }}:</span>
                    <template>
                      <span class="chat_text" :style="{color: textColor(item.role_type)}">{{ item.msg.message }}</span>
                    </template>
                  </div>
                  <div v-if="item.msg.type === 'gift'" class="chat_gift_box">
                    <v-img v-if="item.is_anchor" class='avatar' :src="item.msg.img_url"></v-img>
                    <span v-else class="user_name" @click.stop='atSign(item.msg.name)' >{{ item.msg.name }}</span>
                    <page-pageLoad :src="item.msg.message" width="40" height="32" :contain="true"></page-pageLoad>
                    <span class="num">x1</span>
                  </div>
                  <!--按钮-->
                  <div v-if="item.msg.type == 'bt'" class="chat_bt_box">
                    <v-img v-if="item.is_anchor" class='avatar' :src="item.msg.img_url"></v-img>
                    <span v-else class='user_name'>{{ item.msg.name }}:</span>
                    <div @click='openUrl(item.msg.message)' class="bt"
                         :style="{ backgroundImage: `url('${Img.BillBt}')` }">
                      {{ $t(`Module['跟单']`) }}
                    </div>
                  </div>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
          <template v-else>

            <module-skeletonCard :forIt="4" v-if="loading" width="730" height="45" skeletonClass="px-10px"
                                 type="list-item-avatar"></module-skeletonCard>
            <page-empty v-else :top="0" class="py-10px" :title="$t(`Module['暂无数据']`)"></page-empty>

          </template>
        </div>
        <div class="chat_content_ " style="flex: 1;">
          <!-- 模糊遮罩 -->
          <div v-show="showShield" class="shield" @click="showVipPop = true"></div>
          <div class="bill-anchor-height">
            <div class="bill-anchor ">
              <span><v-img :src="Img.BillAnchor" class="icon"></v-img></span>
              {{ $t(`Module['带单主播']`) }}
            </div>
          </div>
          <DynamicScroller ref="scroller1" class="no_scrollbar chat_right" v-if="billChatList.length"
                           :items="billChatList" style="padding-top: 50px; height: 100%" :min-item-size="40"
                           keyField="msg_id">
            <template v-slot:default="{ item, active, index }">

              <DynamicScrollerItem :item="item" :active="active" :data-index="index" :data-active="active">
                <div :key="item.msg_id" class="chat_content_item" @click="doShowOp(item)">

                  <div v-if="item.msg.type === 'text'" class="chat_info_box">

                    <span v-if="item.is_anchor"><v-img class='avatar' :src="item.msg.img_url"></v-img></span>
                    <span v-else class="user_name">{{ item.msg.name }}:</span>
                    <template>
                      <span class="chat_text" :style="{color: textColor(item.role_type)}" >{{ item.msg.message }}</span>
                    </template>
                  </div>
                  <div v-if="item.msg.type === 'gift'" class="chat_gift_box">
                    <v-img v-if="item.is_anchor" class='avatar' :src="item.msg.img_url"></v-img>
                    <span v-else class="user_name">{{ item.msg.name }}</span>
                    <page-pageLoad :src="item.msg.message" width="40" height="32" :contain="true"></page-pageLoad>
                    <span class="num">x1</span>
                  </div>
                  <!--按钮-->
                  <div v-if="item.msg.type == 'bt'" class="chat_bt_box">
                    <v-img v-if="item.is_anchor" class='avatar' :src="item.msg.img_url"></v-img>
                    <span v-else class='user_name'>{{ item.msg.name }}:</span>
                    <div @click='openUrl(item.msg.message)' class="bt"
                         :style="{ backgroundImage: `url('${Img.BillBt}')` }">
                      {{ $t(`Module['跟单']`) }}
                    </div>
                  </div>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
          <!-- <template v-else>
            <module-skeletonCard :forIt="4" v-if="loading" width="330" height="45" skeletonClass="px-10px"
              type="list-item-avatar"></module-skeletonCard>
          </template> -->
        </div>
      </div>

      <div class="footer_actives" id="chatInput">

        <div class="chat_input">
          <v-textarea color="white" v-model="content" background-color="#141414" outlined auto-grow clearable rows="1"
                      hide-details row-height="40" class="chat_input_item" :placeholder="$t(`Module['我也来说几句']`)"
                      maxlength="2000"
                      :autofocus="true" @keydown.enter.prevent="handleDownSend" @input="handleInput"
                      @click:clear="getUserListHeight"></v-textarea>
          <v-btn small class="mx-10px submit_bt" @click="handleSendTxt">
            {{ $t(`Module['发送']`) }}
            <!-- <span>
              <v-img :src="Img.Submit" width="40" height="40"></v-img>
            </span> -->
          </v-btn>
          <page-gift @sendGift="sendGift"></page-gift>
        </div>


      </div>
    </div>
    <module-giftSvga ref="giftSvga"></module-giftSvga>

    <!-- vip -->
    <v-dialog v-model="showVipPop" max-width="366">
      <div class="vip-pop" :style="{ backgroundImage: `url('${Img.VipCrown}')` }">
        <div class="vip-pop-header">
          <div class="vip-title">{{ $t(`Module['开通']`) }}VIP</div>
          <div class="vip-subtitle">{{ $t(`Module['进入带单室']`) }}</div>
        </div>
        <div class="vip-contact-list">
          <div v-for="(item, index) in contacts" :key="index" class="vip-contact-item">
            <span style="margin-right: 8px;">
              <v-img :src="item.contact_app_logo_url" width="24" height="24" contain/>
            </span>
            <span>{{ item.app_name }}</span>
            <span style="margin: 0 8px">:</span>
            <span>{{ item.contact_url }}</span>
          </div>
        </div>
        <div class="vip-btn">{{ $t(`Module['联系客服开通']`) }}</div>

      </div>
      <div>
        <v-btn icon @click="showVipPop = false" class="bottomClose">
          <v-img :src="Img.Close" class="close" width="32" height="32" contain/>
        </v-btn>
      </div>
    </v-dialog>

    <v-dialog v-model="showOp" max-width="500">
      <div class="action-box">
        <div class="msg">
          <span class="name">{{ msgItem.msg && msgItem.msg.name }}:</span>
          <span class="chat_text">{{ msgItem.msg && msgItem.msg.message }}</span>
        </div>
        <div class="bottom">
          <div class="action-item" @click="blockUser">拉黑</div>
          <div class="action-item" @click="deleteMessage">删除</div>
        </div>
      </div>
    </v-dialog>

  </div>
</template>

<script>
import {
  chatHistoryList,
  sendMsg,
  sendGift,
  operateChat
} from '@/api/chat'
import {
  getAppContact,
  vipStatus
} from '@/api/app'
import config from "@/config/config";


import {DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
  components: {DynamicScroller, DynamicScrollerItem},
  props: {

    anchorid: {
      type: [String, Number],
      default: ''
    },
    isFirst: {
      type: Boolean,
      default: true
    },


    type: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      msgItem: {},
      showVipPop: false,
      contacts: [], // 联系人数据
      showShield: false, // 遮罩是否显示
      showOp: false, // 删除拉黑操作 弹窗

      Img: {
        RoomNotice: require(`@/${this.$img.Page.Room.RoomNotice}`),
        Up: require(`@/${this.$img.Page.User.messageUp}`),
        Down: require(`@/${this.$img.Page.User.messageDown}`),
        Submit: require(`@/${this.$img.Page.Room.Submit}`),
        DanMu: require(`@/${this.$img.Page.Room.DanMu}`),
        BillAnchor: require(`@/${this.$img.Page.Live.BillAnchor}`),
        BillBt: require(`@/${this.$img.Page.Live.BillBt}`),
        VipCrown: require(`@/${this.$img.Page.Live.VipCrown}`),
        Close: require(`@/${this.$img.Page.Live.Close}`),
        DanMuActive: require(`@/${this.$img.Page.Room.DanMuActive}`),
      },
      params: {
        roomID: '',
        id: '',
        limit: 100,
        from_time: 0,
        index: 0,
        row: {},
        msg_id: ''
      },
      showMoreTool: false,
      moreMessage: false,
      messages: 0,
      moreHeight: 0,
      loading: true,
      showGiftMsgId: '',
      selectIds: [],
      activeIndex: -1,
      chatList: [],
      billChatList: [],
      content: '',
      noticeList: [],
      bulletChat: true,
      showNotice: true,
      userHeight: 452,
      scroller: null,
      scroller1: null,
      historyTimer: null,
      // isAnchor: false
    }
  },

  computed: {
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },
    user() {
      let {user} = this.userInfo
      return user || {}
    },
    isAnchor() {
      return this.user.role_type === 2
    },
    roomID() {
      return this.$route.params.id
    },
  },

  watch: {},
  mounted() {

    // this.$bus.$on('live/notice', this.getNoticeRoomList)
    // this.globalNoticeType()
    this.setTopic()
    this.chatHistoryList()
    this.historyTimer = setInterval(() => {
      this.chatHistoryList()
    }, 15000)
    this.getMsg()
    this.checkVip()
    this.getContacts()

  },

  destroyed() {
    if (this.historyTimer) {
      clearInterval(this.historyTimer)
    }
    this.$store.dispatch('mqtt/MQTT_UNSUBSCRIBE', this.liveDataTopic)
    this.$bus.$off(this.liveDataTopic)
  },
  methods: {
    textColor(role_type) {
      switch (role_type) {
        case 2:
          return  '#43CF7C'
        case 1:
          return  'red'
      }
      return '#FFFFFF'
    },
    atSign(name) {
      this.content = `@${name}: `;
    },

    blockUser() {
      let obj = {
        block_user_id: this.msgItem.user_id,
        topic: this.liveDataTopic
      }
      operateChat(obj).then((res) => {
        const {Code} = res;
        if (Code === 200) {
          this.doShowOp()
        }
      })
    },

    doShowOp(msg) {
      // 管理员角色
      if (this.user.role_type === 2) {
        this.showOp = !this.showOp
      }
      if (this.showOp) {
        this.msgItem = msg
      }
    },

    deleteMessage() {
      let obj = {
        del_msg_id: this.msgItem.msg_id,
        topic: this.liveDataTopic,
      }

      operateChat(obj).then((res) => {
        const {Code} = res;
        if (Code === 200) {
          this.doShowOp()
        }
      })
    },

    // 查询联系方式
    async getContacts() {
      const {Code, Data} = await getAppContact()
      if (Code === 200) {
        this.contacts = Data
        // this.showVipPop = true
      }
    },

    // 设置查询字段
    setTopic() {
      let topic = ''
      switch (this.type) {
        case 'bill':
          topic = config.MQTT.TOPIC.GROUP_CHAT_BILL
          break
        case 'public':
          topic = config.MQTT.TOPIC.GROUP_CHAT_PUBLIC
          break;
        default:
          topic = config.MQTT.TOPIC.GROUP_CHAT
          break;
      }
      let baseId = ''

      let live_room_id = Number(this.roomID)

      if (topic !== config.MQTT.TOPIC.GROUP_CHAT_PUBLIC) {
        baseId = live_room_id || 'anchor_' + this.anchorid
      }

      this.liveDataTopic = topic + baseId
    },

    // 检查是否开通VIP
    checkVip() {
      if (this.anchorid !== this.user.id || this.user.id === 0) {
        if (!this.isFirst) {
          this.showShield = true
        }
        if (this.user.id === 0) {
          setTimeout(() => {
            this.showShield = true
            this.$emit("showedShield")
          }, 12000)
          return
        }
        vipStatus(this.user.id).then(
            (res) => {
              const {Data} = res
              if (!Data) {
                setTimeout(() => {
                  this.showShield = true
                  this.$emit("showedShield")
                }, 12000)
              }
            }
        )
      }
    },


    handleInput() {
      this.$nextTick(() => {
        this.getUserListHeight()
      })
    },

    getUserListHeight(flag) {
      this.$nextTick(() => {
        let clientHeight = document.getElementById('chatRoom').clientHeight
        let Notice = document.getElementById('chatNotice') && document.getElementById('chatNotice').clientHeight
        let input = document.getElementById('chatInput').clientHeight
        this.userHeight = clientHeight - 20 - Notice - input
        this.$nextTick(() => {
          flag && this.setScrollTop()
        })
      })
    },

    getMsg() {
      const {user} = this
      this.$store.dispatch('mqtt/MQTT_SUBSCRIBE', this.liveDataTopic)
      this.$bus.$on(this.liveDataTopic, data => {
        let msg = JSON.parse(data.msg)

        switch (msg.type) {
          case 'del_msg':
            this.chatList = this.chatList.filter(item => item.msg_id !== msg.message);
            break
          case 'block':
            if (msg.message === user.id) {
              // 被拉黑用户
              this.$store.dispatch('user/handleLoginOut')
            }
            break
          default:
            if (data.user_id !== user.id) {
              // 自己发的不渲染，不依赖mqtt 由本地渲染
              if (data.is_anchor) {
                this.billChatList.push({
                  ...data,
                  msg: msg
                })
              } else {
                this.chatList.push({
                  ...data,
                  msg: msg
                })
              }


              if (this.moreMessage) {
                this.showMoreTool = true
                this.messages++
              }
            }

            if (!this.moreMessage || data.user_id !== user.id) {
              this.$nextTick(() => {
                if (!data.is_anchor) {
                  this.setScrollTop()
                } else {
                  this.setScrollTop1()
                }
              })
            }


            if (data.user_id !== user.id && msg.type === 'gift' && this.bulletChat) {
              this.showGiftMsgId = data.msg_id
              this.$refs.giftSvga.svgaPlay(msg)
            }
            this.$emit('setChatList', this.chatList)
            this.getUserListHeight()
            break
        }
      })
    },

    mergeChatLists(chatList, newChatList) {
      const chatMap = new Map(chatList.map(chat => [chat.msg_id, chat]));
      newChatList.forEach(newChat => {
        // 如果存在相同的 id，则更新，否则添加到 map
        chatMap.set(newChat.msg_id, newChat);
      });
      // 将更新后的 Map 转回数组
      return Array.from(chatMap.values()).sort((a, b) => a.msg_id - b.msg_id);
    },

    async chatHistoryList(noScroll) {
      let action = 'before'
      this.loading = true
      if (!this.params.from_time) {
        this.params.from_time = this.$date().valueOf()
      }
      let {from_time, limit} = this.params
      const {Code, Data} = await chatHistoryList({
        topic: this.liveDataTopic,
        from_time,
        limit,
        action
      })
      if (Code === 200) {
        const list = Data
        if (noScroll && list.length === 1) {
          return
        }

        list.map((item) => {
          return item.msg = JSON.parse(item.msg)
        })

        // 历史消息 区分主播和普通消息

        const messages = [];
        const billMessage = [];

        list.forEach(item => {
          item.is_anchor ? billMessage.push(item) : messages.push(item);
        });

        this.chatList = this.chatList.length
            ? this.mergeChatLists(this.chatList, messages)
            : messages;

        this.billChatList = this.billChatList.length
            ? this.mergeChatLists(this.billChatList, billMessage)
            : billMessage;


        this.$emit('setChatList', this.chatList)

        this.$nextTick(() => {
          this.setScrollTop()
          this.setScrollTop1()
        })

      }
      this.loading = false
    },

    onScroll(e) {
      if (e.target.scrollTop === 0) {
        this.chatHistoryList(true)
      }
      if (this.moreHeight === 0) {
        this.moreHeight = e.target.scrollHeight - e.target.scrollTop
      }

      if (e.target.scrollHeight - e.target.scrollTop === this.moreHeight) {
        this.moreMessage = false
      } else {
        this.moreMessage = true
      }
    },

    sendGift(item) {
      let {roomID} = this
      let ref_type = ''
      let ref_id = 0
      if (roomID) {
        ref_type = 'live_room'
        ref_id = roomID
      } else {
        ref_type = 'official'
        ref_id = -100
      }
      sendGift({
        topic: this.liveDataTopic,
        gift_id: item.id,
        ref_type,
        ref_id: Number(ref_id)
      }).then(res => {
        this.sendLoading = true
        let {Code, Data} = res
        let msg = JSON.parse(Data.msg)
        if (Code === 200) {
          this.chatList.push({
            ...Data,
            msg: msg
          })
        }
        this.showGiftMsgId = Data.msg_id
        this.$refs.giftSvga.svgaPlay(msg)
        this.sendLoading = false
      })
    },


    handleDownSend() {
      this.handleSendTxt()
    },

    async handleSendTxt() {

      if (!this.userInfo.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      const {content} = this
      if ((content ?? '') === '') return
      this.sendLoading = true

      let newMessage = {
        message: content,
        type: 'text',
        anchor_live: this.roomID,
        name: this.user.user_name,
      }

      // 判断是否是主播角色
      if (this.isAnchor) {
        let messageContent = content
        if (messageContent.trim() === '/bt') {
          newMessage = {
            message: config.OtherBillLink,
            type: 'bt',
            anchor_live: this.roomID,
            name: this.user.user_name,
          }
        }
        newMessage.img_url = this.user.img_url
        this.setScrollTop1()
      } else {
        this.setScrollTop()
      }

      let obj = {
        msg: JSON.stringify(newMessage),
        topic: this.liveDataTopic,
        to_user_id: 0,
        name: this.user.user_name,
        role_type: this.user.role_type,
        msg_id: Date.now(),
      }

      this.content = ''
      await this.sendMsg(obj)
    },

    async sendMsg(data) {
      const {Code, Data} = await sendMsg(data)
      if (Code === 200) {
        if (this.isAnchor) {
          this.billChatList.push({
            ...Data,
            msg: JSON.parse(Data.msg),
            is_anchor: this.isAnchor,
          })
        } else {
          this.chatList.push({
            ...data,
            msg: JSON.parse(Data.msg)
          })
        }
        this.sendLoading = false
      } else this.sendLoading = false
    },

    scrollToItem(index) {
      this.$nextTick(() => {
        this.$refs.scroller?.scrollToItem(index - 1)
      })
    },

    setScrollTop() {
      this.moreMessage = false
      this.showMoreTool = false
      this.messages = 0
      this.$nextTick(() => {
        this.$refs.scroller?.scrollToBottom()
        this.moreMessage = false
        this.showMoreTool = false
        this.messages = 0
        setTimeout(() => {
          this.$refs.scroller?.scrollToBottom()
          this.moreMessage = false
          this.showMoreTool = false
          this.messages = 0
        }, 1000)
      })
    },
    setScrollTop1() {
      this.moreMessage = false
      this.showMoreTool = false
      this.messages = 0
      this.$nextTick(() => {
        this.$refs.scroller1?.scrollToBottom()
        this.moreMessage = false
        this.showMoreTool = false
        this.messages = 0
        setTimeout(() => {
          this.$refs.scroller1?.scrollToBottom()
          this.moreMessage = false
          this.showMoreTool = false
          this.messages = 0
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss">
// vip样式
.v-dialog {
  box-shadow: none;
}

.vip-pop {
  width: 366px;
  height: 414px;
  background-size: cover;
  background-repeat: no-repeat;
}

.vip-pop-header {
  padding-top: 40px;
  padding-left: 40px;
  margin-bottom: 16px;
  color: #CC7445;

}

.vip-title {
  font-size: 36px;
}

.vip-subtitle {
  font-size: 20px;
  margin-top: 4px;
  color: #BD6D4B;
}

.vip-contact-list {
  min-height: 40px;
  padding: 22px 0;
  padding-top: 40px;
}

.vip-contact-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 40px;
  margin-left: 20px;
  padding: 8px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  color: #FFE7DE;
}


.vip-btn {
  background: linear-gradient(90deg, rgba(245, 205, 159, 1) 0%, rgba(247, 219, 190, 1) 100%);
  color: #5c330a;
  border-radius: 120px;
  text-align: center;
  padding: 10px 0;
  margin-right: 40px;
  margin-left: 20px;
  cursor: pointer;
  font-size: 20px;
}

.bottomClose {
  margin-top: 10px;
  margin-left: 160px;
}

.close {
  width: 32px;
  height: 32px;
}

.m_room_chat_warp {
  @apply w-full h-340px relative;

  .chat_content {
    @apply flex flex-col h-full overflow-hidden;
    border-radius: 16px;

    .header_notice {
      @apply p-6px flex items-center;
      background: #2BA5FF;

      .notice_icon {
      }

      .notice_carousel {
        @apply min-h-48px;

        .notice_text {
          @apply flex-1 flex-col px-10px text-12px text-lightFirst leading-18px;

          p {
            @apply mb-0px text-14px leading-20px;
          }

          a {
            @apply text-lightFirst;
          }
        }
      }

      .notice_text_up {
      }

      .icon_action {
      }
    }

    .header_notice_down {
      @apply h-48px;
    }

    // .header_notice_up {
    //   @apply min-h-138px;
    // }
    .chat_box {
      border-radius: 16px;
      @apply h-full flex py-10px overflow-hidden;
      align-content: center;
      justify-content: center;

      .chat_content_ {
        @apply flex-1 bg-hex-202124;
        border-radius: 12px;
        position: relative;

        .bill-anchor-height {
          height: 50px;
          position: absolute;
          width: 100%;
          background: #202124;
          padding: 8px 20px;
          display: flex;
          justify-content: center;
          color: #fff;
          z-index: 2;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          margin: 0;
        }


        .bill-anchor {

          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 61.5px;
          background: #7948EA;
          border: 2px solid #FFEB3B;
          font-size: 13px;

          .icon {
            width: 16.5px;
            height: 16px;
            margin-right: 5px;
          }
        }

        // 遮罩
        .shield {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(24, 24, 24, 0);
          backdrop-filter: blur(8px);
          z-index: 3;
          border-radius: 10px;
          cursor: pointer;
        }
      }

      .chat_right {
        // padding-top: 40px !important;
      }

      .chat_content_item {
        @apply flex items-center cursor-pointer;
        padding: 5px 10px;

        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 17px;
          margin-right: 8px;

        }

        .chat_info_box {
          @apply flex items-center;
          word-wrap: break-word;
          word-break: break-all;
          line-height: 21px;

          .user_name {
            @apply text-hex-FFE39C;
            display: inline;
          }

          .chat_text {
            display: inline;
            color: #fff;
            margin-left: 4px;

            * {
              margin-bottom: 0px;
            }
          }

          .anchor_text {
            background: #2B2B2B;
            padding: 8px 12px;
            border-radius: 8px;
            border-top-left-radius: 0;
            color: #43CF7C;
          }
        }

        .chat_gift_box {
          @apply flex items-center;

          .user_name {
            @apply text-hex-FFE39C;
            display: inline;
          }

          .num {
            @apply text-white ml-10px;
          }
        }

        .chat_bt_box {
          @apply flex items-center;

          .user_name {
            @apply text-hex-FFE39C;
            display: inline;
          }

          .bt {
            width: 110px;
            height: 45px;
            color: #fff;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }


      .chat_content_item_active {
        background: rgba(24, 98, 200, 0.25);
      }

      @keyframes colorChange {
        from {
          background: linear-gradient(90deg,
              rgba(249, 179, 31, 0.25) 0%,
              rgba(249, 179, 31, 0) 100%);
        }

        to {
          background-color: #ffff;
        }
      }

      .gift_active {
        animation-name: colorChange;
        animation-duration: 12s;
        animation-fill-mode: forwards;
        /* 保持最后一帧的样式 */
        animation-iteration-count: 1;
        /* 动画执行一次 */
      }
    }

    .footer_actives {
      @apply min-h-60px pt-10px relative;

      .chat_btn_box {
        @apply flex items-center justify-between;

        .chat_btn {
          @apply pl-0px flex mb-10px;

          .btn_item {
            @apply mr-10px;
          }
        }

        .chat_btn_tmp {
          @apply mb-10px h-40px;
        }

        .chat_bullet {
          @apply mb-10px mt-0px pt-0px;

          .v-input--selection-controls__input {
            height: 20px !important;
          }
        }
      }

      .chat_input {
        @apply flex items-center;

        textarea::placeholder {
          color: #fff;
          opacity: 1;
        }

        .submit_bt {
          height: 40px;
          background: #F0BA46 !important;
          color: #5C330A;
          margin-left: 0;
        }

        .chat_input_item {


          .v-text-field__details {
            display: none;

          }

          .v-text-field__slot {
          }

          .v-input__append-inner {
            margin-top: 8px !important;
          }

          .v-input__slot {
            @apply border-none min-h-40px;

            margin-bottom: 0px;

            fieldset {
              @apply border-none;
            }

            textarea {
              margin-top: 0px !important;
              padding-top: 5px;
              padding-left: 5px;
              color: #fff;

            }
          }
        }
      }

      .more_msg {
        @apply absolute right-20px;
        top: -45px;
      }
    }
  }
}

.chat_tool_tip {
  @apply bg-lightFirst rounded-10px text-dark;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.25);
  padding: 10px !important;
}

.action-box {
  border-radius: 16px;
  background: white;
  display: flex;
  align-items: center;
  min-height: 150px;
  flex-direction: column;
  justify-content: space-around;

  .msg {
    .name {
      color: red;
      font-size: 16px;
      margin-right: 10px;
    }
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;

    .action-item {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: #fff;
      background-color: #F2CC50;
      font-size: 16px;
      border-radius: 13px;
    }
  }


}
</style>