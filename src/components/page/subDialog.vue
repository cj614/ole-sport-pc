<template>
  <!-- row.Subscribed?'取消预约':'预约' -->
  <module-dialog :dialog.sync="dialog" :title="$t(`Module['预约']`)" @close="closed">
    <template v-slot:content>
      <div class="schedule_dialog" v-if="!subLoading">
        <div class="schedule_anchor" v-if="showSub">
          <ul class="anchor_list">
            <li
              class="anchor_item"
              v-for="(item, index) of modalParams.sub_detail"
              :key="index"
              @click="item.status = !item.status"
            >
              <div class="anchor_info_x">
                <v-avatar width="40" height="40" min-width="40">
                  <v-img :src="item.sub_type == 1 ? Img.LiveLogo : item.user_img_url"></v-img>
                </v-avatar>
                <span
                  class="anchor_title"
                >{{ item.sub_type === 1 ? $t(`Module['OLE 官方']`) : item.user_name }}</span>
              </div>
              <span>
                <v-img :src="item.status ? Img.CheckActive : Img.Check" width="20" height="20"></v-img>
              </span>
            </li>
          </ul>
        </div>

        <div class="schedule_time" :show="showForm">
          <div class="_time" v-if="modalParams.before !== undefined">
            <span class="_time_title">{{$t(`Module['比赛开始']`)}}</span>
            <span class="switch_box" @click.stop="$set(modalParams,'before',!modalParams.before)">
              <page-pageLoad
                height="28"
                width="60"
                currentClass="rounded-full"
                :src="modalParams.before?Img.SwitchActive:Img.Switch"
              ></page-pageLoad>
            </span>
            <!-- <v-switch
              color="#F9B31F"
              inset
              dense
              class="input_switch"
              hide-details
              height="28"
              v-model="modalParams.before"
            ></v-switch>-->
          </div>

          <div class="_time" v-if="modalParams.after !== undefined">
            <span class="_time_title">{{$t(`Module['比赛结束']`)}}</span>
            <span class="switch_box" @click.stop="$set(modalParams,'after',!modalParams.after)">
              <page-pageLoad
                height="28"
                width="60"
                currentClass="rounded-full"
                :src="modalParams.after?Img.SwitchActive:Img.Switch"
              ></page-pageLoad>
            </span>
            <!-- <v-switch
              color="#F9B31F"
              inset
              dense
              class="input_switch"
              height="28"
              hide-details
              v-model="modalParams.after"
            ></v-switch>-->
          </div>
        </div>

        <v-btn
          depressed
          class="schedule_btn"
          outlined
          width="320"
          height="50"
          :loading="loading"
          @click="handleSubmit"
        >{{$t(`Module['确认']`)}}</v-btn>
      </div>
      <div class="schedule_load_dialog" v-else>
        <v-progress-circular indeterminate :value="10" color="primaryFirst"></v-progress-circular>
      </div>
      <!-- <div class="schedule_dialog" v-else>
        <p class="close_title">你确定要取消预约？</p>
        <div class="close_actives">
          <v-btn
            color="#1862C8"
            outlined
            depressed
            width="140"
            height="40"
            @click="dialog = false"
          >取消</v-btn>
          <v-btn
            depressed
            outlined
            width="140"
            class="btn_submit"
            height="40"
            :loading="loading"
            @click="handleConfirm"
          >确认</v-btn>
        </div>
      </div>-->
    </template>
  </module-dialog>
</template>

