<template>
  <div class="m_sport_news_wrap">
    <module-self>
      <div class="news_box">

        <template v-if="newsList.length">
          <div class="news_list">
            <div class="news_item" v-for="(item, index) in newsList" :key="index" @click="handleClickNes(item)">
              <article-card :item="item"></article-card>
            </div>
          </div>
          <module-pagination :paddingTop="20" :page="page.page" :count="page.count" :limit="page.limit"
            @pageList="pageList"></module-pagination>
        </template>
        <template v-else>
          <module-skeletonCard v-if="loading" skeleton="live" width="630" height="232"></module-skeletonCard>
          <page-empty v-else :top="0" :title="$t(`Module['暂无数据']`)"></page-empty>
        </template>
      </div>
    </module-self>

  </div>
</template>

<script>
import { sportNewList } from '@/api/sportNews'
import { timeFormat } from '@/libs/util.js'
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
      newsList: [],
      column_set_id: '',
      keyword: '',
      Img: {
        ThumbUp: require(`@/${this.$img.Page.News.ThumbUp}`)
      }
    }
  },

  mounted() {
    this.getSportNewList()
  },

  methods: {
    // handleSelect(data) {
    //   if (this.column_set_id === data.column_set_id) {
    //     return
    //   }
    //   this.column_set_id = data.column_set_id
    //   this.competition = data.competition || ''
    //   this.pageList(1)
    // },

    // handleClickCompetition(data) {
    //   this.column_set_id = data.column_set_id
    //   this.competition = data.competition || ''
    //   this.pageList(1)
    // },

    pageList(page) {
      this.page.page = page
      this.getSportNewList()
    },

    timeFormat(date) {
      return timeFormat(date * 1000)
    },

    handleClickNes(item) {
      this.$router.push({ name: 'sportNewsDetails', params: { id: item.id } })
    },

    async getSportNewList() {
      try {
        this.newsList = []
        this.loading = true
        const param = {
          page: this.page.page,
          limit: this.page.limit,
          // column_set_id: this.column_set_id,
          // competition: this.competition,
          // keyword: this.keyword
        }
        const { Code, Data } = await sportNewList(param)
        if (Code === 200) {
          const { Data: List, Count, Page } = Data
          this.newsList = List
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
.m_sport_news_wrap {
  @apply w-full h-full flex flex-col;

  .news_box {
    @apply pt-20px pb-40px;

    .news_adv {
      @apply pb-20px;

      .v-image {
        @apply rounded-10px;
      }
    }

    .news_list {
      @apply w-full flex flex-wrap;

      .news_item {
        @apply flex items-center p-10px rounded-10px w-630px h-190px mb-20px cursor-pointer border-solid border-1px border-hex-000;
        transition: all 0.3s;
      }

      .news_item:hover {
        @apply border-solid border-1px border-hex-E4CAAB;
      }

      .news_item:nth-child(odd) {
        @apply mr-20px;
      }
    }
  }
}
</style>
