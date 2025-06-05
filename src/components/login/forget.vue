<template>
  <div class="m-login-warp">
    <div class="w-500px">
      <page-ImgSwiper height="532" typeName="Pc-Login page banner" :defaultImg="Img.LoginDefault"></page-ImgSwiper>
    </div>
    <div class="content">
      <div class="content-pad">
        <div class="login-tit">
          <span class="tit">{{$t("Page['忘记密码']")}}</span>
          <span class="close" @click="handleClose">
            <v-img :src="Img.LoginClose" width="30" height="30"></v-img>
          </span>
        </div>

        <div class="login-form">
          <v-form
            v-model="valid"
            style="width: 100%"
            ref="regForgetRef"
            lazy-validation
            @keydown.enter.native="handleForgetValidation"
          >
            <v-text-field
              :placeholder="$t(`Module['手机号码']`)"
              v-model="forget.mobile"
              class="input-item input-item-pad"
              :rules="mobileRules"
              single-line
              outlined
              dense
              height="50"
              type="number"
              maxlength="10"
              hide-spin-buttons
              full-width
              :error-messages="errMobileMsg"
              :error="errMobileSw"
            >
              <template v-slot:prepend-inner>
                <login-country :CodeList="CodeList" @setCountryCode="(data) => CountryData =data"></login-country>
              </template>
            </v-text-field>

            <v-text-field
              :placeholder="$t(`Module['验证码']`)"
              v-model="forget.verify_code"
              class="input-item"
              :rules="smsCodeRule"
              single-line
              outlined
              dense
              height="50"
              type="number"
              maxlength="10"
              hide-spin-buttons
              full-width
              :error-messages="errCodeMsg"
              :error="errCodeSw"
            >
              <template #append>
                <login-code
                  :mobile="forget.mobile"
                  :CountryCode="CountryCode"
                  @errMsg="(t)=>{errMobileSw=true;errMobileMsg=t}"
                  @offMsg="()=>{errMobileSw=false;errMobileMsg=''}"
                ></login-code>
              </template>
            </v-text-field>

            <v-text-field
              :placeholder="$t(`Module['密码']`)"
              v-model="forget.pass_word"
              class="input-item"
              :rules="passRule"
              single-line
              outlined
              dense
              height="50"
              maxlength="25"
              type="password"
              full-width
              :error-messages="errPassMsg"
              :error="errPassSw"
            ></v-text-field>
          </v-form>
        </div>
        <v-btn
          depressed
          rounded
          width="100%"
          :loading="loading"
          class="login-submit"
          @click="handleForgetValidation"
        >{{$t(`Module['提交']`)}}</v-btn>
        <v-btn
          depressed
          rounded
          width="100%"
          class="login-zc"
          @click="$emit('handleReg','login')"
        >{{$t(`Module['返回登录']`)}}</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { isValidPhoneNumber } from 'libphonenumber-js'
import { userForget } from '@/api/user'
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
      CountryData: {},
      valid: false,
      forget: {
        mobile: '',
        verify_code: '',
        pass_word: '',
        email: ''
      },
      errMobileMsg: '',
      errMobileSw: false,
      errCodeMsg: '',
      errCodeSw: false,
      errPassMsg: '',
      errPassSw: false,
      loading: false
    }
  },

  computed: {
    CountryCode() {
      const { CountryData } = this
      return CountryData.code || +86
    },

    mobileRules() {
      return [
        v => !!v || this.$t(`Module['请填写手机号']`)
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
    }
  },

  methods: {
    async handleForgetValidation() {
      const {
        forget: { mobile, verify_code, pass_word, email },
        CountryCode
      } = this
      if (this.$refs.regForgetRef.validate()) {
        this.loading = true
        const { Code } = await userForget({
          email,
          mobile: mobile ? CountryCode + mobile : undefined,
          verify_code,
          pass_word
        })
        if (Code === 200) {
          this.$emit('handleReg', 'login')
        } else {
          if (Code === '-400212') {
            this.errMobileSw = true
            this.errMobileMsg = this.$t(`Code[${Code.toString()}]`)
          } else {
            this.errCodeSw = true
            this.errCodeMsg = this.$t(`Code[${Code.toString()}]`)
          }
        }
        this.loading = false
      }
    },

    reset() {
      this.initForm()
    },

    initForm() {
      this.loading = false
      this.$refs.regForgetRef && this.$refs.regForgetRef.reset()
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
