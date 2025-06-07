<template>
  <div class="m_app_warp" :style="{ backgroundImage: `url(${Img.Appbg})` }">
    <div class="app_content">
      <div class="app_sucai">
        <span>
          <v-img :src="getCurrentThemeMode() === 'light' ? Img.SuCai : Img.SuCaiDark" width="429" height="527"></v-img>
        </span>
      </div>
      <div class="app_group">
        <div class="app_sys">
          <div class="sys_Bg">
            <div class="imgboxs">
              <vue-qrcode v-if="Img.IosDownload" :value="Img.IosDownload" :options="{ width: 160 }"></vue-qrcode>
              <span class="corner top-left"></span>
              <span class="corner top-right"></span>
              <span class="corner bottom-left"></span>
              <span class="corner bottom-right"></span>
            </div>

          </div>
          <!-- <div class="sys_img">
            <span>
              <v-img :src="Img.Ios" width="40" height="48"></v-img>
            </span>
          </div> -->
          <div class="sys_title">{{ 'iOS' + $t(`Module['扫码下载']`) }}</div>
          <!-- <div class="sys_date">{{ Img.Date }}</div> -->
          <div class="sys_btn">
            <v-btn depressed rounded class="sys_btn_item" height="46" width="148" @click="handleApp('iso')">{{
              $t(`Module['安裝教程']`) }}</v-btn>
          </div>
        </div>

        <div class="app_sys">
          <div class="sys_Bg">

            <div class="imgboxs">
              <vue-qrcode v-if="Img.AndroidDownload" :value="Img.AndroidDownload"
                :options="{ width: 160 }"></vue-qrcode>
              <span class="corner top-left"></span>
              <span class="corner top-right"></span>
              <span class="corner bottom-left"></span>
              <span class="corner bottom-right"></span>
            </div>
          </div>
          <!-- <div class="sys_img">
            <span>
              <v-img :src="Img.Android" width="40" height="48"></v-img>
            </span>
          </div> -->
          <div class="sys_title">{{ 'Android' + $t(`Module['扫码下载']`) }}</div>
          <!-- <div class="sys_date">{{ Img.Date }}</div> -->
          <div class="sys_btn">
            <v-btn depressed rounded class="sys_btn_item" height="46" width="148" @click="handleApp('an')">{{
              $t(`Module['安裝教程']`) }}</v-btn>
          </div>
        </div>
      </div>
    </div>
    <module-dialog :title="$t(`Module['安裝教程']`)" :dialog.sync="show" width="900">
      <template v-slot:content>
        <ul class="add_install_course !px-9px">
          <li v-for="(item, index) in list" :class="['course_item', { course_pad: (index + 1) % 2 === 0 }]" :key="index"
            @click="viewImg(index)">
            <page-pageLoad :width="item.width" :height="item.height" :src="item.img"></page-pageLoad>
            <div class="step_item">
              <span>
                <v-img width="18" height="9" :src="Img.LeftArrow"></v-img>
              </span>
              <span class="text">{{ item.text }}</span>
              <span>
                <v-img width="18" height="9" :src="Img.RightArrow"></v-img>
              </span>
            </div>
          </li>
        </ul>
      </template>
    </module-dialog>
    <viewer class="images" ref="viewer" :options="Options" :images="list" @inited="inited">
      <template slot-scope="scope">
        <img v-for="src in scope.images" v-show="0" :src="src.img" :key="src.id" class="image" />
      </template>
    </viewer>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import { component as viewer } from 'v-viewer'
import { homeDownLoad } from '@/api/global'
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { getCurrentThemeMode } from "@/libs/util";

