<template>
    <div>
        <div v-if="hometeam.home"
            style="background-color:white;padding: 30px 20px; display: flex;justify-content: space-between;align-items: center;position: relative;">
            <div class="topl">
                <el-image style="width: 44px;height: 44px;" :src="hometeam.home_logo">
                </el-image>
                <span style="margin-left: 10px;font-weight: bold">{{ hometeam.home }}</span>
            </div>
            <el-image fit="contain"
                style="height: 58px;width: 62px; position: absolute;left: calc(50% - 35px); z-index: 2;"
                :src="require('@/static/image/live/VS.png')">
            </el-image>
            <div class="topr">
                <span style="margin-right: 10px;font-weight: bold">{{ awayteam.away }}</span>
                <el-image style="width: 44px;height: 44px;" :src="awayteam.away_logo">
                </el-image>
            </div>
        </div>
        <div v-if="type == 'FOOTBALL'">

            <!--统计指标-->
            <div style="background-color: white">
                <div style="display: flex;justify-content: space-around;padding:10px 0;">
                    <div style="width: 33%;text-align: center;">{{ $t(`Module['进攻']`) }}</div>
                    <div style="width: 33%;text-align: center">{{ $t(`Module['危险进攻']`) }}</div>
                    <div style="width: 33%;text-align: center">{{ $t(`Module['控球率']`) }}</div>
                </div>
                <div style="display: flex;justify-content: space-around;">
                    <div style="width:100px;height: 100px; display: flex;align-items: center;justify-content: center; ">
                        <span class="textl">{{ hometeam.attack }}</span>
                        <ring-chart :options="opts" :chartdata="chartData" />
                        <span class="textr">{{ awayteam.attack }}</span>
                    </div>
                    <div style="width:100px;height: 100px; display: flex;align-items: center;justify-content: center;">
                        <span class="textl">{{ hometeam.dangerous_attack }}</span>
                        <ring-chart :options="opts" :chartdata="chartData1" />
                        <span class="textr">{{ awayteam.dangerous_attack }}</span>
                    </div>
                    <div style="width:100px;height: 100px; display: flex;align-items: center;justify-content: center;">
                        <span class="textl">{{ hometeam.ball_possession }}</span>
                        <ring-chart :options="opts" :chartdata="chartData2" />
                        <span class="textr">{{ awayteam.ball_possession }}</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-around; padding-bottom: 20px;">
                    <div
                        style=" border-radius: 24px;border: 1px solid #F0F0F0;display: flex;justify-content: space-around; align-items: center;padding: 30px 10px;width: 170px;">

                        <div style="width: 24px; text-align: center;">
                            <el-image class="card" style="margin-bottom: 15px;"
                                :src="require('@/static/image/live/jiaoqiu.png')">
                            </el-image>
                            <span class="card">{{ hometeam.corner_kicks }}</span>
                        </div>

                        <div style="width: 24px; text-align: center;">
                            <el-image class="card" style="margin-bottom: 15px;"
                                :src="require('@/static/image/live/hongpai.png')">
                            </el-image>
                            <span class="card">{{ hometeam.red_cards }}</span>
                        </div>
                        <div style="width: 24px; text-align: center;">
                            <el-image class="card" style="margin-bottom: 15px;"
                                :src="require('@/static/image/live/huangpai.png')">
                            </el-image>
                            <span class="card">{{ hometeam.yellow_cards }}</span>
                        </div>
                    </div>

                    <div
                        style="display: flex;justify-content: space-around; align-items: center;flex-direction: column;">

                        <div class="progressbox">
                            <div
                                style="height: 25px; display: flex; align-items: center; justify-content: space-between;">
                                <span class="textl">{{ hometeam.shots_on_target }}</span>
                                <span>{{ $t(`Module['射正球门']`) }}</span>
                                <span class="textr">{{ awayteam.shots_on_target }}</span>
                            </div>
                            <div class="flex">
                                <el-progress class="progress pl" :stroke-width="8" :format="format" color="#2E72EF"
                                    :percentage="hometeam.shots_on_target / (hometeam.shots_on_target + awayteam.shots_on_target) * 100 || 0">
                                </el-progress>
                                <el-progress class="progress pr" :stroke-width="8" :format="format" color="#E35D68"
                                    :percentage="awayteam.shots_on_target / (hometeam.shots_on_target + awayteam.shots_on_target) * 100 || 0">
                                </el-progress>
                            </div>

                        </div>
                        <div class="progressbox">
                            <div
                                style="height: 25px; display: flex; align-items: center; justify-content: space-between;">
                                <span class="textl" v-if="awayteam">{{ hometeam.shots - hometeam.shots_on_target
                                    }}</span>
                                <span class="textl" v-else>0</span>
                                <span>{{ $t(`Module['射偏球门']`) }}</span>
                                <span class="textr" v-if="awayteam">{{ awayteam.shots - awayteam.shots_on_target
                                    }}</span>
                                <span class="textr" v-else>0</span>

                            </div>
                            <div class="flex">
                                <el-progress class="progress pl" :stroke-width="8" :format="format" color="#2E72EF"
                                    :percentage="(hometeam.shots - hometeam.shots_on_target) / (hometeam.shots - hometeam.shots_on_target + awayteam.shots - awayteam.shots_on_target) * 100 || 0">
                                </el-progress>
                                <el-progress class="progress pr" :stroke-width="8" :format="format" color="#E35D68"
                                    :percentage="(awayteam.shots - awayteam.shots_on_target) / (hometeam.shots - hometeam.shots_on_target + awayteam.shots - awayteam.shots_on_target) * 100 || 0">
                                </el-progress>
                            </div>
                        </div>
                        <!-- <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                            <span class="card">{{ awayteam.yellow_cards }}</span>
                            <span class="card">{{ awayteam.red_cards }}</span>
                            <span class="card">{{ awayteam.corner_kicks }}</span>
                        </div> -->

                    </div>
                    <div
                        style=" border-radius: 24px;border: 1px solid #F0F0F0;display: flex;justify-content: space-around; align-items: center;padding: 30px 10px;width: 170px;">
                        <div style="width: 24px; text-align: center;">
                            <el-image class="card" style="margin-bottom: 15px;"
                                :src="require('@/static/image/live/huangpai.png')">
                            </el-image>
                            <span class="card">{{ awayteam.yellow_cards }}</span>
                        </div>

                        <div style="width: 24px; text-align: center;">
                            <el-image class="card" style="margin-bottom: 15px;"
                                :src="require('@/static/image/live/hongpai.png')">
                            </el-image>
                            <span class="card">{{ awayteam.red_cards }}</span>
                        </div>
                        <div style="width: 24px; text-align: center;">
                            <el-image class="card" style="margin-bottom: 15px;"
                                :src="require('@/static/image/live/jiaoqiu.png')">
                            </el-image>
                            <span class="card">{{ awayteam.corner_kicks }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="incidentData != null">
                <div class="title">
                    <el-image style="width: 20px" :src="require('@/static/image/live/lineup.png')"
                        mode="widthFix"></el-image>
                    {{ $t(`Module['重要事件']`) }}
                </div>

                <!-- 时间轴 -->
                <div class="timebox">
                    <time-line leftWidth="345px" :incidentData='incidentData' gap='30px'></time-line>
                </div>

                <!-- 标注 -->
                <div class="logobox">
                    <div class="logoitem" v-for="(item, index) in logoList" :key="index">
                        <el-image style="width: 12px;height:12px" :src="item.src"></el-image>
                        <span class="logotitle">{{ item.title }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 篮球 -->

        <div v-if="type == 'BASKETBALL'">
            <div style="background-color: #fff;">
                <div style=" display: flex;justify-content: space-around; align-items: center;padding-top: 20px;">
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center;">
                        <span>{{ hometeam.three_pointer }}</span>
                    </div>
                    <div class="progressbox">
                        <div class="progresstitle">
                            {{ $t(`Module['三分球']`) }}
                        </div>
                        <div class="flex">
                            <el-progress class="progress pl" :stroke-width="8" :format="format" color="#2E72EF"
                                :percentage="hometeam.three_pointer / (hometeam.three_pointer + awayteam.three_pointer) * 100 || 0">
                            </el-progress>
                            <el-progress class="progress pr" :stroke-width="8" :format="format" color="#E35D68"
                                :percentage="awayteam.three_pointer / (hometeam.three_pointer + awayteam.three_pointer) * 100 || 0">
                            </el-progress>
                        </div>

                    </div>
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ awayteam.three_pointer }}</span>
                    </div>
                </div>

                <div style="display: flex;justify-content: space-around; align-items: center;margin-top: 20px;">
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ hometeam.two_pointer }}</span>
                    </div>
                    <div class="progressbox">
                        <div class="progresstitle">
                            {{ $t(`Module['两分球']`) }}
                        </div>
                        <div class="flex">
                            <el-progress class="progress pl" :stroke-width="8" :format="format" color="#2E72EF"
                                :percentage="hometeam.two_pointer / (hometeam.two_pointer + awayteam.two_pointer) * 100 || 0">
                            </el-progress>
                            <el-progress class="progress pr" :stroke-width="8" :format="format" color="#E35D68"
                                :percentage="awayteam.two_pointer / (hometeam.two_pointer + awayteam.two_pointer) * 100 || 0">
                            </el-progress>
                        </div>

                    </div>
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ awayteam.two_pointer }}</span>
                    </div>
                </div>


                <div style="display: flex;justify-content: space-around; align-items: center;margin-top: 20px;">
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ hometeam.free_throw }}</span>
                    </div>
                    <div class="progressbox">
                        <div class="progresstitle">
                            {{ $t(`Module['罚球']`) }}
                        </div>
                        <div class="flex">
                            <el-progress class="progress pl" :stroke-width="8" :format="format" color="#2E72EF"
                                :percentage="hometeam.free_throw / (hometeam.free_throw + awayteam.free_throw) * 100 || 0">
                            </el-progress>
                            <el-progress class="progress pr" :stroke-width="8" :format="format" color="#E35D68"
                                :percentage="awayteam.free_throw / (hometeam.free_throw + awayteam.free_throw) * 100 || 0">
                            </el-progress>
                        </div>

                    </div>
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ awayteam.free_throw }}</span>
                    </div>
                </div>

                <div style="display: flex;justify-content: space-around; align-items: center;margin-top: 20px;">
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ hometeam.remaining_timeout }}</span>
                    </div>
                    <div class="progressbox">
                        <div class="progresstitle">
                            {{ $t(`Module['剩余暂停']`) }}
                        </div>
                        <div class="flex">
                            <el-progress class="progress pl" :stroke-width="8" :format="format" color="#2E72EF"
                                :percentage="hometeam.remaining_timeout / (hometeam.remaining_timeout + awayteam.remaining_timeout) * 100 || 0">
                            </el-progress>
                            <el-progress class="progress pr" :stroke-width="8" :format="format" color="#E35D68"
                                :percentage="awayteam.remaining_timeout / (hometeam.remaining_timeout + awayteam.remaining_timeout) * 100 || 0">
                            </el-progress>
                        </div>

                    </div>
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ awayteam.remaining_timeout }}</span>
                    </div>
                </div>

                <div style="display: flex;justify-content: space-around; align-items: center;margin-top: 20px;">
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ hometeam.fouls }}</span>
                    </div>
                    <div class="progressbox">
                        <div class="progresstitle">
                            {{ $t(`Module['犯规']`) }}
                        </div>
                        <div class="flex">
                            <el-progress class="progress pl" :stroke-width="8" :format="format" color="#2E72EF"
                                :percentage="hometeam.fouls / (hometeam.fouls + awayteam.fouls) * 100 || 0">
                            </el-progress>
                            <el-progress class="progress pr" :stroke-width="8" :format="format" color="#E35D68"
                                :percentage="awayteam.fouls / (hometeam.fouls + awayteam.fouls) * 100 || 0">
                            </el-progress>
                        </div>

                    </div>
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ awayteam.fouls }}</span>
                    </div>
                </div>

                <div style="display: flex;justify-content: space-around; align-items: center;margin-top: 20px;">
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ hometeam.free_throw_percentage }}%</span>
                    </div>
                    <div class="progressbox">
                        <div class="progresstitle">
                            {{ $t(`Module['罚球命中率']`) }}
                        </div>
                        <div class="flex">
                            <el-progress class="progress pl" :stroke-width="8" :format="format" color="#2E72EF"
                                :percentage="hometeam.free_throw_percentage / (hometeam.free_throw_percentage + awayteam.free_throw_percentage) * 100 || 0">
                            </el-progress>
                            <el-progress class="progress pr" :stroke-width="8" :format="format" color="#E35D68"
                                :percentage="awayteam.free_throw_percentage / (hometeam.free_throw_percentage + awayteam.free_throw_percentage) * 100 || 0">
                            </el-progress>
                        </div>

                    </div>
                    <div style="width: 170px;display: flex; justify-content: space-around;align-items: center; ">
                        <span>{{ awayteam.free_throw_percentage }}%</span>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import timeLine from '../xuan-timeLine/xuan-timeLine.vue'
