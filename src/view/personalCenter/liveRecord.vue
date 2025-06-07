<template>
  <div class="attention_warp">
    <p class="item_h_title">{{ $t(`Module['直播记录']`) }}</p>

    <div class="attention_content">
      <module-table :headers="headers" :loading="loading" :items="items"></module-table>
      <module-pagination :paddingTop="60" :page="page.page" :count="page.count" :limit="page.limit"
        @pageList="pageList"></module-pagination>
    </div>
  </div>
</template>

<script>
import { getRoomList } from '@/api/room'
export default {
  name: '',
  data() {
    return {
      loading: false,
      headers: [
        {
          text: this.$t(`Module['开始时间']`),
          align: 'center',
          value: 'createdAt'
        },
        {
          text: this.$t(`Module['结束时间']`),
          align: 'center',
          value: 'updatedAt'
        },
        {
          text: this.$t(`Module['比赛名称']`),
          align: 'center',
          value: 'glive_matches_name'
        },
        {
          text: this.$t(`Module['房间名']`),
          align: 'center',
          value: 'title'
        }
      ],
      items: [],
      page: {
        page: 1,
        limit: 9,
        count: 0
      }
    }
  },
  computed: {
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },
    user() {
      let { user } = this.userInfo
      return user || {}
    }
  },
  mounted() {
    this.getRoomList()
  },
  methods: {
    pageList(page) {
      this.page.page = page
      this.getRoomList()
    },
    async getRoomList() {
      const { user } = this
      const { page, limit } = this.page
      this.loading = true
      const { Data, Code } = await getRoomList({
        page,
        limit,
        user_id: user.id,
        status: 2
      })
      if (Code === 200) {
        const { Data: List, Count } = Data
        this.page.count = Count
        this.items = List.map(m => {
          if (m.createdAt) {
            m.createdAt = this.$date(m.createdAt).format('YYYY-MM-DD HH:mm:ss')
          }
          if (m.updatedAt) {
            m.updatedAt = this.$date(m.updatedAt).format('YYYY-MM-DD HH:mm:ss')
          }
          return m
        })
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.attention_warp {
  @apply h-full;

  .attention_content {
    @apply flex flex-col h-full overflow-hidden;
  }
}
</style>
