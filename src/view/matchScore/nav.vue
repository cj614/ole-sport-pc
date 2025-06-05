<template>
  <v-list class="nav_list">
    <v-list-group class="mav_list_group" v-for="(item, index) in matchTagList" :key="index" :value="navIndex === index"
      @click.native.stop="handleNavClick(item, index)" active-class="mav_list_group_active">
      <template v-slot:activator>
        <v-list-item class="nav_list_item">
          <v-list-item-avatar min-width="24" width="24" min-height="24" height="24">
            <page-pageLoad :src="navIndex === index ? item.imgActive : item.img" min-width="24" width="24"
              min-height="24" height="24"></page-pageLoad>
          </v-list-item-avatar>

          <v-list-item-title class="match_item_title whiteSpace_nowrap">{{ item.text }}</v-list-item-title>
          <div class="match_item_title" v-if="item.count">{{ item.count }}</div>
        </v-list-item>
      </template>

      <v-list-item-group v-model="selectedItems" multiple class="child_list_group no_scrollbar"
        v-scroll.self="onScroll">
        <v-list-item v-for="(child, cIndex) in item.childList" :key="cIndex" class="child_item"
          color="rgba(249, 179, 31, 0.15)" active-class="child_item_active" @click.stop="handleChildClick(child)">
          <v-list-item-avatar min-width="20" width="20"
            v-if="['FOOTBALL', 'BASKETBALL', 'ANCHOR'].includes(item.type) || child.logo" min-height="20" height="20">
            <page-pageLoad :src="child.logo || Img.MatchDefault" min-width="20" width="20" min-height="20" height="20"
              :contain="true"></page-pageLoad>
          </v-list-item-avatar>

          <v-list-item-title class="child_item_title">{{ child.name }}</v-list-item-title>
          <span class="child_item_title" v-if="child.count">{{ child.count }}</span>
        </v-list-item>
        <div class="h-100px leading-100px text-center" v-if="loading">
          <v-progress-circular indeterminate :value="10"></v-progress-circular>
        </div>
        <v-list-item v-if="showTxt" class="no_data_item">{{ showTxt }}</v-list-item>
      </v-list-item-group>
    </v-list-group>
  </v-list>
</template>

