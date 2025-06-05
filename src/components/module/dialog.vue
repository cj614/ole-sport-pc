<template>
  <v-dialog transition="dialog-bottom-transition" :hide-overlay="hideOverlay" v-model="dialog" :width="width"
    :origin="origin" @update:return-value="onDialogClosed" :persistent="true">
    <div class="m_dialog_warp">
      <div class="dialog_header" v-if="hideHeader">
        <span class="dialog_title">{{ title || $t(`Module['提示']`) }}</span>
        <v-btn icon color="#fff" class="dialog_close" v-if="isClose" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <span v-else></span>
      </div>
      <div class="dialog_content">
        <slot name="content"></slot>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },

    isClose: {
      type: Boolean,
      default: true
    },

    hideHeader: {
      type: Boolean,
      default: true
    },

    hideOverlay: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: ''
    },

    origin: {
      type: String,
      default: 'center center'
    },

    width: {
      type: [Number, String],
      default: 400
    }
  },
  watch: {
    dialog(old, newdata) {
      console.log("old", old, newdata)
      this.dialog = old
    }
  },
  data() {
    return {
      dialogs: false
    }
  },
  mounted() {

  },
  methods: {
    onDialogClosed(isDialogClosed) {
      console.log("isDialogClosed", isDialogClosed)
      if (isDialogClosed) {
        console.log("isDialogClosed", isDialogClosed)

        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_dialog_warp {
  @apply flex-col w-full z-100;

  .dialog_header {
    @apply flex justify-center items-center h-40px rounded-tl-20px rounded-tr-20px relative;
    background: #25262E;

    .dialog_title {
      @apply text-16px font-bold text-lightFirst;
    }

    .dialog_close {
      @apply pr-20px absolute;
      top: 3px;
      right: 10px;
    }
  }

  .dialog_content {
    @apply min-h-200px bg-black rounded-bl-20px rounded-br-20px;
  }
}
</style>