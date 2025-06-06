<template>
  <v-app-bar app class="main_header" height="70" extension-height="70" elevate-on-scroll fixed>
    <div class="m-header-warp">
      <div class="header-content">
        <div class="header_left">
          <div class="main_logo cursor-pointer" @click.stop="() => {
            $router.push({ name: 'live' })
          }
          ">
            <v-img :src="Img.OleLogo" height="43" width="175"></v-img>
          </div>
          <ul class="header_nav">
            <li v-for="(item, key) in navList" :key="key" class="nav_item"
              :class="item.path === navActiveName ? 'nav_item_active' : ''" @click="toPage(item.path, item.isLogin)">
              <div class="nav_link">
                <v-img v-if="item.icon" :src="item.icon" class="mr-4px" height="24" width="24"></v-img>
                <div class="subtitle_1">{{ item.name }}</div>
              </div>
            </li>
          </ul>
        </div>
        <v-spacer />
        <div class="header_right">

          <template v-if="token">
            <v-badge :content="messageCount" offset-x="16" offset-y="8" :value="!!messageCount" color="error" overlap>
              <layout-info @handleLogout="() => {
                dialog = true
              }
              " :messages="messageCount"></layout-info>
            </v-badge>
          </template>
          <template v-else>
            <div class="header-login-btn" @click="handleDialog('login')">{{ $t(`Page['登录']`) }}</div>

            <div class="header-Daftar-btn" @click="handleDialog('reg')">{{ $t(`Page['注册']`) }}</div>
          </template>
          <layout-lang></layout-lang>
        </div>
      </div>
      <login-page :showDialog.sync="showDialog" :type="type"></login-page>
    </div>
    <module-dialog :dialog.sync="dialog" :isClose="false">
      <template v-slot:content>
        <div class="login_dialog">
          <p class="close_title">{{ $t(`Module['您确定退出账号']`) }}？</p>
          <div class="close_actives">
            <v-btn color="#1862C8" outlined depressed width="140" height="40" @click="() => (dialog = false)">{{
              $t(`Module['取消']`) }}
            </v-btn>
            <v-btn depressed outlined width="140" class="btn_submit" height="40" @click="handleConfirm">{{
              $t(`Module['确认']`) }}
            </v-btn>
          </div>
        </div>
      </template>
    </module-dialog>
  </v-app-bar>
</template>

