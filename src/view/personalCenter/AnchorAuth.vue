<template>
  <div class="au_warp">
    <p class="item_h_title">{{ $t(`Module['主播认证']`) }}</p>

    <ul class="au_step_list">
      <li v-for="(item, index) in liveStepList" class="step_item"
        :class="{ step_item_active: index === stepIndex, ['mr-20px']: index < 2 }"
        :style="{ backgroundImage: `url(${index === stepIndex ? item.activeIcon : item.icon})` }" :key="index">
        <div class="step_content">
          <div class="step_count">{{ item.step }}</div>
          <div class="step_title">{{ item.title }}</div>
        </div>
      </li>
    </ul>

    <div class="item_data login_form">
      <v-form v-model="valid" style="width: 500px;" ref="anchorFromRef" lazy-validation
        @keydown.enter.native="handleLoginValidation">
        <div class="input_box">
          <div class="prepend_title_re">
            <span class="text-error">*</span>Email
          </div>
          <v-text-field :placeholder="$t(`Module['请输入邮箱地址']`)" v-model="anchor.email" class="input_item item_wid"
            single-line outlined dense height="50" maxlength="200" :rules="emailRule" :error-messages="emailMsg"
            :error="emailSw" full-width></v-text-field>
        </div>

        <div class="input_box" v-if="!(stepIndex === 1 && anchor.status != 1)">
          <div class="prepend_title_re">
            <span class="text-error">*</span>
            {{ $t(`Module['验证码']`) }}
          </div>
          <v-text-field :placeholder="$t(`Module['请输入验证码']`)" v-model="anchor.code"
            class="input_item item_wid item_code_mt" single-line outlined dense height="50" maxlength="25"
            hide-spin-buttons type="number" :rules="codeRule" full-width>
            <template #append>
              <login-code :email="anchor.email" type="email" ref="codeRef"
                @errMsg="(t) => { emailSw = true; emailMsg = t }"
                @offMsg="() => { emailSw = false; emailMsg = '' }"></login-code>
            </template>
          </v-text-field>
        </div>

        <div class="input_box">
          <div class="prepend_title_re">{{ $t(`Module['直播经验']`) }}</div>
          <v-textarea :placeholder="$t(`Module['请输入直播经验']`)" v-model="anchor.info" class="input_item item_wid"
            single-line outlined dense height="200" maxlength="25" full-width></v-textarea>
        </div>

        <div class="item_status_box input_box" v-if="stepIndex === 1">
          <span class="status_txt prepend_title_re">{{ $t(`Module['状态']`) }}</span>
          <v-chip :color="getStatusColor()" class="chip_status" outlined>{{ getStatusTxt() }}</v-chip>
        </div>

        <div class="step_btn_au">
          <v-btn v-if="stepIndex === 0" depressed rounded height="50" min-width="200" class="item_save_btn"
            :loading="loading" @click="handleCreateAnchor">{{ $t(`Module['申请']`) }}</v-btn>
          <v-btn v-if="stepIndex === 1 && anchor.status == 1" depressed rounded height="50" min-width="200"
            class="item_save_btn" :loading="loading" @click="handleEditAnchor">{{ $t(`Module['编辑']`) }}</v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import { createAnchor, updateAnchor } from '@/api/anchor'

