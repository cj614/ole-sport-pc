<template>
  <div class="goLive_warp">
    <p class="item_h_title">{{ $t(`Module['去直播']`) }}</p>

    <ul class="goLive_step_list">
      <li v-for="(item, index) in liveStepList" class="step_item" :class="{
        step_item_active: index === stepIndex,
        ['mr-20px']: index < 2
      }" :style="{
        backgroundImage: `url(${index === stepIndex ? item.activeIcon : item.icon
          })`
      }" :key="index">
        <div class="step_content">
          <div class="step_count">{{ item.step }}</div>
          <div class="step_title">{{ item.title }}</div>
        </div>
      </li>
    </ul>

    <p v-if="stepIndex === 2" class="step_3_msg">
      {{
        $t(
          `Module['提示：恭喜您已经开播了！您还可以在下方修改房间信息，或者立即进入']`
        )
      }}
      <span @click.stop="handleClickLice">{{ $t(`Module['我的直播间']`) }}</span>
    </p>

    <div v-if="stepIndex === 0 || stepIndex === 2" class="item_data login_form">
      <v-form v-model="valid" style="width: 500px" ref="roomFromRef" lazy-validation
        @keydown.enter.native="handleLiveValidation(1)">
        <div class="input_box">
          <div class="prepend_title_re">{{ $t(`Module['房间名']`) }}</div>
          <v-text-field  color="white" :placeholder="$t(`Module['请填写房间名']`)" v-model="live.title" class="input_item" single-line
            outlined dense :rules="titleRule" height="50" maxlength="200" full-width></v-text-field>
        </div>

        <div class="input_box">
          <div class="prepend_title_re">{{ $t(`Module['视频介绍']`) }}</div>
          <v-text-field  color="white" :placeholder="$t(`Module['视频介绍']`)" v-model="live.remark" class="input_item" single-line
                        outlined dense :rules="descRule" height="50" maxlength="200" full-width></v-text-field>
        </div>

<!--        <div class="input_box">-->
<!--          <div class="prepend_title_re">{{ $t(`Module['类型']`) }}</div>-->
<!--          <v-autocomplete :placeholder="$t(`Module['请输入类型']`)" class="input_item" v-model="live.sport_types_id" outlined-->
<!--            dense item-text="text" item-value="id" :items="matchTagList" height="50" full-width-->
<!--            :disabled="stepIndex === 2" :rules="sportRule"></v-autocomplete>-->
<!--        </div>-->

<!--        <div class="input_box">-->
<!--          <div class="prepend_title_re">{{ $t(`Module['赛事']`) }}</div>-->
<!--          <v-autocomplete :placeholder="$t(`Module['请输入赛事']`)" class="input_item" v-model="live.glive_matches_id"-->
<!--            item-text="text" item-value="Id" :items="matchesList" single-line outlined dense :rules="matchRule"-->
<!--            :disabled="!live.sport_types_id || stepIndex === 2" @focus="handleSportTypes" height="50" maxlength="25"-->
<!--            full-width></v-autocomplete>-->
<!--        </div>-->

