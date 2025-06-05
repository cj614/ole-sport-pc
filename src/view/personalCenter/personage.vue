<template>
  <div class="personage_warp">
    <p class="item_h_title">{{ $t(`Page['我的预约']`) }}</p>

    <template v-if="listData.length">
      <div class="list">
        <div class="item" v-for="(item, index) in listData" :key="index">
          <sub-match-card :item="item"></sub-match-card>
        </div>
      </div>
      <module-pagination :paddingTop="20" :page="page.page" :count="page.count" :limit="page.limit"
        @pageList="pageList"></module-pagination>
    </template>
    <template v-else>
      <div class="w-full h-100 flex items-center justify-center">
        <v-progress-circular v-if="loading" indeterminate color="primary" size="24"></v-progress-circular>
        <page-empty v-else type="user" :title="$t(`Module['暂无预约']`)"></page-empty>
      </div>
    </template>
  </div>
</template>

<script>
import { mySubscribe, myAnchorSubscribe } from '@/api/live'
import { setStartM, setScores, formatTimestampDayAndTime } from '@/libs/util.js'
// import search from "@/view/matchScore/search.vue";
import ScheduleCard from "_c/page/scheduleCard.vue";
import { SwiperSlide } from "vue-awesome-swiper";
import SubMatchCard from "_c/match/subMatchCard.vue";

export default {
  components: { SubMatchCard, SwiperSlide, ScheduleCard },
  computed: {
    search() {
      return search
    }
  },
  data() {
    return {
      listData: [],
      loading: false,
      page: {
        page: 1,
        limit: 5,
        count: 0
      }
    }
  },
  mounted() {
    this.mySubscribe()
  },

  methods: {
    pageList(page) {
      this.page.page = page
      this.mySubscribe()
    },

    subSuccess() {
      this.page.page = 1
      this.mySubscribe()
    },

    async mySubscribe() {
      this.loading = true
      const { page, limit } = this.page
      const { Code, Data: resData } = await mySubscribe({ page, limit })
      if (Code === 200) {
        const { Data, Count } = resData
        this.page.count = Count

        var beforeItemDay = ""; // 用于保存前一个日期，避免重复添加日期标签
        for (var i = 0; i < Data.length; i++) {
          var _format = formatTimestampDayAndTime(Data[i].match_time * 1000);
          var day = _format.day;
          var time = _format.time;
          Data[i].day = day;
          Data[i].time = time;

          if (day != beforeItemDay) {
            Data[i].label = day;
            beforeItemDay = day;
          }

          Data[i].is_sub = true;
          this.listData.push(Data[i]);
        }

      }
      this.loading = false
    },

    mySubscribeAnchorList(list) {
      myAnchorSubscribe({
        matches: list
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          if (Data) {
            let anchorList = Object.keys(Data).map(item => {
              return {
                key: item,
                ...Data[item]
              }
            })
            anchorList.forEach(anchor => {
              let diff = anchor.key.split('-')
              this.listData.forEach(item => {
                if (item.id == diff[0]) {
                  item.anchorList.push(anchor)
                } else if (item.liveId == diff[0]) {
                  item.anchorList.push(anchor)
                }
              })
            })
          }
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.personage_warp {
  @apply w-full;
}

.list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;

  .item {
    border-radius: 10px;
  }
}
</style>
