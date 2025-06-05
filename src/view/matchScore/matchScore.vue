<template>
  <module-self>
    <div class="m_match_score_wrap">
      <div class="live_adv" v-show="aboveBanner">
        <page-ImgSwiper height="150" typeName="Pc-Livescore above banner"
          @show="(res) => aboveBanner = res"></page-ImgSwiper>
      </div>

      <div dense class="match_score_content">
        <div class="match_nav_list_warp">
          <div class="after"></div>
          <navCom ref="navComRef" :params="params" :countData="countData" :countList="countList"
            @getMatchDairy="getMatchDairy"></navCom>
          <div class="before"></div>
        </div>

        <div class="score_content">
          <search @getNavCom="getNavCom">
            <module-menuList v-if="downList && downList.length && params.sport_type == 'FOOTBALL'" type="odds"
              v-model="currentDown" :selValue="currentDown" :list="setTypeList(downList)"></module-menuList>
          </search>
          <template v-if="listData.length">
            <page-hotRecommended v-for="(item, key) in listData" :sport_type="params.sport_type" type="match" :key="key"
              :match="item"></page-hotRecommended>
            <module-pagination :paddingTop="20" :page="dairy.page" :count="dairy.count" :limit="dairy.limit"
              @pageList="pageList"></module-pagination>
          </template>
          <template v-else>
            <div class="match_empty_loading">
              <module-skeletonCard v-if="loading" :height="510" :width="980" skeleton="match"></module-skeletonCard>
              <page-empty v-else :top="60" :title="$t(`Module['暂无数据']`)"></page-empty>
            </div>
          </template>
        </div>
      </div>
    </div>

    <page-adv left="Pc-Livescore left side banner" right="Pc-Livescore right side banner"></page-adv>
    <page-footeradv footer="Pc-Livescore footer banner"></page-footeradv>
  </module-self>
</template>

<script>
import navCom from './nav.vue'
import search from './search.vue'

import {
  everySimpleMatchScore,
  matchAnchor,
  matchMarket,
  matchDairySimpleCount
} from '@/api/matchScore'

