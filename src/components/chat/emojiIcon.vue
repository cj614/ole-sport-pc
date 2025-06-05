<template>
  <div class="sc-user-input--picker-wrapper">
    <chat-emojiPicker
      v-if="isActive"
      :on-emoji-picked="onEmojiPicked"
      :on-blur="_handlePickerBlur"
    />
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    onEmojiPicked: {
      type: Function,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    _handlePickerBlur() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.sc-user-input--emoji-icon-wrapper {
  display: block;
  background: none;
  border: none;
  padding: 0px;
  margin: 0px;
  outline: none;
}

.sc-user-input--emoji-icon-wrapper:focus {
  outline: none;
}

.sc-user-input--emoji-icon {
  display: block;
  cursor: pointer;
}
</style>
