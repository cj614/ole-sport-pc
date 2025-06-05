<template>
  <module-self>
    <div class="chat-stats">
      <div class="stat-item" v-for="(list, key) in data" :key="key">
        <div class="stat-item-title">
          <div class="bar"></div>
          <span class="stat-label">{{ key }}</span>
        </div>
        <div class="stat-value">
          <div class="stat-value-item stat-value-scrolling" v-for="(item, index) in list" :key="index">
            <!-- <img class="icon" :src="item.img" /> -->
            <span class="name">{{ item.name }}</span>
            <span class="number">{{ formatNum(item.amount) }} VND(k)</span>
          </div>
        </div>
      </div>
      <div class="msgtips" v-show="msgtips">
        <v-img class="kudosImg" :src="gifBg"></v-img>
        <div class="gradient-border">
          <div class="kudosBox ">
            <div class="kudosTitle">
              {{ $t(`Module['恭喜']`) + maxItem.name }}
            </div>
            <div class="kudosTitle">
              {{ $t(`Module['提现']`) }}
              <span class="kudosamount">{{ formatNum(maxItem.amount) }}VND(k)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 在线人数 -->
    <div class="bill-anchor-height">
      <div class="online ">
        <div class="dot"></div>
        <div>{{ online }} {{ $t(`Module['人在线']`) }}</div>
      </div>
    </div>
    <div class="room_footer">
      <template>
        <chat-roomChat type="public" @switchChange="setDanmuSw"
          @setChatList="list => (messageList = list)"></chat-roomChat>
      </template>

    </div>
    <v-dialog v-model="showgift" max-width="1280">
      <div class="showgiftbox">
        <img class="showgiftImg" :src="Img.Gif3" />
        <div class="gradient-border">
          <div class="kudosBox ">
            <div class="kudosTitle">
              {{ $t(`Module['恭喜']`) + maxItem.name }}
            </div>
            <div class="kudosTitle">
              {{ $t(`Module['提现']`) }}
              <span class="kudosamount">{{ formatNum(maxItem.amount) }}VND(k)</span>
            </div>
          </div>
        </div>
      </div>

    </v-dialog>
  </module-self>
</template>

<script>
import { getDepAdd } from "../../api/app";

export default {
  data() {
    return {
      gifBg: '',
      msgtips: false,
      showgift: false,
      online: 0,
      data: {
      },
      messageList: [],
      maxItem: {},
      params: {
        limit: 20,
        from_time: 0,
        content: ''
      },
      scrollInterval: null,
      Img: {
        Fllowing: require(`@/${this.$img.Page.Home.Fllowing}`),
        Close: require(`@/${this.$img.Page.Chat.Close}`),
        Emo: require(`@/${this.$img.Page.Chat.Emo}`),
        Notice: require(`@/${this.$img.Page.Chat.Notice}`),
        Photo: require(`@/${this.$img.Page.Chat.Photo}`),
        Quote: require(`@/${this.$img.Page.Chat.Quote}`),
        Gif1: require(`@/${this.$img.Page.Chat.Gif1}`),
        Gif2: require(`@/${this.$img.Page.Chat.Gif2}`),
        Gif3: require(`@/${this.$img.Page.Chat.Gif3}`),
        ChatLeft: require(`@/${this.$img.Page.Chat.ChatLeft}`)
      },
    }
  },

  mounted() {
    this.getDepAddList()
    this.interval = setInterval(() => {
      this.getDepAddList();
    }, 15000); // 每 15000 毫秒，即 15 秒执行一次
  },
  beforeDestroy() {
    clearInterval(this.interval); // 组件销毁前清除定时器，避免内存泄漏
  },
  computed: {

  },


  methods: {
    formatNum(num) {
      if (typeof num !== 'number') {
        return "";
      }
      return num.toLocaleString()
    },
    setDanmuSw() { },
    getDepAddList() {
      getDepAdd().then(res => {
        const { Code, Data } = res;
        if (Code === 200) {
          console.log('data', Data)
          this.data = {
            [this.$t(`Module['存款记录']`)]: Data.add_fund_list,
            [this.$t(`Module['取款记录']`)]: Data.deposit_list
          }
          this.online = Data.online
          this.maxItem = Data.deposit_list.reduce((max, item) => {
            return item.amount > max.amount ? item : max
          }, Data.deposit_list[0])

          // console.log('最大值项:', this.maxItem)

          this.getAmountLevel(this.maxItem.amount)
          // 等待两秒钟后关闭 msgtips
          setTimeout(() => {
            this.msgtips = false;
            this.showgift = false;
          }, 2000); // 两秒之后关闭 msgtips
        }
      })
    },
    getAmountLevel(amount) {
      if (amount >= 1000000) {
        // console.log('一百万以上')
        this.showgift = true

      } else if (amount >= 100000) {
        // console.log('十万以上')
        this.gifBg = this.Img.Gif2
        this.msgtips = true

      } else if (amount <= 10000) {
        // console.log('一万以内')
        this.gifBg = this.Img.Gif1
        this.msgtips = true
      }
    },


  }
}
</script>

