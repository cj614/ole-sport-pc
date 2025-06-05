<template>
  <module-self>
    <div class="m_sport_video_details">

      <div class="video_detail_box">
        <div class="video_comment_box">
          <div class="video_content">
            <div class="video_header">
              <div class="video_title">
                <div class="_title">{{ video.title }}</div>
                <div class="live_icon">
                  <span><v-img :src="Img.Videoicon" width="16" height="14"></v-img></span>
                  <span style=" margin-left: 10px;">{{ video.read_num }}</span>
                  <span style="margin:0 10px;">{{ video.created_at }}</span>
                  <span><v-img :src="Img.Watchicon" width="16" height="14"></v-img></span>
                  <span style="margin-left: 6px;">{{ video.viewer }}</span>
                </div>
                <!-- <div class="_date">{{ day(video.created_utc_timestamp || '') }}</div> -->
              </div>
              <!-- <page-share type="video" :shareInfo="shareInfo"></page-share> -->
            </div>

            <div class="html_content">

              <page-DPlayer :movie="{
                img: video.img_url || '',
                video: video.video_url || ''
              }"></page-DPlayer>
            </div>
            <div class="iconBox">
              <div @click="doNiceVideo" style="cursor: pointer;">
                <v-img :src="video.is_nice ? Img.ThumbUped : Img.ThumbUp" width="20" height="20"></v-img>
              </div>
              <div @click="store" style="cursor: pointer;">
                <v-img :src="video.is_store ? Img.Started : Img.Start" width="20" height="20"></v-img>
              </div>
              <div>
                <page-share type="video" :shareInfo="shareInfo"></page-share>
              </div>
            </div>
            <!-- <page-action v-if="video" :video="video" :shareInfo="shareInfo"></page-action> -->

          </div>

          <div class="title_tit">
            <span class="title_name">{{ $t(`Module['精彩评论']`) + ' ' + video.comment_count }}</span>
          </div>

          <div class="comment_content">

            <ul class="comment_list">
              <li v-for="(item, index) in commentList" :key="index" class="comment_item">
                <div class="avatar_info_x">
                  <v-avatar size="32">
                    <v-img :src="item.user.img_url ||
                      'https://cdn.vuetifyjs.com/images/john.jpg'
                      " />
                  </v-avatar>
                  <div class="info_x">
                    <div class="user_txt">{{ item.user.user_name }}</div>
                    <div class="comment_date">{{ item.content }}</div>
                    <div class="comment_txt">{{ formatTimestamp(item.created_utc_timestamp * 1000)
                      }}</div>
                  </div>
                </div>
                <div class="right_operate">
                  <div class="item_count">
                    <span class="cursor-pointer" @click.stop="handleLike(item)">
                      <v-img :src="item.is_nice ? Img.ThumbUped : Img.ThumbUp" width="14" height="14"></v-img>
                    </span>
                    <span class="count_txt">{{ item.nice_count }}</span>
                  </div>
                  <module-menuList v-if="user.role_type === 1" :item="item" :index="index" :list="otherList"
                    rounded="20px 0px 20px 20px" @activeMenuItem="activeMenuItem"></module-menuList>
                </div>
              </li>
            </ul>
            <div class="comment_input">
              <div class="input_text_box">
                <v-textarea v-model="content" background-color="#181818" color="#fff" outlined filled auto-grow
                  class="comment_input_item" :placeholder="$t(`Module['请输入评论']`)" maxlength="500"></v-textarea>
              </div>
              <div class="submit_box">
                <v-btn outlined depressed height="40" width="200" :loading="loading" @click="handleContent">{{
                  $t(`Module['发送']`) }}</v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="video_top">
          <div class="title_tit title_tit_video">
            <span class="title_name">{{ $t(`Module['相关推荐']`) }}</span>
            <div class="change_it" @click.stop="handleChangeIt">
              <span class="text">{{ $t(`Module['换一换']`) }}</span>
              <!-- <page-pageLoad :src="Img.ChangeIt" width="20" height="20"></page-pageLoad> -->
            </div>
          </div>
          <div class="video_top_box" :class="{ ['bg-lightFirst']: !matchList.length }">
            <template v-if="matchList.length">
              <page-videoCard :List="matchList" @handleClickItem="handleClickItem"></page-videoCard>
            </template>
            <template v-else>
              <page-empty :title="$t(`Module['暂无数据']`)"></page-empty>
            </template>
          </div>
        </div>
      </div>
    </div>

  </module-self>
</template>

