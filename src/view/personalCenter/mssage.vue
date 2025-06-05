<template>
  <div class="message_warp" v-if="showContent">
    <p class="item_h_title">{{$t(`Module.User['消息中心']`)}}</p>

    <div class="item_tabs">
      <div :class="{tab_active:type=='notice'}" class="tab" @click="() => {type = 'notice'}">通知</div>

      <div :class="{tab_active:type=='affiche'}" class="tab" @click="() => {type = 'affiche'}">公告</div>
    </div>

    <div class="notice_warp" v-if="type==='notice'">
      <div class="notice_content">
        <div class="notice_list">
          <div class="herder">
            <div class="title_1">
              <span class="img_p">
                <v-img :src="Img.MessageLight" width="32" height="32"></v-img>
              </span>
              <div class="txt">我是消息标题我是消息标题</div>
            </div>

            <div class="date">
              <div class="txt">2024-01-24 12:12:12</div>
              <span class="img_p">
                <v-img :src="Img.Show" width="14" height="14"></v-img>
              </span>
            </div>
          </div>

          <div class="content">
            <div class="txt">本场赛事: 阿萨纳 VS 海于格松 已开始，欢迎进入直播间观看。</div>
            <span class="img_p">
              <v-img :src="Img.Delete" width="20" height="20"></v-img>
            </span>
          </div>
        </div>
      </div>

      <module-pagination></module-pagination>
    </div>

    <div class="affiche_warp notice_warp" v-if="type==='affiche'">
      <div class="notice_content">
        <div class="notice_list">
          <div class="herder">
            <div class="title_1">
              <span class="img_p">
                <v-img :src="Img.MessageLight" width="32" height="32"></v-img>
              </span>
              <div class="sub">
                <div class="sub_title">我是消息标题我是消息标题</div>
                <div class="sub_txt">我是公告文案我是公告文案我是公告文案我是公告文案我是公告文案我是公告文案我是公告文案我是公告文案我是公告文案</div>
              </div>
            </div>

            <div class="date">
              <div class="txt">2024-01-24 12:12:12</div>
              <span class="img_p">
                <v-img :src="Img.Delete" width="20" height="20"></v-img>
              </span>
            </div>
          </div>
        </div>
      </div>

      <module-pagination></module-pagination>
    </div>
  </div>
  <div v-else class="affiche_detail">
    <p class="item_h_title">{{$t(`Module.User['返回']`)}}</p>

    <div class="affiche_detail_h">
      <div class="h_txt">我是公告标题我是公告标题</div>
      <div class="h_date">2024-01-24 12:12:12</div>
    </div>
    <div class="affiche_detail_content">
      我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案
      我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案
      我是消息文案我是消息文案我是消息文案
      我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案
      我是消息文案
      我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案我是消息文案
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'notice',
      showContent: false,
      Img: {
        Show: require(`@/${this.$img.Icon.Other.Show}`),
        On: require(`@/${this.$img.Icon.Other.On}`),
        Delete: require(`@/${this.$img.Icon.Other.Delete}`),
        MessageLight: require(`@/${this.$img.Icon.Other.MessageLight}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.message_warp {
  @apply w-full h-full flex flex-col overflow-hidden;

  .item_tabs {
    @apply flex items-center justify-center w-full rounded-25px h-50px p-5px mb-20px;
    background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
    .tab {
      @apply w-1/2 h-full flex justify-center items-center  text-16px font-bold text-white rounded-25px;
    }
    .tab_active {
      @apply text-hex-FFD557  bg-white;
    }
  }
  .notice_warp {
    @apply flex h-full flex-col justify-center items-center overflow-hidden;
    .notice_content {
      @apply flex-1 overflow-auto w-full;
      .notice_list {
        @apply flex flex-col;
        .herder {
          @apply h-80px flex items-center justify-between bg-white border-bottom-1px border-solid border-bottom-hex-f0f0f0;
          .title_1 {
            @apply flex items-center;
            .txt {
              @apply font-bold text-black text-16px ml-20px;
            }
            .sub {
              @apply flex flex-col ml-20px;
              .sub_title {
                @apply font-bold text-16px text-black;
              }
              .sub_txt {
                @apply font-normal text-12px text-hex-9a9a9a mt-10px;
              }
            }
          }
          .img_p {
            @apply cursor-pointer;
          }
          .date {
            @apply flex items-center;
            .txt {
              @apply text-14px font-normal text-hex-9a9a9a mr-20px;
            }
          }
        }

        .content {
          @apply h-80px px-20px bg-hex-f0f0f0 flex items-center justify-between;
          .txt {
            @apply font-bold text-black text-16px;
          }
          .img_p {
            @apply cursor-pointer;
          }
        }
      }
    }
  }
}
.affiche_detail {
  @apply w-full h-full flex flex-col overflow-hidden;

  .affiche_detail_h {
    @apply flex items-center justify-between px-20px bg-hex-1862cb rounded-20px mb-20px h-70px;
    .h_txt {
      @apply font-bold text-20px text-white;
    }
    .h_date {
      @apply text-14px text-white font-normal;
    }
  }

  .affiche_detail_content {
    @apply leading-40px text-14px text-black;
  }
}
</style>