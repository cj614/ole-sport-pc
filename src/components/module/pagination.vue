<template>
  <div class="m_pagination_warp" :style="{ paddingTop: `${paddingTop}px` }">
    <v-pagination v-show="count > limit" v-model="pageIndex" color="#fff " :length="length" @input="handleInput"
      :total-visible="7"></v-pagination>
  </div>
</template>

<script>
import { scrollToTop } from '@/libs/util'
export default {
  props: {
    page: {
      type: Number,
      default: 1
    },

    paddingTop: {
      type: Number,
      default: 40
    },

    count: {
      type: Number,
      default: 0
    },

    limit: {
      type: Number,
      default: 20
    },

    totalVisible: {
      type: Number,
      default: 7
    }
  },

  data() {
    return {
      pageIndex: 1
    }
  },

  watch: {
    page(v) {
      this.pageIndex = v
    }
  },

  computed: {
    length() {
      return Math.ceil(this.count / this.limit)
    }
  },

  created() {
    this.pageIndex = this.page
  },

  methods: {
    handleInput(page) {
      scrollToTop()
      this.$emit('pageList', page)
    }
  }
}
</script>

<style lang="scss" scoped>
.m_pagination_warp {
  @apply w-full flex justify-center;

  // .v-pagination__item {
  //   @apply h-36px min-w-36px w-36px border-1px border-solid border-hex-e5e5e5 text-14px shadow-none rounded-4px text-secondary;
  // }

  // .v-pagination__navigation {
  //   @apply h-36px min-w-36px w-36px border-1px border-solid border-hex-e5e5e5 text-14px shadow-none rounded-4px text-secondary;
  // }

  .v-pagination__item,
  .v-pagination__navigation {
    background: none !important;
    color: #999999 !important;
    border: 1px solid #303030 !important;
  }

  .notranslate {
    color: #E4CAAB !important;
  }

  .v-pagination__more {
    color: #999999 !important;

  }

  .v-pagination__item--active {
    background: #E4CAAB !important;
    border-color: #E4CAAB !important;
    color: #030303 !important;
  }
}
</style>