<script>
export default {
  name: 'main-header',
  data() {
    return {
      showDialog: false,
      dialog: false,
      navActiveName: 'home',
      type: 'login',
      navName: [],
      keyword: '',
      Img: {
        OleLogo: require(`@/${this.$img.Page.Layout.OleLogo}`),
        GlobalSearch: require(`@/${this.$img.Page.Layout.GlobalSearch}`),
        MenuDown: require(`@/${this.$img.Page.Layout.MenuDown}`)
      },
      index: 2
    }
  },
  computed: {
    token() {
      return JSON.parse(this.$store.state.user.userInfo).token
    },

    userInfo() {
      let info = JSON.parse(this.$store.state.user.userInfo).user
      return {
        ...info
      }
    },

    messageCount() {
      return this.$store.state.app.messageCount
    },
    localConfig() {
      return this.$store.state.app.localConfig
        ? JSON.parse(this.$store.state.app.localConfig)
        : {}
    },

    navList() {
      // const { localConfig } = this
      let menuList = [
        {
          name: this.$t('Page["首页"]'),
          path: 'home'
        },
        {
          name: this.$t('Page["主播"]'),
          path: 'live',
        },
        // {
        //   name: this.$t('Page["文章"]'),
        //   path: 'sportNews'
        // },
        {
          name: this.$t('Page["聊天"]'),
          path: 'chatRoom'
        },
        {
          name: this.$t('Module["视频"]'),
          path: 'video'
        },
        {
          name: this.$t('Page["活动"]'),
          path: 'activity'
        },
        {
          name: this.$t('Page["个人中心"]'),
          path: 'personalCenter',
          isLogin: true
        },
        {
          name: this.$t('Page["下载"]') + ' APP',
          path: 'App'
        }
      ]

      // if (localConfig) {
      //   let localName = localConfig?.lang || 'zh-CN'
      //   if (['zh-CN', 'en-US', 'vi-VN'].includes(localName)) {
      //     menuList = menuList.filter(
      //       f => !['sportVideo', 'activity'].includes(f.path)
      //     )
      //   }
      // }
      return menuList
    },

    isSearch() {
      return true //this.$route.name !== 'homeSearch'
    }
  },

  mounted() {
    this.$bus.$on('login/on', this.onLogin)
    this.$once('hook:beforeDestroy', () => {
      this.$bus.$off('login/on', this.onLogin)
    })

    this.$nextTick(() => {
      this.setNavActiveName()
    })
  },

  methods: {
    handleDialog(type) {
      this.type = type
      this.$nextTick(() => {
        this.showDialog = true
      })
    },

    handleConfirm() {
      this.dialog = false
      this.$store.dispatch('user/handleLoginOut')
    },

    onLogin(type) {
      this.handleDialog(type)
    },

    toPage(name, isLogin) {
      if (!this.token && isLogin) {
        this.handleDialog('login')
        return
      }
      this.$route.name != name &&
        this.$router.push({
          name
        })
    },

    handleKeydown(e) {
      if (e.keyCode == 13) {
        this.handleClickInner()
      }
    },

    handleClickInner() {
      if (this.$route.name === 'homeSearch') {
        this.$bus.$emit('all/search', this.keyword)
      } else {
        this.$router
          .push({
            name: 'homeSearch',
            query: { keyword: this.keyword }
          })
          .then(() => {
            // this.keyword = ''
          })
      }
    },

    setNavActiveName() {
      let { navList, $route } = this
      let diff = navList.filter(item => {
        return (
          item.path === $route.name || item.path === $route.meta?.parentName
        )
      })
      if (diff.length > 0) {
        this.navActiveName = diff[0].path
      } else {
        this.navActiveName = ''
      }
    }
  },

  watch: {
    '$route.name'() {
      this.setNavActiveName()
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  .main_header {
    @apply z-100;
    background: var(--app-header-bg);

    .v-toolbar__content {
      @apply py-0px;
    }

    .m-header-warp {
      @apply flex-1 overflow-auto;

      .header-content {
        @apply flex items-center justify-between;
        margin: 0 120px;

        .header_left {
          @apply flex items-center;

          .main_logo {
            @apply flex items-center;

            .text {
              @apply text-lightFirst text-28px font-bold;
            }
          }

          .header_nav {
            @apply flex ml-40px pl-0px h-70px;

            .nav_item {
              @apply flex items-center justify-center py-10px px-10px text-center rounded-l-25px cursor-pointer relative;

              .active_img {
                @apply absolute top-0;
              }

              .nav_link {
                .subtitle_1 {
                  padding: 5px 10px;
                  @apply text-16px;
                  color: var(--app-text);
                }
              }
            }

            .nav_item:hover,
            .nav_item_active {
              .nav_link {
                .subtitle_1 {
                  color: var(--text-color);
                  border-radius: 4px;

                }
              }
            }
          }
        }

        .header_right {
          @apply flex items-center relative;

          .header_global_search {
            @apply mr-20px;

            .v-input__control {
              @apply flex-col flex-initial;
              min-height: 32px !important;
            }

            input {
              @apply text-lightFirst text-12px font-normal;
            }

            input::placeholder {
              @apply text-lightFirst text-12px font-normal;
            }

            .v-input__slot {
              @apply mb-0px w-180px rounded-16px;
              box-shadow: none;
              min-height: 32px !important;

              .v-input__prepend-inner {
                @apply mr-8px;
              }
            }

            .v-text-field__details,
            .v-messages {
              margin-bottom: 0px !important;
              min-height: 0px !important;
            }
          }

          // .primary--text {
          //   .v-input__slot {
          //     border: 1px solid #fbab12 !important;
          //   }
          // }

          .header-user-btn {
            @apply w-120px h-32px leading-32px rounded-16px ml-25px text-lightFirst text-14px font-bold text-center cursor-pointer;
            background: linear-gradient(90deg, #F0B348 0%, #FFF98B 60.43%, #FFD073 100%);
          }

          .header-Daftar-btn {
            @apply min-w-90px px-10px h-32px rounded-5px text-14px font-bold leading-32px text-center cursor-pointer;
            background: #eee;
            color: #383838;
          }

          .header-login-btn {
            @apply min-w-90px px-10px h-32px rounded-5px text-14px font-bold leading-32px text-center cursor-pointer mr-10px;
            background: linear-gradient(90deg, #337FF2 0%, #0337E7 100%);

            color: #fff;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1280px) and (min-width: 1440px) {
  .v-toolbar__content {
    @apply pl-20px;
  }
}

.login_dialog {
  @apply py-40px px-20px text-center;

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
</style>
