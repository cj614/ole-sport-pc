<template>
  <div class="m_special_offer_warp">
    <module-self>
      <h1 class="title">{{ $t(`Module['优惠活动']`) }}</h1>

      <div class="special_offer_content">
        <div class="special_offer_pad">
          <template v-if="activityList.length">
            <div v-for="(item, index) in activityList" :key="index" class="special_offer_item"
              @click.stop="handleClickImg(item)">
              <active-card :item="item" :index="index"></active-card>
            </div>
          </template>
          <template v-else>
            <module-skeletonCard v-if="loading" skeletonClass="p-10px" height="140" width="350"></module-skeletonCard>
            <page-empty v-else :top="60" :title="$t(`Module['暂无数据']`)"></page-empty>
          </template>
        </div>
      </div>
    </module-self>


  </div>
</template>

<script>
import { getActivityList } from '@/api/sidebar'

export default {
  data() {
    return {
      activeIdex: 0,
      activityList: [],
      loading: false,
      headerBanner: false,
      Img: {

        Active1: require(`@/${this.$img.Page.Active.Active1}`),
        Active2: require(`@/${this.$img.Page.Active.Active2}`),
        Active3: require(`@/${this.$img.Page.Active.Active3}`),
        Active4: require(`@/${this.$img.Page.Active.Active4}`),
      }
    }
  },

  mounted() {
    this.getActivityList()
  },

  methods: {
    handleTab(index) {
      this.activeIdex = index
      this.getActivityList()
    },

    handleClickImg(item) {
      if (item.is_over_time) {
        return
      }
      if (item.content_img_url) {
        this.$router.push({
          name: 'activityDetail',
          query: { img: item.content_img_url }
        })
      } else {
        // this.$toast.warning('暂无详情图')
      }
    },

    async getActivityList() {
      try {
        this.loading = true
        const { Code, Data } = await getActivityList({
          page: 1,
          limit: 50,
          status: this.activeIdex
        })
        if (Code === 200) {
          const { Data: List } = Data
          this.activityList = List
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_special_offer_warp {
  @apply w-full h-full flex flex-col;

  .title {
    color: var(--app-text);
    margin-top: 20px;
  }

  .special_offer_content {
    @apply py-20px min-h-600px rounded-10px;

    .special_offer_pad {
      @apply flex flex-wrap rounded-10px;
      gap: 20px;

      .special_offer_item {
        @apply cursor-pointer relative;


      }
    }
  }
}

.special_offer_content_2 {
  @apply py-20px min-h-550px rounded-10px p-10px;
}
</style>
