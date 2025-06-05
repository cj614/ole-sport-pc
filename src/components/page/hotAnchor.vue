<template>
  <div class="m_hot_anchor_warp">
    <v-slide-group>
      <v-slide-item
        v-for="(item, index) in anchorList"
        @change="change(item)"
        :key="index"
        v-slot="{ active, toggle }"
      >
        <div class="anchor_item cursor-pointer" @click="toggle">
          <div class="anchor_avatar">
            <div class="lottie_head" v-if="item.room_status === 1">
              <page-lottie :animationData="Lottie.Head"></page-lottie>
            </div>
            <v-avatar
              width="80"
              height="80"
              :class="item.room_status === 1 ? 'breathing-element' : ''"
            >
              <!-- <page-pageLoad :src="item.img_url" width="80" height="80"></page-pageLoad> -->
              <v-img :src="item.img_url" />
            </v-avatar>
            <span class="flag_live" v-if="item.room_status === 1">
              <v-img :src="Img.HomeAnchorLive" width="44" height="16"></v-img>
            </span>
          </div>
          <span class="avatar_name">{{ item.user_name }}</span>
        </div>
      </v-slide-item>
      <template v-slot:next>
        <div class="hot_active">
          <v-icon size="20" color="#ffffff">mdi-chevron-right</v-icon>
        </div>
      </template>
      <template v-slot:prev>
        <div class="hot_active">
          <v-icon size="20" color="#ffffff">mdi-chevron-left</v-icon>
        </div>
      </template>
    </v-slide-group>
  </div>
</template>

<script>
import { hotAnchorList } from '@/api/global'
export default {
  props: {
    keyword: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Lottie: {
        Head: require(`@/${this.$lottie.Live.Head}`)
      },
      Img: {
        HomeAnchorLive: require(`@/${this.$img.Page.Home.HomeAnchorLive}`)
      },
      anchorList: []
    }
  },
  mounted() {
    this.hotAnchorList()
  },
  computed: {
    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    }
  },
  methods: {
    async hotAnchorList() {
      const { Code, Data } = await hotAnchorList({ key_word: this.keyword })
      if (Code === 200) {
        this.anchorList = Data
      }
    },

    change(row) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      const { room_id, room_status, user_id } = row
      this.$router.push({
        name: room_status === 1 ? 'anchorRoom' : 'anchorSchedule',
        params: { id: room_status === 1 ? room_id : user_id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.m_hot_anchor_warp {
  @apply h-130px rounded-10px bg-lightFirst px-30px mb-40px;
  .hot_active {
    @apply bg-darkSecond w-20px h-40px flex justify-center items-center rounded-4px;
  }
  .anchor_item {
    @apply w-120px h-130px flex flex-col justify-between items-center py-9px;
    .anchor_avatar {
      @apply relative;
      .lottie_head {
        width: 120%;
        height: 120%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        @apply absolute;
      }
      .flag_live {
        @apply absolute  left-18px;
        bottom: -9px;
      }
    }
    .avatar_name {
      @apply text-14px font-bold text-dark;
    }
  }
}
@keyframes breathe {
  0% {
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transform: scale(0.88);
  }

  50% {
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
    transform: scale(1);
  }

  100% {
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transform: scale(0.88);
  }
}
.breathing-element {
  @apply border-2px border-solid border-warning rounded-2/1;
  /* 圆形元素 */
  animation: breathe 2s ease infinite;
  /* 应用关键帧，每2秒执行一次，无限循环 */
}
</style>
