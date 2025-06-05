<template>
    <div class="rank">
        <div class="liveReplay">
            <div @click="handle_bestSeller(index)"
                :class="[bestSelleractive == index ? 'liveReplayitem active' : 'liveReplayitem']"
                v-for="(item, index) in bestSeller" :key='index'>
                {{ item.name }}
            </div>
        </div>

        <div class="bestSellerbox" v-if="bestSellerList.length > 0">
            <div class="bestSelleritem" v-for="(item, index) in bestSellerList" :key='index'>
                <div class="selleritemleft">
                    <span v-if="index == 0" style="color: #FFC914;">{{ index + 1 }}</span>
                    <span v-if="index == 1" style="color: #AEBBDA;">{{ index + 1 }}</span>
                    <span v-if="index == 2" style="color: #C6977D;">{{ index + 1 }}</span>
                    <span v-if="index > 2" style="color: #A5A9B3;">{{ index + 1 }}</span>
                    <div class="itemleftimgbox">
                        <el-image style="width: 100%;height: 100%;border-radius: 100%;" :src="item.img_url">
                        </el-image>
                    </div>
                    <div class="itemleftname">
                        <div class="">
                            {{ item.user_name }}
                        </div>
                        <div class="live">
                            <el-image style="width: 12px;height: 10px;"
                                :src="require('@/static/image/live/diamond.png')">
                            </el-image>
                            <span style="color:#A5A9B3">{{ item.sum_amount }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <page-empty :top="60" class="h-full" :title="$t(`Module['暂无数据']`)"></page-empty>
        </div>
    </div>
</template>

<script>
import {

    live_room_top
} from "@/api/live.js";

export default {
    props: {
        userId: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            isFollow: true,
            bestSelleractive: 0, // 控制时间轴是否显示
            bestSellerList: [],
            bestSeller: [{
                name: this.$t(`Module['日榜']`)
            },
            {
                name: this.$t(`Module['周榜']`)
            },
            ]
        }
    },
    computed: {
        userInfo() {
            let info = JSON.parse(this.$store.state.user.userInfo).user
            console.log(info)
            return {
                ...info
            }
        }
    },
    mounted() {
        this.live_room_topinit()
        // this.$refs.timeline.getScroll();
    },
    methods: {
        // 查询排行榜
        live_room_topinit: function () {
            console.log('this.allMatchId', this.userId)
            var _this = this; // 将 this 存储在变量中

            live_room_top({
                anchor_user_id: this.userId,
                type: this.bestSelleractive == 0 ? 'day' : 'week'
            }).then(function (response) {
                var Code = response.Code;
                var Data = response.Data;

                if (Code == 200) {
                    console.log("主播Data11", Data);
                    _this.bestSellerList = Data; // 使用 _this 来访问 Vue 实例的数据
                }
            }).catch(function (error) {
                console.error("获取数据失败", error);
            });
        },

        // 点击事件详情
        handle_bestSeller(index) {

            this.bestSelleractive = index
            this.live_room_topinit()
        }
    }
}
</script>


<style lang="scss" scoped>
.rank {
    background: #fff;
    padding: 20px 0;
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
        // width: 200px;
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

.bestSellerbox {
    height: 400px;
    overflow-y: auto;

    .bestSelleritem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 45px;
        line-height: 45px;
        padding: 12px 40px;
        margin-top: 7px;

        .selleritemleft {
            display: flex;
            align-items: center;

            .itemleftimgbox {
                display: flex;
                width: 42px;
                height: 42px;
                padding: 6px;
                justify-content: center;
                align-items: center;
                background: rgba(247, 55, 55, 0.10);
                margin-left: 20px;
                margin-right: 16px;
                border-radius: 8px;
            }

            .itemleftname {
                display: flex;
                flex-direction: column;
                line-height: 21px;

                .live {
                    margin-top: 5px;
                    display: flex;
                    align-items: center;
                    height: 15px;
                    border-radius: 74px;
                    padding: 20px 40px;
                    background: #F5F9FF;
                    width: 100px;
                    padding: 2px 8px;
                    font-size: 12px;
                }
            }
        }



        image {
            width: 20px;
            height: 20px;
        }
    }
}
</style>