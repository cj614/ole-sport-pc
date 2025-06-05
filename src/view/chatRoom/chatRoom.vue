<template>
  <div class="m_chat_warp">
    <div class="chat_page">
      <div class="chat_content_box">
        <div class="chat_content">
          <DynamicScroller ref="scroller" class="no_scrollbar" v-if="messageList.length" :items="messageList"
            :style="{ height: userHeight + 'px' }" :min-item-size="91" keyField="msg_id">
            <template v-slot:default="{ item, active, index }">
              <DynamicScrollerItem :item="item" :active="active" :data-index="index" :data-active="active"
                :size-dependencies="[
                  item.msg_json.message, ''
                ]">
                <div class="content_item"
                  :class="[{ content_item_active: item.user_id === user.id }, replyIds.includes(item.msg_id) ? item.user_id === user.id ? 'reply_active2' : 'reply_active' : '']">
                  <div class="item_header">
                    <div class="user_info_item">
                      <v-avatar width="40" min-width="40" height="40">
                        <v-img :src="item.img_url"></v-img>
                      </v-avatar>
                      <div class="_name_date">
                        <span class="_name">{{ item.user_name }}</span>
                        <span class="_date">{{ $date(item.msg_id).format('MM-DD HH:mm') }}</span>
                      </div>
                    </div>
                  </div>
                  <template v-if="item.msg_json.type === 'text'">
                    <template>
                      <div class="text_box">{{ item.msg_json.message }}</div>
                    </template>
                  </template>

                  <div v-else-if="item.msg_json?.type === 'image'" class="image_box"
                    @click.stop="viewImg(item.msg_json.message)">
                    <page-pageLoad class="cursor-pointer" height="80" width="80"
                      :src="item.msg_json.message"></page-pageLoad>
                  </div>
                </div>
                <!-- 这里放需要渲染的代码，以前写v-for 循环item 一样的写法 -->
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
          <module-skeletonCard :forIt="6" v-else-if="messageLoading" width="1000" height="91"
            skeletonClass="px-20px pt-20px" type="list-item-avatar,text"></module-skeletonCard>
        </div>

        <div class="chat_box">
          <div class="move_news_now_box" v-show="moreMessage">
            <div class="move_news_now" @click.stop="handDownScroll">
              <span class="text">{{ $t(`Module['有更多消息']`) }}</span>
              <v-icon color="lightFirst" size="20">mdi-arrow-down</v-icon>
            </div>
          </div>
          <div class="chat_input" v-if="chooseUserAddress.user_id">
            <div class="chat_icon">
              <chat-emojiIcon @close="emojiShow = false" :isActive="emojiShow" class="flex"
                :on-emoji-picked="_handleEmojiPicked">
                <span class="mr-20px cursor-pointer" @click="emojiShow = true">
                  <v-img :src="Img.Emo" width="28" height="28"></v-img>
                </span>
              </chat-emojiIcon>

              <label for="imgFile">
                <span>
                  <v-img :src="Img.Photo" width="28" height="28"></v-img>
                </span>
              </label>

              <input type="file" name id="imgFile" v-show="0" @change="sendImg" accept="image/*" />

            </div>
            <v-textarea v-model="params.content" background-color="#F9F9F9" outlined clearable rows="1" row-height="50"
              class="chat_input_item" :placeholder="$t(`Module['请输入内容']`)" maxlength="2000"
              :autofocus="true"></v-textarea>
            <v-btn color="#fff" outlined depressed width="140px" height="50px" @click="handleSendTxt"
              :loading="sendLoading">{{
                $t(`Module['发送']`) }}
            </v-btn>
          </div>
        </div>
      </div>

      <div class="chat_users">
        <div class="user_title">
          <div class="msg">{{ $t(`Module['聊天']`) }}</div>
        </div>

        <div class="user_list" ref="userRef" v-if="chatAddressList.length">
          <v-virtual-scroll class="no_scrollbar" v-if="chatAddressList.length" :bench="benched" :items="chatAddressList"
            :height="userHeight" item-height="60">
            <template v-slot:default="{ item, index }">
              <v-list-item :key="item.id" height="40" @click="getMsgHistory(index)"
                :style="{ background: item.user_id == chooseUserAddress.user_id ? 'rgba(250, 151, 40, 0.1)' : '' }">
                <v-list-item-avatar width="40" min-width="40" height="40">
                  <v-img :src="item.img_url"></v-img>
                </v-list-item-avatar>
                <v-list-item-group style="flex:1">
                  <v-list-item-title>{{ item.user_name }}</v-list-item-title>
                  <v-list-item-title class="item-msg">
                    <el-image v-if="item.last_msg.startsWith('http')" class="icon" :src="item.last_msg"></el-image>
                    <span v-else>{{ item.last_msg }}</span>
                  </v-list-item-title>
                </v-list-item-group>
                <span class="item-count" v-if="item.no_read_num">
                  <v-avatar color="error" min-width="20" width="20" height="20">
                    <span class="white--text text-12px">{{ item.no_read_num }}</span>
                  </v-avatar>
                </span>

              </v-list-item>


            </template>
          </v-virtual-scroll>
          <module-skeletonCard :forIt="6" v-else width="260" height="56" skeletonClass="mb-4px"
            type="list-item-avatar"></module-skeletonCard>
        </div>
      </div>
    </div>

    <viewer class="images" ref="viewer" :options="Options" :images="images" @inited="inited">
      <template slot-scope="scope">
        <img v-for="src in scope.images" v-show="0" :src="src" :key="src" class="image" />
      </template>
    </viewer>

    <page-adv left="Pc-Chatroom left side banner" right="Pc-Chatroom right side banner"></page-adv>

    <module-dialog :dialog.sync="subData.dialog" :title="$t(`Module['提示']`)" :isClose="false">
      <template v-slot:content>
        <div class="login_dialog">
          <p class="close_title">{{ subData.msg }}</p>
          <div class="close_actives">
            <v-btn color="#1862C8" outlined depressed minWidth="140" height="40"
              @click="() => (subData.dialog = false)">{{ $t(`Module['取消']`) }}
            </v-btn>
            <v-btn depressed outlined width="140" class="btn_submit" height="40" :loading="subData.loading"
              @click="handleConfirm">{{ $t(`Module['确认']`) }}
            </v-btn>
          </div>
        </div>
      </template>
    </module-dialog>
  </div>
