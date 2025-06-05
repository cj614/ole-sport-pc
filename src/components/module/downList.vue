<template>
  <v-menu
    :close-on-content-click="true"
    @input="handleClick"
    z-index="200"
    content-class="match_menu_com"
    nudge-bottom="60"
    v-model="value"
  >
    <template v-slot:activator="{ on, attrs }">
      <span class="btn_txt" v-bind="attrs" v-on="on">{{ name }}</span>
    </template>

    <template v-if="matchList.length">
      <v-list dense class="match_list_nav" rounded v-scroll.self="onScroll">
        <v-list-item-group v-model="selectedItem" class="match_list_group">
          <v-list-item
            v-for="(item, index) in matchList"
            class="match_item"
            :key="index"
            active-class="match_item_active"
            @click="handleTeamClick(item)"
          >
            <!-- <v-list-item-avatar min-width="20" width="20" min-height="20" height="20">
              <v-img :src="item.logo"></v-img>
            </v-list-item-avatar>-->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item-title class="match_item_title" v-bind="attrs" v-on="on">{{ item.name }}</v-list-item-title>
              </template>
              <span>{{ item.name }}</span>
            </v-tooltip>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </template>
    <template v-else-if="loading && 0">
      <div class="match_list_nav flex justify-center items-center">
        <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
      </div>
    </template>
  </v-menu>
</template>

<script>
import { getCompetitionSportNews } from '@/api/sportNews'
import { getCompetitionSportVideos } from '@/api/sportVideo'

export default {
  props: {
    isVideo: {
      type: Boolean,
      default: false
    },

    column_set_id: {
      type: String,
      default: '0'
    },

    name: {
      type: String,
      default: ''
    },

    index: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      selectedItem: -1,
      matchList: [],
      loading: false,
      hisColumn_set_id: '',
      value: false,
      page: {
        page: 1,
        limit: 50,
        count: 0
      }
    }
  },

  computed: {},

  watch: {
    show(v) {
      alert(v)
    }
  },

  methods: {
    handleClick(bool) {
      if (!bool) {
        this.value = false
        this.selectedItem = -1
      }

      bool && this.$emit('selectMenu')
      this.$nextTick(() => {
        if (bool) {
          this.hisColumn_set_id = this.column_set_id
          this.getCompetitionListBySportType()
        }
      })
    },

    initList() {
      this.hisColumn_set_id = this.column_set_id
      this.getCompetitionListBySportType()
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

    handleTeamClick(item) {
      this.$emit('changeItem', item)
    },

    getCompetitionListBySportType() {
      this.matchList = []
      this.value = false
      if (this.index === 0) {
        return
      }
      if (this.isVideo) {
        this.videoList()
      } else this.newsList()
    },

    async newsList() {
      this.loading = true
      const { Code, Data } = await getCompetitionSportNews({
        column_set_id: this.column_set_id,
        page: this.page.page,
        limit: this.page.limit
      })
      if (Code === 200) {
        const { Data: List, Count } = Data
        this.page.count = Count
        if (this.page.page === 1) {
          this.matchList = List
        } else this.matchList.push(...List)
        if (List.length) {
          this.value = true
        }
      }
      this.loading = false
    },

    async videoList() {
      this.loading = true
      const { Code, Data } = await getCompetitionSportVideos({
        column_set_id: this.column_set_id,
        page: this.page.page,
        limit: this.page.limit
      })
      if (Code === 200) {
        const { Data: List, Count } = Data
        this.page.count = Count
        if (this.page.page === 1) {
          this.matchList = List
        } else this.matchList.push(...List)
        if (List.length) {
          this.value = true
        }
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.match_menu_com {
  @apply bg-lightFirst;
  border-radius: 0px 20px 20px 20px !important;
  border: 2px solid #f9b31f !important;
}
.match_list_nav {
  @apply max-w-1280px max-h-320px overflow-y-auto;
  .match_list_group {
    @apply flex flex-wrap bg-lightFirst;
    .match_item {
      @apply flex-none px-0px m-10px pl-20px w-full;
      margin-bottom: 10px !important;
      width: 232px;
      .match_item_title {
        @apply pr-8px;
      }
    }
    .match_item_active {
      @apply bg-primaryFirst rounded-20px;
      .v-list-item__title {
        @apply font-bold text-14px text-lightFirst;
      }
    }
    .match_item:hover {
      @apply bg-primaryFirst rounded-20px;
      .v-list-item__title {
        @apply font-bold text-14px text-lightFirst;
      }
    }
  }
}
</style>
