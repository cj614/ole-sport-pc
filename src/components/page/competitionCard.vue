<template>
  <!--   @apply mb-30px; -->
  <ul class="competition_content !pl-0px ">
    <li v-for="(item, index) in List" :key="item + index" @click="handleClickItem(item)" style="position: relative;">
      <template>
        <page-pageLoad :src="item.bg_img" currentClass="rounded-t-10px" width="325" height="171"></page-pageLoad>
        <page-pageLoad class="videoPlay" :src="Img.VideoPlay" width="60" height="60" :contain="true"></page-pageLoad>
      </template>


      <div class="footer_subtitle">
        <div class="actions_right">
          <span class="mr-2px">
            <v-img :src="Img.Fire" width="14" height="18"></v-img>
          </span>
          <span class="count_">{{ item.view_num }}</span>
        </div>
        <div class="subtitle">{{ timeFormat(item.created_utc_timestamp) }}</div>

      </div>
    </li>
  </ul>
</template>

<script>
import { timeFormat, timeFormatSJ } from '@/libs/util.js'
export default {
  props: {


    Anchor: {
      type: Boolean,
      default: false
    },

    showMr: {
      type: Boolean,
      default: true
    },

    hasScale: {
      type: Boolean,
      default: true
    },

    isVideo: {
      type: Boolean,
      default: false
    },

    List: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Lottie: {
        Line: require(`@/${this.$lottie.Live.Line}`)
      },

      Img: {
        Fire: require(`@/${this.$img.Page.Live.Fire}`),
        LiveTeam: require(`@/${this.$img.Page.Live.LiveLogo}`),
        VideoPlay: require(`@/${this.$img.Page.News.VideoPlay}`)
      }
    }
  },

  methods: {
    handleClickItem(item) {
      this.$emit('handleClickItem', item)
    },
    timeFormat(date) {
      return timeFormat(date * 1000)
    },
    timeFormatSJ(date) {
      return timeFormatSJ(date * 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.competition_content {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .videoPlay {
    position: absolute;
    top: 60px;
    left: 130px;
  }

  .footer_subtitle {
    @apply flex items-center h-61px p-10px rounded-bl-10px rounded-br-10px;
    background: #111319;
    justify-content: space-between;
    color: #999999;

    .subtitle {
      @apply text-14px;
      padding: 5px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .actions_right {
      @apply flex items-center ml-10px;

      .count_ {
        @apply font-sans;
      }
    }
  }

}
</style>