</template>

<script>
import {
  chatLogin,
  chatLoginOut,
  chatUserList,
  countUser,
  chatHistoryList,
  sendMsg,
  operateChat, addressList, singleHistory, chatSendMsg, chatRead
} from '@/api/chat'
import { postImg } from '@/api/global'

import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import 'viewerjs/dist/viewer.css'
import { component as viewer } from 'v-viewer'
import { storageRead, storageSave } from "@/libs/util";

export default {
  components: { DynamicScroller, DynamicScrollerItem, viewer },

  data() {
    return {
      chooseUserAddress: {},
      messageList: [],
      chatAddressList: [],
      emojiShow: false,
      subData: {
        loading: false,
        dialog: false,
        msg: '',
        row: {},
        item: {},
        index: -1
      },

      benched: 0,
      userHeight: 552,
      chatList: [],
      userList: [],
      moreMessage: false,
      scrollY: false,
      moreHeight: 0,
      noticeList: [],
      params: {
        limit: 20,
        from_time: 0,
        content: ''
      },
      replyInfo: null,
      sendLoading: false,
      messageLoading: true,
      Img: {
        Close: require(`@/${this.$img.Page.Chat.Close}`),
        Emo: require(`@/${this.$img.Page.Chat.Emo}`),
        Notice: require(`@/${this.$img.Page.Chat.Notice}`),
        Photo: require(`@/${this.$img.Page.Chat.Photo}`),
        Quote: require(`@/${this.$img.Page.Chat.Quote}`),
        ChatLeft: require(`@/${this.$img.Page.Chat.ChatLeft}`)
      },

      replyIds: [],
      images: [],
      $viewer: null,
      isNotice: true,
      Options: {
        inline: false,
        button: true, //右上角按钮
        navbar: true, //底部缩略图
        title: true, //当前图片标题
        toolbar: true, //底部工具栏
        tooltip: true, //显示缩放百分比
        movable: true, //是否可以移动
        zoomable: true, //是否可以缩放
        rotatable: true, //是否可旋转
        scalable: true, //是否可翻转
        transition: true, //使用 CSS3 过度
        fullscreen: true, //播放时是否全屏
        keyboard: true //是否支持键盘
      }
    }
  },

  mounted() {
    this.getChatAddress()
    setTimeout(() => {
      this.getChatAddress()
    }, 15000)

    this.subMsg()
    this.$nextTick(() => {
      this.getUserListHeight()
    })
  },

  computed: {
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    otherList() {
      return [
        {
          text: this.$t(`Module['踢出']`),
          label: this.$t(`Module['踢出']`),
          value: 1
        },
        {
          text: this.$t(`Module['禁言']`),
          label: this.$t(`Module['禁言']`),
          value: 2
        },
        {
          text: this.$t(`Module['删除']`),
          label: this.$t(`Module['删除']`),
          value: 3
        }
      ]
    },

    user() {
      let { user } = this.userInfo
      return user || {}
    }
  },

  beforeDestroy() {
  },

  methods: {
    sendMsgV2(inputValue, type = 'text') {
      this.sendLoading = true
      let newMessage = {
        message: inputValue,
        type: type,
        to_user_id: this.chooseUserAddress.user_id,
      }

      let obj = {
        msg: JSON.stringify(newMessage),
        topic: "ole/single_chat",
        to_user_id: this.chooseUserAddress.user_id,
      }

      // 接口发送消息
      chatSendMsg(obj).then(res => {
        let {
          Code,
          Data
        } = res;
        if (Code === 200) {
          this.messageList.push({
            ...Data,
            img_url: this.user.img_url,
            msg_json: newMessage,
          })
          this.chatAddressList.map(item => {
            if (item.user_id === this.chooseUserAddress.user_id) {
              item.last_msg = inputValue
              item.msg = obj
            }
          })
          const id = this.user.id
          const key = 'chatList' + id
          storageSave(key, JSON.stringify(this.chatAddressList))
          this.scrollToItem(this.messageList.length)
        }
        this.sendLoading = false
      }).catch(err => {
        this.sendLoading = false
      })
    },
    getMsgHistory(index) {
      // 将前面的消息缓存
      storageSave(`message-${this.user.id}-${this.chooseUserAddress.user_id}`, JSON.stringify(this.messageList))

      // 获取历史消息
      this.chooseUserAddress = this.chatAddressList[index]
      const history = storageRead(`message-${this.user.id}-${this.chooseUserAddress.user_id}`)
      if (history) {
        this.messageList = JSON.parse(history)
      } else {
        this.messageList = []
      }

      const from_user_id = this.chooseUserAddress.user_id
      const from_msg_id = this.chooseUserAddress.msg_id
      const from_user_img_url = this.chooseUserAddress.img_url

      singleHistory({
        from_user_id: from_user_id,
        from_msg_id: from_msg_id,
      }).then((res) => {
        //获取私聊历史消息
        let {
          Code,
          Data
        } = res;
        if (Code === 200) {
          if (Data) {
            this.messageList = this.mergeChatMsgLists(this.messageList, Data)
            // 补充头像 和 解析msg
            this.user.id
            this.messageList = this.messageList.map((item) => {
              let imgUrl = this.user.img_url
              if (item.user_id === from_user_id) {
                imgUrl = from_user_img_url
              }
              return {
                ...item,
                img_url: imgUrl,
                msg_json: JSON.parse(item.msg)
              };
            })
            this.chatAddressList[index].no_read_num = 0
            // 调用已读
            chatRead({
              from_user_id: from_user_id,
              from_msg_id: from_msg_id,
            })
          }
        }
      });
    },

    subMsg() {
      this.$store.dispatch('mqtt/MQTT_SUBSCRIBE', 'ole/single_chat')
      this.$bus.$on('ole/single_chat', data => {
        let { type } = JSON.parse(data.msg)
        switch (type) {
          case 'text':
            if (data.to_user_id === this.user.id) {
              if (data.user_id === this.chooseUserAddress.user_id) {
                // 当前聊天框
                this.messageList.push({
                  ...data,
                  img_url: this.chooseUserAddress.img_url,
                  msg_json: JSON.parse(data.msg)
                })
                if (!this.scrollY) {
                  this.setScrollTop()
                } else {
                  this.moreMessage = true
                }
              } else {
                this.chatAddressList.map((item) => {
                  if (item.user_id === data.user_id) {
                    item.last_msg = JSON.parse(data.msg).message || ''
                    item.no_read_num += 1
                  }
                })
              }
            }
            break
        }
      })
    },

    getChatAddress() {
      const id = this.user.id
      const key = 'chatList' + id
      if (storageRead(key)) {
        this.chatAddressList = JSON.parse(storageRead(key))
      }
      addressList().then((res) => {
        let {
          Code,
          Data
        } = res;
        if (Code === 200) {
          // 1.先检查本地有没有缓存的聊天列表 如果有需要进行更新和按时间排序
          if (this.chatAddressList) {
            this.chatAddressList = this.mergeChatAddressLists(this.chatAddressList, Data)
          } else {
            this.chatAddressList = Data
          }

          this.chatAddressList = this.chatAddressList.map((item) => {
            // 当前的 聊天人 为0
            if (item.user_id === this.chooseUserAddress.user_id) {
              item.no_read_num = 0
            }
            let last_msg = ''
            if (item.msg.msg) {
              last_msg = JSON.parse(item.msg.msg).message
            }
            return {
              ...item,
              last_msg: last_msg,
            };
          })
          storageSave(key, JSON.stringify(this.chatAddressList))

          // 获取第一个聊天人的历史消息
          if (!this.chooseUserAddress.user_id && this.chatAddressList.length) {
            this.getMsgHistory(0)
          }
          this.messageLoading = false
        }
      });
      return key
    },
    mergeChatMsgLists(chatList, newChatList) {
      const chatMap = new Map(chatList.map(chat => [chat.msg_id, chat]));

      newChatList.forEach(newChat => {
        // 如果存在相同的 id，则更新，否则添加到 map
        chatMap.set(newChat.msg_id, newChat);
      });
      // 将更新后的 Map 转回数组
      return Array.from(chatMap.values()).sort((a, b) => a.msg_id - b.msg_id);
    },
    mergeChatAddressLists(chatList, newChatList) {
      const chatMap = new Map(chatList.map(chat => [chat.user_id, chat]));
      newChatList.forEach(newChat => {
        // 如果存在相同的 id，则更新，否则添加到 map
        chatMap.set(newChat.user_id, newChat);
      });
      // 将更新后的 Map 转回数组
      return Array.from(chatMap.values()).sort((a, b) => b.msg_id - a.msg_id);
    }
    ,

    inited(viewer) {
      this.$viewer = viewer
    }
    ,

    showHtml(html) {
      return /<[^>]*>|<\/\w+>/gm.test(html)
    },

    async handleConfirm() {
      this.subData.loading = true
      const { row, item } = this.subData
      const { value } = row
      const { user_id, msg_id } = item
      const params = {
        topic: 'ole/chat_room'
      }
      switch (value) {
        case 1:
          params.block_user_id = user_id
          break
        case 2:
          params.shutup_user_id = user_id
          break
        case 3:
          params.del_msg_id = msg_id
          break
      }
      const { Code } = await operateChat(params)
      if (Code === 200) {
        this.$toast.success(this.$t(`Module['操作成功']`))
      }
      this.subData.loading = false
      this.subData = {
        loading: false,
        dialog: false,
        msg: '',
        row: {},
        item: {},
        index: -1
      }
    },
    async activeMenuItem(row, item, index) {
      const { value } = row
      const { user_name } = item
      this.subData.row = row
      this.subData.item = item
      this.subData.index = index
      switch (value) {
        case 1:
          this.subData.msg = `确定将 ${user_name} 拉黑吗？`
          break
        case 2:
          this.subData.msg = `确定将 ${user_name} 禁言吗？`
          break
        case 3:
          this.subData.msg = `确定将 ${user_name} 删除吗？`
          break
      }
      this.subData.dialog = true
    },

    handDownScroll() {
      this.moreMessage = false
      this.setScrollTop()
    },

    viewImg(img) {
      this.images = [img]
      this.$viewer.show()
    },

    getUserListHeight() {
      let clientHeight = document.documentElement.clientHeight
      this.userHeight = clientHeight - 60 - 70 - 40
    },

    formattedContent(content) {
      // 使用正则表达式为缺少协议的链接添加 https://
      return content.replace(/href="(?!https?:\/\/)([^"]+)"/g, (match, p1) => {
        return `href="https://${p1}"`;
      });
    },

    async handleSendTxt() {
      const {
        params: { content }
      } = this
      if (content) {
        this.sendLoading = true
        await this.sendMsgV2(content)
        this.replyInfo = null
        this.params.content = ''
      }
      this.sendLoading = false
    },

    //发送本地图片
    sendImg(e) {
      //先上传图片
      if (e.target.files && e.target.files[0]) {
        try {
          this.sendLoading = true
          let file = e.target.files[0]
          this.imgLoading = true
          let formData = new FormData()
          formData.append('file', file)
          formData.append('folder', 'chat')
          postImg(formData)
            .then(res => {
              const { Code, Data } = res
              if (Code == 200) {
                this.sendMsgV2(Data, 'image')
              }
            })
            .catch(() => {
              this.sendLoading = false
            })
        } catch (error) {
          this.sendLoading = false
        }
        //然后发送消息
        e.target.files = null
      }
    },

    handleReply(item) {
      this.replyInfo = item
    },

    async sendMsg(msg) {
      const { Code } = await sendMsg({ topic: 'ole/chat_room', msg })
      if (Code === 200) {
        this.sendLoading = false
      } else this.sendLoading = false
    },

    async chatHistoryList(noScroll) {
      let action = 'before'
      if (!this.params.from_time) {
        this.params.from_time = this.$date().valueOf()
      }
      let { from_time, limit } = this.params
      const { Code, Data } = await chatHistoryList({
        topic: `ole/chat_room`,
        from_time,
        limit,
        action
      })
      if (Code === 200) {
        const { Data: list } = Data
        if (noScroll && list.length === 1) {
          return
        }
        let chatList = list || []
        chatList = chatList
          .map(item => {
            let msg = JSON.parse(item.msg)
            return {
              ...msg,
              msg: JSON.parse(msg.msg)
            }
          })
          .filter(r => r.msg_id !== this.params.from_time)

        this.chatList.splice(0, 0, ...chatList)
        this.messageLoading = false
        if (list.length > 0) {
          this.params.from_time = list[0].msg_id
        }
        if (noScroll) {
          this.scrollToItem(list.length)
        } else {
          this.setScrollTop()
        }
      }
    },

    onScroll(e) {
      if (e.target.scrollTop === 0) {
        this.chatHistoryList(true)
      }
      if (this.moreHeight === 0) {
        this.moreHeight = e.target.scrollHeight - e.target.scrollTop
      }
      if (e.target.scrollHeight - e.target.scrollTop === this.moreHeight) {
        this.scrollY = false
      } else {
        this.scrollY = true
      }
    },

    handleViewReply(data) {
      const { msg_id } = data
      if (this.replyIds.includes(msg_id)) {
        let lx = this.replyIds.findIndex(f => f === msg_id)
        this.replyIds.splice(lx, 1)
        setTimeout(() => {
          this.replyIds.push(msg_id)
        }, 200)
      } else {
        this.replyIds.push(msg_id)
      }
      let index = this.chatList.findIndex(f => f.msg_id === msg_id)
      if (index > -1) {
        this.$refs.scroller.scrollToItem(index)
      }
    },

    scrollToItem(index) {
      this.$nextTick(() => {
        this.$refs.scroller.scrollToItem(index - 1)
      })
    },

    setScrollTop() {
      this.$nextTick(() => {
        this.$refs.scroller?.scrollToBottom()
        setTimeout(() => {
          this.$refs.scroller?.scrollToBottom()
        }, 1000)
      })
    },


    async chatUserList() {
      const { Code, Data } = await chatUserList()
      if (Code === 200) {
        const {
          Data: { list }
        } = Data
        this.userList = list
      }
    }
    ,

    async countUser() {
      const { Code, Data } = await countUser()
      if (Code === 200) {
        this.$bus.$emit('chat/room/count', Data.count)
      }
    },

    _handleEmojiPicked(emoji) {
      this.params.content += `${emoji}`
    }
  }
}
</script>

