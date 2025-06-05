<template>
  <module-dialog :dialog.sync="dialog" :title="$t(`Module['直播中']`)+'...'" @close="closed">
    <template v-slot:content>
      <div class="m_anchor_list_warp">
        <div class="anchor_list">
          <div
            @click="anchorClick(anchorChild)"
            class="anchor_card"
            v-for="(anchorChild, key) in anchorList"
            :key="key"
          >
            <div class="anchor_item">
              <div class="img_box">
                <div class="lottie_head" v-if="anchorChild.is_live">
                  <page-lottie :animationData="Lottie.Head"></page-lottie>
                </div>
                <div class="item_img">
                  <page-pageLoad
                    :src="anchorChild.user_img_url || Img.LiveLogo"
                    width="80"
                    height="80"
                  ></page-pageLoad>
                </div>
              </div>
              <div class="live" v-if="anchorChild.is_live">LIVE</div>
              <div class="name">{{ anchorChild.user_name }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </module-dialog>
</template>

<script>
export default {
  props: {
    anchorList: {
      type: Array,
      default: () => []
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      Lottie: {
        Head: require(`@/${this.$lottie.Live.Head}`)
      },
      Img: {
        LiveLogo: require(`@/${this.$img.Page.Live.LiveLogo}`)
      },
      dialog: false
    }
  },

  computed: {
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },
    Color() {
      return this.$store.state.app.appColor
    }
  },
  methods: {
    setDialog() {
      this.dialog = true
    },
    closed() {
      this.dialog = false
    },
    anchorClick(item) {
      this.$emit('anchorClick', item)
      this.closed()
    }
  }
}
</script>

<style lang="scss" scoped>
.m_anchor_list_warp {
  @apply py-40px px-20px;
  .anchor_list {
    @apply grid grid-cols-2;
    .anchor_card {
      @apply flex items-center justify-center cursor-pointer;
      .anchor_item {
        @apply relative h-130px w-100px flex items-center justify-center flex-col;
        .img_box {
          @apply relative;
          .lottie_head {
            width: 120%;
            height: 120%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            @apply absolute;
          }
          .item_img {
            @apply rounded-full border-2px border-solid border-lightFirst overflow-hidden;
          }
        }
        .live {
          transform: translateX(-50%);
          left: 50%;
          bottom: 25%;
          @apply absolute w-44px h-16px flex items-center justify-center bg-warning rounded-full text-12px text-lightFirst;
        }
        .name {
          @apply text-dark text-14px leading-21px pt-7px;
        }
      }
    }
  }
}
</style>