<script>
import { matchSubscribe, subscribeMatchStatus } from '@/api/live'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },

    anchor: {
      type: Boolean,
      default: false
    },
    anchorId: {
      type: [Number, String],
      default: 0
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      Img: {
        LiveLogo: require(`@/${this.$img.Page.Live.LiveLogo}`),
        Check: require(`@/${this.$img.Page.Layout.Check}`),
        CheckActive: require(`@/${this.$img.Page.Layout.CheckActive}`),
        SwitchActive: require(`@/${this.$img.Page.Layout.SwitchActive}`),
        Switch: require(`@/${this.$img.Page.Layout.Switch}`)
      },
      showDialog: false,
      loading: false,
      subLoading: false,
      dialog: false,
      modalParams: {
        after: false,
        before: false,
        sub_detail: null
      }
    }
  },

  computed: {
    showForm() {
      let { sub_detail } = this.modalParams
      if (sub_detail && sub_detail.length > 0) {
        if (sub_detail.length === 1 && sub_detail[0].sub_type === 1) {
          return true
        } else {
          let diff = sub_detail.filter(item => {
            return item.status
          })
          return diff.length > 0 ? true : false
        }
      } else {
        return true
      }
    },
    showSub() {
      let { sub_detail } = this.modalParams
      let sw = false
      if (sub_detail !== null) {
        if (sub_detail.length > 1) {
          sw = true
        } else {
          if (sub_detail[0].sub_type === 2) {
            sw = true
          }
        }
      }
      return sw
    },
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    }
  },

  methods: {
    closed() {
      this.modalParams = {
        before: false,
        after: false,
        sub_detail: null
      }
    },
    setDialog() {
      this.dialog = true
      this.$nextTick(() => {
        this.subscribeMatchStatus()
      })
    },
    handleSubmit() {
      this.matchSubscribe()
    },

    handleConfirm() {
      this.matchSubscribe()
    },

    subscribeMatchStatus() {
      let { token, row, type } = this
      if (!token) {
        this.$store.dispatch('user/handleLoginOut')
        return
      }
      let { Id, id, sport_type, Type, sportType, matchTime } = row
      sportType = sportType || sport_type || Type
      let body = {}
      if (type === 'match') {
        switch (sportType) {
          case 'FOOTBALL':
          case 'BASKETBALL':
            body.nami_match_id = id
            break
          default:
            body.nami_match_id = id
            break
        }
        body.sport_type = sportType
        body.match_time = matchTime
      } else {
        body.nami_match_id = Id
        body.sport_type = sportType
        body.match_time = matchTime
      }
      this.subLoading = true
      subscribeMatchStatus(body).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          this.modalParams = Data
        }
        this.subLoading = false
      })
    },

    matchSubscribe() {
      let { row, modalParams, type, showSub } = this
      let {
        Id,
        id,
        Subscribed,
        status,
        sport_type,
        sportType,
        match_time,
        UTCTimeStartInt,
        matchTime,
        Type
      } = row
      sportType = sportType || sport_type || Type
      matchTime = matchTime || match_time || UTCTimeStartInt
      let { after, before, sub_detail } = modalParams
      if (!showSub) {
        if (sub_detail !== null) {
          sub_detail.forEach(sub => {
            if (sub.sub_type === 1) {
              sub.status = true
            }
          })
        }
      }
      let body = {
        before,
        after,
        sub_detail
      }
      if (type === 'match') {
        switch (sportType) {
          case 'FOOTBALL':
          case 'BASKETBALL':
            body.nami_match_id = id
            break
          default:
            body.nami_match_id = id
            break
        }
        body.sport_type = sportType
        body.match_time = matchTime
        body.status = status === 4 ? false : true
      } else {
        body.nami_match_id = Id
        body.status = Subscribed ? false : true
        body.sport_type = sportType
        body.match_time = matchTime
      }
      this.loading = true

      matchSubscribe(body)
        .then(res => {
          let { Code, Data } = res
          if (Code === 200) {
            this.loading = false
            this.dialog = false
            this.$bus.$emit('subscribeConfirm', {
              id: body.nami_match_id || body.nami_match_id,
              sport_type: body.sport_type,
              status
            })
            this.$emit('subSuccess', Data.status)
          }
          this.loading = false
        })
        .catch(() => (this.loading = false))
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule_dialog {
  @apply py-40px px-20px text-center;
  .schedule_anchor {
    @apply max-h-400px overflow-y-auto;
    .anchor_list {
      @apply flex flex-col pl-0px items-center;
      .anchor_item {
        @apply h-60px w-full bg-light rounded-10px pl-10px pr-30px flex items-center justify-between mb-10px;
        .anchor_info_x {
          @apply flex items-center;
          .anchor_title {
            @apply ml-10px text-16px font-bold;
          }
        }
      }
    }
  }
  .schedule_time {
    @apply flex-col;
    ._time {
      @apply flex justify-between h-60px items-center;
      ._time_title {
        @apply text-16px;
      }
      .switch_box {
        @apply cursor-pointer;
      }
      .input_switch {
        margin-top: 0px;
        padding-top: 0px;
        .v-input--selection-controls__input {
          width: 60px;
        }
        .v-input--switch__track {
          height: 28px;
          width: 60px;
        }
        .v-input--switch__thumb {
          width: 24px !important;
          height: 24px !important;
        }
      }
    }
  }
  .schedule_btn {
    background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
    border-radius: 10px;
    margin-top: 10px;
    color: #fff;
  }
  .close_title {
    @apply text-16px mb-40px;
  }
  .close_actives {
    @apply flex justify-center;
    .v-btn {
      border-radius: 10px;
    }
    .btn_submit {
      @apply ml-20px text-lightFirst;
      background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
    }
  }
}
.schedule_load_dialog {
  @apply flex h-100px justify-center items-center;
}
</style>
