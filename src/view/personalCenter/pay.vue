<template>
  <div class="m_pay_warp">
    <p class="item_h_title !mb-40px">{{$t(`Page['充值']`)}}</p>
    <div class="paly_channel_h">{{$t(`Module['请选择支付渠道']`)}}</div>
    <ul class="paly_channel_list">
      <li
        v-for="(pay,index) in channelList"
        :class="['channel_item',{channel_item_active:activeId===index}]"
        :key="index"
        @click="handlePayClick(index)"
      >
        <page-pageLoad :width="pay.id===8?49:40" height="40" :src="pay.img_url"></page-pageLoad>
        <span class="name">{{pay.name}}</span>
        <div class="recommend" v-if="pay.id===7">
          {{$t(`Module['推荐']`)}}
          <!-- <v-img width="36" height="22" :src="Img.Recommend"></v-img> -->
        </div>
        <span class="active" v-if="activeId===index">
          <v-img width="40" height="40" :src="Img.PayActive"></v-img>
        </span>
      </li>
    </ul>
    <div class="pay_form_box login_form">
      <v-form
        v-model="valid"
        style="width: 450px;"
        ref="payFromRef"
        lazy-validation
        @keydown.enter.native="handleConfirm"
      >
        <template v-if="channelData.pay_channel_cate_id ===8">
          <div class="paly_channel_h">{{$t(`Module['请输入真实姓名']`)}}</div>
          <v-text-field
            v-model="pay.rela_name"
            :placeholder="$t(`Module['请输入真实姓名']`)"
            class="input_item !mb-40px"
            single-line
            outlined
            dense
            :rules="nameRules"
            height="50"
            maxlength="200"
            full-width
          ></v-text-field>
        </template>

        <div class="paly_channel_h">{{$t(`Module['请输入金额']`)}}</div>
        <v-text-field
          v-model="pay.pay_amount"
          :placeholder="$t(`Module['请输入付款金额']`)"
          class="input_item"
          single-line
          outlined
          dense
          type="number"
          hide-spin-buttons
          :rules="amountRules"
          :error-messages="amountMsg"
          :error="amountSw"
          height="50"
          maxlength="200"
          full-width
        ></v-text-field>

        <div class="pay_info_text">
          <div class="text mb-20px">
            <span>{{$t(`Module['最低存款金额']`)}}：{{formatCurrency(channelData.maxmum)}}{{channelData.currency}}</span>
            <span>1{{channelData.currency}}={{formatCurrency(channelData.rate)}} (O{{$t(`Module['币']`)}})</span>
          </div>
          <div class="text">
            <span>{{$t(`Module['最高存款金额']`)}}：{{formatCurrency(channelData.minimum)}}{{channelData.currency}}</span>
          </div>
        </div>

        <v-btn
          :loading="loading"
          depressed
          rounded
          height="50"
          width="200"
          class="pay_on_btn"
          @click="handlePay"
        >{{$t(`Page['充值']`)}}</v-btn>
      </v-form>
    </div>
    <module-dialog
      :dialog.sync="showPay"
      :title="$t(`Module['提交成功']`)"
      :isClose="false"
      width="400"
    >
      <template v-slot:content>
        <div class="pay_dialog" v-if="payLoading">
          <page-pageLoad :src="Img.PayLoading" width="60" height="60"></page-pageLoad>
          <div class="pay_title">{{$t(`Module['请在第三方网站上操作']`)}}</div>
          <div class="pay_sub">{{$t(`Module['请点击下方相应的按钮']`)}}</div>

          <div class="pay_actives">
            <v-btn
              color="#1862C8"
              outlined
              depressed
              width="140"
              height="40"
              rounded="10"
              @click="showPay=false"
            >{{$t(`Module['取消']`)}}</v-btn>
            <v-btn
              depressed
              outlined
              width="140"
              class="btn_submit"
              height="40"
              rounded="10"
              @click="handleConfirm"
            >{{$t(`Module['确认']`)}}</v-btn>
          </div>
        </div>
        <div v-else class="h-60px flex justify-center items-center">
          <v-progress-circular color="primary" indeterminate></v-progress-circular>
        </div>
      </template>
    </module-dialog>
  </div>
</template>

