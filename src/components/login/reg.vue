<template>
  <div class="m-login-warp">
    <div class="w-500px">
      <page-ImgSwiper width="500" :height="height" typeName="Pc-Login page banner"
        :defaultImg="Img.LoginDefault"></page-ImgSwiper>
    </div>
    <div class="content" ref="content">
      <div class="content-pad">
        <div class="login-tit">
          <span class="tit">{{ $t('Page["注册"]') }}</span>
          <span class="close" @click="handleClose">
            <v-img :src="Img.LoginClose" width="30" height="30"></v-img>
          </span>
        </div>
        <div class="login-form">
          <v-form v-model="valid" style="width: 100%" ref="regFromRef" lazy-validation
            @keydown.enter.native="handleRegValidation">
            <v-text-field v-model="reg.user_name" :placeholder="$t(`Module['账号']`)" class="input-item" single-line
              outlined dense height="50" maxlength="25" full-width :rules="userNameRules"></v-text-field>

            <v-text-field v-model="reg.pass_word" :placeholder="$t(`Module['密码']`)" class="input-item" single-line
              outlined dense height="50" maxlength="25" type="password" full-width :rules="passRule"></v-text-field>

            <v-text-field v-model="reg.mobile" :placeholder="$t(`Module['手机号码']`)" class="input-item input-item-pad"
              single-line outlined dense height="50" type="number" maxlength="25" hide-spin-buttons full-width
              :rules="mobileRules" :error-messages="errMsg" :error="errSw">
              <template v-slot:prepend-inner>
                <login-country :CodeList="CodeList" @setCountryCode="data => CountryData = data"></login-country>
              </template>
            </v-text-field>

            <v-text-field v-model="reg.verify_code" :placeholder="$t(`Module['验证码']`)" class="input-item" single-line
              outlined dense height="50" type="number" maxlength="10" hide-spin-buttons full-width :rules="smsCodeRule"
              :error-messages="errCodeMsg" :error="errCodeSw">
              <template #append>
                <login-code :mobile="reg.mobile" :CountryCode="CountryCode" @errMsg="t => {
                  errSw = true
                  errMsg = t
                }
                  " @offMsg="() => {
                    errSw = false
                    errMsg = ''
                  }
                    "></login-code>
              </template>
            </v-text-field>

            <div class="check_box">
              <v-checkbox color="#F9B31F" class="check-content" :rules="checkboxRule" v-model="checkbox">
                <template v-slot:label>
                  <div class="subtit">
                    {{ $t('Module["我已阅读并同意条款和条件"]') }}
                    <span class="tit" @click.stop="toPage">{{ $t('Module["《OLE直播最终用户许可协议》"]') }}</span>
                  </div>
                </template>
              </v-checkbox>
            </div>
          </v-form>
        </div>

        <v-btn :loading="loading" depressed rounded width="100%" class="login-submit" @click="handleRegValidation">{{
          $t('Page["注册"]') }}</v-btn>
        <div class="login-in">
          {{ $t('Module["已有账号"]') }}，
          <span @click="$emit('handleReg', 'login')">{{ $t('Module["直接登录"]') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isValidPhoneNumber } from 'libphonenumber-js'
import { userRegister } from '@/api/user.js'
import { getAdjustWebUuid, getChannelData, trackEvent } from "@/libs/channel";
export default {
  props: {
    CodeList: {
      type: Array
    }
  },
  data() {
    return {
      Img: {
        LoginClose: require(`@/${this.$img.Page.Login.LoginClose}`),
        LoginDefault: require(`@/${this.$img.Page.Login.LoginDefault}`)
      },
      height: 532,
      CountryData: {},
      show: false,
      checkbox: true,
      valid: true,
      loading: false,
      errMsg: '',
      errCodeMsg: '',
      errSw: false,
      errCodeSw: false,
      reg: {
        user_name: '',
        mobile: '',
        verify_code: '',
        pass_word: ''
      }
    }
  },

  computed: {
    CountryCode() {
      const { CountryData } = this
      return CountryData.code || +86
    },

    userNameRules() {
      return [v => !!v || this.$t(`Module['请输入账号']`)]
    },

    mobileRules() {
      const {
        CountryCode,
        CountryData: { country_code }
      } = this
      return [
        v => !!v || this.$t(`Module['请填写手机号']`),
      ]
    },

    smsCodeRule() {
      return [v => !!v || this.$t(`Module['请输入验证码']`)]
    },

    passRule() {
      return [
        v => !!v || this.$t(`Module['请填写密码']`),
        v =>
          (v && !(v.length < 6 || v.length > 18)) ||
          this.$t(`Module['密码长度至少 6 位']`)
      ]
    },

    checkboxRule() {
      return [v => !!v || this.$t(`Module['请阅读许可协议']`)]
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.height = this.$refs.content.clientHeight
    })
  },

  methods: {

    async handleRegValidation() {
      this.errSw = false
      this.errMsg = ''
      const {
        reg: { user_name, mobile, verify_code, pass_word },
        CountryCode
      } = this
      if (this.$refs.regFromRef.validate()) {
        this.loading = true
        const { Code } = await this.$store.dispatch('user/handleUserRegister', {
          user_name,
          mobile: CountryCode + mobile,
          verify_code,
          pass_word
        })
        if (Code === 200) {
          this.$toast.success(this.$t('Module["注册成功"]'), '', {
            position: 'topCenter',
            timeout: 1000 * 3,
            balloon: true
          })

          this.handleClose()
        }

        this.loading = false
      }
    },

    reset() {
      this.$refs.regFromRef?.reset()
    },

    toPage() {
      window.open('/#/privacy/policy')
    },

    handleClose() {
      this.$emit('handleClose')
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./style.scss');
</style>

<style lang="scss" scoped>
// .m-login-warp {
//   @apply flex items-center w-full h-532px;
//   .content {
//     @apply bg-lightFirst h-532px w-500px;
//     .content-pad {
//       @apply p-30px;
//       .login-tit {
//         @apply flex items-center justify-between h-30px mb-20px;
//         .tit {
//           @apply text-20px font-bold text-left text-dark;
//         }
//         .close {
//           @apply cursor-pointer;
//         }
//       }

//       .login-tabs {
//         @apply flex items-center py-5px mb-30px;
//         .tab-item {
//           @apply text-16px font-normal text-dark mr-30px cursor-pointer;
//         }

//         .active {
//           @apply relative text-20px font-bold text-warning;
//         }
//         .active::after {
//           @apply absolute flex justify-center w-40px h-4px rounded-2px bottom--4px left-20px bg-warning;
//           content: '';
//         }
//       }

//       .login-form {
//         .input-item {
//           .v-input__slot {
//             @apply rounded-10px px-20px;
//             border: 1px solid #e5e5e5 !important;
//             .v-input__prepend-inner {
//               @apply mr-20px;
//               margin-top: 13px !important;
//             }

//             input::placeholder {
//               @apply text-dark text-16px font-normal;
//             }
//           }
//           .v-text-field__details {
//             @apply mb-0px;
//           }
//         }
//         .input-item-pad {
//           input {
//             @apply p-20px;
//             border-left: 1px solid #e5e5e5 !important;
//           }
//         }
//         .subtit {
//           @apply text-12px font-normal text-dark;
//           span {
//             @apply text-warning cursor-pointer;
//           }
//         }

//         .check-content {
//           @apply mt-0px pt-0px;
//           .v-input__slot {
//             @apply mb-0px;
//           }
//           .v-messages {
//             @apply min-h-0px;
//           }
//         }

//         .login-forget {
//           @apply text-right text-14px font-normal text-warning;
//         }
//       }
//       .login-submit {
//         @apply h-50px text-lightFirst text-16px font-bold mt-30px;
//         background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
//       }
//       .login-zc {
//         @apply h-50px text-primaryFirst text-16px font-bold mt-20px border-1px border-solid border-hex-1862c8;
//       }
//       .login-in {
//         @apply text-center mt-20px text-16px font-normal text-dark;
//         span {
//           @apply text-warning border-1px border-solid border-b-hex-f9b31f cursor-pointer;
//         }
//       }
//     }
//   }
// }</style>
