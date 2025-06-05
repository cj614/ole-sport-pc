<template>
  <div class="m_contact_us_warp">
    <span class="contact_img_box">
      <v-img :src="Img.ContactUs" height="260" width="100%"></v-img>
      <div class="text_info">
        <div class="text">{{ $t(`Page['联系我们']`) }}</div>
      </div>
    </span>
    <module-self>
      <div class="contact_us_pd">
        <div class="contact_us_content">
          <div class="contact_us_title">{{ $t(`Module['感谢你的意见或者联系我们商务洽谈']`) }}</div>
          <div class="item_data item_contact_us">
            <v-form v-model="valid" style="width: 1080px;" ref="contactFromRef" lazy-validation>
              <v-text-field :placeholder="$t(`Module['名字']`)" v-model="contactUs.first_name" :rules="firstRules"
                class="input_item input_item_mr" single-line outlined dense height="50" maxlength="200"
                full-width></v-text-field>
              <v-text-field :placeholder="$t(`Module['姓']`)" v-model="contactUs.last_name" :rules="lastRules"
                class="input_item" single-line outlined dense height="50" maxlength="200" full-width></v-text-field>
              <v-text-field placeholder="Email" v-model="contactUs.email" :rules="emailRules"
                class="input_item input_item_mr" single-line outlined dense height="50" maxlength="200"
                full-width></v-text-field>
              <v-text-field :placeholder="$t(`Module['手机号码']`)" :rules="mobileRules" v-model="contactUs.mobile"
                class="input_item" single-line outlined dense height="50" maxlength="200" full-width></v-text-field>
              <v-textarea :placeholder="$t(`Module['留言评论']`)" v-model="contactUs.content" class="input_item" auto-grow
                clearable rows="2" row-height="60" single-line outlined dense maxlength="2000" full-width></v-textarea>
              <v-btn depressed rounded height="50" width="1080" class="item_save_btn" :loading="loading"
                @click="handleSubmit">{{ $t(`Module['发送']`) }}</v-btn>
            </v-form>
          </div>
        </div>
      </div>
    </module-self>
  </div>
</template>

<script>
import { submitContact } from '@/api/sidebar'
//verifyPhone
import { verifyEmail } from '@/libs/util'
export default {
  data() {
    return {
      valid: false,
      loading: false,
      contactUs: {
        first_name: '',
        last_name: '',
        mobile: '',
        email: '',
        content: ''
      },
      CountryData: {},

      Img: {
        ContactUs: require(`@/${this.$img.Page.Home.ContactUs}`)
      }
    }
  },

  computed: {
    CountryCode() {
      const { CountryData } = this
      return CountryData.code || +86
    },
    // mobileRules() {
    //   return [
    //     v => !!v || this.$t(`Module['请输入您的手机号码']`),
    //     // v => v.length < 6 || this.$t(`Module['手机号码不正确']`)
    //   ]
    // },
    mobileRules() {
      const {
        CountryCode,
        CountryData: { country_code }
      } = this

      return [
        v => !!v || this.$t(`Module['请填写手机号']`),
      ]
    },
    firstRules() {
      return [v => !!v || this.$t(`Module['请输入您的名字']`)]
    },
    lastRules() {
      return [v => !!v || this.$t(`Module['请输入您的姓']`)]
    },
    emailRules() {
      return [
        v => !!v || this.$t(`Module['请输入您的电子邮箱']`),
        v => verifyEmail(v) || this.$t(`Module['邮箱不正确']`)
      ]
    }
  },

  methods: {
    async handleSubmit() {
      const {
        contactUs: { first_name, last_name, mobile, email, content }
      } = this
      if (this.$refs.contactFromRef.validate()) {
        try {
          this.loading = true
          const { Code } = await submitContact({
            first_name,
            last_name,
            mobile,
            email,
            content
          })
          if (Code === 200) {

            this.loading = false
            this.contactUs = {
              first_name: '',
              last_name: '',
              mobile: '',
              email: '',
              content: ''
            }
            this.$refs.contactFromRef.reset();  // 清除验证错误
            this.$toast.success(this.$t('Module["发送成功"]'), "Success", {
              position: "topCenter",
              timeout: 1000 * 3,
            })

            // this.$router.go(-1)
          }
        } catch (error) {
          this.loading = false
          throw error
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_contact_us_warp {
  @apply w-full;

  .contact_img_box {
    @apply relative;

    .text_info {
      @apply absolute top-1/2 w-full;

      .text {
        @apply w-1280px my-0px mx-auto font-bold text-36px leading-54px pl-32px text-lightFirst relative;
      }

      .text::before {
        content: '';
        position: absolute;
        top: 0px;
        left: 0px;
        width: 12px;
        height: 60px;
        background: #fff;
      }
    }
  }

  .contact_us_pd {
    @apply py-20px;

    .contact_us_content {
      @apply h-475px bg-lightFirst rounded-10px p-20px;

      .contact_us_title {
        @apply w-full text-center mb-20px text-30px font-bold;
      }

      .item_contact_us {
        @apply flex justify-center;

        .v-form {
          @apply flex flex-wrap;

          .v-input {
            width: 520px;
          }

          .input_item_mr {
            @apply mr-40px;
          }

          .item_save_btn {
            background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
            border-radius: 10px;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>