<style lang="scss" scoped>
.gradient-border {
  padding: 1px;
  background: linear-gradient(134.91deg,
      rgba(214, 207, 188, 1) 0%,
      rgba(84, 84, 67, 1) 37.14%,
      rgba(197, 193, 159, 1) 67.77%,
      rgba(144, 142, 116, 1) 100%);
  border-radius: 15.25px;
  margin-right: 20px;
}

.chat-stats {
  display: flex;
  padding-top: 20px;
  justify-content: space-between;
  position: relative;

  .msgtips {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    background: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;

    // transition: opacity 0.5s ease-in-out;
    .kudosImg {
      position: absolute;
      left: 0%;
      right: 0%;
      bottom: 0%;
      z-index: 4;
    }

    .kudosBox {
      position: relative;
      color: #fff;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      display: inline-block;
      background: linear-gradient(180deg, #AD8E63 0%, #403B39 100%);
      border-radius: 15.25px;
      padding: 15px 25px;
      text-align: center;
      z-index: 5;

      .kudosamount {
        color: #FFC300;
      }
    }
  }

}

.showgiftbox {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  // transition: opacity 0.5s ease-in-out;
  .showgiftImg {
    height: 90vh;
    margin: 0 auto;
  }

  .kudosBox {
    position: absolute;
    top: 30%;
    left: 40%;
    color: #fff;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    display: inline-block;
    background: linear-gradient(180deg, #AD8E63 0%, #403B39 100%);
    border-radius: 15.25px;
    padding: 15px 25px;
    text-align: center;
    z-index: 5;

    .kudosamount {
      color: #FFC300;
    }
  }
}

.stat-item {
  background: #18191d;
  border-radius: 16px;
  padding: 16px 15px 16px 25px;
  min-width: 630px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);

  .stat-item-title {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .bar {
      width: 4px;
      height: 22px;
      background: linear-gradient(180deg, #eac78b 0%, #bfa76a 100%);
      border-radius: 2px;
      margin-right: 12px;
    }

    .stat-label {
      font-size: 20px;
      color: #FFE863;
      font-weight: bold;
      letter-spacing: 1px;
    }
  }

  .stat-value {
    // background: red;
    height: 190px;
    overflow-y: hidden;

    .stat-value-scrolling {
      animation: scrollItems 5s linear infinite;
    }

    @keyframes scrollItems {
      0% {
        transform: translateY(0);
      }

      100% {
        transform: translateY(-100%);
        /* 滚动到负值，模拟列表滚动 */
      }
    }

    .stat-value-item {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      margin-right: 10px;
      padding: 8px;
      border: 1px solid #FFFD80;
      background: #EFD471;
      border-radius: 4px;
      color: #6B4724;
      transition: transform 0.5s ease;

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 12px;
        margin-left: 6px;
        object-fit: cover;
        background: #222;
        border: 1px solid #333;
      }

      .name {
        flex: 1;
        font-size: 16px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .number {
        font-size: 16px;
        // font-weight: bold;
        margin-left: 18px;
        min-width: 100px;
        text-align: right;
        letter-spacing: 1px;
      }
    }
  }
}

//在线人数
.bill-anchor-height {
  height: 50px;
  width: 1280px;
  background: #202124;
  padding: 8px 20px;
  display: flex;
  justify-content: center;
  color: #fff;
  z-index: 2;
  border-radius: 10px;
  margin-top: 10px;
  // border-top-left-radius: 10px;
  // border-top-right-radius: 10px;
}

.online {
  @apply rounded-123px w-full;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 235, 59, 0.12);
  z-index: 2;
  font-size: 16px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 235, 59, 0.35);

  .bt {
    display: flex;
    align-items: center;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 10px;
    background: #D1B368;
  }
}
</style>