export default {
  components: {
    viewer,
    VueQrcode,
  },
  name: '',
  data() {
    return {
      type: 'an',
      show: false,
      $viewer: null,
      Img: {
        Date: '',
        Android: require(`@/${this.$img.Page.App.Android}`),
        Ios: require(`@/${this.$img.Page.App.Ios}`),
        Bg: require(`@/${this.$img.Page.App.Bg}`),
        Appbg: require(`@/${this.$img.Page.App.Appbg}`),
        AndroidDownload: "",
        IosDownload: "",
        CodeBg: require(`@/${this.$img.Page.App.CodeBg}`),
        SuCai: require(`@/${this.$img.Page.App.SuCai}`),
        SuCaiDark: require(`@/${this.$img.Page.App.SuCaiDark}`),
        LeftArrow: require(`@/${this.$img.Page.App.LeftArrow}`),
        RightArrow: require(`@/${this.$img.Page.App.RightArrow}`)
      },
      Options: {
        inline: false,
        button: true, //右上角按钮
        navbar: true, //底部缩略图
        title: true, //当前图片标题
        toolbar: true, //底部工具栏
        tooltip: true, //显示缩放百分比
        movable: true, //是否可以移动
        zoomable: true, //是否可以缩放
        rotatable: true, //是否可旋转
        scalable: true, //是否可翻转
        transition: true, //使用 CSS3 过度
        fullscreen: true, //播放时是否全屏
        keyboard: true //是否支持键盘
      }
    }
  },
  computed: {
    localConfig() {
      return this.$store.state.app.localConfig
        ? JSON.parse(this.$store.state.app.localConfig)
        : {}
    },

    list() {
      const { type } = this
      let isAn = type === 'an'
      let list = []
      const App = this.$img.Page.App
      let num = 0
      let key = ''
      switch (this.localConfig.lang) {
        case 'zh-CN':
          num = isAn ? 7 : 6
          key = isAn ? 'AnZH' : 'IsoZH'
          break
        case 'en-US':
          num = 6
          key = isAn ? 'AnEN' : 'IsoEN'
          break
        case 'th-TH':
          num = isAn ? 4 : 7
          key = isAn ? 'AnTH' : 'IsoTH'
          break
        case 'id-ID':
          num = isAn ? 4 : 7
          key = isAn ? 'AnID' : 'IsoID'
          break
        case 'vi-VN':
          num = isAn ? 4 : 10
          key = isAn ? 'AnVI' : 'IsoVI'
          break
      }
      let bz = [
        this.$t(`Module['第一步']`),
        this.$t(`Module['第二步']`),
        this.$t(`Module['第三步']`),
        this.$t(`Module['第四步']`),
        this.$t(`Module['第五步']`),
        this.$t(`Module['第六步']`),
        this.$t(`Module['第七步']`),
        this.$t(`Module['第八步']`),
        this.$t(`Module['第九步']`)
      ]
      for (let i = 1; i < num; i++) {
        list.push({
          id: i,
          img: require(`@/${App[key + i]}`),
          width: '274',
          height: '198',
          text: bz[i - 1]
        })
      }

      return list
    }
  },
  created() {
    this.homeDownLoad()
  },
  mounted() {
  },
  methods: {
    getCurrentThemeMode,
    async homeDownLoad() {
      const { Code, Data } = await homeDownLoad()
      if (Code == 200) {
        this.Img.AndroidDownload = Data.AndroidUrl
        this.Img.IosDownload = Data.IPhoneUrl
        this.Img.Date = this.$date(Data.updated_at).format(
          'YYYY-MM-DD'
        )
      }
    },
    viewImg(index) {
      this.$viewer.show(index)
    },
    inited(viewer) {
      this.$viewer = viewer
    },
    handleApp(type) {
      this.type = type
      this.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.m_app_warp {
  @apply w-full h-full;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--live-nav-button-bg);

  .app_content {
    @apply flex items-center;
    width: 1280px;
    margin: 0 auto;
    justify-content: space-between;

    .app_group {
      @apply flex items-center;

      .app_sys {
        @apply flex flex-col items-center justify-center mx-15px;

        .sys_Bg {
          @apply w-231px h-231px flex items-center justify-center;
          background: var(--live-info-bg);
          border-radius: 20px;

          .imgboxs {

            @apply w-175px h-175px flex items-center justify-center;

            position: relative;

            .corner {
              position: absolute;
              width: 20px;
              height: 20px;
            }

            .corner::before,
            .corner::after {
              content: "";
              position: absolute;
              background-color: #2D40F4;
              /* 角的颜色 */
            }

            /* 水平方向短边 */
            .corner::before {
              width: 12px;
              height: 2px;
            }

            /* 垂直方向短边 */
            .corner::after {
              width: 2px;
              height: 12px;
            }

            /* 四个角的位置和方向调整 */
            .top-left {
              top: 0;
              left: 0;
            }

            .top-left::before {
              top: 0;
              left: 0;
            }

            .top-left::after {
              top: 0;
              left: 0;
            }

            .top-right {
              top: 0;
              right: 0;
            }

            .top-right::before {
              top: 0;
              right: 0;
            }

            .top-right::after {
              top: 0;
              right: 0;
            }

            .bottom-left {
              bottom: 0;
              left: 0;
            }

            .bottom-left::before {
              bottom: 0;
              left: 0;
            }

            .bottom-left::after {
              bottom: 0;
              left: 0;
            }

            .bottom-right {
              bottom: 0;
              right: 0;
            }

            .bottom-right::before {
              bottom: 0;
              right: 0;
            }

            .bottom-right::after {
              bottom: 0;
              right: 0;
            }

          }

        }


        // .sys_img {
        //   @apply mb-20px;
        // }

        .sys_title {
          @apply text-14px text-white mt-20px;
        }

        // .sys_date {
        //   @apply text-14px text-dark mt-15px;
        // }

        .sys_btn {
          @apply mt-20px;

          .sys_btn_item {
            @apply rounded-25px text-16px;
            font-weight: 500;
            background: linear-gradient(90deg, #337FF2 0%, #0337E7 100%);
            color: #fff;

          }
        }
      }
    }

    // .app_sucai {
    //   @apply ml-35px;
    // }
  }
}

.add_install_course {
  @apply flex flex-wrap py-10px;

  .course_item {
    @apply flex flex-col justify-center px-9px py-10px;

    .step_item {
      @apply flex items-center justify-center mt-10px;

      .text {
        @apply px-30px text-12px;
        color: #fff;
      }
    }
  }
}
</style>
