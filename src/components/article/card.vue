<template>
    <div class="hot-item">
        <div class="ellipsis">
            <div class="ellipsisitem">{{ item.title }}</div>
            <div class="ellipsisread">
                <span>{{ $t(`Module['阅读']`) }} {{ item.read_num }}</span>
                <div style="display: flex; align-items: center;">
                    <v-img class="img" :src="Img.ThumbUp"></v-img>
                    <span> {{ item.like_num }} </span>
                </div>
            </div>
            <div class="imgsbox" v-if="item.img_list.length > 1">
                <v-img class="img" v-for="(j, index) in item.img_list" :key="index" :src="j"></v-img>
            </div>
        </div>
        <div class="imgbox" v-if="item.img_list.length == 1">
            <v-img class="img" :src="item.img_list[0]"></v-img>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
        },
    },
    data() {
        return {

            Img: {
                ThumbUp: require(`@/${this.$img.Page.News.ThumbUp}`)
            }
        }
    },

    mounted() {
        // this.getSportNewList()
    },

    methods: {

    }
}
</script>

<style lang="scss" scoped>
.hot-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #1A1A1A;
    padding-bottom: 10px;

    .imgbox {
        width: 160px;
        height: 100%;
        // height: 120px;
        overflow: hidden;
        border-radius: 8px;

        .img {
            width: 160px;
            height: 100%;
            border-radius: 8px;
        }
    }

    .imgsbox {
        display: flex;
        align-items: center;
        margin-top: 10px;

        .img {
            width: 120px;
            height: 90px;
            margin-right: 13px;
            border-radius: 8px;
        }
    }

    .ellipsis {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-right: 12px;

        .ellipsisitem {
            font-size: 15px;
            color: #fff;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            /* 设置行数 */
            -webkit-box-orient: vertical;
            overflow: hidden;
            span-overflow: ellipsis;
        }

        .ellipsisread {
            display: flex;
            align-items: center;
            justify-content: baseline;
            color: var(--Color-, #A5A9B3);
            font-size: 12px;
            margin-top: 10px;

            .img {
                width: 13px;
                height: 13px;
                margin-left: 30px;
                margin-right: 3px;
            }
        }
    }
}
</style>