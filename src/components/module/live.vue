<template>
  <div style="padding: 20px 0;background: #fff;">

    <div style="background: white;padding-bottom: 20px ">
      <div class="liveReplay">
        <div @click="liveReplayactive = index"
          :class="[liveReplayactive == index ? 'liveReplayitem active' : 'liveReplayitem']"
          v-for="(item, index) in liveReplay" :key='index'>
          {{ item.name }}
        </div>
      </div>
    </div>
    <div style="background: #fff; height: 400px; overflow-y: auto;">
      <!-- 直播回放 -->
      <el-timeline type="card" v-if="liveReplayactive == 0 && lineDatalist">
        <el-timeline-item style="background-color: #f5f9ff;padding: 10px 0;margin-right: 30px;"
          v-for="(items, key, index) in lineDatalist" :key="index" :timestamp="key" placement="top">
          <div class="lineDatabox">
            <div class="scroll-div-item_H" @click="roomDetail(item)" v-for="(item, index1) in items" :key="index1">
              <div style="color:#505B71;font-size: 12px">{{
                formatOnlytimestamp(item.match_time * 1000) }}
              </div>
              <div
                style="margin-top: 6px;width: 150px;white-space: normal;word-wrap: break-word;color: #505B71;font-size: 12px">
                {{ item.title }}
              </div>
              <div style="position: relative">
                <el-image class="image" :src="item.bg_img" fit="cover"></el-image>
                <div class="view_num">
                  <el-image style="width: 14px;height: 14px;margin-right:5px"
                    :src="require('@/static/consult/video-square.png')"></el-image>
                  {{ item.view_num }}
                </div>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>

      <div class="" v-if="liveReplayactive == 1">
        <div class="liveReplayactive">
          <div v-for="(item, index) in anchorSchedulelist" :key="index">
            <sub-match-card :item="item"></sub-match-card>
          </div>
        </div>
      </div>
      <!-- <div v-if="!lineDatalist">
        <page-empty :top="60" class="h-full" :title="$t(`Module['暂无数据']`)"></page-empty>
      </div> -->
    </div>
  </div>
</template>

<script>
// import {
//   liveFollowV2,
//   followStatusV2
// } from "@/api/follow.js";
import {
  playback,
  anchor_schedule,
} from "@/api/live.js";
import {
  formatDayTimestamp,
  formatOnlytimestamp,
  formatTimestampDayAndTime
} from "@/libs/util";
import SubMatchCard from "../match/subMatchCard.vue";

export default {
  props: {
    userId: {
      type: Number,
      default: 0
    },
  },
  components: { SubMatchCard },

  data() {
    return {
      isFollow: true,
      liveReplayactive: 0,
      lineDatalist: null,
      anchorSchedulelist: null,
      liveReplay: [{
        name: this.$t(`Module['直播回放']`)
      },
      {
        name: this.$t(`Module['直播预告']`)
      },
      ]
    }
  },
  mounted() {
    this.playbackinit()
    this.anchor_scheduleinit()
  },
  methods: {
    //  查询直播回放
    playbackinit() {
      var _this = this; // 保存 this 的引用

      if (_this.lineDatalist != null) {
        return;
      }

      playback({
        anchor_user_id: _this.userId
      }).then(function (response) {
        console.log('直播回放', response)
        var Code = response.Code;
        var Data = response.Data;

        if (Code == 200) {
          _this.lineDatalist = {};
          for (var i = 0; i < Data.Data.length; i++) {
            var day = formatDayTimestamp(Data.Data[i].match_time * 1000);
            if (!_this.lineDatalist[day]) {
              _this.lineDatalist[day] = [];
            }
            _this.lineDatalist[day].push(Data.Data[i]);
          }
        }
      }).catch(function (error) {
        console.error("获取数据失败", error);
      });
    },
    // 直播预告
    anchor_scheduleinit() {
      var _this = this; // 保存 this 的引用

      if (_this.anchorSchedulelist != null) {
        return;
      }

      anchor_schedule({
        anchor_user_id: _this.userId
      }).then(function (response) {
        console.log('直播预告', response)

        var Code = response.Code;
        var Data = response.Data;

        if (Code == 200) {
          _this.anchorSchedulelist = [];
          var beforeItemDay = ""; // 用于保存前一个日期，避免重复添加日期标签
          for (var i = 0; i < Data.length; i++) {
            var _format = formatTimestampDayAndTime(Data[i].match_time * 1000);
            var day = _format.day;
            var time = _format.time;
            Data[i].day = day;
            Data[i].time = time;

            if (day != beforeItemDay) {
              Data[i].label = day;
              beforeItemDay = day;
            }

            _this.anchorSchedulelist.push(Data[i]);
          }
        }
      }).catch(function (error) {
        console.error("获取日程数据失败", error);
      });
    },
    // 时间转换
    formatOnlytimestamp(time) {
      return formatOnlytimestamp(time)
    },
    // 点击事件详情
    roomDetail(item) {
      console.log("Room Detail", item);

      let { live_play_id, live_room_id, all_match_id } = item
      if (live_room_id) {
        this.$router.push({ name: 'anchorRoom', params: { id: live_room_id, all_match_id: all_match_id, type: 0 } })
      } else if (live_play_id) {
        this.$router.push({ name: 'anchorRoom', params: { id: live_play_id, all_match_id: all_match_id, type: 1 } })
      }

    },
  }
}
</script>


<style lang="scss" scoped>
.attention {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 12px;
  background: #E7F3FF;
  margin: 0 auto;

  .attentionbtn {
    padding: 4px 12px;
    border-radius: 100px;
    background: linear-gradient(180deg, #53CCFF 0%, #31ABFF 100%);
    color: #FFF;
    font-size: 14px;
    cursor: pointer;
  }

  .attentionAcitveBtn {
    padding: 4px 24px;
    border-radius: 100px;
    background-color: #A5A9B3;
    color: #FFF;
    font-size: 14px;
    cursor: pointer;

  }

  .attentionitem {
    display: flex;
    align-items: center;
  }

  .attentionname {

    .name {
      color: #101217;
    }

    .des {
      color: #A5A9B3;
    }
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

.liveReplay {
  width: 400px;
  padding: 4px;
  background-color: #E7F3FF;
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: space-around;
  border-radius: 92px;

  .liveReplayitem {
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    color: #A5A9B3;
    cursor: pointer;
  }

  .active {
    color: #2BA5FF;
    background: #FFF;
    border-radius: 92px;
  }
}

.lineDatabox {
  width: 860px;
  overflow-x: auto;
}

.scroll-div-item_H {
  display: inline-block;
  width: 180px;
  height: 110px;
  flex-shrink: 0;
  border-radius: 25px;
  margin-right: 24px;
  position: relative;

  .image {
    // width: 270px;
    height: 110px;
    border-radius: 16px;
    margin-top: 8px;
  }

  .view_num {
    position: absolute;
    bottom: 10px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #fff;
    width: 100px;
    left: 10px;
  }
}
</style>