<template>
  <div class="m-login-warp">
    <div class="w-500px">
      <page-ImgSwiper height="532" typeName="Pc-Login page banner" :defaultImg="Img.LoginDefault"></page-ImgSwiper>
    </div>
    <div class="content">
      <div class="content-pad">
        <div class="login-tit">
          <span class="tit">{{ $t("Page['登录']") }}</span>
          <span class="close" @click="handleClose">
            <v-img :src="Img.LoginClose" width="30" height="30"></v-img>
          </span>
        </div>

        <div class="login-tabs">
          <div class="tab-item" :class="{ active: login.login_type === 'mobile' }" @click="handleClickTabItem('mobile')">
            {{ $t("Module['手机号码']") }}</div>

          <div class="tab-item" :class="{ active: login.login_type === 'email' }" @click="handleClickTabItem('email')">
            {{ $t("Module['电子邮件']") }}</div>
        </div>

        <div class="login-form">
          <v-form v-model="valid" style="width: 100%" ref="loginFromRef" lazy-validation
            @keydown.enter.native="handleLoginValidation">
            <v-text-field v-if="login.login_type === 'mobile'" v-model="login.user" :placeholder="$t(`Module['手机号码']`)"
              class="input-item input-item-pad" single-line outlined dense height="50" type="number" maxlength="25"
              required hide-spin-buttons autocomplete="off" :rules="mobileRules" :error-messages="errMobileMsg"
              :error="errMobileSw" full-width>
              <template v-slot:prepend-inner>
                <login-country :CodeList="CodeList" @setCountryCode="(data) => CountryData = data"></login-country>
              </template>
            </v-text-field>

            <v-text-field v-if="login.login_type === 'email'" v-model="login.user" :placeholder="$t(`Module['电子邮箱']`)"
              class="input-item" single-line outlined dense required height="50" maxlength="100" hide-spin-buttons
              autocomplete="off" :rules="emailRule" :error-messages="errEmailMsg" :error="errEmailSw"
              full-width></v-text-field>

            <v-text-field :placeholder="$t(`Module['密码']`)" type="password" v-model="login.pass_word" class="input-item"
              single-line outlined dense :rules="passRule" autocomplete="off" :error-messages="errPassMsg"
              :error="errPassSw" height="50" full-width></v-text-field>
          </v-form>

          <div class="login-forget">
            <span @click="$emit('handleReg', 'forget')">{{ $t(`Page['忘记密码']`) }}？</span>
          </div>
        </div>
        <v-btn depressed rounded :loading="loading" width="100%" class="login-submit"
          @click="handleLoginValidation">{{ $t(`Page['登录']`) }}</v-btn>
        <v-btn depressed rounded width="100%" class="login-zc"
          @click="$emit('handleReg', 'reg')">{{ $t(`Page['注册']`) }}</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyEmail } from '@/libs/util'
import { isValidPhoneNumber } from 'libphonenumber-js'
export default {
  props: {
    CodeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Img: {
        LoginClose: require(`@/${this.$img.Page.Login.LoginClose}`),
        LoginDefault: require(`@/${this.$img.Page.Login.LoginDefault}`)
      },
      CountryData: {},

      login: {
        login_type: 'mobile',
        user: '',
        pass_word: ''
      },

      valid: false,
      loading: false,
      errMobileMsg: '',
      errMobileSw: false,
      errEmailMsg: '',
      errEmailSw: false,
      errPassMsg: '',
      errPassSw: false
    }
  },

  computed: {
    CountryCode() {
      const { CountryData } = this
      return CountryData.code || +86
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

    emailRule() {
      return [
        v => !!v || this.$t(`Module['请填写邮箱号']`),
        v => verifyEmail(v) || this.$t(`Module['邮箱地址不正确']`)
      ]
    },

    passRule() {
      return [
        v => !!v || this.$t(`Module['请填写密码']`),
        v =>
          (v && !(v.length < 6 || v.length > 18)) ||
          this.$t(`Module['密码长度至少 6 位']`)
      ]
    }
  },

  methods: {
    handleClose() {
      this.$emit('handleClose')
    },

    reset() {
      this.handleClickTabItem('mobile')
    },

    initForm() {
      this.loading = false
      this.$refs.loginFromRef && this.$refs.loginFromRef.reset()
    },

    handleClickTabItem(type) {
      this.login.login_type = type
      this.errMobileMsg = ''
      this.errMobileSw = false
      this.errEmailMsg = ''
      this.errEmailSw = false
      this.errPassMsg = ''
      this.errPassSw = false
      this.initForm()
    },

    async handleLoginValidation() {
      const {
        login: { login_type, user, pass_word },
        CountryCode
      } = this

      if (this.$refs.loginFromRef.validate()) {
        this.loading = true
        const { Code } = await this.$store.dispatch('user/handleUserLogin', {
          pass_word,
          login_type,
          user: login_type === 'mobile' ? CountryCode + user : user
        })
        if (Code === 200) {
          // this.$toast.success(this.$t('Module.User["登录成功"]'))

          this.handleClose()
        }
        this.loading = false
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@import url('./style.scss');
</style>