<script>
import { paymentChannel, paymentPay } from '@/api/payment'
import { formatCurrency } from '@/libs/util'
export default {
  data() {
    return {
      channelList: [],
      activeId: -1,
      pay: {
        rela_name: '',
        pay_amount: ''
      },
      payDetail: {},
      valid: false,
      payLoading: false,
      loading: false,
      showPay: false,
      amountMsg: '',
      amountSw: false,
      Img: {
        Recommend: require(`@/${this.$img.Page.User.Recommend}`),
        PayActive: require(`@/${this.$img.Page.User.PayActive}`),
        PayLoading: require(`@/${this.$img.Page.User.PayLoading}`)
      }
    }
  },

  computed: {
    channelData() {
      const { activeId } = this
      return this.channelList[activeId] || {}
    },

    nameRules() {
      return [v => !!v || this.$t(`Module['真实姓名不能为空']`)]
    },

    amountRules() {
      return [v => !!v || this.$t(`Module['金额不能为空']`)]
    }
  },

  mounted() {
    this.paymentChannel()
  },

  methods: {
    handlePayClick(index) {
      this.activeId = index
    },

    formatCurrency(num) {
      return formatCurrency(num)
    },

    async handlePay() {
      this.payDetail = {}
      this.amountSw = false
      this.amountMsg = ''
      const { pay, channelData } = this
      if (this.$refs.payFromRef.validate() && Object.keys(channelData).length) {
        //pay_code 描述：支付编码，渠道接口payment_code不为空 支付方式选择必传 描述：用户付款地址，btc,usdt,eth 必传
        const { id, minimum, maxmum } = channelData
        const { pay_amount, rela_name } = pay
        if (pay_amount < minimum) {
          this.amountSw = true
          this.amountMsg = this.$t(`Module['金额不能小于最低存款金额']`)
          return
        }
        if (pay_amount > maxmum) {
          this.amountSw = true
          this.amountMsg = this.$t(`Module['金额不能大于最高存款金额']`)
          return
        }
        this.loading = true
        this.payLoading = false
        this.showPay = true

        const param = {
          pay_channel_id: id,
          pay_amount: Number(pay_amount),
          rela_name
        }
        const { Data, Code } = await paymentPay(param).catch(() => {
          this.loading = false
        })
        if (Code === 200) {
          this.payDetail = Data
          this.payLoading = true
          this.$refs.payFromRef.reset()
        }
        this.loading = false
      }
    },

    handleConfirm() {
      // this.showPay = false
      if (this.payDetail.jumpUrl) {
        window.open(this.payDetail.jumpUrl, '_blank')
      }
    },

    handlePayValidation() {
      this.handlePay()
    },

    async paymentChannel() {
      const { Code, Data } = await paymentChannel()
      if (Code === 200) {
        this.channelList = Data.channels
        this.activeId = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_pay_warp {
  .paly_channel_h {
    @apply text-16px font-bold pl-20px leading-20px h-20px relative flex items-center mb-20px;
  }
  .paly_channel_h::before {
    content: '';
    @apply absolute w-6px h-20px rounded-3px bg-warning left-0px top-0px;
  }
  .paly_channel_list {
    @apply flex pl-0px items-center flex-wrap w-705px min-h-100px;
    .channel_item {
      @apply flex items-center h-80px w-215px rounded-10px border-1px border-solid border-info p-20px mr-20px mb-20px cursor-pointer relative;
      .name {
        @apply font-bold text-16px ml-10px;
      }
      .recommend {
        @apply absolute top-0px right-0px py-2px px-6px rounded-tr-10px rounded-bl-10px h-18px bg-primaryFirst text-lightFirst text-12px flex items-center justify-center;
      }
      .active {
        @apply absolute;
        bottom: -1px;
        right: -1px;
      }
    }
    .channel_item:hover,
    .channel_item_active {
      @apply border-warning;
    }
  }
  .pay_form_box {
    @apply mt-20px;
    .paly_channel_h {
      @apply mb-10px;
    }
    .pay_on_btn {
      @apply rounded-25px text-lightFirst mt-40px;
      background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
    }
    .pay_info_text {
      @apply flex flex-col;
      .text {
        @apply flex items-center justify-between;
        span {
          @apply text-12px text-info;
        }
      }
    }
  }
}
.pay_dialog {
  @apply py-40px px-50px flex flex-col justify-center items-center;
  .pay_title {
    @apply mt-40px text-16px mb-20px;
  }
  .pay_sub {
    @apply text-12px text-info mb-40px;
  }
  .btn_submit {
    @apply ml-20px text-lightFirst;
    background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
  }
}
</style>