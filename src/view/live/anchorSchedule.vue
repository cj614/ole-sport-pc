<template>
  <module-self>
    <div class="m_anchor_schedule_warp">
      <div class="anchor_header">
        <div class="anchor_img">
          <v-avatar width="80" height="80">
            <v-img :src="anchor.img_url"></v-img>
          </v-avatar>
        </div>

        <div class="anchor_txt">
          <span class="name_a">{{ anchor.user_name }}</span>
          <span class="title_a">{{ anchor.status_info || '-' }}</span>
        </div>

        <div class="anchor_btn">
          <v-btn depressed rounded outlined class="btn" :class="anchor.is_follow ? 'btn2' : 'btn3'"
            :minWidth="anchor.is_follow ? 118 : 90" height="33" :color="anchor.is_follow ? '#F9B31F' : '#ffffff'"
            @click="handleAttention()">
            <v-icon size="20">{{ anchor.follow ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
            {{ anchor.is_follow ? $t(`Module['取消关注']`) : $t(`Module['关注']`) }}
          </v-btn>
        </div>
      </div>

      <module-homeTitle :title="$t(`Module['主播赛程']`)" iconName="topAnchorSchedule" type="1"></module-homeTitle>
      <div class="anchor_schedule_content no_scrollbar">
        <!-- <module-anchorSchedule :userId="anchor.user_id" type="anchorSchedule" :anchorId="id"></module-anchorSchedule> -->
        <module-live :userId="id"></module-live>

      </div>

      <module-homeTitle :title="$t(`Module['精彩推荐']`)" iconName="topMoment" type="1"></module-homeTitle>
      <div class="anchor_schedule_footer">
        <template v-if="matchLiveList.length">
          <page-competitionCard type="live" :Anchor="true" :List="matchLiveList"
            @handleClickItem="handleClickItem"></page-competitionCard>
        </template>
        <template v-else>
          <module-skeletonCard v-if="loading" :forIt="4" type="card-avatar,article@2"
            skeletonClass="mx-auto"></module-skeletonCard>
          <page-empty type="matchLive" v-else :top="0" :title="$t(`Module['目前暂无直播']`)"></page-empty>
        </template>
      </div>
    </div>
  </module-self>
</template>

<script>
import { getMatchLiveListPage } from '@/api/live'
import { followStatusV2, liveFollowV2, setFollow } from '@/api/follow'

import { userDetail } from '@/api/user'
export default {
  data() {
    return {
      Img: {
        Living: require(`@/${this.$img.Page.Home.Living}`)
      },
      anchor: {},
      matchLiveList: [],
      matchList: [],
      loading: false
    }
  },

  computed: {
    id() {
      return this.$route.params.id
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
    this.getRoomDetail()
    this.getMatchLiveListPage()
  },

  methods: {
    handleAttention() {
      let { id, is_follow } = this.anchor
      setFollow({
        to_user_id: id
      }).then(res => {
        let { Code } = res
        if (Code === 200) {
          if (is_follow) {
            this.$set(this.anchor, 'is_follow', 0)
            // this.$toast.success('取消关注')
          } else {
            this.$set(this.anchor, 'is_follow', 1)
            // this.$toast.success('关注成功')
          }
        }
      })
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
          })).filter(r => r.LiveUserId === this.userId)
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
    async getRoomDetail() {
      const { id } = this
      const { Data, Code } = await userDetail({ user_id: id })
      if (Code === 200) {
        this.anchor = Data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_anchor_schedule_warp {
  @apply pt-20px pb-40px;

  .anchor_header {
    @apply px-20px h-100px flex items-center bg-lightFirst rounded-10px mb-40px;

    .anchor_img {
      @apply mr-20px;
    }

    .anchor_txt {
      @apply flex flex-col flex-1 justify-center;

      .name_a {
        @apply mb-10px text-20px font-bold;
      }

      .title_a {
        @apply text-12px;
      }
    }

    .anchor_btn {
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

  .anchor_schedule_content {
    @apply h-692px rounded-10px bg-lightFirst p-20px mb-40px overflow-auto;
  }

  .anchor_schedule_footer {
    @apply h-232px;
  }
}
</style>
