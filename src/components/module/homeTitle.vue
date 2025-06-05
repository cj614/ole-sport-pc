<template>
  <div class="home-tit" v-if="type == 1">
    <div>
      <v-img :src="homeImg" width="24" height="24"></v-img>
    </div>
    <span class="title_name">{{ title }}</span>
  </div>

  <div class="home-tit-2" v-else>
    <div class="tit-left">
      <div class="home-tit">
        <div>
          <v-img :src="homeImg" width="24" height="24"></v-img>
        </div>
        <span>{{ title }}</span>
      </div>
      <div class="month_sel_warp" v-if="title === $t(`Page['赛事比分']`)">
        <v-icon :color="pre ? '#F9B31F' : '#cccccc'" @click="previousDate">mdi-chevron-left</v-icon>
        <div class="month_content">
          <span class="title_mon">{{ getMatchDate }}</span>
          <v-menu
            content-class="m_date_down_warp no_scrollbar"
            transition="scale-transition"
            offset-x
            v-model="value"
            :nudge-left="150"
            :nudge-bottom="0"
            :close-on-content-click="false"
            :z-index="50"
          >
            <template v-slot:activator="{ on, attrs }">
              <!-- <v-icon v-bind="attrs" v-on="on" color="dark">mdi-calendar-month-outline</v-icon> -->
              <span v-bind="attrs" v-on="on">
                <page-pageLoad :src="Img.HomeWeek" width="16" height="16"></page-pageLoad>
              </span>
            </template>

            <ul class="other_down_list">
              <li
                v-for="(item, index) in dateList"
                @click="handleChange(item, index)"
                :class="[
                  'other_down_item',
                  { other_down_item_active: activeIndex === index }
                ]"
                :key="index"
                :style="{
                  width: 150 + 'px',
                  height: 36 + 'px'
                }"
              >{{ item.text }}</li>
            </ul>
          </v-menu>
        </div>
        <v-icon :color="next ? '#F9B31F' : '#cccccc'" @click="nextDate">mdi-chevron-right</v-icon>
      </div>
    </div>
    <div class="tit-right" @click="handleMove">
      <span class="right-txt">{{$t(`Module['更多']`)}}</span>
      <div>
        <v-img :src="Img.LeftLink" width="20" height="20"></v-img>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '2'
    },

    iconName: {
      type: String,
      default: ''
    },

    title: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      Img: {
        LeftLink: require(`@/${this.$img.Page.Home.LeftLink}`),
        topAnchor: require(`@/${this.$img.Page.Home.topAnchor}`),
        topMoment: require(`@/${this.$img.Page.Home.topMoment}`),
        toNews: require(`@/${this.$img.Page.Home.toNews}`),
        topScore: require(`@/${this.$img.Page.Home.topScore}`),
        topVideo: require(`@/${this.$img.Page.Home.topVideo}`),
        topAnchorSchedule: require(`@/${this.$img.Page.Home.topAnchorSchedule}`),
        topLiving: require(`@/${this.$img.Page.Home.topLiving}`),
        HomeWeek: require(`@/${this.$img.Page.Home.HomeWeek}`)
      },
      activeIndex: -1,
      value: false,
      next: true,
      pre: true,
      matchDate: ''
    }
  },

  mounted() {
    this.matchDate = this.$date().format('YYYY-MM-DD')
    this.activeIndex = 7
    this.change()
  },

  computed: {
    homeImg() {
      let img = ''
      const { Img, iconName } = this
      switch (iconName) {
        case 'topLiving':
          img = Img.topLiving
          break
        case 'topMoment':
          img = Img.topMoment
          break
        case 'topScore':
          img = Img.topScore
          break
        case 'topAnchor':
          img = Img.topAnchor
          break
        case 'toNews':
          img = Img.toNews
          break
        case 'topVideo':
          img = Img.topVideo
          break
        case 'topAnchorSchedule':
          img = Img.topAnchorSchedule
          break
      }
      return img
    },

    dateList() {
      let dayjs = this.$date
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
      let list = dateList.map(item => {
        return {
          text: `${dayjs(item).format('MMM DD,YY')}`,
          value: item
        }
      })

      return list
    },

    getMatchDate() {
      return this.$date(this.matchDate).format('MMM DD,YY')
    }
  },

  methods: {
    handleMove() {
      let path = ''
      const { iconName } = this
      switch (iconName) {
        case 'topMoment':
          path = 'live'
          break
        case 'topScore':
          path = 'matchScore'
          break
        case 'topAnchor':
          path = 'live'
          break
        case 'toNews':
          path = 'sportNews'
          break
        case 'topVideo':
          path = 'sportVideo'
          break
      }
      this.$router.push({ name: path })
    },

    change() {
      let start =
        this.$date(
          this.$date(this.matchDate).format('YYYY-MM-DD 00:00:00')
        ).valueOf() / 1000

      let end =
        this.$date(
          this.$date(this.matchDate).format('YYYY-MM-DD 23:59:59')
        ).valueOf() / 1000
      const { dateList } = this
      let len = dateList.length - 1
      if (dateList[len].value === this.matchDate) {
        this.next = false
        this.pre = true
      } else if (dateList[0].value === this.matchDate) {
        this.next = true
        this.pre = false
      } else {
        this.next = true
        this.pre = true
      }

      this.$emit('change', { start, end })
    },
    handleChange(v, index) {
      this.activeIndex = index
      this.matchDate = v.value
      this.value = false
      this.change()
    },

    previousDate() {
      if (!this.pre) {
        return
      }
      this.matchDate = this.$date(this.matchDate)
        .subtract(1, 'day')
        .format('YYYY-MM-DD')
      this.activeIndex--
      this.change()
    },

    nextDate() {
      if (!this.next) {
        return
      }
      this.matchDate = this.$date(this.matchDate)
        .add(1, 'day')
        .format('YYYY-MM-DD')
      this.activeIndex++
      this.change()
    }
  }
}
</script>

<style lang="scss" scoped>
.home-tit {
  @apply flex items-center mb-14px;
  span {
    @apply text-20px font-bold text-dark ml-10px;
  }
}
.home-tit-2 {
  @apply flex justify-between items-center mb-14px h-30px;
  .tit-left {
    @apply flex;
    .home-tit {
      @apply mb-0px;
    }
    .month_sel_warp {
      @apply ml-20px flex items-center h-36px w-179px justify-center rounded-10px bg-lightFirst;
      .month_content {
        @apply flex items-center justify-between px-5px;
        .title_mon {
          @apply text-12px px-6px;
        }
      }
      .v-icon {
        cursor: pointer;
      }
    }
  }

  .tit-right {
    @apply flex items-center cursor-pointer;
    .right-txt {
      @apply text-14px font-normal text-dark mr-5px;
    }
  }
}
.m_date_down_warp {
  border-radius: 20px 0px 20px 20px !important ;
  height: 560px;
  .other_down_list {
    @apply flex flex-col pl-0px py-10px overflow-y-auto bg-white px-20px;
    .other_down_item {
      @apply flex items-center justify-center font-bold cursor-pointer text-12px rounded-10px mb-5px;
    }
    .other_down_item:hover,
    .other_down_item_active {
      @apply bg-warning text-lightFirst;
    }
  }
}
</style>
