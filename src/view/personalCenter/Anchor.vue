<template>
  <div class="goLive_warp">
    <p class="item_h_title">{{$t(`Module.User['去直播']`)}}</p>

    <ul class="goLive_step_list">
      <li
        v-for="(item,index) in liveStepList"
        class="step_item"
        :class="{step_item_active:index === stepIndex,['mr-20px']:index<2}"
        :style="{backgroundImage:`url(${index === stepIndex?item.activeIcon:item.icon})`}"
        @click="() => {stepIndex = index}"
        :key="index"
      >
        <div class="step_content">
          <div class="step_count">{{item.step}}</div>
          <div class="step_title">{{item.title}}</div>
        </div>
      </li>
    </ul>

    <div v-if="stepIndex===0" class="item_data login_form">
      <v-form
        v-model="valid"
        style="width: 702px;"
        ref="loginFromRef"
        lazy-validation
        @keydown.enter.native="handleLoginValidation"
      >
        <v-text-field
          :placeholder="$t(`Module.User['请输入邮箱地址/手机号码']`)"
          class="input_item item_wid"
          single-line
          outlined
          dense
          height="50"
          maxlength="25"
          full-width
        >
          <template v-slot:prepend>
            <div class="prepend_title">*邮箱地址/手机号码</div>
          </template>
        </v-text-field>

        <v-text-field
          :placeholder="$t(`Module.User['请输入验证码']`)"
          class="input_item item_wid"
          single-line
          outlined
          dense
          height="50"
          maxlength="25"
          full-width
        >
          <template v-slot:prepend>
            <div class="prepend_title">*验证码</div>
          </template>
          <template #append>
            <login-code :mobile="mobile"></login-code>
          </template>
        </v-text-field>

        <v-textarea
          :placeholder="$t(`Module.User['请输入直播经验']`)"
          class="input_item item_wid"
          single-line
          outlined
          dense
          height="200"
          maxlength="25"
          full-width
        >
          <template v-slot:prepend>
            <div class="prepend_title">直播经验</div>
          </template>
        </v-textarea>

        <div class="step_btn">
          <v-btn depressed rounded height="50" width="200" class="item_save_btn">申请</v-btn>
        </div>
      </v-form>
    </div>

    <div v-if="stepIndex===1">
      <page-empty type="live" title="Congratulations!You are now verified!"></page-empty>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  data() {
    return {
      stepIndex: 0,
      Img: {
        Upload: require(`@/${this.$img.Icon.Other.Upload}`),
        AddPass: require(`@/${this.$img.Icon.Other.AddPass}`),
        setLive: require(`@/${this.$img.Page.User.setLive}`)
      },
      valid: false,
      mobile: ''
    }
  },

  computed: {
    liveStepList() {
      const { Step1, Step3, ActiveStep1, ActiveStep3 } = this.$img.Page.User
      return [
        {
          step: 1,
          title: '直播设定',
          name: 'setRoom',
          icon: require(`@/${Step1}`),
          activeIcon: require(`@/${ActiveStep1}`)
        },
        {
          step: 2,
          title: '开始值班',
          name: 'setLive',
          icon: require(`@/${Step3}`),
          activeIcon: require(`@/${ActiveStep3}`)
        }
      ]
    }
  },

  methods: {
    handleLoginValidation() {}
  }
}
</script>

<style lang="scss" scoped>
.goLive_warp {
  @apply w-full;
  .goLive_step_list {
    @apply pl-0px flex items-center;
    .step_item {
      @apply h-50px w-1/2 flex justify-center items-center cursor-pointer;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      .step_content {
        @apply flex justify-center items-center;
        .step_count {
          @apply w-24px h-24px rounded-1/2 flex justify-center items-center text-16px font-bold font-sans bg-white text-black;
        }
        .step_title {
          @apply font-bold text-16px text-white ml-20px;
        }
      }
    }
    .step_item_active {
      .step_content {
        .step_count {
          @apply text-hex-1862c8;
        }
      }
    }
  }

  .item_data {
    @apply flex items-center justify-center mt-40px;
    .step_btn {
      @apply w-full text-center;
      .item_save_btn {
        @apply mt-40px rounded-25px text-16px font-bold text-white;
        background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
      }
    }

    .item_wid {
      .v-input__prepend-outer {
        .prepend_title {
          @apply w-170px;
        }
      }
    }
  }
}
</style>