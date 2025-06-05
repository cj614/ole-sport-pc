<template>
  <v-app class="main_box">
    <layout-header></layout-header>
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
    <layout-footer v-if="footerShow"></layout-footer>
    <layout-service></layout-service>
    <layout-snackbars></layout-snackbars>
  </v-app>
</template>

<script>
export default {
  data() {
    return {}
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
