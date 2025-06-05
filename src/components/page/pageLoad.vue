<template>
  <div
    class="flex flex-none items-center justify-center relative"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <span v-if="!isLoadError && src">
      <v-img
        :width="width"
        :height="height"
        :src="src"
        :class="currentClass"
        @error="handleError"
        :contain="contain"
      >
        <template v-slot:placeholder>
          <!-- <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
          </v-row>-->
        </template>
      </v-img>
    </span>

    <span v-else>
      <v-img
        v-if="imgSrc"
        max-width="84"
        :width="width"
        :height="height"
        max-height="84"
        :src="imgSrc"
      ></v-img>
    </span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: [String, Number],
      default: ''
    },
    contain: {
      default: false,
      type: Boolean
    },
    borderRadius: {
      type: String,
      default: '0'
    },
    currentClass: {
      type: String,
      default: ''
    },

    defaultImg: {
      type: String,
      default: ''
    },

    bgColor: {
      type: String,
      default: 'transparent'
    },
    loadingMode: {
      type: String,
      default: 'skeleton-1'
    },

    src: {
      type: String,
      default: ''
    },

    height: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      Img: {
        LazySrc: require(`@/${this.$img.Page.Layout.ImgLoad}`),
        MoreImg: require(`@/${this.$img.Page.Layout.MoreImg}`),
        MatchDefault: require(`@/${this.$img.Page.MatchScore.MatchDefault}`)
      },
      showImg: false,
      isLoadError: false
    }
  },
  computed: {
    imgSrc() {
      const { defaultImg, Img } = this
      return Img[defaultImg || 'no']
    }
  },
  methods: {
    handleError() {
      this.isLoadError = true
    },
    handleLoad() {
      this.showImg = true
    }
  }
}
</script>

<style lang="scss" scoped>
.show_ver {
  background: rgba(0, 0, 0, 0.65);
}

/* 骨架屏1 */
.skeleton-1 {
  background-color: #e3e3e3;
  background-image: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 80%
  );
  background-size: 50px 100%;
  background-repeat: repeat-y;
  background-position: 0 0;
  animation: skeleton-1 0.6s infinite;
}
@keyframes skeleton-1 {
  to {
    background-position: 200% 0;
  }
}
/* 骨架屏2 */
.skeleton-2 {
  background-image: linear-gradient(
    -90deg,
    #fefefe 0%,
    #e6e6e6 50%,
    #fefefe 100%
  );
  background-size: 400% 400%;
  background-position: 0 0;
  animation: skeleton-2 1.2s ease-in-out infinite;
}
@keyframes skeleton-2 {
  to {
    background-position: -135% 0;
  }
}
</style>
