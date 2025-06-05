<template>
  <div class="personal_data_warp">
    <p class="item_h_title">{{ $t(`Module['个人资料']`) }}</p>

    <div class="item_tabs">
      <div :class="{ tab_active: type == 'user' }" class="tab" @click="handleClickTab('user')">{{ $t(`Module['个人资料']`)
        }}</div>

      <div :class="{ tab_active: type == 'pass' }" class="tab" @click="handleClickTab('pass')">{{ $t(`Module['更改密码']`)
        }}</div>

      <div :class="{ tab_active: type == 'email' }" class="tab" @click="handleClickTab('email')">Email</div>
    </div>

    <div class="item_data login_form" v-if="type === 'user'">
      <v-form v-model="valid" style="width: 500px;" ref="userFromRef" lazy-validation
        @keydown.enter.native="handleSubmit" key="userFromRef">
        <div class="input_box">
          <div class="prepend_title_re !leading-80px">{{ $t(`Module['头像']`) }}</div>
          <v-file-input show-size @change="handleFileChange" class="file_item" accept="image/*" single-line outlined
            dense height="50" required prepend-icon hide-input id="userImg">
            <template v-slot:append-outer>
              <v-avatar size="80">
                <v-img :src="userInfo.img_url || 'https://cdn.vuetifyjs.com/images/john.jpg'" />
              </v-avatar>
              <v-btn depressed rounded height="33" min-width="96" class="prepend_file_btn" @click="handleSelectImg">{{
                $t(`Module['选择头像']`) }}</v-btn>
            </template>
          </v-file-input>
        </div>
        <div class="input_box">
          <div class="prepend_title_re">{{ $t(`Module['昵称']`) }}</div>
          <v-text-field v-model="user_name" :placeholder="$t(`Module['请输入昵称']`)" class="input_item" single-line outlined
            dense height="50" maxlength="25" full-width></v-text-field>
        </div>

        <div class="input_box">
          <div class="prepend_title_re">{{ $t(`Module['状态']`) }}</div>
          <v-text-field v-model="status_info" :placeholder="$t(`Module['请输入状态']`)" class="input_item" single-line
            outlined dense height="50" maxlength="200" full-width></v-text-field>
        </div>

        <!-- <v-radio-group
          v-model="row"
          class="radio_item"
          row
          single-line
          outlined
          dense
          height="50"
          full-width
        >
          <v-radio label="男" value="radio-1" color="#F9B31F"></v-radio>
          <v-radio label="女" value="radio-2" color="#F9B31F"></v-radio>
          <template v-slot:prepend>
            <div class="prepend_title">性别</div>
          </template>
        </v-radio-group>-->

        <!-- <v-text-field
          :placeholder="请输入状态"
          class="input_item"
          single-line
          outlined
          dense
          height="50"
          maxlength="25"
          full-width
          display
        >
          <template v-slot:prepend>
            <div class="prepend_title">状态</div>
          </template>
        </v-text-field>-->

        <v-btn depressed rounded height="50" width="200" class="item_save_btn" @click="handleSubmit"
          :loading="loading">{{
            $t(`Module['保存更改']`) }}</v-btn>
      </v-form>
    </div>

    <div class="item_data login_form" v-else-if="type === 'pass'">
      <v-form v-model="valid" style="width: 500px;" ref="passFromRef" lazy-validation
        @keydown.enter.native="handleSavePass" key="passFromRef">
        <div class="input_box">
          <div class="prepend_title_re">
            <span class="text-error">*</span>
            {{ $t(`Module['旧密码']`) }}
          </div>
          <v-text-field v-model="pass.old_password" :placeholder="$t(`Module['请输入您的旧密码']`)" class="input_item"
            single-line outlined dense height="50" maxlength="25" required hide-spin-buttons autocomplete="off"
            type="password" :rules="oldPassRule" :error-messages="oldPassMsg" :error="oldPassSw" full-width>
            <!-- <template v-slot:prepend></template> -->
          </v-text-field>
        </div>

        <div class="input_box">
          <div class="prepend_title_re">
            <span class="text-error">*</span>
            {{ $t(`Module['新密码']`) }}
          </div>
          <v-text-field v-model="pass.new_password" :placeholder="$t(`Module['请输入您的新密码']`)" class="input_item"
            single-line outlined dense height="50" maxlength="25" required hide-spin-buttons autocomplete="off"
            type="password" :rules="newPassRule" :error-messages="newPassMsg" :error="newPassSw" full-width
            key="22"></v-text-field>
        </div>

        <div class="input_box">
          <div class="prepend_title_re">
            <span class="text-error">*</span>
            {{ $t(`Module['确认新密码']`) }}
          </div>
          <v-text-field v-model="pass.on_password" :placeholder="$t(`Module['请再次输入您的新密码']`)" class="input_item"
            single-line outlined dense height="50" maxlength="25" required hide-spin-buttons type="password"
            autocomplete="off" :rules="onPassRule" :error-messages="onPassMsg" :error="onPassSw"
            full-width></v-text-field>
        </div>

        <v-btn depressed rounded height="50" width="200" class="item_save_btn" :loading="passLoading"
          @click="handleSavePass">{{ $t(`Module['保存更改']`) }}</v-btn>
      </v-form>
    </div>

    <div class="item_data login_form" v-else>
      <v-form v-model="valid" style="width: 500px;" ref="emailFromRef" lazy-validation
        @keydown.enter.native="handleEmailUPdate" key="emailFromRef">
        <div class="input_box">
          <div class="prepend_title_re">
            <span class="text-error">*</span>Email
          </div>
          <v-text-field v-model="email.email" placeholder="Email" class="input_item" single-line outlined dense
            height="50" maxlength="25" required hide-spin-buttons autocomplete="off" :disabled="isEmail"
            :rules="emailRule" :error-messages="emailMsg" :error="emailSw" full-width></v-text-field>
        </div>

        <div class="input_box">
          <div class="prepend_title_re">
            <span class="text-error">*</span>
            {{ $t(`Module['验证码']`) }}
          </div>
          <v-text-field v-model="email.verify_code" :placeholder="$t(`Module['验证码']`)" class="input_item item_code_mt"
            single-line outlined dense v-if="!isEmail" height="50" maxlength="25" full-width required hide-spin-buttons
            autocomplete="off" type="number" :rules="codeRule" :error-messages="codeMsg" :error="codeSw" key="5">
            <template #append>
              <login-code :email="email.email" type="email" @errMsg="(t) => { emailSw = true; emailMsg = t }"
                @offMsg="() => { emailSw = false; emailMsg = '' }"></login-code>
            </template>
          </v-text-field>
        </div>
        <v-btn v-if="!isEmail" depressed rounded height="50" width="200" class="item_save_btn" :loading="emailLoading"
          @click="handleEmailUPdate">{{ $t(`Module['保存更改']`) }}</v-btn>
      </v-form>
    </div>
  </div>
