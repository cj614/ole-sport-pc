<template>
  <div class="m_sport_video_wrap">
    <module-headerList
      :isVideo="true"
      @handleClickSetId="handleSelect"
      @handleClickCompetition="handleClickCompetition"
    ></module-headerList>
    <module-self>
      <div class="video_box">
        <div class="video_adv" v-show="aboveBanner">
          <page-ImgSwiper
            height="150"
            typeName="Pc-Video above banner"
            @show="(res) => aboveBanner = res"
          ></page-ImgSwiper>
        </div>
        <template v-if="videoList.length">
          <page-competitionCard
            type="live"
            :isVideo="true"
            :List="videoList"
            @handleClickItem="handleVideoClickItem"
          ></page-competitionCard>

          <module-pagination
            :paddingTop="20"
            :page="page.page"
            :count="page.count"
            :limit="page.limit"
            @pageList="pageList"
          ></module-pagination>
        </template>
        <template v-else>
          <module-skeletonCard v-if="loading" skeleton="live"></module-skeletonCard>
          <page-empty v-else :top="0" type="video" :title="$t(`Module['暂无数据']`)"></page-empty>
        </template>
      </div>
    </module-self>
    <page-adv left="Pc-Video left side banner" right="Pc-Video right side banner"></page-adv>
    <page-footeradv footer="Pc-Video footer banner"></page-footeradv>
  </div>
</template>

<script>
import { sportVideoList } from '@/api/sportVideo'
export default {
  data() {
    return {
      loading: false,
      page: {
        page: 1,
        limit: 20,
        count: 0
      },
      aboveBanner: false,
      column_set_id: '',
      keyword: '',
      videoList: []
    }
  },

  mounted() {
    this.getSportVideoList()
  },

  methods: {
    handleSelect(data) {
      if (this.column_set_id === data.column_set_id) {
        return
      }
      this.column_set_id = data.column_set_id
      this.competition = data.competition || ''
      this.pageList(1)
    },

    handleClickCompetition(data) {
      this.column_set_id = data.column_set_id
      this.competition = data.competition || ''
      this.pageList(1)
    },

    pageList(page) {
      this.page.page = page
      this.getSportVideoList()
    },

    handleVideoClickItem(item) {
      this.$router.push({ name: 'sportVideoDetails', params: { id: item.id } })
    },

    async getSportVideoList() {
      try {
        this.videoList = []
        this.loading = true
        const param = {
          page: this.page.page,
          limit: this.page.limit,
          column_set_id: this.column_set_id,
          competition: this.competition,
          keyword: this.keyword
        }
        const { Code, Data } = await sportVideoList(param)
        if (Code === 200) {
          const { Data: List, Count, Page } = Data
          this.videoList = List
          this.page.page = Page
          this.page.count = Count
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_sport_video_wrap {
  @apply w-full h-full flex flex-col;
  .video_box {
    @apply pt-20px pb-40px;
    .video_adv {
      @apply pb-20px;
      .v-image {
        @apply rounded-10px;
      }
    }
  }
}
//
</style>
