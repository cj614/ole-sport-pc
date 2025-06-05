<template>
  <div class="attention_warp">
    <p class="item_h_title">{{ $t(`Module['打赏记录']`) }}</p>

    <div class="attention_content">
      <module-table :headers="headers" :items="items"></module-table>
      <module-pagination :paddingTop="60" :page="page.page" :count="page.count" :limit="page.limit"
        @pageList="pageList"></module-pagination>
    </div>
  </div>
</template>

<script>
import { getChatGiftsOrder } from '@/api/payment'
export default {
  name: '',
  data() {
    return {
      headers: [
        {
          text: this.$t(`Module['流水编号']`),
          align: 'center',
          value: 'order_no'
        },
        {
          text: this.$t(`Module['打赏金额']`),
          align: 'center',
          value: 'balance'
        },
        {
          text: this.$t(`Module['被打赏人']`),
          align: 'center',
          value: 'to_name'
        },
        {
          text: this.$t(`Module['打赏时间']`),
          align: 'center',
          value: 'updated_at'
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
  mounted() {
    this.getChatGiftsOrder()
  },
  methods: {
    pageList(page) {
      this.page.page = page
      this.getChatGiftsOrder()
    },
    async getChatGiftsOrder() {
      const { page, limit } = this.page
      const { Data, Code } = await getChatGiftsOrder({ page, limit })
      if (Code === 200) {
        const { Data: List, Count } = Data
        this.page.count = Count
        this.items = List.map(m => {
          if (m.created_at) {
            m.updated_at = this.$date(m.created_at).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          return m
        })
      }
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