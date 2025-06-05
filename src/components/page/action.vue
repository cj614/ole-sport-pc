<template>
    <div class="iconBox">
        <div @click="doNiceVideo" style="cursor: pointer;">
            <v-img key="localVideo.is_nice" :src="localVideo.is_nice ? Img.ThumbUped : Img.ThumbUp" width="20"
                height="20"></v-img>
        </div>
        <div @click="store" style="cursor: pointer;">
            <v-img :src="localVideo.is_store ? Img.Started : Img.Start" width="20" height="20"></v-img>
        </div>
        <div>
            <page-share type="video" :shareInfo="shareInfo"></page-share>
        </div>
    </div>
</template>
<script>
import {
    storeVideo,
    niceVideo
} from '@/api/sportVideo'

export default {
    props: {
        video: {
            type: Object,

        },
        shareInfo: {
            type: Object,

        },
    },

    data() {
        return {
            localVideo: {},  // 创建副本用于修改
            Img: {
                ThumbUp: require(`@/${this.$img.Page.Live.ThumbUp}`),
                ThumbUped: require(`@/${this.$img.Page.Live.ThumbUped}`),
                Start: require(`@/${this.$img.Page.Live.Start}`),
                Started: require(`@/${this.$img.Page.Live.Started}`),
                Share: require(`@/${this.$img.Page.Live.Share}`),
            },
            // shareInfo: {
            //     url: '',
            //     title: '',
            //     description: '',
            //     quote: '',
            //     hashtags: '',
            //     twitterUser: ''
            // },

        }
    },

    computed: {


    },



    mounted() {
        this.set()
    },

    methods: {
        // 响应式赋值
        set() {
            console.log('video', this.video.is_store)
            // Object.keys(this.video).forEach(key => {
            //     this.$set(this.localVideo, key, this.video[key])
            // })
            // // this.$set(this.localVideo, this.video)
            // console.log('localVideo', this.localVideo)

            // localVideo
        },
        // 收藏
        async store() {
            console.log(this.localVideo)
            let status = 1
            if (this.localVideo.is_store) {
                status = 0
            }
            let result = await storeVideo({
                video_id: this.localVideo.id * 1,
                status: status
            })
            if (result.Code === 200) {
                this.$set(this.localVideo, 'is_store', !this.localVideo.is_store)
                // this.localVideo.is_store = !this.localVideo.is_store
                console.log(this.localVideo.is_store)

            }
        },
        // 点赞
        async doNiceVideo() {
            let status = 1
            if (this.localVideo.is_nice) {
                status = 0
            }
            let result = await niceVideo({
                video_id: this.localVideo.id,
                status: status
            })
            if (result.Code === 200) {
                this.$set(this.localVideo, 'is_nice', !this.localVideo.is_nice)

                // this.localVideo.is_nice = !this.localVideo.is_nice
                console.log(this.localVideo.is_nice)

            }
        },
    }
}
</script>
<style scoped>
.iconBox {
    display: flex;
    gap: 40px;
    /* padding: 18px 30px; */
}
</style>