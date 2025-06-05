<template>
  <div class="attention_warp">
    <p class="item_h_title">{{$t(`Module['充值记录']`)}}</p>

    <div class="attention_content">
      <module-table :headers="headers" :loading="loading" :items="items"></module-table>
      <module-pagination
        :paddingTop="60"
        :page="page.page"
        :count="page.count"
        :limit="page.limit"
        @pageList="pageList"
      ></module-pagination>
    </div>
  </div>
</template>

<script>
import { payOrdersList } from '@/api/payment'
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
          text: 'O' + this.$t(`Module['币']`),
          align: 'center',
          value: 'balance'
        },
        {
          text: this.$t(`Module['金额']`),
          align: 'center',
          value: 'pay_amount'
        },
        {
          text: this.$t(`Module['状态']`),
          align: 'center',
          value: 'pay_status'
        },
        {
          text: this.$t(`Module['充值时间']`),
          align: 'center',
          value: 'updated_at'
        }
      ],
      items: [],
      loading: false,
      page: {
        page: 1,
        limit: 9,
        count: 0
      }
    }
  },
  mounted() {
    this.payOrdersList()
  },
  methods: {
    pageList(page) {
      this.page.page = page
      this.payOrdersList()
    },

    async payOrdersList() {
      const { page, limit } = this.page
      this.loading = true
      const { Data, Code } = await payOrdersList({ page, limit })
      if (Code === 200) {
        const { Data: List, Count } = Data
        this.page.count = Count
        // 描述：支付状态枚举值，UNPAID：进行中，PAID已完成 FAIL：充值失败
        this.items = List.map(m => {
          if (m.pay_status) {
            m.pay_status = {
              UNPAID: this.$t(`Module['进行中']`),
              PAID: this.$t(`Module['已完成']`),
              FAIL: this.$t(`Module['充值失败']`)
            }[m.pay_status]
          }
          if (m.updated_at) {
            m.updated_at = this.$date(m.updated_at).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          return m
        })

        this.loading = false
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