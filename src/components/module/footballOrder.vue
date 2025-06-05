<template>
  <div class="m_football_order_warp">
    <div class="football_pad">
      <div class="venue_addr">
        <span class="addr">{{ lineupData.venue_name || '' }}</span>
        <span class="venue_info_x">
          <span>{{ matchAddressInfo }}</span>
        </span>
      </div>
      <div class="order_bg">
        <div class="formation" :class="{ ['pl-30px']: homeClass, ['pr-30px']: awayClass }">
          <ul class="list" :class="index === 0 ? 'home_list' : 'awy_list'" v-for="(item, index) in list" :key="index">
            <li :class="li.name" v-for="(li, cindex) in item.mapList" :key="cindex" class="li-full">
              <div class="player" v-for="(d, dindex) in li.list" :key="dindex">
                <!-- <v-avatar class="player_img avatar_img" size="40" v-show="!d.isNull">
                  <page-pageLoad :src="d.logo" width="40" min-width="40" defaultImg="MoreImg" height="40"
                    :contain="true"></page-pageLoad>
                </v-avatar> -->

                <div class="num" v-show="!d.isNull">{{ d.shirt_number }}
                  <div class="incidents_box">
                    <div class="down">
                      <div v-if="incidentOutMap[d.id]">
                        {{ incidentOutMap[d.id].time }}'
                        <el-image :src="require('@/static/image/live/reddown.png')" fit="cover">
                        </el-image>
                      </div>
                    </div>
                    <div class="other">
                      <div v-for="(v, i) in incidentOtherMap[d.id]" :key="i">
                        <el-image style="width: 15px;" :src="getIncidentLogo(v.type)" fit="cover">
                        </el-image>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="name text_omit" :title="d.name" v-show="!d.isNull">{{ d.name }}</div>
                <div class="name namerating" :title="d.name" v-show="!d.isNull">{{ d.rating }}</div>
                <div :class="['inc' + (i), { ['incH' + (i)]: inc.isH }]" class="incidents"
                  v-for="(inc, i) in d.incidents" :key="i">
                  <span :class="{ 'icnImg': inc.img.includes('image_goal') }" class="hot_item">
                    <v-img :width="inc.isH ? 19 : 16" height="16" :src="require(`@/${inc.img}`)"
                      :contain="true"></v-img>
                    <div :class="['num_hot', i > 1 ? 'num_bottom' : 'num_top']" v-if="inc.num > 1">{{ inc.num }}</div>
                  </span>

                  <span class="time relative" v-show="i === 0">
                    {{ inc.time }}
                    <span class="sub_m">'</span>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="venue_type">
        <span>{{ venueType[0] }}</span>
        <span>{{ venueType[1] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  live_room_incidents,
} from "../../api/live";
import { getIncidentLogo } from "@/libs/util";

export default {
  name: '',

  props: {
    list: {
      type: Array,
      default: () => []
    },
    lineupData: {
      type: Object,
      default: () => ({})
    },
    matchAddressInfo: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    homeClass: {
      type: Boolean,
      default: false
    },
    awayClass: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    venueType() {
      const [item, item1] = this.list || []

      return [item?.formation, item1?.formation]
    }
  },

  data() {
    return {
      incidentOutMap: {}, // 下场事件数据
      incidentOtherMap: {}, // 其他事件数据
    }
  },
  mounted() {
    this.liveIncidents()
  },
  methods: {

    getIncidentLogo,
    async liveIncidents() {
      const {
        Code,
        Data
      } = await live_room_incidents({
        all_match_id: this.id
      })
      if (Code === 200) {

        if (Data && Data.incidents.length > 0) {
          Data.incidents.forEach((item) => {
            let key = 0
            if (item.out_player_id) {
              key = item.in_player_id
              // this.incidentOutMap[key] = item
              this.$set(this.incidentOutMap, key, item);

            }

            if (item.player_id) {
              key = item.player_id
              if (!this.incidentOtherMap[key]) {
                this.incidentOtherMap[key] = []
              }
              this.incidentOtherMap[key].push(item)
            }
          })
        }
      }
    },
  }

}
</script>

<style lang="scss" scoped>
.li-full {
  @apply h-full
}

.m_football_order_warp {
  @apply h-570px rounded-10px bg-no-repeat bg-center bg-successFirst;

  .football_pad {
    @apply px-20px h-full relative;

    .venue_addr {
      @apply w-full h-40px flex items-center justify-between;

      .addr {
        @apply text-lightFirst text-12px;
      }

      .venue_info_x {
        @apply text-lightFirst text-12px;
      }
    }

    .venue_type {
      @apply w-full h-40px flex items-center justify-between text-lightFirst text-12px;
    }

    .order_bg {
      height: 490px;
      background: url(../../static/image/page/room/icon_room_FBbg.png);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;

      .formation {
        @apply flex justify-between h-full px-10px;

        .list {
          @apply pl-0px flex;
          gap: 0;
          >li {
            @apply flex flex-col justify-around mx-7.5px w-62px;

            .player {
              @apply flex flex-col items-center justify-center relative h-70px;

              .player_img {
                @apply mb-10px;
              }



              .num {
                @apply w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border-1 border-solid border-lightFirst z-0;
                background-color: #B31942;
                color: #fff;

                .incidents_box {
                  position: absolute;
                  height: 25px;
                  right: -100%;
                  top: 25%;
                  z-index: 20;
                  font-size: 12px;
                  color: white;
                  width: 50px;

                  .down,
                  .other {
                    height: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: left;
                  }
                }
              }

              .name {
                @apply absolute py-3px px-6px text-12px text-lightFirst rounded-20px min-w-30px text-center max-w-90px;
                bottom: -8px;
              }

              .namerating {
                bottom: -26px;
                background: rgba(89, 91, 105, 0.70);
              }

              .incidents {
                @apply absolute flex items-center w-50px;

                .time {
                  @apply text-12px font-sans text-lightFirst font-bold mx-1px z-10 relative;

                  .sub_m {
                    @apply absolute;
                  }
                }

                .icnImg {
                  .v-image {
                    background-color: #fff;
                    border-radius: 50%;
                  }
                }

                .hot_item {
                  @apply relative;

                  .num_hot {
                    @apply absolute left-1px font-sans text-12px font-bold text-lightFirst w-16px h-16px rounded-1/2 text-center bg-error border-1px border-solid border-lightFirst;
                  }

                  .num_top {
                    top: -12px;
                  }

                  .num_bottom {
                    bottom: -12px;
                  }
                }
              }

              .inc0 {
                right: -38px;
                top: 5px;
              }

              .inc1 {
                flex-direction: row-reverse;
                left: -38px;
                top: 5px;
                z-index: 5;
              }

              .inc2 {
                left: -40px;
                bottom: 19px;
                flex-direction: row-reverse;
              }

              .inc3 {
                right: -40px;
                bottom: 19px;
              }
            }
          }

          .staff_G {
            @apply items-center ml-0px;
          }

          .staff_D {
            @apply items-center;
          }

          .staff_M {
            @apply items-center;
          }

          .staff_F {
            @apply items-center;
          }

          .staff_F1 {
            @apply items-center;
          }

          .staff_F2 {
            @apply items-center mr-0px;
          }

          .staff_G_a {
            @apply items-center mr-0px;
          }

          .staff_D_a {
            @apply items-center;
          }

          .staff_M_a {
            @apply items-center;
          }

          .staff_F_a {
            @apply items-center;
          }

          .staff_F1_a {
            @apply items-center;
          }

          .staff_F2_a {
            @apply items-center ml-0px;
          }
        }

        .home_list {
          @apply flex-row-reverse;
        }

        .awy_list {
          .num {
            background-color: #0A3161 !important;
          }
        }
      }
    }
  }
}
</style>