import { verifyEmail } from '@/libs/util'
export default {
  name: '',

  data() {
    return {
      stepIndex: 0,
      valid: false,
      anchor: {
        info: '',
        email: '',
        code: ''
      },
      loading: false,
      emailMsg: '',
      emailSw: false
    }
  },

  computed: {
    liveStepList() {
      const { Step1, Step3, ActiveStep1, ActiveStep3 } = this.$img.Page.User
      return [
        {
          step: 1,
          title: this.$t(`Module['直播设定']`),
          name: 'setRoom',
          icon: require(`@/${Step1}`),
          activeIcon: require(`@/${ActiveStep1}`)
        },
        {
          step: 2,
          title: this.$t(`Module['开始直播2']`),
          name: 'setLive',
          icon: require(`@/${Step3}`),
          activeIcon: require(`@/${ActiveStep3}`)
        }
      ]
    },

    emailRule() {
      return [
        v => !!v || this.$t(`Module['请填写邮箱号']`),
        v => verifyEmail(v) || this.$t(`Module['邮箱地址不正确']`)
      ]
    },

    codeRule() {
      return [v => !!v || this.$t(`Module['请输入验证码']`)]
    },

    anchorDetail() {
      return this.$store.state.app.globalAnchorDetail
    }
  },

  watch: {
    anchorDetail: {
      handler() {
        this.getAnchorDetail()
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.getAnchorDetail()
    })
  },

  methods: {
    getAnchorDetail() {
      const { anchorDetail } = this
      if (anchorDetail.user_id > 0) {
        this.stepIndex = 1
      }
      this.anchor.info = anchorDetail.info
      this.anchor.email = anchorDetail.email
      this.anchor.status = anchorDetail.status
    },

    handleLoginValidation() {
      if (this.stepIndex === 0) {
        this.handleCreateAnchor()
      } else {
        this.handleEditAnchor()
      }
    },

    getStatusTxt() {
      const {
        anchor: { status }
      } = this
      return status == 0
        ? this.$t(`Module['待审核']`)
        : status == 1
          ? this.$t(`Module['停用']`)
          : this.$t(`Module['通过']`)
    },

    getStatusColor() {
      const {
        anchor: { status }
      } = this
      return status == 0 ? 'primary' : status == 1 ? 'error' : 'success'
    },

    async handleEditAnchor() {
      try {
        const {
          anchor: { info, email, code }
        } = this
        this.emailMsg = ''
        this.emailSw = false
        if (this.$refs.anchorFromRef.validate()) {
          this.loading = true
          const { Code } = await updateAnchor({ info, email, code })
          if (Code === 200) {
            this.stepIndex = 1
            this.anchor.code = ''
            // this.$toast.success('修改成功')
            this.$refs.codeRef.reset()
            this.$store.dispatch('app/handleAnchorDetail')
          }
          this.loading = false
        }
      } catch (error) {
        this.loading = false
      }
    },

    async handleCreateAnchor() {
      try {
        const {
          anchor: { info, email, code }
        } = this
        this.emailMsg = ''
        this.emailSw = false
        if (this.$refs.anchorFromRef.validate()) {
          this.loading = true
          const { Code } = await createAnchor({ info, email, code })
          if (Code === 200) {
            this.stepIndex = 1
            this.anchor.code = ''
            // this.$toast.success('创建成功')
            this.$refs.codeRef.reset()
          }
          this.loading = false
        }
      } catch (error) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.au_warp {
  @apply w-full;

  .au_step_list {
    @apply pl-0px flex items-center;

    .step_item {
      @apply h-50px w-1/2 flex justify-center items-center cursor-pointer;
      background-size: 100% 100%;
      background-repeat: no-repeat;

      .step_content {
        @apply flex justify-center items-center;

        .step_count {
          @apply w-24px h-24px rounded-1/2 flex justify-center items-center text-16px font-bold font-sans bg-lightFirst text-dark;
        }

        .step_title {
          @apply font-bold text-16px text-lightFirst ml-20px;
        }
      }
    }

    .step_item_active {
      .step_content {
        .step_count {
          @apply text-primaryFirst;
        }
      }
    }
  }

  .item_data {
    @apply flex items-center justify-center mt-40px;

    .step_btn_au {
      @apply w-full;

      .item_save_btn {
        @apply mt-40px rounded-25px text-16px font-bold text-hex-5C330A;
        background: linear-gradient(90deg, #F0B348 0%, #FFF98B 60.43%, #FFD073 100%);
      }
    }

    .item_status_box {
      @apply flex items-center;

      .status_txt {
        @apply w-170px text-right text-dark text-16px font-bold leading-50px mr-20px;
      }

      .chip_status {
        @apply overflow-auto whitespace-normal break-all min-h-32px h-auto;
      }
    }

    .item_wid {
      .v-input__prepend-outer {
        color: #fff;

        .prepend_title {
          @apply w-170px;
        }
      }
    }
  }
}
</style>