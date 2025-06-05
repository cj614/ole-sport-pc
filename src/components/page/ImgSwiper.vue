<template>
  <v-carousel v-if="swiperList" :height="height" :cycle="true" hide-delimiter-background :interval="interval"
    hide-delimiters>
    <v-carousel-item v-for="(item, i) in swiperList" :key="i" :src="item.img_url"
      @click="onItemClick(item)"></v-carousel-item>
  </v-carousel>
  <v-carousel v-else-if="items.length" :height="height" :cycle="true" hide-delimiter-background :interval="interval" hide-delimiters>
    <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.img_url"
      @click="onItemClick(item)"></v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  props: {
    swiperList: {
      default: ''
    },
    typeName: {
      type: String,
      default: ''
    },
    defaultImg: {
      type: String,
      default: ''
    },
    height: {
      type: [String, Number],
      default: 600
    },
    interval: {
      type: [Number],
      default: 6000
    }
  },
  data() {
    return {
      items: [],
      openTypeList: ['Pc-Homepage pop-up banner']
    }
  },
  watch: {
    // 监听 message 数据变化
    swiperList(newValue, oldValue) {
      console.log(`swiperList changed from ${oldValue} to ${newValue}`);
    }
  },
  mounted() {
    this.openType()
    // console.log("swiperList", this.swiperList)
  },

  methods: {
    // 点击跳转
    onItemClick(i) {
      if (i.on_click_url) {
        window.open(i.on_click_url)
      }
    },
    openType() {
      const { openTypeList, typeName } = this
      if (openTypeList.includes(typeName)) {
        let ok = sessionStorage.getItem(typeName)
        if (ok) {
          // this.$emit('show', false)
          // return
        }
        sessionStorage.setItem(typeName, 'ok')
      }
      this.getLoginBanner()
    },

    getLoginBanner() {
      this.$store
        .dispatch('app/globalBannerListByTypeName', this.typeName)
        .then(res => {

          if (!this.swiperList) {
            if (res.length === 0 && this.defaultImg) {
              res = [{ img_url: this.defaultImg }]
            }
            console.log('getswiperList', res, this.typeName)
            this.items = res
            // console.log('!!res.length', !!res.length)
            this.$emit('show', !!res.length)
          }

        })
    }
  }
}
</script>
<style>
/* 修改箭头颜色 */
.notranslate {
  color: #f9b31f !important;
}
</style>