<script>
import dayjs from 'dayjs'
import {
  sportVideoDetail,
  commentSportVideos,
  topSportVideoList,
  storeVideo,
  niceVideo
} from '@/api/sportVideo'
import { formatTimestamp } from "@/libs/util";

//operateComment
import { makeComment, likeComment, operateComment } from '@/api/sport'
export default {
  data() {
    return {
      commentCount: 0,
      video: {},
      content: '',
      headerBanner: false,
      loading: false,
      Img: {
        Nice: require(`@/${this.$img.Page.News.Nice}`),
        NiceActive: require(`@/${this.$img.Page.News.NiceActive}`),
        Videoicon: require(`@/${this.$img.Page.Live.Videoicon}`),
        Watchicon: require(`@/${this.$img.Page.Live.Watchicon}`),
        ThumbUp: require(`@/${this.$img.Page.Live.ThumbUp}`),
        ThumbUped: require(`@/${this.$img.Page.Live.ThumbUped}`),
        Start: require(`@/${this.$img.Page.Live.Start}`),
        Started: require(`@/${this.$img.Page.Live.Started}`),
        Share: require(`@/${this.$img.Page.Live.Share}`),
        ChangeIt: require(`@/${this.$img.Page.News.ChangeIt}`)

      },
      shareInfo: {
        url: '',
        title: '',
        description: '',
        quote: '',
        hashtags: '',
        twitterUser: ''
      },
      commentList: [],
      matchList: [],
      page: {
        page: 1,
        limit: 4,
        count: 0
      }
    }
  },

  computed: {
    id() {
      return this.$route.params.id || 0
    },

    user() {
      return JSON.parse(this.$store.state.user.userInfo).user || {}
    },

    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    },

    otherList() {
      return [
        {
          text: this.$t(`Module['删除']`),
          label: this.$t(`Module['删除']`),
          value: 1
        },
        {
          text: this.$t(`Module['禁言']`),
          label: this.$t(`Module['禁言']`),
          value: 2
        },
        {
          text: this.$t(`Module['拉黑']`),
          label: this.$t(`Module['拉黑']`),
          value: 3
        }
      ]
    }
  },

  watch: {
    '$route.params': {
      handler() {
        this.sportVideoDetail()
        this.getCommentSportVideos()
        this.topSportVideoList()
      }
    }
  },

  mounted() {
    this.sportVideoDetail()
    this.getCommentSportVideos()
    this.topSportVideoList()
  },

  methods: {
    formatTimestamp,
    day(date) {
      return dayjs(date * 1000).format('YYYY-MM-DD HH:mm')
    },

    async getCommentSportVideos() {
      const { Code, Data } = await commentSportVideos({ id: this.id })
      if (Code === 200) {
        const { Data: List } = Data
        this.commentList = List
      }
    },

    handleClickItem(item) {
      this.$router.push({ name: 'videoDetails', params: { id: item.id } })
    },

    handleChangeIt() {
      this.page.page = 1
      this.matchList = []
      this.topSportVideoList()
    },

    async topSportVideoList() {
      const {
        page: { page, limit }
      } = this
      const { Code, Data } = await topSportVideoList({
        page,
        limit,
        id: this.id
      })
      if (Code === 200) {
        this.matchList = Data.Data
      }
    },

    async activeMenuItem(row, item, index) {
      const { value } = row
      const { user_id, id } = item
      const params = {}
      switch (value) {
        case 1:
          params.del_comment_id = id
          break
        case 2:
          params.shutup_user_id = user_id
          break
        case 3:
          params.block_user_id = user_id

          break
      }
      const { Code } = await operateComment(params)
      if (Code === 200) {
        this.$toast.success(this.$t(`Module['操作成功']`))
        this.getCommentSportVideos()
      }
    },
    // 收藏
    async store() {
      let status = 1
      if (this.video.is_store) {
        status = 0
      }
      let result = await storeVideo({
        video_id: this.video.id * 1,
        status: status
      })
      if (result.Code === 200) {
        this.video.is_store = !this.video.is_store
      }
    },
    // 点赞
    async doNiceVideo() {
      let status = 1
      if (this.video.is_nice) {
        status = 0
      }
      let result = await niceVideo({
        video_id: this.video.id,
        status: status
      })
      if (result.Code === 200) {
        this.video.is_nice = !this.video.is_nice
      }
    },
    async handleContent() {
      try {
        if (!this.token) {
          this.$bus.$emit('login/on', 'login')
          return
        }
        this.loading = true
        if (!this.content) {
          this.$bus.$emit('snackbar/on', this.$t(`Module['请输入评论']`))
          return
        }
        const { Code } = await makeComment({
          sport_video_id: this.id,
          comment: this.content
        })
        if (Code === 200) {
          this.$bus.$emit('snackbar/on', this.$t(`Module['评论成功']`))
          this.content = ''
          this.page.page = 1
          this.getCommentSportVideos()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async handleLike(item) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      const { Code, Data } = await likeComment({
        comment_id: item.id,
        status: !item.is_nice
      })
      if (Code === 200) {
        this.$set(item, 'nice_count', Data.nice_count)
        this.$set(item, 'is_nice', Data.status)
      }
    },

    async sportVideoDetail() {
      // console.log('111111', this.id)
      const { Code, Data } = await sportVideoDetail({ id: this.id })
      if (Code === 200) {
        let videoData = Data.data
        this.video = videoData
        this.video.viewer = Math.floor(Math.random() * Data.data.read_num) || 1
        this.video.created_at = formatTimestamp(this.video.created_utc_timestamp * 1000)
        this.shareInfo.url = window.location.href
        this.shareInfo.title = `${videoData.title}`
        this.shareInfo.description = `${videoData.competition}`
        this.shareInfo.quote = `${videoData.competition}`
        this.shareInfo.hashtags = `${videoData.competition}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_sport_video_details {
  @apply flex-1 flex flex-col py-20px;

  .video_details-av {
    @apply pb-20px;

    .v-image {
      @apply rounded-10px;
    }
  }

  .video_detail_box {
    @apply flex;

    .video_comment_box {
      @apply mr-20px;

      .video_content {
        @apply w-940px rounded-10px bg-hex-202124 mb-40px;

        .video_header {
          @apply flex items-center justify-between p-20px mb-10px;

          .video_title {
            @apply flex flex-col;

            ._title {
              @apply text-20px font-bold text-hex-fff mb-10px;
            }

            .live_icon {
              display: flex;
              align-items: center;
              color: #808080;
            }


          }

          .video_shard {
            @apply w-90px h-33px flex items-center justify-between px-18px rounded-18px text-lightFirst font-bold cursor-pointer;
            background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
          }
        }

        .html_content {
          @apply h-528px w-940px bg-dark;
        }

        .iconBox {
          display: flex;
          gap: 40px;
          padding: 18px 30px;
          // align-items: center;
        }
      }

      .title_name {
        color: #fff;
      }
    }

    .comment_content {
      @apply w-955px min-h-426px p-10px;

      .comment_input {
        .input_text_box {
          .comment_input_item {
            .v-text-field__details {
              display: none;
            }

            ::v-deep textarea::placeholder,
            ::v-deep textarea {
              color: #fff;
            }


            .v-input__slot {
              @apply border-none bg-hex-181818;


              fieldset {
                @apply border-none;
              }


            }
          }
        }

        .submit_box {
          @apply mt-20px;

          .v-btn {
            background: linear-gradient(90deg, #F5CD9F 0%, #F7DBBF 100%);
            color: #5C330A;
            border-radius: 10px;
          }
        }
      }

      .submit_box {
        @apply w-full text-right mb-20px;
      }
    }

    .comment_list {
      @apply pl-0px w-full max-h-1000px overflow-y-auto;

      .comment_item {
        @apply flex items-center justify-between h-100px py-20px px-10px border-t-1px border-solid border-hex-1c1c1c;

        .avatar_info_x {
          @apply flex;

          .info_x {
            @apply ml-10px flex flex-col justify-between;

            .user_txt {
              @apply text-14px text-hex-808080;
            }

            .comment_date {
              @apply font-bold text-16px text-white m-11px ml-0;
            }

            .comment_txt {
              @apply text-13px text-hex-474747;

            }
          }
        }

        .right_operate {
          @apply flex items-center max-w-120px;

          .item_count {
            @apply flex items-center mr-10px;

            .count_txt {
              @apply ml-6px font-bold text-hex-474747;
            }
          }
        }
      }
    }

    .title_tit_video {
      @apply justify-between;

      .title_name {
        color: #A6A6A6;
        font-weight: 500
      }

      .change_it {
        @apply flex items-center cursor-pointer;

        .text {
          @apply ml-5px text-hex-A6A6A6;
        }
      }
    }

    .video_top_box {
      @apply max-h-1290px min-h-700px overflow-y-auto;
    }
  }
}
</style>
