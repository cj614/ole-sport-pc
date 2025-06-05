<template>
  <div class="m_special_offer_warp">
    <page-ImgSwiper height="300" v-show="headerBanner" typeName="Pc-Activity page header banner"
      @show="res => (headerBanner = res)"></page-ImgSwiper>
    <div class="special_offer_menu">
      <ul class="menu_list">
        <li class="menu_item" :class="{ menu_item_active: activeIdex === 0 }" @click="handleTab(0)">{{
          $t(`Module['全部活动']`) }}</li>
        <li class="menu_item" :class="{ menu_item_active: activeIdex === 1 }" @click="handleTab(1)">{{
          $t(`Module['限时活动']`) }}</li>
        <li class="menu_item" :class="{ menu_item_active: activeIdex === 2 }" @click="handleTab(2)">{{
          $t(`Module['已过期']`) }}</li>
      </ul>
    </div>
    <module-self>
      <div class="special_offer_content">
        <div class="special_offer_pad">
          <template v-if="activityList.length">
            <div v-for="(item, index) in activityList" :key="index" class="special_offer_item"
              @click.stop="handleClickImg(item)">
              <div class="_logo">
                <v-overlay absolute color="dark" :opacity="0.65" :value="!!item.is_over_time"></v-overlay>
                <page-pageLoad :src="item.img_url" width="400" height="233"
                  currentClass="rounded-t-10px"></page-pageLoad>
              </div>
              <div class="activity_box">
                <div class="activity_info">
                  <v-tooltip top z-index="10">
                    <template v-slot:activator="{ on, attrs }">
                      <div class="activity_title whiteSpace_nowrap" v-bind="attrs" v-on="on">{{ item.title }}</div>
                    </template>
                    <span>{{ item.title }}</span>
                  </v-tooltip>

                  <div class="activity_time">
                    {{ $t(`Module['活动时间']`) }}：{{
                      $date(item.start_time * 1000).format('YYYY-MM-DD')
                    }}
                    -
                    {{ $date(item.end_time * 1000).format('YYYY-MM-DD') }}
                  </div>
                </div>
              </div>
              <span class="ing" v-if="!item.is_over_time">
                <!-- <v-img :src="Img.Ing" width="76" height="26"></v-img> -->
                {{ $t(`Module['活动进行中']`) }}
              </span>
              <span class="out" v-else>
                {{ $t(`Module['已过期']`) }}
                <!-- <v-img :src="Img.Out" width="52" height="26"></v-img> -->
              </span>
            </div>
          </template>
          <template v-else>
            <module-skeletonCard v-if="loading" skeletonClass="p-10px" height="233" width="400"></module-skeletonCard>
            <page-empty v-else :top="60" :title="$t(`Module['暂无数据']`)"></page-empty>
          </template>
        </div>
      </div>
    </module-self>

    <page-adv left="Pc-Activity page left side banner" right="Pc-Activity page right side banner"></page-adv>
    <page-footeradv footer="Pc-Activity page footer side banner"></page-footeradv>
  </div>
</template>

<script>
import { getActivityList } from '@/api/sidebar'
export default {
  data() {
    return {
      activeIdex: 0,
      activityList: [],
      loading: false,
      headerBanner: false,
      Img: {
        Ing: require(`@/${this.$img.Page.Layout.Ing}`),
        Out: require(`@/${this.$img.Page.Layout.Out}`)
      }
    }
  },

  mounted() {
    this.getActivityList()
  },

  methods: {
    handleTab(index) {
      this.activeIdex = index
      this.getActivityList()
    },

    handleClickImg(item) {
      if (item.is_over_time) {
        return
      }
      if (item.content_img_url) {
        this.$router.push({
          name: 'activityDetail',
          query: { img: item.content_img_url }
        })
      } else {
        // this.$toast.warning('暂无详情图')
      }
    },

    async getActivityList() {
      try {
        this.loading = true
        const { Code, Data } = await getActivityList({
          page: 1,
          limit: 50,
          status: this.activeIdex
        })
        if (Code === 200) {
          const { Data: List } = Data
          this.activityList = List
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m_special_offer_warp {
  @apply w-full h-full flex flex-col bg-hex-f4f6ff;

  .special_offer_menu {
    @apply w-full h-60px bg-black text-white;

    .menu_list {
      @apply flex w-1280px pl-0px my-0px mx-auto items-center;

      .menu_item {
        @apply h-60px text-16px flex items-center mr-60px cursor-pointer relative;
      }

      .menu_item_active {
        @apply text-hex-E6CCAE text-20px font-bold;
      }

      .menu_item_active::after {
        content: '';
        @apply h-6px absolute bottom-0px left-0px w-full rounded-10px bg-hex-E6CCAE;
      }
    }
  }

  .special_offer_content {
    @apply py-20px min-h-600px rounded-10px;

    .special_offer_pad {
      @apply bg-hex-292A34 p-10px flex flex-wrap rounded-10px;

      .special_offer_item {
        @apply cursor-pointer p-10px relative;

        ._logo {
          @apply relative w-400px h-233px rounded-t-10px;
        }

        .v-image {
          border-radius: 10px 10px 0px 0px;
        }

        .activity_box {
          @apply w-400px h-75px bg-light px-10px flex items-center justify-between rounded-b-10px;
          border-radius: 0px 0px 10px 10px;

          .activity_info {
            @apply w-full;

            .activity_title {
              @apply font-bold text-16px;
            }

            .activity_time {
              @apply mt-10px;
            }
          }

          .activity_btn {
            .v-btn {
              background: var(---, #1862c8);
              border-radius: 10px 10px 0px 10px;
              font-size: 12px;
            }
          }
        }

        .out,
        .ing {
          @apply absolute top-10px right-10px z-10 py-4px px-8px;
        }

        .ing {
          @apply min-w-76px h-26px flex items-center justify-center rounded-tr-10px rounded-bl-10px text-12px text-warning font-bold;
          background: rgba(0, 0, 0, 0.5);
        }

        .out {
          @apply min-w-52px h-26px flex items-center justify-center rounded-tr-10px rounded-bl-10px text-12px text-lightFirst;
          background: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }

  .special_offer_content_2 {
    @apply py-20px min-h-550px rounded-10px p-10px;
  }
}
</style>
