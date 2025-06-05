<template>
    <div class="m_live_warp">

        <module-self>

            <div class="live_content">
                <div style="width: 80px;height: 29px; display: flex; align-items: center; cursor: pointer;"
                    @click="$router.go(-1);">
                    <v-icon size="18" style="color: #E4CAAB !important;">mdi-arrow-left</v-icon>
                    <span style="color: #E4CAAB;margin-left: 10px;">{{ $t(`Module['返回']`) }}</span>
                </div>
                <div class="title_box">
                    <div @click="handle_item(item, index)" class="title_item"
                        :class="[currentTitle == index ? 'active' : '']" v-for="(item, index) in titleList"
                        :key="index">
                        <span :class="[currentTitle == index ? 'active' : '']" class="title_name">{{
                            $t(`Module['${item.name}']`)
                            }}</span>
                    </div>
                </div>
                <template v-if="matchLiveList.length">
                    <div class="pb-40px">
                        <page-competitionCardnew :type="liveType" :Anchor="true" :List="matchLiveList"
                            @handleClickItem="handleClickItem"></page-competitionCardnew>
                        <module-pagination :paddingTop="20" :page="page.page" :count="page.count" :limit="page.limit"
                            @pageList="pageList"></module-pagination>
                    </div>
                </template>
                <template v-else>
                    <module-skeletonCard v-if="loading" skeleton="live"></module-skeletonCard>
                    <page-empty type="matchLive" v-else :top="40" :title="$t(`Module['目前暂无直播']`)"></page-empty>
                </template>
            </div>

        </module-self>


    </div>
</template>

<script>

import { HomeLive, getVideoList } from '@/api/live'


export default {
    data() {
        return {
            currentTitle: 0,
            liveType: 0,
            matchLiveList: [], // 历史回放 / 教程

            titleList: [{ name: '直播中', live_type: 0 }, { name: '精彩推荐', live_type: 1 }],

            loading: false,
            page: {
                page: 1,
                limit: 24,
                count: 0
            },
            aboveBanner: false,
            item: {},
        }
    },

    computed: {

        userInfo() {
            return JSON.parse(this.$store.state.user.userInfo) || {}
        },

        token() {
            let { token } = this.userInfo
            return token || ''
        }
    },

    mounted() {

        this.getMatchLiveListPage()
    },

    methods: {

        handle_item(item, index) {
            this.currentTitle = index
            this.liveType = item.live_type
            this.getMatchLiveListPage()
        },
        handleClickItem(item) {
            if (!this.token) {
                this.$bus.$emit('login/on', 'login')
                return
            }

            let { live_play_id, live_room_id, all_match_id } = item
            let items = {
                img: item.img_url,
                video: item.video_url,
                title: item.title,
            }
            if (live_room_id) {
                this.$router.push({ name: 'anchorRoom', params: { id: live_room_id, all_match_id: all_match_id, type: 0 } })
            } else if (live_play_id) {
                this.$router.push({ name: 'anchorRoom', params: { id: live_play_id, all_match_id: all_match_id, type: 1 } })
            } else {
                this.$router.push({ name: 'anchorRoom', params: { id: -1 * item.id, videoInfo: JSON.stringify(items) } })
            }
        },


        pageList(page) {
            this.page.page = page
            this.getMatchLiveListPage()
        },


        async getMatchLiveListPage() {
            try {
                this.matchLiveList = []
                this.loading = true
                const param = {
                    page: this.page.page,
                    limit: this.page.limit,
                    sport_type: '',
                    live_type: this.liveType
                }
                let res;
                switch (this.liveType) {
                    case 0:
                        res = await HomeLive(param);
                        break;
                    case 1:
                        res = await getVideoList({
                            page: this.page.page,
                            limit: this.page.limit,
                        });
                        break;
                    default:

                }
                const { Code, Data } = res
                if (Code === 200) {
                    const { Data: List, Count } = Data
                    this.matchLiveList = List.map(r => ({
                        ...r,
                        Type: r.sport_type
                    }))
                    this.page.count = Count
                    if (Object.keys(this.item).length) {
                        this.$set(this.item, 'count', Count)
                    }
                    console.log(this.matchLiveList)
                }
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        },

    }
}
</script>

<style lang="scss" scoped>
.m_live_warp {
    @apply w-full h-full flex flex-col;

    .title {
        color: #fff;
        font-size: 30px !important;
        font-weight: 500;
        padding: 40px 0;
        text-align: center
    }

    .more_btn {
        border: 1px solid #ECCD91;
        color: #E4CAAB;
        background: #000 !important;
        display: flex !important;
        align-items: center !important;
        margin: 30px auto;
    }

    .liveing {
        height: 720px;
        background: url(../../static/image/live/bg.png);
        background-position: center center;
        background-repeat: no-repeat;
        // background-attachment: fixed;
        background-size: cover;
    }

    .live_content {
        @apply pt-20px;

        .title_box {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            // background: #fff;
            padding: 10px;
            margin-bottom: 5px;

            .title_item {
                color: #786B62;
                padding: 5px 15px;
            }

            font-weight: 600;
        }

        .active {
            background: linear-gradient(90deg, #F0B348 0%, #FFF98B 60.43%, #FFD073 100%);
            color: #5C330A !important;
            border-radius: 50px;
            font-weight: 600;

        }
    }

    .live {
        background: #15161A;

        .live-mainbox {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 1280px;
            margin: 0 auto;
        }

        .frist {
            width: 256px;
            height: 290px;
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            position: relative;

            .live-tips {
                position: absolute;
                z-index: 2;
                background: rgb(0, 0, 0, 0.4);
                height: 36px;
                display: flex;
                align-items: center;
                justify-items: center;
                color: #FFEB3B;
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
            width: 349px;
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
                    color: #fff;
                    font-size: 18px;
                }

                .card-tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #C4AB6F;
                    font-size: 12px;
                    color: #9F9F9F;
                    padding: 2px 15px;
                    border-radius: 40px;
                    margin-left: 13px;
                }
            }

            .card-description {
                margin-top: 10px;
                width: 349px;
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
                width: 349px;
                margin: 18px 0;

                .info-item {
                    width: 168px;
                    border-radius: 106px;
                    text-align: center;
                    background: #303030;
                    color: #fff;
                    font-size: 16px;
                    height: 60px;

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
                color: #A18F62;
                background: #71643E;
                border-radius: 193px;
                font-weight: 500;
            }
        }
    }

    .article {
        .article_item {
            @apply flex items-center p-10px rounded-10px w-630px h-190px mb-20px cursor-pointer border-solid border-1px border-black;
            transition: all 0.3s;
        }

        .article_item:hover {
            @apply border-solid border-1px border-hex-E4CAAB;
        }

    }
}
</style>