<template>
  <div class="empty_warp" :style="{ marginTop: top + 'px' }">
    <span>
      <v-img :src="imgSrc" height="200" width="300"></v-img>
    </span>
    <span class="empty_title" :class="isDark ? 'text-dark empty_dark' : 'text-info empty_info'">{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    top: {
      type: [Number, String],
      default: 120
    },

    type: {
      type: String,
      default: 'default'
    },

    title: {
      type: String,
      default: ''
    },

    isDark: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {}
  },

  computed: {
    imgSrc() {
      let src = ''
      const {
        Empty,
        EmptyTable,
        EmptyLive,
        EmptyMatchLive,
        EmptyMessage,
        EmptySearch,
        EmptyRoom,
        EmptyTeam,
        EmptyVideo
      } = this.$img.Page.Empty
      switch (this.type) {
        case 'default':
          src = require(`@/${EmptyTable}`)
          break
        case 'user':
          src = require(`@/${Empty}`)
          break
        case 'live':
          src = require(`@/${EmptyLive}`)
          break
        case 'matchLive':
          src = require(`@/${EmptyMatchLive}`)
          break
        case 'table':
          src = require(`@/${EmptyTable}`)
          break
        case 'video':
          src = require(`@/${EmptyVideo}`)
          break
        case 'message':
          src = require(`@/${EmptyMessage}`)
          break
        case 'search':
          src = require(`@/${EmptySearch}`)
          break
        case 'room':
          src = require(`@/${EmptyRoom}`)
          break
        case 'team':
          src = require(`@/${EmptyTeam}`)
          break
      }
      return src
    }
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
.empty_warp {
  @apply w-full flex flex-col justify-center items-center;

  .empty_title {
    @apply text-16px font-normal;
  }

  .empty_dark {
    @apply leading-21px;
    color: #fff;
    padding-top: 15px;
  }

  .empty_info {
    @apply leading-24px;

  }
}
</style>