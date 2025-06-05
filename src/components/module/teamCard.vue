<template>
  <div class="m_team_list_warp">
    <div class="team_main">
      <span class="coach_name">{{ item.coach }}</span>
      <div class="coach_tag" v-if="item.coach">{{ $t(`Module['教练']`) }}</div>
    </div>
    <div class="team_content">
      <template v-if="item && item.substitute?.length">
        <div class="h_text" v-if="type === 'FOOTBALL'">{{ $t(`Module['替补阵容']`) }}</div>
        <ul class="team_member_list">
          <li class="team_item" v-for="(sub, index) in item.substitute" :key="index">
            <div class="team_left">
              <span class="name_img">

                <div class="lineupshirt_number" :class="{ 'lineupshirt_number_away': teamIndex == 1 }">{{
                  sub.shirt_number }}</div>
              </span>
              <div class="player_name">
                <div class="index_num">{{ sub.position }}</div>
                <div class="center">{{ sub.rating }}</div>
                <div class="name">{{ sub.name }}</div>
              </div>
            </div>

            <div class="lineup_up" v-if="incidentInMap[sub.id]">
              {{ incidentInMap[sub.id].time }}'
              <el-image style="width: 12px;" :src="require('@/static/image/live/greenup.png')" fix="cover">
              </el-image>
            </div>
            <!-- <div v-else>
              <span>No incident data available</span>
            </div> -->
          </li>
        </ul>
      </template>
      <template v-else>
        <div class="team_member_list">
          <page-empty type="team" top="0" :title="$t(`Module['暂无数据']`)"></page-empty>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import {
  live_room_incidents,
} from "../../api/live";
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    teamIndex: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      incidentInMap: {}, // 上场事件数据

    }
  },
  mounted() {
    this.liveIncidents()
  },
  methods: {

    async liveIncidents() {
      const { Code, Data } = await live_room_incidents({ all_match_id: this.id });
      if (Code === 200) {
        if (Data && Data.incidents.length > 0) {
          Data.incidents.forEach((item) => {
            if (item.in_player_id) {
              this.$set(this.incidentInMap, item.in_player_id, item);
              // this.incidentInMap[item.in_player_id] = item;
            }
          });
        }
      }
    },
  },
  // watch: {
  //   // Watch for changes in the incidentInMap object
  //   incidentInMap: {
  //     handler(newValue, oldValue) {
  //       console.log('incidentInMap has changed:', newValue);
  //       // You can do any other logic here when the map changes
  //     },
  //     deep: true, // This ensures that nested properties are also watched
  //   },
  // },
}
</script>

<style lang="scss" scoped>
.m_team_list_warp {
  @apply min-h-300px w-440px border-warning border-1px border-solid rounded-10px;

  .team_main {
    @apply h-60px flex items-center px-20px rounded-t-10px;
    background: #2BA5FF;

    .coach_name {
      @apply font-bold text-16px text-lightFirst mr-10px;
    }

    .coach_tag {
      @apply rounded-t-6px px-6px py-3px text-warning text-12px;
      background: rgba(249, 179, 31, 0.5);
    }
  }

  .team_content {
    @apply p-20px;

    .h_text {
      @apply font-bold text-16px mb-20px;
    }

    .team_member_list {
      @apply pl-0px;

      .team_item {
        @apply flex items-center justify-between h-50px border-b-1px border-solid border-accent;

        .team_left {
          @apply flex items-center;

          .name_img {
            @apply mr-10px relative;

            .lineupshirt_number {
              width: 36px;
              height: 36px;
              background-color: #B31942;
              border-radius: 18px;
              text-align: center;
              line-height: 36px;
              margin: 10px 5px 10px 0;
              color: #fff;
              font-size: 14px;
            }

            .lineupshirt_number_away {
              background-color: #0A3161
            }

            .avatar_img {
              @apply border-warning bg-info rounded-1/2;
            }

            .pla_type {
              @apply absolute bottom-0px right-0px w-17px h-17px text-lightFirst bg-warning text-12px rounded-1/2 text-center leading-17px;
              right: -7px;
            }
          }

          .player_name {
            @apply flex items-center;

            .index_num {
              @apply w-28px h-28px leading-28px text-center bg-accent rounded-4px mr-10px;
            }

            .center {
              display: flex;
              align-items: center;
              color: #FFF;
              font-size: 12px;
              font-weight: 700;
              border-radius: 4px;
              padding: 2px 7px;
              background: #595B69;
              margin-right: 10px;
            }

            .name {}
          }
        }

        .lineup_up {
          display: flex;
          align-items: center;
          color: #ACADB4;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
        }

        .team_right {
          @apply min-w-100px flex justify-end;

          .icon_item {
            @apply w-30px flex flex-col items-center justify-center mr-5px;

            .time {
              @apply font-bold text-dark relative font-sans;

              .sub_m {
                @apply absolute;
              }
            }
          }
        }
      }
    }
  }
}
</style>