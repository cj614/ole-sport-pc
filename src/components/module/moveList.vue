<template>
  <v-menu
    @input="handleClick"
    offset-y
    :nudge-left="10"
    :nudge-bottom="19"
    :close-on-content-click="true"
    content-class="move_match_menu_live"
    z-index="200"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        size="16"
        v-bind="attrs"
        v-on="on"
        color="#F9B31F"
      >{{showColor?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
    </template>

    <div class="move_match_warp_live">
      <template v-for="(item,index) in matchTagList">
        <div :key="index" class="move_match_col">
          <ul class="move_match_list">
            <li
              v-for="(match,i) in item"
              :key="i"
              class="move_item"
              :class="{move_item_active:activeIndex===match.id}"
              @click.stop="handleItemClick(match,index)"
            >
              <div>
                <span>
                  <v-img
                    :src="activeIndex===match.id?match.imgActive:match.img"
                    width="24"
                    height="24"
                  ></v-img>
                </span>
              </div>

              <div class="match_txt_">
                <div class="match_txt">{{match.text}}</div>
                <!-- <v-icon size="16">{{activeIndex===match.id?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon> -->
              </div>
              <div
                :class="match.type ===row.type && page.count?'match_count_on':'match_count_no'"
                class="match_count"
              >{{match.type ===row.type?page.count:''}}</div>
            </li>
          </ul>

          <ul
            class="move_match_item_list"
            v-if="loadIndex===index && (list || []).length"
            id="moveMatch"
            v-scroll.self="onScroll"
          >
            <!-- <li class="match_item">全部</li> -->
            <li
              class="match_item"
              v-for="(child,index) in (list || [])"
              :key="index"
            >{{child.i18n_league}}</li>
          </ul>
        </div>
      </template>
    </div>
  </v-menu>
</template>

<script>
import { getCompetitionListBySportType } from '@/api/live'

export default {
  props: {},

  data() {
    return {
      activeIndex: -1,
      loadIndex: -1,
      showColor: false,
      row: {},
      list: [],
      page: {
        page: 1,
        limit: 20,
        count: 0
      }
    }
  },

  mounted() {
    this.getCompetitionListBySportType()
  },

  computed: {
    matchTagData() {
      return this.$store.state.app.matchTagList
    },

    matchTagList() {
      let { matchTagData } = this
      let { Match } = this.$img.Page

      let NowList = matchTagData.slice(5, 99)
      let data = {}

      let tempArr = NowList.map((item, id) => {
        return {
          ...item,
          id,
          text: this.$t(`Module['${item.text}']`),
          img: require(`@/${Match[item.type]}`),
          imgActive: require(`@/${Match[`${item.type}_S`]}`)
        }
      })

      let num = 0
      let key = 1
      for (let tm of tempArr) {
        if (num == 0) {
          data[key] = [tm]
        } else {
          data[key].push(tm)
        }
        if (num === 2) {
          num = 0
          key++
        } else num++
      }

      return Object.values(data)
    }
  },

  methods: {
    handleItemClick(item, index) {
      this.activeIndex = item.id
      this.page.page = 1
      this.page.count = 0
      this.row = item
      this.getCompetitionListBySportType(index)
    },

    async getCompetitionListBySportType(index) {
      if (!this.row.type) {
        return
      }
      try {
        const { Code, Data } = await getCompetitionListBySportType({
          sport_type: this.row.type,
          page: this.page.page,
          limit: this.page.limit
        })
        if (Code === 200) {
          const { Data: List, Count } = Data
          if (index !== undefined) {
            this.list = List
          } else this.list.push(...List)

          this.page.count = Count
          if (index !== undefined) {
            this.loadIndex = index
          }
        }
      } catch (error) {
        this.list = []
        if (index !== undefined) {
          this.loadIndex = -1
        }
      }
    },

    onScroll(e) {
      let than = e.target
      const condition = than.scrollHeight - than.scrollTop <= than.clientHeight
      if (condition) {
        this.loadMore()
      }
    },

    loadMore() {
      //容错
      let maxIndex =
        this.page.count % this.page.limit === 0
          ? this.page.count / this.page.limit
          : Math.floor(this.page.count / this.page.limit)
      if (maxIndex <= this.page.page) {
        return
      }
      this.page.page++
      this.getCompetitionListBySportType()
    },

    handleClick(bool) {
      this.showColor = bool
      bool && this.$emit('selectMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.move_match_menu_live {
  @apply w-600px bg-lightFirst;
  border-radius: 0px 20px 20px 20px !important;
  border: 2px solid #f9b31f !important;
}

.move_match_warp_live {
  @apply py-10px;
  .move_match_col {
    @apply my-20px;
    .move_match_list {
      @apply pl-0px px-10px flex flex-wrap items-center;
      .move_item {
        @apply px-16px py-8px flex items-center justify-between h-40px cursor-pointer mr-20px;
        width: calc(33.3333% - 20px);
        .match_txt_ {
          @apply flex items-center mx-8px;
          .match_txt {
            @apply font-normal text-dark text-14px max-w-70px;
            white-space: nowrap; /* 确保文本在一行内显示 */
            overflow: hidden; /* 隐藏溢出的内容 */
            text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
          }
        }

        .match_count {
          @apply flex items-center p-4px min-w-18px min-h-18px font-sans font-bold  rounded-5px text-secondary text-12px;
        }
        .match_count_on {
          @apply bg-tertiary;
        }
      }
      .move_item_active,
      .move_item:hover {
        @apply bg-warning rounded-20px;
        .match_txt_ {
          .match_txt {
            @apply text-lightFirst;
          }
        }
      }
    }

    .move_match_item_content {
      @apply overflow-y-auto;
    }
    .move_match_item_list {
      @apply pl-0px  h-110px py-10px flex flex-wrap  bg-primaryFirst  mt-20px overflow-auto;
      .match_item {
        @apply h-40px leading-40px px-20px text-lightFirst text-16px font-normal  cursor-pointer;
        width: calc(33.3333% - 0px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .match_item:hover,
      .match_item_active {
        @apply text-warning;
      }
    }
  }
}
</style>