import {
  analysisMatches,
  analysisAnchor,
  analysisMarket,
  analysisMQTTMarketMatches
} from '@/libs/util.js'
export default {
  components: { navCom, search },

  data() {
    return {
      params: {
        sport_type: '',
        status: '0',
        start: '',
        end: '',
        competition_id: ''
      },
      aboveBanner: false,
      listData: [],
      countData: {},
      countList: {},
      loading: false,
      dairy: {
        page: 1,
        limit: 10,
        count: 0
      },
      currentDown: '',
      downList: []
    }
  },

  mounted() {
    this.globalNoticeType()
    this.matchDairySimpleCount()
  },

  destroyed() {
    this.$bus.$off(`ole/global`)
    this.$bus.$off(`subscribeConfirm`)
  },

  watch: {
    currentDown(v) {
      this.listData = this.listData.map(r => ({ ...r, selVal: v }))
    }
  },

  methods: {
    async matchDairySimpleCount(item) {
      const { params } = this
      const { Code, Data } = await matchDairySimpleCount({
        start: params.start,
        end: params.end,
        status: params.status
      })
      if (Code === 200) {
        this.countList = Data
      }
    },
    getMatchDairy(data) {
      const { sport_type, competition_ids, isChange, count } = data
      if (count == 0) {
        //如果一级菜单没有数据则直接返回
        this.loading = false
        return
      }

      const { params } = this
      if (isChange) {
        this.downList = []
        this.currentDown = ''
      }

      params.sport_type = sport_type
      params.competition_ids = competition_ids

      this.getMatchDairyList()
    },

    pageList(page) {
      this.dairy.page = page
      this.getMatchDairyList()
    },

    setTypeList(list) {
      return list.map(l => ({
        text: l,
        label: l === '1 X 2' ? l : this.$t(`Module['${l}']`)
      }))
    },

    async getMatchDairyList() {
      try {
        const { dairy, params } = this
        const { sport_type, start } = params
        if (!start) {
          return
        }
        this.listData = []
        this.loading = true
        const { Data, Code } = await everySimpleMatchScore({
          ...params,
          page: dairy.page,
          limit: dairy.limit
        })
        if (Code === 200) {
          const { Data: competition, Count } = Data
          dairy.count = Count
          let List = competition.MatchList
          let { arr } = analysisMatches(List)
          this.listData = arr
          if (sport_type !== 'ANCHOR') {
            if (!this.downList.length) {
              this.downList =
                this.listData.length > 0
                  ? this.listData[0].downList.length > 0
                    ? this.listData[0].downList
                    : []
                  : []
              if (this.downList.length > 0) {
                this.currentDown = this.downList[0]
              }
            }
          }

          // this.matchAnchor(ids)
          // this.matchMarket(ids)
          for (let key in competition) {
            if (!['AllBetType', 'MatchList'].includes(key)) {
              this.countData[key] = competition[key]
            }
          }

          this.loading = false
        } else this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    matchAnchor2(list) {
      return new Promise((resolve, reject) => {
        let params = list.map(item => {
          return {
            id: item.Matches[0].id,
            sport_type: item.Matches[0].sport_type
          }
        })

        matchAnchor({
          matches: params
        })
          .then(res => {
            let { Code, Data } = res
            if (Code === 200) {
              resolve(Data)
            }
          })
          .catch(() => reject(false))
      })
    },

    matchAnchor(list) {
      matchAnchor({
        matches: list
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          if (Data) {
            analysisAnchor(Data, this)
          }
        }
      })
    },
    matchMarket(list) {
      matchMarket({
        matches: list
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          if (Data) {
            analysisMarket(Data, this)
          }
        }
      })
    },

    getNavCom(data) {
      const { status, start, end } = data
      const { params, dairy } = this

      params.status = status
      params.start = start
      params.end = end

      this.matchDairySimpleCount()
      //
      dairy.page = 1
      this.$nextTick(() => {
        this.$refs.navComRef?.getMatchTagListBy()
      })
    },

    globalNoticeType() {
      this.$bus.$off(`ole/global`)
      this.$bus.$off(`subscribeConfirm`)
      this.$bus.$on(`ole/global`, res => {
        let { notice_type } = res
        if (notice_type === 1 || notice_type === 2) {
          analysisMQTTMarketMatches(res, this)
        } else if (notice_type === 5 || notice_type === 6) {
          let ids = []
          this.listData.forEach(item => {
            item.list.forEach(matches => {
              ids.push({
                id: matches.id,
                sport_type: matches.sportType
              })
            })
          })
          this.matchAnchor(ids)
        }
      })
      this.$bus.$on(`subscribeConfirm`, res => {
        let { id, sport_type, status } = res
        let { listData } = this
        listData.forEach((item, key) => {
          item.list.forEach((matches, index) => {
            if (matches.id === id && matches.sportType === sport_type) {
              this.$set(listData[key].list[index], 'status', status)
            }
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.m_match_score_wrap {
  @apply pt-20px pb-40px;

  .live_adv {
    @apply pb-20px;

    .v-image {
      @apply rounded-10px;
    }
  }

  .match_score_content {
    @apply flex;

    .match_nav_list_warp {
      @apply mr-20px rounded-10px w-240px;

      .after {
        @apply h-10px w-240px rounded-tl-10px rounded-tr-10px bg-warning;
      }

      .before {
        @apply h-10px w-240px rounded-bl-10px rounded-br-10px bg-warning;
      }
    }

    .score_content {
      @apply w-full flex flex-col overflow-hidden;

      .match_empty_loading {
        @apply flex-row h-550px bg-lightFirst items-center justify-center rounded-10px p-20px;
      }
    }
  }
}
</style>
