<template>
  <v-menu offset-y :nudge-left="50" :nudge-bottom="10" v-model="value" content-class="m_info_warp"
    :close-on-content-click="true">
    <template v-slot:activator="{ on, attrs }">
      <div class="info-user-btn" v-bind="attrs" v-on="on">
        <v-avatar width="28" height="28" min-width="28">
          <v-img :src="userInfo.img_url || 'https://cdn.vuetifyjs.com/images/john.jpg'" />
        </v-avatar>

        <!-- <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span class="text_omit user_txt" v-bind="attrs" v-on="on">{{userInfo.user_name}}</span>
          </template>
<span>{{userInfo.user_name}}</span>
</v-tooltip> -->
      </div>
    </template>

    <v-list dense class="info-list-nav">
      <v-list-item-content class="info-base">
        <v-avatar width="60" height="60">
          <v-img :src="userInfo.img_url || 'https://cdn.vuetifyjs.com/images/john.jpg'" />
        </v-avatar>
        <span class="base-name">{{ userInfo.user_name }}</span>
        <span class="base-id">ID:{{ userInfo.id }}</span>
        <div class="base-coin">
          <span>
            <img :src="Img.Dollar" alt="$" width="20" height="20" />
          </span>
          <span class="coin">O{{ $t(`Module['币']`) }}：{{ userInfo.balance }}</span>
        </div>
      </v-list-item-content>
      <v-list-item-group v-model="navActive">
        <v-list-item v-for="(item, index) in infoNavList" color="rgba(249, 179, 31, 0.15)" active-class="item_active"
          :key="index" @click.stop="toPage(item.path)">
          <span class="item-icon">
            <v-img :src="item.icon" width="20" height="20" :alt="item.name" />
          </span>
          <v-list-item-title class="item-name">{{ item.name }}</v-list-item-title>
          <span class="item-count" v-if="item.bot">
            <v-avatar color="error" min-width="20" width="20" height="20">
              <span class="white--text text-12px">{{ item.bot }}</span>
            </v-avatar>
          </span>
        </v-list-item>
      </v-list-item-group>
      <v-list-item-content class="info-logout-content">
        <v-btn width="160" height="40" color="#fff" depressed class="info-logout !border-info" @click="handleLogout">{{
          $t(`Module['退出登录']`) }}</v-btn>
      </v-list-item-content>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    messages: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      navActive: -1,
      Img: {
        Dollar: require(`@/${this.$img.Page.User.Dollar}`)
      },
      value: false,
      loading: false
    }
  },

  computed: {
    AnchorAuthStatus() {
      return this.$store.state.app.globalAnchorDetail.status
    },

    infoNavList() {
      const {
        PersonalData,
        Personage,
        Message,
        AnchorAuth,
        GoLive,
        Attention
      } = this.$img.Page.User
      const { messages } = this
      let list = [
        {
          icon: require(`@/${PersonalData}`),
          name: this.$t(`Module['个人资料']`),
          path: 'personalData'
        },
        {
          icon: require(`@/${Attention}`),
          name: this.$t(`Page['我的关注']`),
          path: 'attention'
        },
        {
          icon: require(`@/${Personage}`),
          name: this.$t(`Page['我的预约']`),
          path: 'personage'
        },
        {
          icon: require(`@/${Message}`),
          name: this.$t(`Page['消息中心']`),
          path: 'message',
          bot: messages
        }
      ]

      if (this.AnchorAuthStatus == 2) {
        list.push({
          path: 'goLive',
          icon: require(`@/${GoLive}`),
          name: this.$t(`Module['去直播']`)
        })
      } else if (this.AnchorAuthStatus == 1 || this.AnchorAuthStatus == 0) {
        list.push({
          icon: require(`@/${AnchorAuth}`),
          name: this.$t(`Module['主播认证']`),
          path: 'AnchorAuth'
        })
      }
      return list
    },

    userInfo() {
      let info = JSON.parse(this.$store.state.user.userInfo).user
      return {
        ...info
      }
    }
  },

  methods: {
    toPage(path) {
      this.value = false
      this.$router.push({ name: 'personalCenter', params: { source: path } })
    },

    handleLogout() {
      this.$emit('handleLogout')
    }
  }
}
</script>

<style lang="scss" scoped>
.info-user-btn {
  @apply flex items-center h-28px leading-32px rounded-25px cursor-pointer;
  // background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);

  // .user_txt {
  //   @apply text-14px font-normal text-lightFirst;
  // }
}

.v-menu__content {
  border: 2px solid #f9b31f !important;
}

.m_info_warp {
  border-radius: 20px 0 20px 20px !important;

  .v-menu__content {
    border-radius: 20px 0 20px 20px !important;
    border: 2px solid #f9b31f !important;
  }

  .info-list-nav {
    @apply w-200px pt-20px pb-0px;

    .info-base {
      @apply flex flex-col items-center justify-center py-0px;

      .base-name {
        @apply text-16px font-bold text-dark my-11px;
      }

      .base-id {
        @apply font-sans text-14px font-bold text-hex-656568 mb-11px;
      }

      .base-coin {
        @apply flex items-center;

        .coin {
          @apply text-14px font-normal text-dark ml-8px;
        }
      }
    }

    .v-item-group {
      @apply py-10px;
    }

    .v-list-item {
      min-height: 46px !important;
      @apply flex items-center justify-between px-20px;

      .item-icon {
        @apply mr-20px;
      }

      .item-name {
        @apply text-14px font-normal text-dark;
      }
    }

    .v-list-item:hover {
      background: rgba(249, 179, 31, 0.15);
    }

    .info-logout-content {
      @apply justify-center;
    }

    .item_active {
      background: rgba(249, 179, 31, 0.15);
    }

    .v-list-item::before {
      background: rgba(249, 179, 31, 0.15) !important;
    }

    .info-logout {
      @apply border-solid border-1px rounded-10px text-info text-14px font-normal flex-none;
    }
  }
}
</style>
