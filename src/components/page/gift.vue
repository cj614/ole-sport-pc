<template>
  <v-menu content-class="m_gift_warp " offset-x top :nudge-left="320" :nudge-top="50" v-model="giftValue"
    :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-btn fab depressed small v-bind="attrs" v-on="on">
        <v-tooltip top color="#000" content-class="chat_tool_tip" z-index="2000">
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <v-img style="background: #000;" :src="Img.OngGift" width="40" height="40"></v-img>
            </span>
          </template>
          <span class="!text-dark">{{ $t(`Module['打赏']`) }}</span>
        </v-tooltip>
      </v-btn>
    </template>
    <ul class="gift_list no_scrollbar">
      <li v-for="(item, index) in giftList" :key="index" class="gift_item" @click.stop="handleClickGift(item)">
        <div>
          <page-pageLoad :src="item.img_url" width="48" height="48"></page-pageLoad>
        </div>
        <v-tooltip top color="#ffffff">
          <template v-slot:activator="{ on, attrs }" z-index="200">
            <div class="name whiteSpace_nowrap" v-bind="attrs" v-on="on">{{ item.name }}</div>
          </template>
          <span class="!text-dark">{{ item.name }}</span>
        </v-tooltip>
        <div class="amount">
          <span>
            <img :src="Img.DollarMall" width="16" height="16" />
          </span>
          <span>{{ item.amount }}</span>
        </div>
      </li>
    </ul>
  </v-menu>
</template>

<script>
import { giftList } from '@/api/chat'
export default {
  data() {
    return {
      giftList: [],
      giftValue: false,
      Img: {
        DollarMall: require(`@/${this.$img.Page.User.Dollar}`),
        OngGift: require(`@/${this.$img.Page.Room.OngGift}`)
      }
    }
  },
  mounted() {
    this.getGiftList()
  },
  methods: {
    async getGiftList() {
      const { Data, Code } = await giftList()
      if (Code === 200) {
        this.giftList = Data.list
      }
    },
    handleClickGift(item) {
      this.giftValue = false
      this.$emit('sendGift', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.m_gift_warp {
  @apply w-330px h-300px rounded-t-20px rounded-bl-20px py-10px bg-hex-202124;

  .gift_list {
    @apply px-10px overflow-y-auto h-full flex flex-wrap;

    .gift_item {
      @apply w-1/3 h-123px flex flex-col items-center justify-center cursor-pointer;

      .name {
        @apply font-bold text-12px my-10px max-w-80px text-white;
      }

      .amount {
        @apply flex font-sans font-bold text-16px text-white;
      }
    }
  }
}
</style>