<template>
  <v-snackbar
    v-model="snackbar"
    centered
    height="45"
    min-width="80"
    rounded="36"
    :timeout="3000"
  >{{ text }}</v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      text: ''
    }
  },

  mounted() {
    this.$bus.$on('snackbar/on', this.handleOn)
    this.$bus.$on('snackbar/off', this.handleOff)
    this.$bus.$on('snackbar/update', this.handleUpdate)
  },

  beforeDestroy() {
    this.$bus.$off('snackbar/on', this.handleOn)
    this.$bus.$off('snackbar/off', this.handleOff)
    this.$bus.$off('snackbar/update', this.handleUpdate)
  },

  methods: {
    handleOn(txt) {
      this.snackbar = true
      this.text = txt
    },

    handleOff() {
      this.snackbar = false
    },

    handleUpdate(txt) {
      this.text = txt
    }
  }
}
</script>