import ringChart from '../echarts/ringChart.vue';
import {
    live_room_stats,
    live_room_incidents,
    live_room_score
} from "../../api/live";

export default {
    name: "outs",
    props: {
        allMatchId: {
            type: Number || String,
            default: 0
        },
        type: {
            type: String,
            default: "",
        },
    },
    components: {
        timeLine,
        ringChart
    },
    data() {
        return {
            players: null,
            hometeam: {
                home_logo: null,
                home: "",
            },
            awayteam: {
                away_logo: null,
                away: "",
            },
            type_code: {},
            reason_type_code: {},
            incidentData: null,
            acitveIndex: 0,
            logoList: [
                {
                    title: this.$t('Module["进球"]'),
                    src: require('@/static/image/live/jinqiu.png')
                },
                {
                    title: this.$t('Module["点球"]'),
                    src: require('@/static/image/live/dianqiu.png')
                },
                {
                    title: this.$t('Module["点球不进"]'),
                    src: require('@/static/image/live/dianbu.png')
                },
                {
                    title: this.$t('Module["乌龙球"]'),
                    src: require('@/static/image/live/wulong.png')
                },
                {
                    title: this.$t('Module["角球"]'),
                    src: require('@/static/image/live/jiaoqiu.png')
                },
                {
                    title: this.$t('Module["助攻"]'),
                    src: require('@/static/image/live/zhugong.png')
                },
                {
                    title: this.$t('Module["黄牌"]'),
                    src: require('@/static/image/live/huangpai.png')
                },
                {
                    title: this.$t('Module["红牌"]'),
                    src: require('@/static/image/live/hongpai.png')
                },
                {
                    title: this.$t('Module["两黄一红"]'),
                    src: require('@/static/image/live/honghuang.png')
                },
                {
                    title: this.$t('Module["换人"]'),
                    src: require('@/static/image/live/huanren.png')
                },
                {
                    title: this.$t('Module["受伤"]'),
                    src: require('@/static/image/live/shoushang.png')
                },
                {
                    title: 'VAR',
                    src: require('@/static/image/live/VAR.png')
                },
            ],
            location: 'center',
            time: 0,
            isclick: true,
            menuList: [
                // 	{
                // 	name: "文字直播",
                // 	type: "word"
                // },
                {
                    name: this.$t('重要事件'),
                    type: "event"
                }
            ],
            chartData: {},
            chartData1: {},
            chartData2: {},
            opts: {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    left: 'center'
                },

                series: [

                ]
            },

        };
    },
    mounted() {
        this.init()
        // this.$refs.timeline.getScroll();
    },
    onPageScroll() {

        if (this.isclick) {
            // this.timer();
            // this.$refs.timeline.getScroll();
        }
    },
    methods: {
        format() {
            return ''
        },
        handle_menu(item, index) {
            this.acitveIndex = index;
            if (item.type == 'word') {
                this.location = 'left'
            } else {
                this.location = 'center'
            }
        },
        timer() {
            if (this.time > 0) {
                this.isclick = false;
                this.time--;
                setTimeout(this.timer, 1)
            } else {
                this.isclick = true;
                this.time = 10
            }
        },
        async live_room_score() {

            const {
                Code,
                Data
            } = await live_room_score({
                all_match_id: this.allMatchId
            })
            if (Code == 200) {
                if (Data) {
                    this.hometeam.home = Data.home;
                    this.hometeam.home_logo = Data.home_logo;
                    this.awayteam.away = Data.away;
                    this.awayteam.away_logo = Data.away_logo;
                }
            }
        },
        async live_room_incidents() {

            const {
                Code,
                Data
            } = await live_room_incidents({
                all_match_id: this.allMatchId
            })
            if (Code == 200) {
                if (Data && Data.incidents.length > 0) {
                    this.incidentData = Data
                }
            }
        },
        async live_room_stats() {
            const {
                Code,
                Data
            } = await live_room_stats({
                all_match_id: this.allMatchId
            })
            if (Code == 200) {
                console.log('环形', Data)
                if (Data) {

                    this.hometeam = {
                        ...Data.home,
                        ...this.hometeam,
                    }
                    this.awayteam = {
                        ...Data.away,
                        ...this.awayteam
                    }

                    console.log('this.hometeam', this.hometeam)
                    let attack = {
                        data: [{
                            "name": "",
                            "value": this.awayteam.attack,
                        }, {
                            "name": "",
                            "value": this.hometeam.attack,
                        },]
                    };

                    let dangerous_attack = {
                        data: [{
                            "name": "",
                            "value": this.awayteam.dangerous_attack,
                        }, {
                            "name": "",
                            "value": this.hometeam.dangerous_attack,
                        },]
                    };

                    let ball_possession = {
                        data: [{
                            "name": "",
                            "value": this.awayteam.ball_possession * 1,
                        }, {
                            "name": "",
                            "value": this.hometeam.ball_possession * 1,
                        },]
                    };
                    console.log("147369", ball_possession);
                    this.chartData = JSON.parse(JSON.stringify(attack));
                    this.chartData1 = JSON.parse(JSON.stringify(dangerous_attack));
                    this.chartData2 = JSON.parse(JSON.stringify(ball_possession));
                    console.log("1123", this.hometeam);
                    console.log("11234", this.awayteam);

                }
            }
        },
        init() {
            this.live_room_score()
            this.live_room_stats()
            this.live_room_incidents()
        }
    }
}
</script>
<style>
.el-progress-bar {
    padding: 0 !important;
    margin: 0 !important;

}

