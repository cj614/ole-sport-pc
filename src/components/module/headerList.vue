<template>
  <div class="ole_match_header">
    <div class="match_content">
      <v-slide-group class="match_list">
        <v-slide-item
          v-for="(item, index) in list"
          @change="handleSelectSport(item,index)"
          class="match_item"
          :key="index"
          :class="{ match_item_active: matchIndex === index }"
          v-slot="{ active, toggle }"
        >
          <div class="match_btn" @click="toggle">
            <module-downList
              ref="DownList"
              :name="item.name"
              :showColor="matchIndex === index"
              :index="index"
              @selectMenu="handleSelectSport2(item, index)"
              @changeItem="changeItem"
              :isVideo="isVideo"
              :column_set_id="column_set_id"
            ></module-downList>
          </div>
        </v-slide-item>
      </v-slide-group>

      <div class="move_btn" v-if="move">
        <span class="move_txt">{{$t(`Module['更多']`)}}</span>
        <module-moveList :showColor="true"></module-moveList>
      </div>
    </div>
  </div>
</template>

<script>
import { getColumnList } from '@/api/global'
export default {
  props: {
    page: {
      type: Object,
      default: () => ({})
    },

    isCount: {
      type: Boolean,
      default: false
    },

    isVideo: {
      type: Boolean,
      default: false
    },

    move: {
      type: Boolean,
      default: false
    },
    isIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      matchIndex: 0,
      column_set_id: '0',
      list: []
    }
  },

  mounted() {
    if (this.isVideo) {
      this.getVideoColumnList()
    } else this.getColumnList()
  },

  methods: {
    handleSelectSport(item, index) {
      // this.matchIndex = index
      // this.column_set_id = String(item.id)
      // this.$emit('handleClickSetId', { column_set_id: this.column_set_id })
      // if (index !== 0) {
      //   this.$nextTick(() => {
      //     this.$refs.DownList[index].initList()
      //   })
      // }
    },

    handleSelectSport2(item, index) {
      this.matchIndex = index
      this.column_set_id = String(item.id)
      this.$emit('handleClickSetId', { column_set_id: this.column_set_id })
    },

    changeItem(item) {
      this.$emit('handleClickCompetition', {
        column_set_id: this.column_set_id,
        competition: item.name
      })
    },

    async getVideoColumnList() {
      const { Code, Data } = await getColumnList({ name: 'video' })
      if (Code === 200) {
        Data.unshift({
          id: 0,
          name: this.$t(`Module['全部']`)
        })
        this.list = Data
      }
    },

    async getColumnList() {
      const { Code, Data } = await getColumnList({ name: 'news' })
      if (Code === 200) {
        Data.unshift({
          id: 0,
          name: this.$t(`Module['全部']`)
        })
        this.list = Data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ole_match_header {
  @apply h-80px flex justify-center items-center bg-lightFirst;
  .match_content {
    @apply flex items-center justify-between w-1280px relative;
    .match_list {
      @apply pl-0px flex;
      .match_item {
        @apply h-80px flex justify-center items-center mr-40px  cursor-pointer relative;
        .btn_txt {
          @apply text-16px font-normal text-dark;
        }
        .match_count {
          @apply flex items-center justify-center p-4px min-w-18px min-h-18px font-sans font-bold rounded-5px text-secondary text-12px;
        }
        .match_count_on {
          @apply bg-tertiary;
        }
      }
      .match_item:hover,
      .match_item_active {
        @apply rounded-20px;
        .btn_txt {
          @apply text-warning text-20px font-bold;
        }
      }
      .match_item_active::after {
        content: '';
        @apply h-6px absolute bottom-10px left-0px w-full rounded-10px bg-warning;
      }
    }

    .move_btn {
      .move_txt {
        @apply mr-5px font-normal text-16px text-dark;
      }
    }
  }
}
</style>