<script>
import dayjs from 'dayjs'
import { matchCompetitionList } from '@/api/matchScore'
export default {
  props: {
    params: {
      type: Object,
      default: () => ({
        status: '0',
        start: '',
        end: ''
      })
    },
    countData: {},
    countList: {}
  },

  data() {
    return {
      selectedItems: [],
      navIndex: 0,
      sport_type: 'FOOTBALL',
      competition_ids: [], // 多选
      loading: 'false',
      showTxt: '',
      Img: {
        MatchDefault: require(`@/${this.$img.Page.MatchScore.MatchDefault}`)
      },
      competition: {
        page: 1,
        limit: 20,
        count: 0
      },
      matchTagList: [],
    }
  },

  watch: {
    countData() {
      this.getMatchTagListNow()
    },
    countList() {
      this.matchDairySimpleCount()
    }
  },

  computed: {
    matchTagData() {
      return this.$store.state.app.matchTagList
    },
  },
  mounted() {
    this.matchDairySimpleCount()
    this.matchTagListInit()
  },
  methods: {
    matchTagListInit() {
      let { matchTagData } = this
      let { Match } = this.$img.Page

      let temp = JSON.parse(JSON.stringify(matchTagData))

      Object.keys(this.countList).forEach(key => {
        temp.map(item => {
          if (item.type == key) {
            item.count = temp[key]
          }
        })
      });

      this.matchTagList = temp.map(item => {
        return {
          ...item,
          text: this.$t(`Module['${item.text}']`),
          img: require(`@/${Match[item.type]}`),
          imgActive: require(`@/${Match[`${item.type}_S`]}`),
          childList: [],
          count: 0
        }
      })
      // console.log('matchTagList', this.matchTagList)
    },

    matchDairySimpleCount() {
      // 匹配数据
      Object.keys(this.countList).forEach(key => {
        this.matchTagList.map(item => {
          if (item.type == key) {
            item.count = this.countList[key]
          }
        })
      });
    },
    getMatchTagListNow(data) {
      let { matchTagData } = this
      let count = 0
      let arr = Object.values(data)
      if (arr.length) {
        count = arr.reduce((a, b) => a + b)
      }

      data.ALL = count

      matchTagData.map(item => {
        item.count = data[item.type] || 0
      })
    },
    getMatchTagListBy() {
      this.competition.page = 1
      this.selectedItems = []
      this.getMatchCompetitionList().then(() => {
        this.$emit('getMatchDairy', {
          sport_type: this.sport_type,
          competition_ids: this.competition_ids,
        })
      })
    },

    onScroll(e) {
      let than = e.target
      const condition = than.scrollHeight - than.scrollTop <= than.clientHeight
      if (condition && !this.loading) {
        this.loadMore()
      }
    },

    loadMore() {
      let maxIndex =
        this.competition.count % this.competition.limit === 0
          ? this.competition.count / this.competition.limit
          : Math.ceil(this.competition.count / this.competition.limit)

      if (maxIndex <= this.competition.page) {
        // this.showTxt = '---到底了---'
        return
      }
      this.showTxt = ''
      this.competition.page++
      this.getMatchCompetitionList()
    },

    handleNavClick(item, index) {
      this.navIndex = index
      this.sport_type = item.type
      this.competition.page = 1
      this.selectedItems = []
      this.competition_ids = []
      this.getMatchCompetitionList(item).then(() => {
        this.$emit('getMatchDairy', {
          sport_type: this.sport_type,
          competition_ids: this.competition_ids,
          isChange: true,
          conut: item.count
        })
      })
    },

    handleChildClick(item) {
      // 存在就剔除 不存在就添加
      let id = item.id
      const index = this.competition_ids.indexOf(id);
      if (index !== -1) {
        this.competition_ids.splice(index, 1); // Remove item if found
      } else {
        this.competition_ids.push(id); // Add item if not found
      }

      this.$emit('getMatchDairy', {
        sport_type: this.sport_type,
        competition_ids: this.competition_ids
      })
    },

    async getMatchCompetitionList(item) {
      if (item && item.conut == 0) {
        return
      }

      try {
        this.loading = true
        const {
          competition: { page, limit },
          matchTagList,
          params: { status, start, end }
        } = this
        const params = {
          sport_type: this.sport_type,
          page,
          limit,
          status,
          start:
            start ||
            dayjs(dayjs().format('YYYY-MM-DD 00:00:00')).valueOf() / 1000,
          end:
            end || dayjs(dayjs().format('YYYY-MM-DD 23:59:59')).valueOf() / 1000
        }
        const { Code, Data } = await matchCompetitionList(params)
        if (Code === 200) {
          const { Data: List, Count } = Data
          if (page === 1) {
            matchTagList[this.navIndex].childList = []
          }
          matchTagList[this.navIndex].childList.push(
            ...List.filter(r => r.name)
          )
          this.competition.count = Count
        }
      } catch (error) {
        if (this.competition.page !== 1) {
          this.competition.page--
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav_list {
  @apply py-5px min-h-100px;

  .mav_list_group {
    .v-list-item {
      @apply px-10px;
    }

    .nav_list_item {
      @apply h-50px px-0px;

      .v-list-item__avatar {
        @apply mr-10px;
      }

      .match_item_title {
        @apply font-bold font-kanit max-w-120px;
      }
    }

    .child_list_group {
      @apply max-h-400px min-h-0px overflow-y-auto;

      .child_item {
        @apply h-50px px-20px;

        .child_item_title {
          @apply font-normal text-dark text-12px;
        }
      }

      .no_data_item {
        @apply justify-center text-12px text-info;
      }

      .child_item_active {
        background: rgba(249, 179, 31, 0.15);

        .child_item_title {
          @apply text-12px;
        }
      }

      .child_item_active::after {
        content: '';
        @apply w-6px h-full absolute bg-warning rounded-3px;
        left: 0px;
      }
    }

    .mav_list_group_active {
      @apply bg-warning;

      .match_item_title {
        @apply text-white;
      }

      .v-list-group__header__append-icon {
        .v-icon {
          @apply text-white;
        }
      }
    }
  }

  .v-list-group--active {
    .v-list-group__items {
      @apply border-2px border-solid border-warning;
    }
  }
}
</style>