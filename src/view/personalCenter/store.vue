<template>
    <div class="attention_warp">
        <p class="item_h_title">{{ $t(`Module['我的收藏']`) }}</p>

        <template v-if="list.length">
            <page-videoCard :List="list" @handleClickItem="goDetail"></page-videoCard>
            <module-pagination :paddingTop="20" :page="page.page" :count="page.count" :limit="page.limit"
                @pageList="pageList"></module-pagination>
        </template>
        <template v-else>
            <div class="w-full h-100 flex items-center justify-center">
                <v-progress-circular v-if="loading" indeterminate color="primary" size="24"></v-progress-circular>
                <page-empty v-else type="user" :title="$t(`Module['暂无数据']`)"></page-empty>
            </div>
        </template>
    </div>
</template>

<script>
// import { liveFollowerList } from '@/api/follow'
import { myStoreVideo } from '@/api/sportVideo'
import { storageRead, storageSave } from "@/libs/util";
export default {
    data() {
        return {
            list: [],
            loading: false,
            page: {
                page: 1,
                limit: 12,
                count: 0
            }
        }
    },

    mounted() {
        this.myStoreVideoList()
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

    methods: {
        goDetail(item) {
            this.$router.push({
                name: 'videoDetails',
                params: { id: item.id }
            });
        },
        pageList(page) {
            this.page.page = page
            this.myStoreVideoList()
        },
        async myStoreVideoList() {
            const {
                page: { page, limit }
            } = this
            this.loading = true
            const { Data, Code } = await myStoreVideo({ page, limit })
            if (Code === 200) {
                this.list = Data.Data
                console.log('myStoreVideo', Data)
            }
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.attention_warp {
    @apply w-full;

    .attention_list {
        @apply flex pl-0px flex-wrap max-h-760px;

        .attention_item {
            @apply flex justify-between items-center h-100px p-20px w-[calc(50%-10px)] bg-accentSecond mb-20px rounded-10px;

            .item_Anchor {
                @apply flex items-center;

                .img_box {
                    @apply relative;

                    .live_color {
                        @apply h-10px w-10px rounded-1/2 bg-success absolute top-5px right-2px;
                    }

                    .live_color_2 {
                        @apply bg-hex-999999;
                    }
                }

                .anchor_name {
                    @apply text-16px font-bold text-dark ml-10px;
                }
            }

            .attention_btn {
                @apply flex items-center;

                .btn1 {
                    @apply text-lightFirst;
                    background: linear-gradient(180deg, #ffd557 0%, #fbab12 100%);
                }

                .btn2 {
                    @apply ml-10px;
                }

                .btn3 {
                    @apply text-primaryFirst;
                    border: 1px solid #1862c8;
                }

                .btn {
                    @apply rounded-22px font-normal text-12px;
                }
            }
        }

        .attention_item:nth-child(odd) {
            @apply mr-10px;
        }

        .attention_item:nth-child(even) {
            @apply ml-10px;
        }
    }
}
</style>