.pl {
    transform: scaleX(-1);

}

.pr .el-progress-bar__outer,
.pr .el-progress-bar__inner {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
}

.pl .el-progress-bar__outer,
.pl .el-progress-bar__inner {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
}
</style>
<style lang="scss" scoped>
.flex {
    display: flex;
    align-items: center;
}

.card {
    width: 24px;
    height: 24px;
    text-align: center;
}

.active {
    color: #2BA5FF;
    background-color: #fff;
    width: 375px;
    height: 90px;
    line-height: 90px;
    span-align: center;
    border-radius: 30px 30px 0px 0px;
    display: flex;
    align-items: center;
}

.nocative {
    align-items: center;
    display: flex;
    width: 375px;
    height: 90px;
    line-height: 90px;
    span-align: center;
    color: #dfdfdf;
    background-color: #f6f7f8;
    border-radius: 20px;
}

.menubox {
    padding: 20px 0;
    display: flex;
    height: 60px;
    align-items: center;
    // background-color: #f6f7f8;
    margin-top: 10px;
}

.timebox {
    width: 100%;
}

.logobox {
    display: flex;
    flex-wrap: wrap;
    /* 容器宽度 */
    background: #fff;
    padding: 40px 20px;
    margin-top: 20px;
    justify-content: center;

    .logoitem {
        display: flex;
        justify-content: start;
        align-items: center;

        .logotitle {
            color: #000;
            font-size: 15px;
            font-weight: 600;
            margin: 0 6px;
        }
    }
}

.title {
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 16px !important;
    font-weight: 500;
}

.progressbox {
    width: 350px;
    height: 50px;
    text-align: center;

    .progresstitle {
        height: 25px;
    }
}

.topl {
    flex: 1;
    display: flex;
    align-items: center;
    border-top-left-radius: 54px;
    border-bottom-left-radius: 54px;
    background: linear-gradient(90deg, #7AC8FF 0%, #2E72EF 100%);
    color: #fff;
    padding: 11px 15px;
    padding-right: 5%;
    clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%);
    height: 60px;
}

.topr {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: right;
    border-top-right-radius: 54px;
    border-bottom-right-radius: 54px;
    background: linear-gradient(90deg, #F23F4E 0%, #FFBCB8 100%);
    color: #fff;
    padding: 11px 20px;
    padding-left: 5%;
    clip-path: polygon(5% 0, 100% 0, 100% 100%, 0% 100%);
    height: 60px;
}


.textl {
    color: #0274F5;
}

.textr {
    color: #CC2535;

}

.progress {
    flex: 1;
}
</style>