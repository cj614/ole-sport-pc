<template>
  <div>
    <!-- 领取钻石 -->
    <div class="progress-wrap" @click="restartCircle">
      <div class="progress-bg">
        <v-progress-circular :size="90" :width="4" :value="process" color="#F7B41F" background-color="transparent"
          :rotate="-90">
          <img :src="Img.Diamond" class="diamond" :class="{ 'diamond-shake': isShaking }" />
        </v-progress-circular>
      </div>

    </div>
    <!--领取钻石弹窗-->
    <v-dialog v-model="showDiamond" max-width="366" class="no_scrollbar">
      <!-- <div :style="{ backgroundImage: `url('${Img.GetDiamond}')` }"> -->
      <!-- <v-img></v-img> -->
      <img :src="Img.GetDiamond" style="width: 366px;" />
      <!-- </div> -->

    </v-dialog>
  </div>

</template>

<script>

import { getDiamondApi } from '@/api/user'
export default {
  emits: ['getDiamond'], // 声明事件
  props: {

  },
  data() {
    return {
      closeTimer: null,
      interval: null,
      process: 3,
      isShaking: false,
      showDiamond: false,
      Img: {
        Diamond: require(`@/${this.$img.Page.User.Diamond}`),
        GetDiamond: require(`@/${this.$img.Page.Live.GetDiamond}`),
        // LiveTeam: require(`@/${this.$img.Page.Live.LiveLogo}`),
        // Liveicon: require(`@/${this.$img.Page.Live.Liveicon}`),
        // Readicon: require(`@/${this.$img.Page.Live.Readicon}`),
        // Videoicon: require(`@/${this.$img.Page.Live.Videoicon}`),

      }
    }
  },
  mounted() {
    this.runCircle()
  },
  watch: {
    showDiamond(val) {
      console.log(val)
      if (!val) return
      // 先清理旧定时器，防止多次触发
      if (this.closeTimer) clearTimeout(this.closeTimer)
      this.closeTimer = setTimeout(() => {
        this.showDiamond = false
      }, 2000)
    }
  },
  beforeDestroy() {
    // 组件销毁时清理定时器
    if (this.closeTimer) clearTimeout(this.closeTimer)
  },
  methods: {
    getDiamond() {
      this.showDiamond = true
      getDiamondApi()
    },
    // openDiamondPop() {
    //   console.log(1111111111111)
    //   setTimeout(() => {
    //     this.showDiamond = false
    //   }, 2000)
    // },
    // 倒计时
    runCircle() {
      if (this.interval !== null) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        if (this.process < 100) {
          this.process = this.process + 1;
        } else {
          clearInterval(this.interval);
        }
      }, 3000)
    },
    restartCircle() {
      if (this.process >= 100) {
        // 认领钻石
        this.$emit('getDiamond');
        this.getDiamond()
        this.isShaking = true;
        // 动画结束后重置状态
        setTimeout(() => {
          this.isShaking = false;
        }, 600); // 动画持续时间
        this.process = 0
        this.runCircle()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 可根据需要设置宽高 */
}

.progress-bg {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  /* 半透明黑色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.diamond {
  width: 48px;
  height: 48px;
  z-index: 2;
}

.diamond-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  25% {
    transform: scale(1.2);
    opacity: 0.8;
  }

  50% {
    transform: scale(0.8);
    opacity: 1;
  }

  75% {
    transform: scale(1.1);
    opacity: 0.9;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
