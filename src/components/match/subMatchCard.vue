<script>
import {subMatch} from "@/api/live";

export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  methods: {

    async doSubMatch() {
      console.log('this.item', this.item)
      let status = 1
      if (this.item.is_sub) {
        status = 0
      }
      const {
        Code,
        Data
      } = await subMatch({
        all_match_id: this.item.id,
        match_time: this.item.match_time,
        status: status,
      })

      if (Code == 200) {
        this.item.is_sub = Data.status === 1
      }
    },

  },
};
</script>

<template>
  <div style="background: rgb(245, 249, 255);padding-bottom: 20px;">
    <div class="label">{{ item.label }}</div>
    <div class="card-he">
      <div class="left">
        <div>
          <el-image class="icon" :src="item.home_logo"></el-image>
          <span class="team-name">{{ item.home }}</span>
        </div>
        <div style="margin-top: 8px">
          <el-image class="icon" :src="item.away_logo"></el-image>
          <span class="team-name">{{ item.away }}</span>
        </div>
      </div>
      <div class="reservation" @click="doSubMatch()"
           :style="{ background: item.is_sub ? 'rgba(165, 169, 179, 1)' : '' }">
        {{ item.is_sub ? $t(`Module['已预约']`) : $t(`Module['预约']`) }}
      </div>
      <div class="right">
        <div>{{ item.time }}</div>
        <div>{{ item.competition }}</div>
        <div class="live_anchor" v-if="item.live_anchors && item.live_anchors.length">
          <el-image class="avatar" v-for="(v, index) in item.live_anchors.slice(0, 3)" :src="v.img_url" :key="index">
          </el-image>
          <div style="margin-left: 8px">
            {{ item.live_anchors.length }}{{ $t(`Module['位主播']`) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-he {
  background: white;
  padding: 12px 10px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  justify-content: space-between;
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  margin: 0 20px;

}

.reservation {
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(180deg, #53CCFF 0%, #31ABFF 100%);
  border-radius: 50px;
  cursor: pointer;
}

.bottom-box {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 400;
  color: rgba(165, 169, 179, 1);
}

.left {
  div {
    width: 280px;
    display: flex;
    align-items: center;
  }

  span {
    display: inline-block;
    margin-left: 5px;
  }

  .icon {
    width: 36px;
    height: 36px;
    margin-right: 16px;
  }
}

.right {
  width: 280px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-end;
  font-size: 12px;
  color: #505B71;
  gap: 8px;
}

.team-name {
  display: inline-block;
  max-width: 8em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.live_anchor {
  display: flex;
  align-items: center;

  /* 垂直方向居中对齐 */
  .avatar {
    width: 30px;
    /* 头像宽度 */
    height: 30px;
    /* 头像高度 */
    border-radius: 50%;
    /* 圆形头像 */
    margin-left: -6px;
    /* 图片之间的重叠距离 */
    object-fit: cover;
    /* 确保图片以正确比例填充 */
  }
}

.label {
  width: 100%;
  text-align: center;
  font-size: 12px;
  padding: 10px 0;
  font-family: PingFang SC;
}
</style>