<style lang="scss" scoped>
.m_chat_warp {
  @apply h-full w-full bg-hex-f4f6ff;

  .chat_page {
    @apply w-1280px mx-auto flex relative h-full;

    .char_notice_box {
      @apply fixed top-60px w-full left-0px z-9;

      .char_wid {
        @apply w-1280px mx-auto;

        .char_notice {
          @apply flex justify-between items-center w-1000px min-h-60px rounded-bl-20px rounded-br-20px bg-lightFirst p-20px;
          box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.2);

          .notice_icon {
            @apply mr-10px;
          }

          // .info_txt {
          //   @apply flex-1 leading-20px;
          //   * {
          //     @apply m-0 p-0;
          //   }
          // }
          .notice_carousel {
            @apply min-h-20px;

            .html_content {
              @apply flex flex-col;

              p {
                @apply mb-0px text-14px leading-20px;
              }
            }
          }

          .close_icon {
            @apply ml-10px cursor-pointer;
          }
        }

        .char_notice_open {
          @apply w-1000px h-60px relative;

          .open_ {
            @apply absolute right-0 w-100px h-60px rounded-l-20px p-20px z-100 bg-lightFirst flex items-center justify-between;
            box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.2);

            .notice_open {
              @apply cursor-pointer;
            }
          }
        }
      }
    }

    .chat_content_box {
      @apply flex flex-col mr-10px w-1000px h-full overflow-hidden;

      .chat_content {
        @apply flex-1 bg-lightFirst;

        .content_item {
          @apply flex flex-col;

          .item_reply {
            @apply flex-1 flex overflow-hidden px-20px pt-20px;

            .reply_content {
              @apply flex-1 flex-col pl-20px border-l-1px border-solid border-primaryFirst overflow-hidden cursor-pointer;

              .reply_to {
                @apply text-primaryFirst;
              }

              .reply_text {
                @apply text-12px mt-6px;

                * {
                  margin-bottom: 0px;
                }
              }
            }
          }

          .item_header {
            @apply flex items-center justify-between p-20px pb-0px;

            .user_info_item {
              @apply flex items-start;

              ._name_date {
                @apply flex items-center ml-10px;

                ._name {
                  @apply text-hex-344999 font-bold text-16px;
                }

                ._date {
                  @apply text-info;
                }
              }
            }

            .actions_ {
              @apply flex items-start h-40px;

              .txt {
                @apply mx-10px text-primaryFirst;
              }
            }
          }

          .text_box {
            @apply pl-70px pr-20px leading-21px mb-20px;
            font-family: Kanit;
            font-size: 14px;
            font-weight: 400;
            margin-top: -10px;
            word-wrap: break-word;
            word-break: break-all;

            * {
              margin-bottom: 0px;
            }
          }

          .image_box {
            @apply pl-70px pr-20px mb-20px;
            margin-top: -10px;

            .v-image {
              @apply rounded-20px;
            }
          }
        }

        .content_item_active {
          background: rgba(250, 151, 40, 0.08);
        }

        @keyframes colorChange {
          from {
            background: linear-gradient(90deg,
                rgba(249, 179, 31, 0.25) 0%,
                rgba(249, 179, 31, 0) 100%);
          }

          to {
            background-color: #ffffff;
          }
        }

        .reply_active {
          animation-name: colorChange;
          animation-duration: 6s;
          animation-fill-mode: forwards;
          /* 保持最后一帧的样式 */
          animation-iteration-count: 1;
          /* 动画执行一次 */
          animation-timing-function: ease-in-out;
        }

        @keyframes colorChange2 {
          from {
            background: linear-gradient(90deg,
                rgba(249, 179, 31, 0.25) 0%,
                rgba(249, 179, 31, 0) 100%);
          }

          to {
            background-color: rgba(250, 151, 40, 0.08);
          }
        }

        .reply_active2 {
          animation-name: colorChange2;
          animation-duration: 6s;
          animation-fill-mode: forwards;
          /* 保持最后一帧的样式 */
          animation-iteration-count: 1;
          /* 动画执行一次 */
          animation-timing-function: ease-in-out;
        }
      }

      .chat_box {
        @apply bg-lightFirst w-1000px border-t-1px border-solid border-accent fixed bottom-0px;

        .move_news_now_box {
          @apply w-full flex justify-center relative;

          .move_news_now {
            @apply absolute w-134px h-40px flex items-center justify-center rounded-10px bg-primaryFirst text-lightFirst cursor-pointer;
            top: -70px;

            .text {
              @apply mr-5px;
            }
          }
        }

        .reply_box {
          @apply flex items-center justify-between pt-10px px-20px;

          .reply_icon {
            @apply h-50px w-40px flex items-center border-r-1px border-solid border-primaryFirst;
          }

          .reply_content {
            @apply flex-1 flex-col px-30px overflow-hidden;

            .reply_to {
              @apply text-primaryFirst;
            }

            .reply_text {
              @apply text-12px mt-6px;
            }
          }
        }

        .chat_input {
          @apply flex items-end justify-between px-20px py-25px;

          .chat_icon {
            @apply h-50px flex items-center relative;
          }

          .v-btn__content {
            @apply font-700;
          }

          .chat_input_item {
            @apply w-704px rounded-10px;
            flex: none;

            .v-text-field__details {
              display: none;
            }

            .v-text-field__slot {}

            .v-input__slot {
              @apply border-none min-h-50px;

              margin-bottom: 0px;

              fieldset {
                @apply border-none;
              }

              textarea {
                margin-top: 0px !important;
                padding-top: 10px;
                padding-left: 5px;
              }
            }
          }

          .v-btn {
            background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
            border-radius: 10px;
          }
        }
      }
    }

    .chat_users {
      @apply w-270px bg-lightFirst h-full overflow-hidden;

      .user_title {
        @apply h-70px border-b-1px border-accent py-20px px-10px;

        .msg {
          @apply text-20px font-bold h-30px relative pl-20px flex items-center;
        }

        .msg::before {
          content: '';
          @apply absolute w-6px h-30px rounded-3px bg-warning top-0px;
          left: 5px;
        }
      }

      .user_list {
        @apply py-20px px-5px;
        height: calc(100% - 70px);
      }
    }
  }
}

.item-msg {
  margin-top: 8px;
  font-size: 12px;

  .icon {
    width: 15px;
    height: 15px;
  }
}

.image {
  height: 200px;
  cursor: pointer;
  margin: 5px;
  display: inline-block;
}
</style>
