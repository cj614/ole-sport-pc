<template>
  <div class="streamer-page">
    <h1 class="page-title">{{ $t('Module["主播"]') }}</h1>

    <!-- 主播卡片展示区 -->
    <div class="streamer-showcase">
      <!-- 左右切换按钮 -->
      <div class="nav-button prev" @click="previousStreamer">
        <i class="el-icon-caret-left"></i>
      </div>

      <!-- 主播信息卡片 -->
      <div class="streamer-card">
        <div class="frist">
          <div class="live-tips" v-if="currentStreamer?.is_live">
            <span>{{ $t('Module["正在直播"]') }}</span>
            <v-img class="live-img" :src="Img.Living"></v-img>
          </div>
          <v-img class="img" :src="currentStreamer?.img_url"></v-img>
          <v-img class="follwing-img" @click="focusAnchor()" style="cursor: pointer;"
            :src="currentStreamer?.is_focused ? Img.Fllowing : Img.NotFllowing"></v-img>
        </div>

        <div class="infos">
          <div class="name-container">
            <span :style="{ maxWidth: currentStreamer?.tag ? '200px' : '340px' }" class="card-name">
              {{ currentStreamer?.user_name }}
            </span>
            <span v-if="currentStreamer?.tag" class="card-tag" v-for="(j, jindex) in parsedTags" :key="jindex">{{ j }}
            </span>
          </div>
          <div class="card-description">{{ currentStreamer?.description }}</div>
          <div class="card-info">
            <div class="info-item">
              <span class="top-text">{{ $t('Module["战绩"]') }}</span>
              <div>
                <span>{{ $t('Module["胜"]') }}: </span>
                <span style="margin-right:10px; color: red; font-weight: bold; vertical-align: middle;">{{
                  currentStreamer?.standing_win || 0
                }}</span>
                <span>{{ $t('Module["败"]') }}:</span>
                <span style="color: green; font-weight: bold;"> {{ currentStreamer?.standing_fail
                  || 0 }}</span>
              </div>
            </div>
            <div class="info-item" style="margin-left: 20px;">
              <span class="top-text">{{ $t('Module["每日带车时间"]') }}</span>
              <div style="font-weight: bold;">
                {{ currentStreamer?.open_time || 0 }}
              </div>
            </div>
          </div>
          <v-btn @click="goanchorRoom(currentStreamer)" v-if="currentStreamer?.is_live" class="btn toRoomBtn">{{
            $t('Module["进入直播间"]') }}</v-btn>
          <v-btn @click="goanchorRoom(currentStreamer)" v-else class="btn">{{ $t('Module["等待开播"]') }}...</v-btn>
        </div>
      </div>

      <!-- 右箭头 -->
      <div class="nav-button next" @click="nextStreamer">
        <i class="el-icon-caret-right"></i>
      </div>
    </div>

    <!-- 底部缩略图列表 -->
    <div class="thumbnail-list">
      <div class="thumbnail-wrapper">
        <div class="thumbnails" :style="{ transform: `translateX(${thumbnailOffset}px)` }">
          <div v-for="(streamer, index) in streamers" :key="index" class="thumbnail"
            :class="{ active: currentIndex === index }" @click="selectStreamer(index)">
            <img :src="streamer.img_url" :alt="streamer.name" />
            <img :src="Img.Activebg" class="bg" />
          </div>
        </div>
      </div>
      <div class="thumbnail-nav">
        <el-button icon="el-icon-back" class="btn" @click="previousPage"></el-button>
        <el-button icon="el-icon-right" class="btn" @click="nextPage"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { liveUserList } from '@/api/live'
import { liveFollowV2 } from '@/api/follow'

export default {
  name: 'StreamerIndex',
  data() {
    return {
      currentIndex: 0,
      thumbnailOffset: 0,
      itemsPerPage: 6,
      streamers: [

      ],
      Img: {
        Living: require(`@/${this.$img.Page.Home.Living}`),
        LiveBg: require(`@/${this.$img.Page.Home.LiveBg}`),
        ToLive: require(`@/${this.$img.Page.Home.ToLive}`),
        Fllowing: require(`@/${this.$img.Page.Home.Fllowing}`),
        NotFllowing: require(`@/${this.$img.Page.Home.NotFllowing}`),
        Activebg: require(`@/${this.$img.Page.Live.Activebg}`)
      }
    }
  },
  computed: {
    currentStreamer() {
      return this.streamers[this.currentIndex]
    },
    parsedTags() {
      try {
        return this.currentStreamer?.tag ? JSON.parse(this.currentStreamer.tag) : [];
      } catch (e) {
        return [];
      }
    }
  },
  mounted() {

    this.getUserList() // 主播列表
  },
  methods: {
    // 主播列表
    async getUserList() {
      let res = await liveUserList({ page: 1, limt: 7 })
      if (res.Code === 200) {
        this.streamers = res.Data.Data
        console.log('主播列表', this.streamers);
      }
    },
    // 关注 取消关关注
    focusAnchor() {
      liveFollowV2(this.currentStreamer.user_id, this.currentStreamer.is_focused ? 0 : 1).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          this.currentStreamer.is_focused = Data.status === 1 ? true : false
        }
      }).catch(() => {
      })
    },
    previousStreamer() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },
    nextStreamer() {
      if (this.currentIndex < this.streamers.length - 1) {
        this.currentIndex++
      }
    },
    selectStreamer(index) {
      this.currentIndex = index
    },
    toggleFavorite() {
      this.streamers[this.currentIndex].isFavorite = !this.streamers[this.currentIndex].isFavorite
    },
    goanchorRoom(item) {
      let { live_play_id, live_room_id, all_match_id } = item

      if (live_room_id) {
        this.$router.push({ name: 'anchorRoom', params: { id: live_room_id, all_match_id: all_match_id, type: 0 } })
      } else if (live_play_id) {
        this.$router.push({ name: 'anchorRoom', params: { id: live_play_id, all_match_id: all_match_id, type: 1 } })
      } else {
        let params = {
          anchor: {
            id: item.user_id,
            img_url: item.img_url,
            user_name: item.user_name,
            follow_num: item.follow_num,
            open_time: item.open_time,
          },
          title: item.user_name,
          view_num: item.follow_num,
        }
        this.$router.push({
          name: 'anchorRoom',
          params: {
            info: JSON.stringify(params)
          }
        })
      }
    },
    previousPage() {
      const newOffset = this.thumbnailOffset + (this.itemsPerPage * 120)
      this.thumbnailOffset = Math.min(newOffset, 0)
    },
    nextPage() {
      const minOffset = -((Math.ceil(this.streamers.length / this.itemsPerPage) - 1) * (this.itemsPerPage * 120))
      const newOffset = this.thumbnailOffset - (this.itemsPerPage * 120)
      this.thumbnailOffset = Math.max(newOffset, minOffset)
    }
  }
}
</script>

