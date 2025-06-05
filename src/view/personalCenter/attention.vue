<template>
  <div class="attention_warp">
    <p class="item_h_title">{{ $t(`Page['我的关注']`) }}</p>

    <template v-if="list.length">
      <ul class="attention_list">
        <li class="attention_item" v-for="(item, index) in list" :key="index">
          <div class="item_Anchor">
            <div class="img_box">
              <v-avatar width="60" class="relative" height="60">
                <v-img :src="item.img_url"></v-img>
              </v-avatar>
              <!--              <div :class="[-->
              <!--                'live_color',-->
              <!--                { live_color_2: item.room_status === 0 }-->
              <!--              ]"></div>-->
            </div>

            <span class="anchor_name">{{ item.user_name }}</span>
          </div>
          <div class="attention_btn">
            <v-btn depressed rounded class="btn1 btn" v-if="item.live_room_id > 0" min-width="88" height="34"
              @click="handleLive(item)">{{ $t(`Module['观看直播']`) }}
            </v-btn>
            <v-btn depressed rounded class="btn3 btn" v-else min-width="88" height="34" @click="handleMatch(item)">{{
              $t(`Module['查看赛程']`)
            }}
            </v-btn>
            <v-btn depressed rounded outlined color="#F9B31F" class="btn2 btn" min-width="88" height="34"
              @click="focusAnchor(item)">{{ $t(`Module['取消关注']`) }}
            </v-btn>
          </div>
        </li>
      </ul>
      <module-pagination :paddingTop="20" :page="page.page" :count="page.count" :limit="page.limit"
        @pageList="pageList"></module-pagination>
    </template>
    <template v-else>
      <div class="w-full h-100 flex items-center justify-center">
        <v-progress-circular v-if="loading" indeterminate color="primary" size="24"></v-progress-circular>
        <page-empty v-else type="user" :title="$t(`Module['暂无关注']`)"></page-empty>
      </div>
    </template>
  </div>
</template>

<script>
import { liveFollowV2, myFollowList, setFollow } from '@/api/follow'

export default {
  data() {
    return {
      list: [],
      loading: false,
      page: {
        page: 1,
        limit: 12,
        count: 0
      }
    }
  },

  mounted() {
    this.myFollowList()
  },

  computed: {
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    }
  },

  methods: {
    pageList(page) {
      this.page.page = page
      this.myFollowList()
    },

    handleLive(item) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      // type == 0 表示主播直播
      this.$router.push({ name: 'anchorRoom', params: { id: item.live_room_id, all_match_id: item.all_match_id, type: 0 } })
    },

    async handleAttention({ to_user_id }) {
      const { Code } = await setFollow({ to_user_id })
      if (Code) {
        this.page.page = 1
        this.myFollowList()
      }
    },


    focusAnchor(item) {
      liveFollowV2(item.id, 0).then(res => {
        let { Code } = res
        if (Code === 200) {
          this.page.page = 1
          this.myFollowList()
        }
      }).catch(() => {
      })
    },

    handleMatch(item) {
      this.$router.push({
        name: 'anchorSchedule',
        params: { id: item.id }
      })
    },

    async myFollowList() {
      const {
        page: { page, limit }
      } = this
      this.loading = true
      const { Data, Code } = await myFollowList({ page, limit })
      if (Code === 200) {
        this.list = Data
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.attention_warp {
  @apply w-full;

  .attention_list {
    @apply flex pl-0px flex-wrap max-h-760px;

    .attention_item {
      @apply flex justify-between items-center h-100px p-20px w-[calc(50%-10px)] bg-accentSecond mb-20px rounded-10px;

      .item_Anchor {
        @apply flex items-center;

        .img_box {
          @apply relative;

          .live_color {
            @apply h-10px w-10px rounded-1/2 bg-success absolute top-5px right-2px;
          }

          .live_color_2 {
            @apply bg-hex-999999;
          }
        }

        .anchor_name {
          @apply text-16px font-bold text-dark ml-10px;
        }
      }

      .attention_btn {
        @apply flex items-center;

        .btn1 {
          @apply text-lightFirst;
          background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
        }

        .btn2 {
          @apply ml-10px;
        }

        .btn3 {
          @apply text-primaryFirst;
          border: 1px solid #1862c8;
        }

        .btn {
          @apply rounded-22px font-normal text-12px;
        }
      }
    }

    .attention_item:nth-child(odd) {
      @apply mr-10px;
    }

    .attention_item:nth-child(even) {
      @apply ml-10px;
    }
  }
}
</style>
