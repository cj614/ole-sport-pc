<template>
    <module-self>
        <div class="video-page">
            <!-- 顶部导航 -->
            <div class="nav-header">
                <div class="menu-box">
                    <div class="menu-scroll">
                        <div v-for="(item, index) in menuList" :key="index" class="menu-item"
                            :class="{ active: index === currentIndex }" @click="handle_menu(item, index)">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 主要内容区 -->
            <div class="main-content">
                <!-- 视频播放器区域 -->
                <div class="video-player">
                    <div v-if="videoInfo.video" class="player-box" @click.self="goDetail(selectedElement)">
                        <MyDplayer :movie="videoInfo"></MyDplayer>
                    </div>
                </div>

                <!-- 视频卡片列表 -->
                <page-videoCard :List="cardList" @handleClickItem="goDetail"></page-videoCard>

            </div>
        </div>
    </module-self>
</template>

<script>
// import VideoCard from "@/components/consult/videoCard.vue";
import { getVideoList } from "@/api/live";
import { getColumnList } from "@/api/global";
import MyDplayer from "_c/module/myDplayer.vue";

// import DPlayer from "@/components/DPlayer/DPlayer.vue";

export default {
    name: "VideoPage",
    components: {
        MyDplayer,
        // VideoCard,
    },
    data() {
        return {
            safeAreaTop: 0,
            menuList: [],
            currentIndex: 0,
            query: {
                page: 1,
                limit: 20,
                column_set_id: null
            },
            cardList: [],
            contentType: null,
            videoColumnSet: 0,
            selectedElement: {},
            videoInfo: {
                img: '',
                video: '',
                videType: '',
            },
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            let result = await getColumnList({ name: 'video' });
            if (result.Code === 200) {
                this.menuList = result.Data;
                this.handle_menu(result.Data[0], 0);
            }
        },
        async handle_menu(item, index) {
            this.cardList = [];
            this.query.page = 1;
            this.currentIndex = index;
            this.query.column_set_id = item.id;

            if (this.contentType === 1) {
                this.videoColumnSet = item.id;
            }

            let result = await getVideoList(this.query);
            if (result.Code === 200) {
                if (result.Data.Data.length > 0) {
                    let randomIndex = Math.floor(Math.random() * result.Data.Data.length);
                    this.selectedElement = result.Data.Data[randomIndex];
                    this.videoInfo = {
                        img: this.selectedElement.img_url,
                        video: this.selectedElement.video_url,
                        videType: '',
                    };
                    result.Data.Data.splice(randomIndex, 1);
                }
                this.cardList.push(...result.Data.Data);
            }
        },
        goDetail(item) {
            this.$router.push({
                name: 'videoDetails',
                params: { id: item.id }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.video-page {
    min-height: 100vh;
    color: #fff;
}

.nav-header {
    position: sticky;
    top: 70px;
    z-index: 100;
    background: #030303;
}

.menu-box {
    padding: 15px 30px;
}

.menu-scroll {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;

    /* IE and Edge */
    &::-webkit-scrollbar {
        display: none;
        /* Chrome, Safari, Opera */
    }
}

.menu-item {
    display: inline-block;
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
    margin-right: 20px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
    border-bottom: 2px solid #030303;

    &.active {
        font-size: 20px;
        color: #e6c350;
        font-weight: bold;
        border-bottom: 2px solid #e6c350;
    }
}

.main-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 15px;
}

.video-player {
    width: 100%;
    background: #202124;
    position: relative;
    margin-bottom: 20px;
    border-radius: 8px;
    // overflow: hidden;

    .player-box {
        height: 100%;
        width: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }
}
</style>