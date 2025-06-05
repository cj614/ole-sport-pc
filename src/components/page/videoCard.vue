<template>

  <ul class="competition_content">
    <div style="height: 235px;" v-for="(item, index) in List" :key="item + index" @click="handleClickItem(item)">
      <li class="competition_item">
        <page-pageLoad :src="item.img_url" currentClass="rounded-t-10px" width="295" height="171"></page-pageLoad>


        <!-- 卡片 -->
        <div class="footer_lives">
          <div class="live_name" :style="{ maxWidth: '245px' }">{{ item.user_name ||
            item.title }}</div>
          <div class="live_text">
            <img :src="Img.Videoicon" style="width:16px;height:14px;margin-right: 6px;" alt="">
            <span>{{ item.read_num }}</span>
            <img :src="Img.Readicon" style="width:16px;height:14px;margin:0 6px;" alt="">
            <span>{{ item.comment_count }}</span>
          </div>
        </div>

        <slot></slot>
      </li>
    </div>
  </ul>

</template>

<script>
import { timeFormat, timeFormatSJ } from '@/libs/util.js'
export default {
  props: {
    type: {
      type: Number,
      default: 3
    },

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
        Views: require(`@/${this.$img.Page.Home.Views}`),
        LiveTeam: require(`@/${this.$img.Page.Live.LiveLogo}`),
        Liveicon: require(`@/${this.$img.Page.Live.Liveicon}`),
        Readicon: require(`@/${this.$img.Page.Live.Readicon}`),
        Videoicon: require(`@/${this.$img.Page.Live.Videoicon}`),

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
  @apply flex flex-wrap;
  gap: 15px;
  padding: 0 !important;
  cursor: pointer;
  margin-bottom: 10px;

  .competition_item {
    @apply w-295px relative;


    .footer_lives {
      @apply h-61px pt-10px bg-hex-111319 rounded-bl-10px rounded-br-10px;
      flex-direction: column;

      .live_name {
        @apply text-14px text-white text-left;
        margin-left: 10px;
        padding: 2px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .live_text {
        @apply text-14px text-hex-808080 text-left flex align-items;
        margin-top: 10px;
        margin-left: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .competition_item_scale:hover {
    scale: 1.1;
  }

  .competition_noLeft {
    @apply mr-0px;
  }
}

// }</style>
