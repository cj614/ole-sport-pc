<template>
  <v-menu
    content-class="m_other_down_warp"
    transition="scale-transition"
    offset-x
    v-model="value"
    :nudge-left="width"
    :nudge-bottom="40"
    :close-on-content-click="false"
    :rounded="rounded"
    :z-index="zIndex"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="other_down_btn_box" v-bind="attrs" v-on="on" v-if="type === 'admin'">
        <v-icon color="primaryFirst">mdi-dots-horizontal</v-icon>
      </div>
    </template>

    <ul class="other_down_list">
      <li
        v-for="(item, index) in list"
        @click="handleDownClick(item, index)"
        :class="[
          'other_down_item',
          { other_down_item_active: activeIndex === index }
        ]"
        :key="index"
        :style="{
          width: width + 'px',
          height: height + 'px'
        }"
      >{{ item.label }}</li>
    </ul>
  </v-menu>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'admin'
    },
    item: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    },

    rounded: {
      type: String,
      default: '0px 20px 20px 20px'
    },

    zIndex: {
      type: Number,
      default: 19
    },

    width: {
      type: String,
      default: '150'
    },
    height: {
      type: String,
      default: '50'
    },
    selValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeIndex: -1,
      value: false
    }
  },

  watch: {
    selValue: {
      handler() {
        let index = this.list.findIndex(f => f.text === this.selValue)
        this.activeIndex = index
      },
      immediate: true
    }
  },

  methods: {
    handleDownClick(row, index) {
      this.activeIndex = index
      this.value = false
      this.$emit('input', row.text)
      this.$emit('activeMenuItem', row, this.item, this.index)
    }
  }
}
</script>

<style lang="scss" scoped>
.m_other_down_warp {
  border-radius: 20px 0px 20px 20px !important;

  .other_down_list {
    @apply flex flex-col pl-0px py-10px max-h-600px overflow-y-auto bg-white;
    .other_down_item {
      @apply flex items-center justify-center font-bold cursor-pointer;
    }
    .other_down_item:hover,
    .other_down_item_active {
      background: rgba(249, 179, 31, 0.15);
    }
  }
}
.odds_down_btn_box {
  @apply flex items-center justify-center min-w-110px h-37px px-15px rounded-23px border-1px border-solid border-warning text-warning;
  .text {
  }
}
</style>
