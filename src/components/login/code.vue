<template>
  <v-btn min-width="90" height="33px" class="code-btn" :class="{ ['active-btn']: !showSmsCode }" depressed
    @click="getCode()" :disabled="showSmsCode">{{ smsTxt }}</v-btn>
</template>

<script>
import { getSmsCode, userSes } from '@/api/user'

//verifyPhone
import { verifyEmail } from '@/libs/util'
export default {
  props: {
    mobile: {},
    email: {},
    type: {
      type: String,
      default: 'mobile'
    },
    CountryCode: {}
  },
  data() {
    return {
      smsTxt: this.$t("Module['获取验证码']"), // 获取验证码按钮文字
      showSmsCode: false,
      timer: null
    }
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  methods: {
    smsCodeDownTime() {
      clearInterval(this.timer)
      let time = 60
      this.timer = setInterval(() => {
        time--
        if (time < 0) {
          this.reset()
          return
        }
        if (this.type === 'email') {
          this.smsTxt = `${time}`
        } else this.smsTxt = `${time} ${this.$t(`Module['秒重新获取']`)}`
      }, 1000)
    },

    reset() {
      clearInterval(this.timer)
      this.showSmsCode = false
      this.smsTxt = this.$t("Module['获取验证码']")
    },

    async getCode() {
      if (this.type === 'mobile') {
        if (!this.mobile) {
          this.$emit('errMsg', this.$t("Module['请填写手机号']"))
          return
        }

        // if (!verifyPhone(this.mobile)) {
        //   this.$emit('errMsg', '手机号不正确')
        //   return
        // }
      } else if (this.type === 'email') {
        if (!this.email) {
          this.$emit('errMsg', this.$t("Module['请填写邮箱号']"))
          return
        }

        if (!verifyEmail(this.email)) {
          this.$emit('errMsg', this.$t("Module['邮箱地址不正确']"))
          return
        }
      }

      this.$emit('offMsg')
      if (this.type === 'mobile') {
        this.getSmsCode()
      } else this.getUserSes()
    },

    async getSmsCode() {
      try {
        this.showSmsCode = true
        const { Code } = await getSmsCode({
          mobile_pre: this.CountryCode,
          mobile: this.mobile
        })
        if (Code === 200) {
          this.smsCodeDownTime()
        } else {
          this.showSmsCode = false
        }
      } catch (error) {
        this.showSmsCode = false
      }
    },

    async getUserSes() {
      try {
        this.showSmsCode = true
        const { Code } = await userSes({
          email: this.email
        })
        if (Code === 200) {
          this.smsCodeDownTime()
        } else {
          this.showSmsCode = false
        }
      } catch (error) {
        this.showSmsCode = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.code-btn {
  @apply text-14px font-normal text-hex-5C330A rounded-6px;
}

.active-btn {
  background: linear-gradient(90deg, #1E3CE8 0.09%, #29D4FF 100%);
  color: #fff;
}
</style>