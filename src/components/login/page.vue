<template>
  <v-dialog
    v-model="dialog"
    content-class="logindialog"
    width="1000"
    overlay-color="#000000"
    overlay-opacity="0.5"
    @click:outside="handleClick"
  >
    <login-reg
      v-if="comType === 'reg'"
      ref="fromRef"
      :CodeList="MobileCountryCodeList"
      @handleReg="handleReg"
      @handleClose="handleClose"
    ></login-reg>
    <login-login
      v-if="comType === 'login'"
      ref="fromRef"
      :CodeList="MobileCountryCodeList"
      @handleReg="handleReg"
      @handleClose="handleClose"
    ></login-login>
    <login-forget
      v-if="comType === 'forget'"
      ref="fromRef"
      :CodeList="MobileCountryCodeList"
      @handleReg="handleReg"
      @handleClose="handleClose"
    ></login-forget>
  </v-dialog>
</template>

<script>
import { getMobileCountryCodeList } from '@/api/global'
export default {
  props: {
    type: {
      type: String,
      default: 'login'
    },

    showDialog: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialog: false,
      comType: 'login',
      MobileCountryCodeList: [
        {
          code: '+84',
          country: 'Vietnam',
          country_code: 'VN'
        }
      ]
    }
  },

  created() {
    this.getMobileCountryCodeList()
  },

  watch: {
    showDialog: {
      handler(v) {
        this.dialog = v
        this.resetFrom()
      },
      immediate: true
    },

    type: {
      handler(v) {
        this.comType = v
      },
      immediate: true
    }
  },

  methods: {
    async getMobileCountryCodeList() {
      const { Code, Data } = await getMobileCountryCodeList()
      if (Code === 200) {
        this.MobileCountryCodeList = Data
      }
    },

    resetFrom() {
      this.$nextTick(() => {
        this.$refs.fromRef?.reset()
      })
    },

    handleClick(v) {
      this.handleClose(v)
    },

    handleReg(v) {
      this.comType = v || 'reg'
    },

    handleClose() {
      this.$emit('update:showDialog', false)
    }
  }
}
</script>
