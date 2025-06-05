<template>
  <div>
    <template v-if="newsList.length">
      <div class="news_item" v-for="(item, index) in newsList" :key="index" @click="handleClickNes(item)">
        <div class="news_img">
          <page-pageLoad :src="item.img_url" width="305" height="171"></page-pageLoad>
        </div>
        <div class="new_content">
          <div class="news_title" v-show="item.column_name">{{ item.competition || item.column_name }}</div>
          <div class="news_subtitle">
            <div class="_date">{{ timeFormat(item.created_utc_timestamp) }}</div>
            <div class="_count">
              <span class="mr-2px">
                <v-img :src="Img.Views" width="14" height="14"></v-img>
              </span>
              {{ item.comment_count }}
            </div>
          </div>
          <div class="news_txt">{{ item.title }}</div>
        </div>
      </div>
      <module-pagination :paddingTop="10" :page="page.page" :count="page.count" :limit="page.limit"
        @pageList="pageList"></module-pagination>
    </template>
    <template v-else>
      <module-skeletonCard v-if="loading" skeleton="live" width="920" height="232"></module-skeletonCard>
      <page-empty v-else :top="0" :title="$t(`Module['暂无数据']`)"></page-empty>
    </template>
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
        limit: 10,
        count: 0
      },
      newsList: [],
      Img: {
        Views: require(`@/${this.$img.Page.Home.Views}`)
      }
    };
  },
  methods: {
    handleClickNes(item) {
      this.$router.push({ name: 'sportNewsDetails', params: { id: item.id } })
    },
    timeFormat(date) {
      return timeFormat(date * 1000)
    },
    pageList(page) {
      this.page.page = page
      this.getSportNewList()
    },
    async getSportNewList() {
      try {
        this.newsList = []
        this.loading = true
        const param = {
          page: this.page.page,
          limit: this.page.limit,
          column_set_id: this.column_set_id,
          competition: this.competition,
          keyword: this.keyword
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
  },
  mounted() {
    this.getSportNewList()
  },

}

</script>



<style scoped lang="scss">
.news_item {
  @apply flex items-center p-10px bg-lightFirst rounded-10px w-920px h-191px mt-20px cursor-pointer;

  .news_img {
    @apply mr-10px;

    .v-image {
      @apply rounded-10px;
    }
  }

  .new_content {
    @apply flex flex-col;
    flex: 1;

    .news_title {
      @apply py-10px text-primaryFirst font-bold;
    }

    .news_subtitle {
      @apply flex items-center justify-between pb-10px border-b-1px border-solid border-accent;

      ._date {
        @apply text-12px text-info;
      }

      ._count {
        @apply text-14px text-info font-sans flex;
      }
    }

    .news_txt {
      @apply py-10px font-bold leading-21px;
      white-space: normal;
      /* 允许换行 */
      overflow-wrap: break-word;
      /* 在必要时单词内部断行 */
    }
  }
}

.news_item:hover {
  @apply border-solid border-2px border-warning;
}

.news_item:nth-child(odd) {
  @apply mr-20px;
}
</style>