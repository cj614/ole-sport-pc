<template>
  <v-app class="main_chat_box">
    <!-- <layout-chatHeader></layout-chatHeader> -->
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
    <layout-snackbars></layout-snackbars>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      dialog: true
    }
  },
  computed: {
    footerShow() {
      let { name } = this.$route
      let footerHideList = ['deal', 'contract']
      let diffArr = footerHideList.filter(item => {
        return item === name
      })
      return diffArr.length > 0 ? false : true
    }
  }
}
</script>

<style></style>
