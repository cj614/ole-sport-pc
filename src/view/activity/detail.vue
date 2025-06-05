<template>
  <div class="special_offer_detail">
    <page-pageLoad :src="contentImg" currentClass="rounded-10px"></page-pageLoad>
    <page-adv left="Pc-Activity page left side banner" right="Pc-Activity page right side banner"></page-adv>
    <page-footeradv footer="Pc-Activity page footer banner"></page-footeradv>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contentImg: ''
    }
  },
  mounted() {
    this.contentImg = this.$route.query.img
  }
}
</script>


<style lang="scss" scoped>
.special_offer_detail {
  @apply flex py-20px justify-center bg-black;
}
</style>