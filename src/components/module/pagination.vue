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
<style>
.v-pagination__item,
.v-pagination__navigation {
  background: none !important;
  color: #999999 !important;
  border: 1px solid !important;
  border-color: var(--live-nav-button-border) !important;
}

.v-pagination__item--active {
  background: var(--bg-color) !important;
  border-color: var(--bg-color) !important;
  color: #fff !important;
}

.notranslate {
  color: var(--text-color) !important;
}

.v-pagination__more {
  color: #999999 !important;

}
</style>
<style lang="scss" scoped>
.m_pagination_warp {
  @apply w-full flex justify-center;








}
</style>