<style scoped lang="scss">
.streamer-page {
  padding: 20px;
  background: var(--app-bg);
  min-height: calc(100vh - 224px);

}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
}

.streamer-showcase {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--live-nav-button-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-color);
  font-size: 20px;
  border: 3px solid;
  border-color: var(--live-nav-button-border);
}

.nav-button:hover {
  background: var(--text-color);
  color: #fff;
}

.streamer-card {
  width: 800px;
  // background: #2a2a2a;
  border-radius: 16px;
  margin: 0 20px 20px 20px;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.frist {
  width: 256px;
  height: 290px;
  border: 2px solid;
  border-color: var(--live-border);

  border-radius: 13px;
  position: relative;

  .live-tips {
    position: absolute;
    z-index: 2;
    background: var(--bg-color);
    height: 36px;
    display: flex;
    align-items: center;
    justify-items: center;
    color: #fff;
    border-radius: 6.73px;
    font-size: 16px;
    font-weight: 500;
    padding: 8px 12px;
    top: 10px;
    left: 10px;

    .live-img {
      width: 10px;
      height: 13px;
      margin-left: 10px;
    }


  }

  .follwing-img {
    position: absolute;
    z-index: 2;
    width: 36px;
    height: 36px;
    bottom: 11px;
    right: 21px;
  }

  .img {
    width: 248px;
    height: 282px;
    border-radius: 13px;
    margin-left: 4px;
    margin-top: 4px;
  }
}

.infos {
  width: 360px;
  height: 290px;
  margin: 0 24px;

  .name-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .card-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--app-text);
      font-size: 18px;
    }

    .card-tag {
      border: 2px solid;
      border-color: var(--live-nav-button-border);
      font-size: 12px;
      color: #9F9F9F;
      padding: 0px 15px;
      border-radius: 40px;
      margin-left: 13px;
    }
  }

  .card-description {
    margin-top: 10px;
    color: #9F9F9F;
    font-size: 28rpx;
    height: 102px;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 18px 0;

    .info-item {
      border-radius: 106px;
      text-align: center;
      background: var(--live-info-bg);
      color: var(--app-text);
      font-size: 16px;
      padding: 5px 10px;

      .top-text {
        display: block;
        margin: 5px 0;
        font-size: 12px;
        color: #757575;
      }
    }


  }

  .btn {
    width: 100% !important;
    height: 53px !important;
    font-size: 26px !important;
    color: #fff;
    background: rgba(45, 64, 244, 0.6);
    border-radius: 193px;
    font-weight: 500;
  }

  .toRoomBtn {
    background: var(--bg-color);
    color: #fff;
  }
}

.thumbnail-list {
  width: 1280px;
  margin: 0 auto;
  position: relative;
}

.thumbnail-wrapper {
  overflow: hidden;
}

.thumbnails {
  display: flex;
  transition: transform 0.3s ease;

}

.thumbnail {
  width: 160px;
  height: 182px;
  border: 2px solid #7B87A5;
  border-color: var(--live-border);
  margin: 2px 5px;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s;
  flex-shrink: 0;
  transform: scale(0.98);
  position: relative;

  .bg {
    position: absolute;
    top: 0;
    transform: scale(1.08);
    opacity: 0;
  }
}

.thumbnail.active {
  opacity: 1;
  transform: scale(1);
  border-color: #2D40F4;

  .bg {
    opacity: 1;
  }
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;

}

.thumbnail-nav {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;

  .btn {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--live-info-bg);
    color: var(--text-color);
    border: none;
    font-size: 20px;
    transition: all 0.3s;

  }

  .btn:hover {
    background: var(--bg-color);
    color: #fff;
  }
}

/* 自定义图标样式 */
.icon-heart-filled {
  color: #ff4757;
}

.icon-heart {
  color: #fff;
}
</style>
