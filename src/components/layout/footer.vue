<template>
  <div class="m-footer-warp">
    <div class="footer-content">
      <ul class="footer-links">
        <li v-for="(item, index) in linkList" class="link-item" @click.stop="handleLink(item)" :key="index">
          <ShareNetwork :network="item.network" :key="index" :style="{ backgroundColor: 'transparent' }" :url="item.url"
            :title="item.title" :description="item.description" :quote="item.quote" :hashtags="item.hashtags"
            :twitterUser="item.twitterUser">
            <div class="flex items-center">
              <v-img :src="item.icon" width="28" height="28"></v-img>
              <span class="link-tit">{{ item.name }}</span>
            </div>
          </ShareNetwork>
          <v-img :src="item.icon" width="28" height="28" min-width="28" contain></v-img>
          <span class="link-tit">{{ item.name }}</span>
        </li>
      </ul>
      <ul class="footer-about">

        <li v-for="(item, key) in bottomList" @click="handleClickBottom(item)" :key="key"
          :class="['about-item', { br: item.br }]">{{ item.describe }}</li>
      </ul>
      <div class="footer-detail whiteSpace_nowrap">
        {{ $t(`Module['免责声明：本站所有视频内容均来自第三方，本站不提供所有视频直播内容以及赛事数据。坚决拥护赛事版权，如有侵权，请联系本站，我们将第一时间处理']`) }}</div>
      <div class="footer_copy_right">{{ footerCopyRight }}</div>
    </div>
  </div>
</template>

<script>
import { pcBottomTab } from '@/api/app'
export default {
  data() {
    return {
      items: [],
      bottomList: []
    }
  },

  computed: {
    siteConfig() {
      return this.$store.state.app.siteConfig
    },

    footerCopyRight() {
      // let year = this.$date().format('YYYY')
      // enterprises，inc，all right reserved
      // let text = `${this.$config.APPNAME} ${this.$t(`Module['保留所有权利']`)}`
      let text = `${this.$t(`Module['保留所有权利']`)}`
      // return `CopyRight © 2017 - ${year} ${text}`
      return `Copyright © OLE Enterprises, Inc. ${text}`
    },

    linkList() {
      const { items } = this
      return items.map(r => ({
        name: r.banner_name,
        icon: r.img_url,
        link: r.on_click_url
      }))
    }
  },

  mounted() {
    this.getLoginBanner()
    this.getPcBottomTab()
  },

  methods: {
    getLoginBanner() {
      this.$store
        .dispatch('app/globalBannerListByTypeName', 'Pc-Social media')
        .then(res => {
          this.items = res
        })
    },

    handleClickBottom(item) {
      const { route } = item
      let regex = /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/
      let block = ['/user/agreement', '/privacy/policy', '/contact/us', '/about/us']
      if (regex.test(route)) {
        window.open(route, '_blank')
        return
      }
      if (block.includes(route)) {
        switch (route) {
          case '/user/agreement':
            this.$router.push({ name: 'userAgreement' })
            break
          case '/privacy/policy':
            this.$router.push({ name: 'privacyPolicy' })
            break
          case '/contact/us':
            this.$router.push({ name: 'contactUs' })
            break
          case '/about/us':
            this.$router.push({ name: 'aboutUs' })
            break
        }
      } else {
        window.location.href = route
      }
    },

    async getPcBottomTab() {
      const { Code, Data } = await pcBottomTab()
      console.log('Data', Data)
      if (Code === 200) {
        const extendedData = [...Data, { describe: `${this.$t(`Module['关于我们']`)}`, id: 0, route: "/about/us" }]
        let len = extendedData.length - 1
        this.bottomList = extendedData.map((m, i) => ({ ...m, br: i !== len }))
        console.log('bottomList', this.bottomList)

      }
    },

    handleLink(item) {
      if (item.link) {
        window.open(item.link, '_blank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m-footer-warp {
  @apply flex justify-center;
  background: #25262E;
  height: 154px;
  color: #747684;

  .footer-content {
    @apply w-1280px pt-16px pb-20px flex flex-col items-center justify-center;

    .footer-links {
      @apply max-w-723px pl-0px flex justify-between;

      .link-item {
        @apply flex items-center cursor-pointer mr-30px;

        .link-tit {
          @apply text-14px font-normal text-lightFirst ml-10px;

        }
      }
    }

    .footer-about {
      @apply flex justify-between;


      .about-item {
        @apply text-14px font-normal my-26px px-20px cursor-pointer;
      }

      .about-item:hover {
        color: #EAC78B;
      }

      .br {
        border-right: 1px solid #c4c4c4;
      }

      .active {
        color: #EAC78B;
      }
    }

    .footer-detail {
      @apply flex text-14px mb-26px;
      font-family: Kanit;
    }

    .footer_copy_right {
      font-family: Kanit;
      @apply text-12px font-normal;
    }
  }
}
</style>
