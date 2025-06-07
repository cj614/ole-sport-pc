<template>
    <div class="">
        <div class="_logo" :class="{ 'even-style': (index + 1) % 2 === 0 }">
            <v-img contain :src="Img[`Active${(index % 4) + 1}`]" height="119" width="119"></v-img>
            <div>
                <div class="activity">{{ item.title }}</div>
                <v-btn class="_btn">{{ $t(`Module['领取']`) }}</v-btn>
            </div>
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
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
        },
        index: {
            type: Number,
        },
    },
    data() {
        return {

            Img: {

                Active1: require(`@/${this.$img.Page.Active.Active1}`),
                Active2: require(`@/${this.$img.Page.Active.Active2}`),
                Active3: require(`@/${this.$img.Page.Active.Active3}`),
                Active4: require(`@/${this.$img.Page.Active.Active4}`),
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
._logo {
    @apply relative w-350px h-142px rounded-10px;
    background: linear-gradient(135deg, #5E62F2 0%, #2D40F4 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 40px;

    ._btn {
        border-radius: 74.75px;
        background: #FF8D1A;
        color: #fff;
        width: 112px;
        text-align: center;
    }
}

.even-style {
    background: linear-gradient(135deg, #F9D37B 0%, #FF9322 100%);

    ._btn {
        background: #2D40F4;
    }
}


.activity {
    font-size: 24px;
    font-weight: 500;
    color: #fff;
    margin-bottom: 10px;
}

.activity_box {
    @apply w-350px h-75px flex items-center justify-between rounded-b-10px;
    border-radius: 0px 0px 10px 10px;
    color: var(--app-text);

    .activity_info {
        @apply w-full;

        .activity_title {
            @apply font-bold text-16px;
        }

        .activity_time {
            @apply mt-10px;
            color: #808080;
        }
    }
}
</style>