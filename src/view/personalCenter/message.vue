<template>
  <div>
    <div class="message_warp" v-show="showContent">
      <p class="item_h_title">{{ $t(`Page['消息中心']`) }}</p>

      <div class="item_tabs">
        <div :class="{ tab_active: type == 'notification' }" class="tab" @click="handleTab('notification')">{{
          $t(`Module['通知']`) }}
        </div>

        <div :class="{ tab_active: type == 'notice' }" class="tab" @click="handleTab('notice')">{{ $t(`Module['公告']`) }}
        </div>
      </div>

      <div class="notice_warp" :class="notification.loading ? 'load_box' : ''" v-show="type === 'notification'">
        <template v-if="notification.list.length">
          <div class="notice_content">
            <div class="notice_list" v-for="(item, index) in notification.list" :key="index">
              <div class="herder" @click.stop="handleNotificationDetail(item)">
                <div class="title_1">
                  <v-badge color="#FF0000" avatar offset-y="6" :value="!item.is_read" dot>
                    <span class="img_p">
                      <v-img :src="Img.MessageLight" width="32" height="32"></v-img>
                    </span>
                  </v-badge>

                  <div class="txt_title">{{ item.title }}</div>
                </div>

                <div class="date">
                  <div class="txt_time">{{ day(item.create_timestamp) }}</div>
                  <span class="img_p">
                    <v-img :src="item.show ? Img.messageDown : Img.messageUp" width="14" height="14"></v-img>
                  </span>
                </div>
              </div>

              <div class="content no_scrollbar" v-show="item.show" @click.stop="handleMessageClick(item.subData)">
                <template v-if="item.subData">
                  <div class="txt_content" v-html="item.subData.content"></div>
                  <span class="img_p" @click.stop="handleDeleteNotification(item)">
                    <v-img :src="Img.Delete" width="20" height="20"></v-img>
                  </span>
                </template>
                <template v-else>
                  <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
                </template>
              </div>
            </div>
          </div>

          <module-pagination :paddingTop="20" :page="notification.page" :count="notification.count"
            :limit="notification.limit" @pageList="pageList"></module-pagination>
        </template>
        <template v-else>
          <v-progress-circular v-if="notification.loading" indeterminate color="primary"
            size="24"></v-progress-circular>
          <page-empty top="50" type="message" :isDark="false" v-else :title="$t(`Module['暂无数据']`)"></page-empty>
        </template>
      </div>

      <div class="notice_warp" :class="notice.loading ? 'load_box' : ''" v-show="type === 'notice'">
        <template v-if="notice.list.length">
          <div class="notice_content" v-for="(item, index) in notice.list" :key="index">
            <div class="notice_list">
              <div class="herder" @click.stop="handleNoticeDetail(item)">
                <div class="title_1">
                  <v-badge color="#FF0000" avatar offset-y="6" :value="!item.is_read" dot>
                    <span class="img_p">
                      <v-img :src="Img.MessageLight" width="32" height="32"></v-img>
                    </span>
                  </v-badge>
                  <div class="sub">
                    <div class="sub_title">{{ item.title }}</div>
                    <div class="sub_txt">{{ item.content }}</div>
                  </div>
                </div>

                <div class="date">
                  <div class="txt">{{ day(item.create_timestamp) }}</div>
                  <span class="img_p" @click.stop="handleDeleteNotice(item)">
                    <v-img :src="Img.Delete" width="20" height="20"></v-img>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <module-pagination :paddingTop="20" :page="notice.page" :count="notice.count" :limit="notice.limit"
            @pageList="pageList"></module-pagination>
        </template>
        <template v-else>
          <v-progress-circular v-if="notice.loading" indeterminate color="primary" size="24"></v-progress-circular>
          <page-empty top="50" type="message" :isDark="false" v-else :title="$t(`Module['暂无消息']`)"></page-empty>
        </template>
      </div>
    </div>
    <div v-show="!showContent" class="affiche_detail">
      <p class="item_h_title">
        <v-btn icon @click="showContent = true">
          <v-icon style="color: #E5CBAD !important">mdi-arrow-left</v-icon>
        </v-btn>
        <span style="color: #E5CBAD;">{{ $t(`Module['返回']`) }}</span>
      </p>

      <div class="affiche_detail_h">
        <div class="h_txt">{{ notice.data.title }}</div>
        <div class="h_date">{{ day(notice.data.create_timestamp) }}</div>
      </div>
      <div class="affiche_detail_content" v-html="notice.data.content"></div>
    </div>
    <module-liveDialog ref="liveRef" @anchorClick="anchorClick" :anchorList="anchorList"></module-liveDialog>
  </div>