<!--        <div class="editor_box" v-for="(item, index) in live.contentList" :key="index">-->
<!--          <span class="edit_sub">{{ $t(`Module['公告']`) }}{{ index + 1 }}</span>-->
<!--          <div class="edit_item">-->
<!--            <vue-editor v-model="item.content" :placeholder="$t(`Module['请输入公告']`)" @text-change="handleTextChange"-->
<!--              :toolbar="false" ref="addEditor" :editor-toolbar="customToolbar" />-->
<!--            <span class="add_img" v-if="index === live.contentList.length - 1" @click.stop="handleAddNotice">-->
<!--              <v-img :src="Img.AddPass" width="50" height="50"></v-img>-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
        <div class="input_box">
          <div class="prepend_title_re">{{ $t(`Module['封面图']`) }}</div>
          <v-file-input v-bind:key="fileInputKey" show-size class="file_item" accept="image/*" single-line outlined
            dense height="50" required prepend-icon hide-input @change="handleFileChange" id="liveImg">
            <template v-slot:append-outer>
              <div class="bg_file_content" :class="{ bg_file_content_err: imgSw }">
                <template v-if="!imgLoading">
                  <div class="upload_msg cursor-pointer" v-if="!live.img_url && !live.local_img_url"
                    @click.stop="handleUpdateLiveImg">
                    <page-pageLoad :src="Img.Upload" @click="handleUpdateLiveImg" height="30px"
                      width="30px"></page-pageLoad>
                    <span class="upload_title">{{ $t(`Module['上传封面']`) }}</span>
                  </div>
                  <page-pageLoad v-else :src="live.local_img_url || live.img_url" currentClass="bgImg" height="280"
                    width="500"></page-pageLoad>
                </template>
                <template v-else>
                  <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
                </template>

                <div class="footer_msg">
                  <div class="footer_content_actives">
                    <span class="info_x" style="background: none; border: none">
                      {{ $t(`Module['不合适']`) }}？
                      <span class="info_col cursor-pointer" @click.stop="handleUpdateLiveImg">{{ $t(`Module['重新上传']`)
                      }}</span>
                    </span>
                    <span class="info_x info_col" @click.stop="handleGetCover">{{ $t(`Module['获取OBS画面']`) }}</span>
                    <div class="content_footer_err" v-if="imgSw">
                      <span>{{ $t(`Module['请选择封面']`) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </v-file-input>
        </div>

        <div class="step_btn" v-if="stepIndex === 0">
          <v-btn depressed rounded :loading="stepLoading" height="50" width="200" class="item_save_btn"
            @click="handleCreateRoom">{{ $t(`Module['下一步']`) }}
          </v-btn>
        </div>

        <div class="step_btn_2" v-if="stepIndex === 2">
          <v-btn depressed rounded height="50" min-width="200" class="item_save_btn btn_1" :loading="stepLoading"
            @click="handleUpdateLiveRoom">{{ $t(`Module['编辑直播']`) }}
          </v-btn>
          <v-btn depressed rounded outlined height="50" min-width="200" color="#F9B31F" class="item_save_btn"
            :loading="closeLoading" @click="handleCloseLiveRoom">{{ $t(`Module['关闭直播']`) }}
          </v-btn>
        </div>
      </v-form>
    </div>

    <div v-if="stepIndex === 1" class="item_data login_form">
      <v-form v-model="valid" style="width: 500px" ref="liveFromRef" lazy-validation
        @keydown.enter.native="handleLiveValidation(2)">
        <div class="input_box">
          <div class="prepend_title_re">{{ $t(`Module['安装OBS']`) }}</div>
          <div class="other_content">
            <v-btn depressed rounded height="50" class="other_btn" @click="handleObsLink">{{ $t(`Module['下载OBS']`) }}
            </v-btn>
          </div>
        </div>

        <div class="input_box">
          <div class="prepend_title_re">{{ $t(`Module['服务器']`) }}</div>
          <v-text-field v-model="liveRep.obs_server" class="input_item live_item" single-line outlined dense height="50"
            maxlength="25" :type="!showServeEye ? 'password' : 'text'"
            :append-icon="!showServeEye ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (showServeEye = !showServeEye)" full-width>
            <template v-slot:append-outer>
              <span class="other_img cursor-pointer">
                <v-img :src="Img.AddPass" width="50" v-clipboard:copy="liveRep.obs_server"
                  v-clipboard:success="firstCopySuccess" v-clipboard:error="firstCopyError" height="50"></v-img>
              </span>
            </template>
          </v-text-field>
        </div>

        <div class="input_box">
          <div class="prepend_title_re">{{ $t(`Module['串流秘钥']`) }}</div>
          <v-text-field class="input_item live_item" v-model="liveRep.tx_secret_str" single-line outlined dense
            height="50" maxlength="25" :type="!showPassEye ? 'password' : 'text'"
            :append-icon="!showPassEye ? 'mdi-eye' : 'mdi-eye-off'" @click:append="() => (showPassEye = !showPassEye)"
            click:append full-width>
            <template v-slot:append-outer>
              <span class="other_img cursor-pointer">
                <v-img :src="Img.AddPass" v-clipboard:copy="liveRep.tx_secret_str"
                  v-clipboard:success="firstCopySuccess" v-clipboard:error="firstCopyError" width="50"
                  height="50"></v-img>
              </span>
            </template>
          </v-text-field>
        </div>

        <div class="other_content !h-244px">
          <span class="other_img">
            <v-img :src="Img.setLive" width="500" height="244"></v-img>
          </span>
        </div>

        <div class="step_btn_2">
          <v-btn depressed rounded height="50" min-width="200" class="item_save_btn btn_1" :loading="stepLoading"
            @click="handleGoLive">{{ $t(`Module['开始直播']`) }}
          </v-btn>
          <v-btn depressed rounded outlined height="50" min-width="200" color="#F9B31F" class="item_save_btn"
                 :loading="closeLoading" @click="handleCloseLiveRoom">{{ $t(`Module['关闭直播']`) }}
          </v-btn>
          <v-btn depressed rounded outlined height="50" min-width="200" color="#F9B31F" class="item_save_btn"
            @click="handleViewObs">{{ $t(`Module['观看OBS教程']`) }}
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import { getLiveMatchList } from '@/api/live'
import { postImg } from '@/api/global'
import {
  createRoom,
  updateRoom,
  getRoomDetail,
  getCoverImg,
} from '@/api/room'
import { createNotice, getNoticeRoomList, updateNotice } from '@/api/notice'

import { setWithExpire, storageRemove } from '@/libs/util'

import { VueEditor } from 'vue2-editor'
import { scrollToTop } from '@/libs/util'

export default {
  name: '',

  components: { VueEditor },

  data() {
    return {
      fileInputKey: 0,
      roomKey: 'NOW_LIVE_ROOM_ID',
      stepIndex: 0,
      Img: {
        Upload: require(`@/${this.$img.Page.User.Upload}`),
        AddPass: require(`@/${this.$img.Page.User.AddPass}`),
        setLive: require(`@/${this.$img.Page.User.setLive}`)
      },
      matches: [],
      live: {
        title: '',
        sport_types_id: '',
        glive_matches_id: '',
        contentList: [{ content: '' }],
        text: '',
        img_url: '',
        local_img_url: '',
        status: 1,
        remark: ''
      },
      liveRep: {
        obs_server: '',
        tx_secret_str: ''
      },
      imgLoading: false,
      closeLoading: false,
      imgSw: false,
      stepLoading: false,
      showPassEye: false,
      showServeEye: false,

      valid: false,
      customToolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ header: 1 }, { header: 2 }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }], //显示字体选择
        [{ align: [] }], // 对齐方式-----
        ['clean'], // 清除文本格式-----
        ['link']
      ]
    }
  },

  created() {
    this.getRoomList()
  },

  computed: {
    liveStepList() {
      const { Step1, Step2, Step3, ActiveStep1, ActiveStep2, ActiveStep3 } =
        this.$img.Page.User
      return [
        {
          step: 1,
          title: this.$t(`Module['房间设定']`),
          name: 'setRoom',
          icon: require(`@/${Step1}`),
          activeIcon: require(`@/${ActiveStep1}`)
        },
        {
          step: 2,
          title: this.$t(`Module['直播设定']`),
          name: 'setLive',
          icon: require(`@/${Step2}`),
          activeIcon: require(`@/${ActiveStep2}`)
        },
        {
          step: 3,
          title: this.$t(`Module['开始直播2']`),
          name: 'goLive',
          icon: require(`@/${Step3}`),
          activeIcon: require(`@/${ActiveStep3}`)
        }
      ]
    },

    matchTagData() {
      return this.$store.state.app.matchTagList.filter(r => r.type !== 'ANCHOR')
    },

    matchTagList() {
      let { matchTagData } = this

      return matchTagData.map(item => {
        return {
          ...item,
          text: this.$t(`Module['${item.text}']`)
        }
      })
    },

    matchesList() {
      const { matches } = this
      return matches.map(r => ({ ...r, text: r.Home + ' VS ' + r.Away }))
    },

    titleRule() {
      return [v => !!v || this.$t(`Module['请填写房间名']`)]
    },

    descRule() {
      return [v => !!v || this.$t(`Module['请填写视频介绍']`)]
    },

    sportRule() {
      return [v => !!v || this.$t(`Module['请输入类型']`)]
    },

    matchRule() {
      return [v => !!v || this.$t(`Module['请输入赛事']`)]
    },

    noticeRule() {
      return [v => !!v || this.$t(`Module['请输入公告']`)]
    },

    userInfo() {
      let info = JSON.parse(this.$store.state.user.userInfo) || {}
      return {
        ...info
      }
    },

    userId() {
      let { user } = this.userInfo
      return user?.id || ''
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    }
  },

  methods: {
    async getRoomList() {
      this.live.roomId = 0
      this.getLiveRoomDetails()
    },
    firstCopySuccess() {
      this.$toast.success(this.$t(`Module['复制成功']`))
    },

    firstCopyError() {
      this.$toast.warning(this.$t(`Module['裁剪失败']`))
      // this.$toast.warning('复制失败')
    },

    handleObsLink() {
      window.open('https://obsproject.com/', '_blank')
    },

    handleViewObs() {
      window.open(
        'https://www.tencentcloud.com/document/product/267/31569',
        '_blank'
      )
    },

    handleClickLice() {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      const {
        liveRep: {
          res: { id }
        }
      } = this
      if (id) {
        this.$router.push({ name: 'anchorRoom', params: { id } })
      }
    },

    async handleGetCover() {
      try {
        this.imgLoading = true
        const { Data, Code } = await getCoverImg()
        if (Code === 200) {
          if (Data.img_url) {
            this.live.local_img_url = ''
            this.live.img_url = Data.img_url
          } else {
            this.$toast.warning('暂时无封面')
          }
        }
        this.imgLoading = false
      } catch (error) {
        this.imgLoading = false
        throw error
      }
    },

    handleLiveValidation(type) {
      if (type === 1) {
        if (this.stepIndex === 0) {
          this.handleCreateRoom()
        } else {
          this.handleUpdateLiveRoom()
        }
      } else {
        this.handleGoLive()
      }
    },

    handleSportTypes() {
      this.getLiveMatchList()
    },

    async getLiveMatchList() {
      const {
        $date,
        live: { sport_types_id },
        matchTagData
      } = this
      let now = $date()
      let start = now.subtract('12', 'hour')
      let end = now.add('12', 'hour')
      const params = {
        start: String(Math.floor($date(start).valueOf() / 1000)),
        end: String(Math.floor($date(end).valueOf() / 1000)),
        page: 1,
        limit: 500,
        sport_type: matchTagData.find(f => f.id === sport_types_id)?.type
      }
      const { Code, Data } = await getLiveMatchList(params)
      if (Code === 200) {
        const { Data: List } = Data
        this.matches = List
      }
    },

    async getLiveRoomDetails() {
      const { Data, Code } = await getRoomDetail({ id: 0 })
      if (Code === 200) {
        const { live, liveRep } = this
        const { data } = Data
        if (data.status === 0 && data.user_id > 0) {
          this.stepIndex = 1
        } else if (data.status === 1 && data.user_id > 0) {
          this.stepIndex = 2
        } else {
          this.stepIndex = 0
          storageRemove(this.roomKey)
          return
        }
        live.title = data.title
        live.img_url = data.img_url
        live.glive_matches_id = data.all_match_id
        live.sport_types_id = data.sport_types_id
        liveRep.res = data
        liveRep.obs_server = data.obs_server
        liveRep.tx_secret_str = data.obs_key
        live.roomId = data.id

        this.getLiveMatchList()
        this.getNoticeRoomList()
      }
    },

    async getNoticeRoomList() {
      const { roomId } = this.live
      const params = {
        related_id: roomId,
        notice_type: '4',
        limit: 500,
        page: 1
      }
      const { Data, Code } = await getNoticeRoomList(params)
      if (Code === 200) {
        const { Data: list } = Data
        if (list.length) {
          this.live.contentList = list
        }
      }
    },

    async handleCreateRoom() {
      const {
        live: { title, img_url,remark }
      } = this
      if (this.$refs.roomFromRef.validate()) {
        try {
          if (!img_url) {
            this.imgSw = true
            return
          }
          this.stepLoading = true
          const { Code, Data } = await createRoom({
            title,
            img_url,
            remark,
          })
          if (Code === 200) {
            this.stepIndex = 1
            this.liveRep = Data
            //创建公告
            const {
              res: { id }
            } = Data
            setWithExpire(this.roomKey, id)
            this.live.roomId = id
            this.createNotice(id)
          }
          this.stepLoading = false
        } catch (error) {
          this.stepLoading = false
          throw error
        }
      } else {
        scrollToTop()
      }
    },

    async handleGoLive() {
      try {
        const {
          live: { title, sport_types_id, glive_matches_id, img_url, status },
          liveRep: {
            res: { id }
          }
        } = this
        if (id) {
          this.stepLoading = true
          const { Code, Data } = await updateRoom({
            title,
            sport_types_id,
            glive_matches_id,
            img_url,
            status,
            id
          })

          if (Code === 200) {
            this.stepIndex = 2
            this.liveRep = Data
          }
          this.stepLoading = false
        }
      } catch (error) {
        this.stepLoading = false
        throw error
      }
    },

    async handleUpdateLiveRoom() {
      try {
        const {
          live: { title, sport_types_id, glive_matches_id, img_url, status },
          liveRep: {
            res: { id }
          }
        } = this
        if (id && this.$refs.roomFromRef.validate()) {
          if (!img_url) {
            this.imgSw = true
            return
          }
          this.stepLoading = true
          const { Code, Data } = await updateRoom({
            title,
            sport_types_id,
            glive_matches_id,
            img_url,
            status,
            id
          })

          if (Code === 200) {
            this.stepIndex = 2
            this.liveRep = Data
            this.updateNotice()
            // this.$toast.success('编辑成功')
          }

          this.stepLoading = false
        } else {
          scrollToTop()
        }
      } catch (error) {
        this.stepLoading = false
        throw error
      }
    },

    async handleCloseLiveRoom() {
      try {
        const {
          liveRep: {
            res: { id }
          }
        } = this
        if (id) {
          this.closeLoading = true
          const { Code } = await updateRoom({
            status: 2,
            id
          })
          if (Code === 200) {
            // this.$toast.success('关闭成功')
            storageRemove(this.roomKey)
            this.stepIndex = 0
            this.$nextTick(() => {
              this.live = {
                title: '',
                sport_types_id: '',
                glive_matches_id: '',
                contentList: [{ content: '' }],
                text: '',
                img_url: '',
                local_img_url: '',
                status: 1
              }
              this.liveRep = {
                obs_server: '',
                tx_secret_str: ''
              }
              this.$refs.roomFromRef?.reset()
            })
          }
          this.closeLoading = false
        }
      } catch (error) {
        this.closeLoading = false
        throw error
      }
    },

    handleTextChange(range, oldRange) {
      let arr = oldRange.ops || []
      let str = ''
      for (let txt of arr) {
        str += txt.insert
      }

      this.live.text = str
    },

    async updateNotice() {
      const {
        live: { contentList }, //text
        liveRep: {
          res: { id }
        }
      } = this
      for (let cl of contentList) {
        if (cl.content && cl.id) {
          await updateNotice({
            id: cl.id,
            notice_type: 4,
            title: null,
            content: cl.content
          })
        } else if (cl.content) {
          await createNotice({
            related_id: id,
            title: null,
            content: cl.content,
            notice_type: 4
          })
        }
      }
      this.getNoticeRoomList()
    },

    handleAddNotice() {
      this.live.contentList.push({ content: '' })
    },

    async createNotice(id) {
      const {
        live: { contentList } //text
      } = this
      for (let cl of contentList) {
        if (cl.content) {
          await createNotice({
            related_id: id,
            title: null,
            content: cl.content,
            notice_type: 4
          })
        }
      }
      this.getNoticeRoomList()
    },

    setImg(file) {
      let than = this
      this.imgLoading = true
      var reader = new FileReader() // 创建FileReader对象
      reader.onload = function (e) {
        // 文件读取成功完成后的处理

        var dataURL = e.target.result
        than.live.local_img_url = dataURL
        than.imgLoading = false
      }
      reader.readAsDataURL(file)
    },

    handleFileChange(file) {
      if (file) {
        if (file.size > 1000000) {
          this.$toast.error('image size should be less than 1 MB!', "Error", {
            position: "topCenter",
            timeout: 1000 * 3,
            balloon: true,
            color: "red",
            messageSize: '16px', // 设置消息字体大小
          })
          this.imgSw = false
          this.imgLoading = false
          this.fileInputKey += 1
          return
        }
        this.imsSw = false
        // this.imgLoading = true
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'live_room')
        this.setImg(file)
        postImg(formData)
          .then(res => {
            const { Code, Data } = res
            if (Code == 200) {
              this.live.img_url = Data
            }
            this.imgSw = false
            this.imgLoading = false
          })
          .catch(() => {
            this.imgSw = false
            this.imgLoading = false
          })
      }
    },

    handleUpdateLiveImg() {
      let input = this.$el.querySelector('#liveImg')
      if (input) {
        input.click() // 触发文件选择对话框
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goLive_warp {
  @apply w-full;
  .goLive_step_list {
    @apply pl-0px flex items-center;

    .step_item {
      @apply h-50px w-1/3 flex justify-center items-center;
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

  .step_3_msg {
    color: #F9B31F;
    @apply mt-20px text-15px font-bold;

    >span {
      @apply text-primaryFirst cursor-pointer;
    }
  }

  .item_data {
    @apply flex items-center justify-center mt-40px;

    .editor_box {
      @apply flex mb-22px relative;

      .edit_sub {
        @apply absolute text-16px font-bold text-dark w-180px text-right leading-50px mr-20px;
        left: -200px;
      }

      .edit_item {
        @apply relative;

        .add_img {
          @apply absolute top-10px cursor-pointer;
          right: -70px;
        }
      }

      .quillWrapper {
        @apply w-500px;
      }
    }

    .step_btn {
      @apply w-full text-center;

      .item_save_btn {
        @apply mt-40px rounded-25px text-16px font-bold text-lightFirst;
        background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
      }
    }

    .step_btn_2 {
      @apply w-full flex items-center justify-between;

      .item_save_btn {
        @apply mt-40px rounded-25px text-16px font-bold text-lightFirst;
      }

      .btn_1 {
        background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
      }
    }

    .other_content {
      @apply w-full flex h-50px mb-20px overflow-hidden relative;

      .other_title {
        @apply absolute text-16px font-bold text-dark w-180px text-right leading-50px mr-20px;
        left: -200px;
      }

      .other_btn {
        @apply rounded-10px text-16px font-bold text-lightFirst flex-1;
        background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
      }

      .other_img {
        @apply flex-1;
      }
    }

    .live_item {
      .v-input__append-inner {
        .v-input__icon {
          @apply mb-12px;
        }
      }

      .v-input__append-outer {
        @apply absolute;
        top: -12px;
        right: -65px;
      }
    }

    .bg_file_content {
      @apply w-500px h-280px border-1px border-info border-solid rounded-10px flex relative justify-center items-center;

      .upload_msg {
        @apply flex items-center justify-center flex-col;

        .upload_title {
          @apply font-normal text-white text-14px mt-10px;
        }
      }

      .bgImg {
        @apply border-1px border-info border-solid rounded-10px;
      }

      .footer_msg {
        @apply absolute w-full bottom--24px left-0px;
        bottom: -25px;

        .footer_content_actives {
          @apply flex justify-between items-center relative;

          .info_x {
            @apply font-bold text-14px text-white;
          }

          .info_col {
            @apply cursor-pointer text-warning;
          }

          .content_footer_err {
            @apply absolute left-5px mt-5px;
            bottom: -20px;

            >span {
              @apply text-12px;
              word-break: break-word;
              color: #ed3f14;
            }
          }
        }
      }
    }

    .bg_file_content_err {
      @apply border-hex-ed3f14;
    }
  }
}
</style>
