<template>
  <div class="score_date_search">
    <v-slide-group show-arrows v-model="slideIndex" mandatory @change="handleSlideChange">
      <v-slide-item
          v-for="(item,index) in dateList"
          active-class="slide_date_active"
          :key="index"
          v-slot="{ active, toggle }"
      >
        <div class="date_content" :input-value="active" @click="toggle">
          <div class="time_txt">{{ item.monthTextNum }}</div>
          <div class="time_txt_week mt-2px">{{ item.weekTextZh }}</div>
        </div>
      </v-slide-item>
      <template v-slot:next>
        <div class="score_page">
          <div class="page_item">
            <v-icon>mdi-chevron-right</v-icon>
          </div>
        </div>
      </template>
      <template v-slot:prev>
        <div class="score_page">
          <div class="page_item">
            <v-icon>mdi-chevron-left</v-icon>
          </div>
        </div>
      </template>
    </v-slide-group>
    <div class="search_other">
      <div class="date_txt">{{ dateTxt.monthText }}, {{ dateTxt.yearTxt }}</div>
      <div class="menu_list">
        <div
            class="item_1"
            :class="{item_1_active:statusIndex===index}"
            v-for="(item,index) in searchStatus"
            @click="handleStatusClick(item,index)"
            :key="index"
        >
          <span>
            <v-img :src="statusIndex===index?item.activeIcon:item.icon" height="20px" width="20px"></v-img>
          </span>
          <span class="status_txt">{{ item.name }}</span>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {weekName} from '@/libs/enumerate'

export default {
  data() {
    return {
      statusIndex: 0,
      slideIndex: 7,
      items: ['00'],
      dateList: []
    }
  },

  computed: {
    searchStatus() {
      const {
        videoBlack,
        AllBlack,
        // MicroBlack,
        TimeBlack,
        videoWhite,
        AllWhite,
        // MicroWhite,
        TimeWhite,
        FTBlock,
        FTWhite
      } = this.$img.Page.MatchScore
      return [
        {
          name: this.$t(`Module['全部']`),
          value: '0',
          icon: require(`@/${AllBlack}`),
          activeIcon: require(`@/${AllWhite}`)
        },
        {
          name: this.$t(`Module['直播中']`),
          value: '1',
          icon: require(`@/${videoBlack}`),
          activeIcon: require(`@/${videoWhite}`)
        },
        {
          name: this.$t(`Module['未开赛']`),
          value: '2',
          icon: require(`@/${TimeBlack}`),
          activeIcon: require(`@/${TimeWhite}`)
        },
        {
          name: this.$t(`Module['完场']`),
          value: '3',
          icon: require(`@/${FTBlock}`),
          activeIcon: require(`@/${FTWhite}`)
        },
        {
          name: this.$t(`Module['关注']`),
          value: '4',
          icon: require(`@/${this.$img.Page.Live.Subscribe}`),
          activeIcon: require(`@/${this.$img.Page.Live.SubscribeSuccess}`)
        }
      ]
    },

    prefix() {
      return JSON.parse(this.$store.state.app.localConfig).prefix || ''
    },

    dateTxt() {
      return this.dateList[this.slideIndex] || {}
    }
  },

  mounted() {
    this.setDataList()
    this.handleSlideChange()
  },

  methods: {
    setDataList() {
      let nowDate = dayjs()
      let beforeDateList = []
      let afterDateList = []
      for (let i = 1; i < 8; i++) {
        beforeDateList.push(nowDate.subtract(i, 'd').format('YYYY-MM-DD'))
      }
      for (let i = 1; i < 31; i++) {
        afterDateList.push(nowDate.add(i, 'd').format('YYYY-MM-DD'))
      }
      let dateList = [
        ...beforeDateList.reverse(),
        nowDate.format('YYYY-MM-DD'),
        ...afterDateList
      ]
      this.dateList = dateList.map(item => {
        return {
          start:
              dayjs(dayjs(item).format('YYYY-MM-DD 00:00:00')).valueOf() / 1000,
          end:
              dayjs(dayjs(item).format('YYYY-MM-DD 23:59:59')).valueOf() / 1000,
          monthText: `${dayjs(item).format('MMM DD')}`,
          monthTextNum: `${dayjs(item).format('MM-DD')}`,
          weekText: `${dayjs(item).format('ddd')}`,
          yearTxt: `${dayjs(item).format('YYYY')}`,
          weekTextZh:
              this.prefix === 'CN'
                  ? weekName[`${dayjs(item).format('ddd')}`]
                  : dayjs(item).format('ddd')
        }
      })
    },

    handleSlideChange() {
      const {start, end} = this.dateTxt
      const {statusIndex} = this
      this.$emit('getNavCom', {start, end, status: statusIndex})
    },

    handleStatusClick(item, index) {
      this.statusIndex = index
      this.handleSlideChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.score_date_search {
  @apply h-110px w-full bg-lightFirst mb-20px rounded-10px;
  .v-item-group {
    @apply px-6px;
  }

  .date_content {
    @apply h-50px w-100px flex flex-col items-center justify-center mx-0px;
    .time_txt {
      @apply text-14px text-info  font-bold font-sans leading-16px;
    }

    .time_txt_week {
      @apply text-12px text-info leading-18px;
    }
  }

  .slide_date_active {
    background-color: rgba(249, 179, 31, 0.15);
    @apply border-b-4px border-solid border-warning;
    .time_txt {
      @apply text-warning;
    }

    .time_txt_week {
      @apply text-warning;
    }
  }

  .score_page {
    @apply h-50px w-100px flex items-center justify-center;
    .page_item {
      @apply w-24px h-24px  bg-hex-F9B31F15 rounded-4px flex items-center justify-center cursor-pointer;
      .v-icon {
        @apply text-warning;
      }
    }

    .page_item:hover {
      background: rgba(249, 179, 31) !important;

      .v-icon {
        @apply text-lightFirst;
      }
    }
  }

  .search_other {
    @apply h-60px border-t-1px border-r-secondary border-solid px-20px flex items-center justify-between;
    .date_txt {
      @apply text-20px font-bold font-sans text-dark relative ml-16px;
    }

    .date_txt::after {
      content: '';
      @apply w-6px h-30px absolute  bg-warning rounded-3px;
      left: -16px;
      top: -5px;
    }

    .menu_list {
      @apply flex items-center;
      .item_1 {
        @apply flex items-center px-20px h-33px mr-10px cursor-pointer text-dark;
        .status_txt {
          @apply ml-10px text-dark text-14px;
        }
      }

      .item_1_active {
        @apply text-lightFirst rounded-20px bg-warning;
        .status_txt {
          @apply text-lightFirst;
        }
      }
    }
  }
}
</style>