</template>

<script>
import {
  getNotificationList,
  readNotification,
  deleteNotification,
  getNotificationDetail
} from '@/api/notification'
import { getNoticeList, getNoticeDetail, deleteNotice } from '@/api/notice'

export default {
  data() {
    return {
      type: 'notification',
      showContent: true,
      Img: {
        messageUp: require(`@/${this.$img.Page.User.messageUp}`),
        messageDown: require(`@/${this.$img.Page.User.messageDown}`),
        Delete: require(`@/${this.$img.Page.User.Delete}`),
        MessageLight: require(`@/${this.$img.Page.User.MessageLight}`)
      },
      notification: {
        page: 1,
        limit: 8,
        count: 0,
        list: [],
        loading: false
      },
      anchorList: [],
      notice: {
        page: 1,
        limit: 8,
        count: 0,
        list: [],
        loading: false,
        data: {}
      },
      item: {},
    }
  },

  mounted() {
    this.getNotificationList()
  },

  methods: {
    handleTab(type) {
      this.type = type
      if (this.type === 'notice') {
        this.notice.page = 1
        this.getNoticeList()
      } else {
        this.notification.page = 1
        this.getNotificationList()
      }
    },
    day(date) {
      return this.$date(date * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    pageList(page) {
      if (this.type === 'notification') {
        this.notification.page = page
        this.getNotificationList()
      } else {
        this.notice.page = page
        this.getNoticeList()
      }
    },
    async getNotificationList() {
      try {
        this.notification.list = []
        this.notification.loading = true
        const {
          notification: { page, limit }
        } = this
        const { Code, Data } = await getNotificationList({ page, limit })
        if (Code === 200) {
          const { Data: list, Count } = Data || []
          this.notification.count = Count || 0
          this.notification.list = list.map(r => ({
            show: false,
            subData: null,
            ...r
          }))
          this.notification.loading = false
        }
      } catch (error) {
        this.notification.loading = false
        throw error
      }
    },

    //删除
    async handleDeleteNotification({ id }) {
      const { Code } = await deleteNotification({ id })
      if (Code === 200) {
        // this.$toast.success('删除成功')
        this.notification.page = 1
        this.getNotificationList()
      }
    },

    async handleNoticeDetail(item) {
      const { notice_id, create_timestamp, id } = item
      const { Code, Data } = await getNoticeDetail({
        notice_id,
        create_timestamp,
        id
      })
      if (Code === 200) {
        this.showContent = false
        this.notice.data = Data
        this.$set(item, 'is_read', 1)
      }
    },

    async handleNotificationDetail(item) {
      this.$set(item, 'show', !item.show)
      if (item.subData) {
        return
      }
      if (!item.show) {
        return
      }
      const { related_id, notification_type, create_timestamp, id } = item
      const { Code, Data } = await getNotificationDetail({
        related_id,
        notification_type,
        create_timestamp,
        id
      })
      if (Code === 200) {
        if (Data.live_detail && Data.live_detail.length) {
          for (let i = 0; i < Data.live_detail.length; i++) {
            if (Data.live_detail[i].sub_type == 1) {
              Data.live_detail[i].type = 'official'
            }
          }
        }
        this.$set(item, 'subData', Data)
        this.$set(item, 'is_read', 1)
        this.$store.dispatch('app/handleMessageCount')
      }
    },

    //舍弃
    async readNotification(row) {
      const { id } = row
      const { Code } = await readNotification({ id })
      if (Code === 200) {
        this.$set(row, 'is_read', 1)
      }
    },

    async getNoticeList() {
      try {
        this.notice.list = []
        this.notice.loading = true
        const {
          notice: { page, limit }
        } = this
        const { Code, Data } = await getNoticeList({ page, limit })
        if (Code === 200) {
          const { Data: list, Count } = Data
          this.notice.count = Count || 0
          this.notice.list = list || []
          this.notice.loading = false
        }
      } catch (error) {
        this.notice.loading = false
        throw error
      }
    },

    async handleDeleteNotice({ id }) {
      const { Code } = await deleteNotice({ id })
      if (Code === 200) {
        // this.$toast.success('删除成功')
        this.notice.page = 1
        this.getNoticeList()
      }
    },

    handleMessageClick(item) {
      const { activity, live_detail } = item
      if (activity && activity > 0 && Object.keys(activity).length) {
        const { content_img_url } = activity
        this.$router.push({
          name: 'activityDetail',
          query: { img: content_img_url }
        })
        return
      }

      if (live_detail && live_detail.length) {
        if (live_detail.length > 1) {
          this.anchorList = live_detail
          this.$refs.liveRef.setDialog()
        } else {
          this.anchorClick(live_detail[0])
        }
        return
      }

      if (item.notification_type === 2) {
        this.$bus.$emit('snackbar/on', this.$t(`Module['目前暂无直播']`))
      }
    },

    anchorClick(anchor) {
      let { item } = this
      let { type } = anchor
      if (type === 'official') {
        let { liveId } = item
        if (liveId) {
          this.$router.push({ name: 'officialRoom', params: { id: liveId } })
        }

        liveId = anchor.glive_match_id
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
        } else if (live_room_user_id) {
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
.message_warp {
  @apply w-full h-full flex flex-col overflow-hidden;

  .item_tabs {
    @apply flex items-center w-full h-80px p-5px mb-40px;
    border-bottom: 1px solid #292929;

    .tab {
      @apply w-1/10 h-full flex justify-center items-center text-16px font-bold text-lightFirst;
      margin-right: 20px;
      cursor: pointer;
    }

    .tab_active {
      @apply text-hex-E6CCAE;
      border-bottom: 2px solid #E6CCAE;
    }
  }

  .notice_warp {
    @apply flex h-full flex-col justify-center items-center overflow-hidden;

    .notice_content {
      @apply flex-1 overflow-auto w-full;

      .notice_list {
        @apply flex flex-col;

        .herder {
          @apply h-80px flex items-center justify-between bg-hex-292A34 border-b-1px border-solid border-accent cursor-pointer;
          padding: 0 10px;

          .title_1 {
            @apply flex items-center;

            .txt_title {
              @apply font-bold text-white text-16px ml-20px;
            }

            .sub {
              @apply flex flex-col ml-20px;

              .sub_title {
                @apply font-bold text-16px text-white;
              }

              .sub_txt {
                @apply font-normal text-12px text-white mt-10px;
              }
            }
          }

          .img_p {
            @apply cursor-pointer;
          }

          .date {
            @apply flex items-center;

            .txt {
              @apply text-14px font-normal text-white mr-20px w-150px;
            }
          }
        }

        .content {
          @apply min-h-80px max-h-300px px-20px py-10px pl-72px bg-hex-f0f0f0 flex items-center justify-between overflow-auto;

          .txt_content {
            @apply text-dark text-16px py-10px leading-21px cursor-pointer;
          }

          .img_p {
            @apply cursor-pointer;
          }
        }
      }
    }
  }

  .load_box {
    @apply min-h-500px;
  }
}

.affiche_detail {
  @apply w-full h-full flex flex-col overflow-hidden;

  .affiche_detail_h {
    @apply flex items-center justify-between px-20px rounded-20px mb-20px h-70px;
    background: linear-gradient(90deg, #E5CBAD 0%, #D6B37E 100%);

    .h_txt {
      @apply font-bold text-20px text-hex-5C330A;
    }

    .h_date {
      @apply text-14px text-hex-5C330A font-normal;
    }
  }

  .affiche_detail_content {
    @apply leading-40px text-14px text-white;

    a {
      color: #ccc;
    }
  }
}
</style>