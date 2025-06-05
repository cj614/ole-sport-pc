<template>
  <v-menu content-class="m_share_warp" offset-y :nudge-left="0" :nudge-bottom="16" :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">

      <template>
        <div class="other_shard" v-bind="attrs" v-on="on">
          <v-img :src="Img.Share" width="20" height="20"></v-img>
          <!-- <span class="shard_txt">{{ $t(`Module['分享']`) }}</span> -->
        </div>
      </template>
    </template>

    <div class="live_room_share">
      <div class="share_icon">
        <div class="item" v-for="(item, key) in shareList" :key="key">
          <ShareNetwork :network="item.network" :key="key" :style="{ backgroundColor: 'transparent' }"
            :url="shareInfo.url" :title="shareInfo.title" :description="shareInfo.description" :quote="shareInfo.quote"
            :hashtags="shareInfo.hashtags" :twitterUser="shareInfo.twitterUser">
            <span>
              <v-img width="60" height="60" :src="item.img"></v-img>
            </span>
          </ShareNetwork>
        </div>
      </div>
      <div class="share_content">
        <div class="text text_omit">{{ shareInfo.url }}</div>
        <v-btn depressed min-width="64" height="31" class="copy_btn" v-clipboard:copy="shareInfo.url"
          v-clipboard:success="firstCopySuccess" v-clipboard:error="firstCopyError">{{ $t(`Module['复制']`) }}</v-btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
export default {
  props: {
    shareInfo: {
      type: Object,
      default: () => {
        return {
          url: '',
          title: '',
          description: '',
          quote: '',
          hashtags: '',
          twitterUser: ''
        }
      }
    },
    type: {
      type: String,
      default: 'live'
    }
  },

  computed: {
    localConfig() {
      return this.$store.state.app.localConfig ? JSON.parse(this.$store.state.app.localConfig) : {}
    },

    shareList() {
      // let { lang } = this.localConfig
      let { Facebook, Line, WhactApp } = this.$img.Page.Room
      return [
        {
          network: 'facebook',
          img: require(`@/${Facebook}`)
        },
        {
          network: 'line',
          img: require(`@/${Line}`)
        },
        {
          network: 'whatsapp',
          img: require(`@/${WhactApp}`)
        }
      ]
    }
  },

  data() {
    return {
      Img: {
        Share: require(`@/${this.$img.Page.Live.Share}`),
        ShareVideo: require(`@/${this.$img.Page.News.Share}`)
      }
    }
  },
  methods: {
    firstCopySuccess() {
      this.$toast.success(this.$t(`Module['复制成功']`))
    },

    firstCopyError() {
      this.$toast.warning(this.$t(`Module['裁剪失败']`))
    }
  }
}
</script>

<style lang="scss" scoped>
.share_btn_box {
  @apply flex items-center;
}

.other_shard {}

.m_share_warp {
  border-radius: 0px 20px 20px 20px !important;
  z-index: 100 !important;
  border: 2px solid #3d3d3d !important;
  // top: 720px !important;
  // left: 290px !important;

  .live_room_share {
    @apply h-170px w-340px p-20px bg-hex-222222;
    color: #fff;

    .share_icon {
      @apply flex items-center mb-20px;

      // gap: 10px;
      .item {
        @apply mr-10px;
      }
    }

    .share_content {
      @apply flex items-center w-300px h-50px rounded-10px bg-hex-181818 px-10px;

      .text {
        @apply w-215px text-16px;
      }

      .copy_btn {
        @apply rounded-20px text-hex-5C330A font-bold;
        background: linear-gradient(90deg, #F5CD9F 0%, #F7DBBF 100%);
      }
    }
  }
}
</style>