</template>


<script>
import {
  userUploadHeadImg,
  updateUserName,
  updateEmail,
  updatePassword
} from '@/api/user'

import { verifyEmail } from '@/libs/util'
export default {
  name: 'personalData',
  data() {
    return {
      valid: false,
      type: 'user',
      user_name: '',
      status_info: '',
      loading: false,
      passLoading: false,
      emailLoading: false,
      oldPassMsg: '',
      oldPassSw: false,

      newPassMsg: '',
      newPassSw: false,

      onPassMsg: '',
      onPassSw: false,

      codeMsg: '',
      codeSw: false,

      emailMsg: '',
      emailSw: false,

      pass: {
        old_password: '',
        new_password: '',
        on_password: ''
      },

      isEmail: false,

      email: {
        email: '',
        verify_code: ''
      }
    }
  },

  computed: {
    userInfo() {
      let info = JSON.parse(this.$store.state.user.userInfo).user
      return {
        ...info
      }
    },

    newPassRule() {
      return [v => !!v || this.$t(`Module['请输入您的旧密码']`)]
    },

    oldPassRule() {
      return [v => !!v || this.$t(`Module['请输入您的新密码']`)]
    },

    onPassRule() {
      return [v => !!v || this.$t(`Module['请再次输入您的新密码']`)]
    },

    emailRule() {
      return [
        v => !!v || this.$t(`Module['请输入邮箱地址']`),
        v => verifyEmail(v) || this.$t(`Module['邮箱地址不正确']`)
      ]
    },

    codeRule() {
      return [v => !!v || this.$t(`Module['请输入验证码']`)]
    }
  },

  mounted() {
    this.user_name = this.userInfo.user_name
    this.status_info = this.userInfo.status_info || ''
    this.email.email = this.userInfo.email || ''
  },

  methods: {
    handleLoginValidation() { },

    handleClickTab(type) {
      this.type = type
      if (type === 'pass') {
        this.pass = {
          old_password: '',
          new_password: '',
          on_password: ''
        }
      }
    },

    restEmailInit() {
      this.codeMsg = ''
      this.codeSw = false

      this.emailMsg = ''

      this.emailSw = false
    },

    async handleEmailUPdate() {
      const {
        email: { email, verify_code }
      } = this
      this.restEmailInit()
      if (this.$refs.emailFromRef.validate()) {
        try {
          this.emailLoading = true
          let token = JSON.parse(this.$store.state.user.userInfo).token || ''
          const { Code, Data } = await updateEmail({ email, verify_code })
          if (Code === 200) {
            let user = this.userInfo
            this.email.email = Data.email
            this.isEmail = true
            user = JSON.parse(JSON.stringify(user))
            user.email = Data
            this.$bus.$emit('snackbar/on', this.$t(`Module['提交成功']`))
            this.$store.commit(
              'user/setUserInfo',
              JSON.stringify({
                token,
                user: {
                  ...user
                }
              })
            )
            // this.$toast.success('邮箱修改成功')
          }
          this.emailLoading = false
        } catch (error) {
          this.emailLoading = false
        }
      }
    },

    handleSelectImg() {
      let input = this.$el.querySelector('#userImg')
      if (input) {
        input.click() // 触发文件选择对话框
      }
    },

    handleFileChange(file) {
      if (file) {
        try {
          let formData = new FormData()
          let token = JSON.parse(this.$store.state.user.userInfo).token || ''
          let user = this.userInfo

          user.img_url = window.URL.createObjectURL(file);
          console.log("user.img_url", user.img_url)

          this.$store.commit(
            'user/setUserInfo',
            JSON.stringify({
              token,
              user: {
                ...user
              }
            })
          )

          formData.append('file', file)
          userUploadHeadImg(formData).then(res => {
            const { Code, Data } = res
            if (Code == 200) {
              let user = this.userInfo
              user = JSON.parse(JSON.stringify(user))
              user.img_url = window.URL.createObjectURL(file)
              this.$store.commit(
                'user/setUserInfo',
                JSON.stringify({
                  token,
                  user: {
                    ...user
                  }
                })
              )
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    },

    async handleSubmit() {
      if (this.user_name) {
        try {
          this.loading = true
          const { Code } = await updateUserName({
            user_name: this.user_name,
            status_info: this.status_info
          })
          if (Code == 200) {
            let token = JSON.parse(this.$store.state.user.userInfo).token || ''
            let user = this.userInfo
            user = JSON.parse(JSON.stringify(user))
            user.user_name = this.user_name
            user.status_info = this.status_info
            this.$bus.$emit('snackbar/on', this.$t(`Module['提交成功']`))
            this.$store.commit(
              'user/setUserInfo',
              JSON.stringify({
                token,
                user: {
                  ...user
                }
              })
            )
          }
        } catch (error) {
          console.log(error)
        } finally {
          this.loading = false
        }
      }
    },

    restInit() {
      this.oldPassMsg = ''
      this.oldPassSw = false

      this.newPassMsg = ''

      this.newPassSw = false

      this.onPassMsg = ''

      this.onPassSw = false
    },

    async handleSavePass() {
      const {
        pass: { old_password, new_password, on_password }
      } = this
      this.restInit()
      if (this.$refs.passFromRef.validate()) {
        if (old_password === new_password) {
          this.newPassMsg = this.$t(`Module['新密码跟老密码一样']`)
          this.newPassSw = true
          return
        }

        if (on_password !== new_password) {
          this.onPassMsg = this.$t(`Module['倆次输入的密码不一致']`)
          this.onPassSw = true
          return
        }
        try {
          this.passLoading = true
          const { Code } = await updatePassword({ old_password, new_password })
          if (Code === 200) {
            this.$toast.success(this.$t(`Module['密码修改成功，请重新登录']`))
          }
          this.passLoading = false
        } catch (error) {
          this.passLoading = false
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.personal_data_warp {

  @apply w-full;

  .item_tabs {
    @apply flex items-center w-full h-80px p-5px mb-40px;
    border-bottom: 1px solid #292929;


    .tab {
      @apply w-1/10 h-full flex justify-center items-center text-16px font-bold text-lightFirst;
      margin-right: 20px;
      cursor: pointer;
    }

    .tab_active {
      @apply text-hex-E6CCAE;
      border-bottom: 2px solid #E6CCAE;
    }
  }



  .item_data {
    @apply flex items-center justify-center;

    .item_save_btn {
      @apply mt-20px rounded-25px text-16px font-bold text-hex-5C330A;
      background: linear-gradient(90deg, #F0B348 0%, #FFF98B 60.43%, #FFD073 100%);
    }
  }
}
</style>