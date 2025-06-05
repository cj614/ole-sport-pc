<template>
  <div class="data_team_header" v-if="score === 1">
    <div class="item item_team item_team_end pl-20px">
      <span class="team team_one">{{ $t(`Module['主队']`) }}</span>
      <span class="name">{{ matchInfo.leftInfo.name }}</span>
      <span>
        <v-img width="60" height="60" :src="matchInfo.leftInfo.img" contain></v-img>
      </span>
    </div>

    <div class="item item_center">
      <span class="num">{{ matchInfo.playTime }}</span>
      <div class="score_content">
        <div class="score">{{ matchInfo.leftInfo.score }}</div>
        <span class="center">:</span>
        <div class="score">{{ matchInfo.rightInfo.score }}</div>
      </div>
    </div>

    <div class="item item_team pl-8px pr-20px">
      <span>
        <v-img width="60" height="60" :src="matchInfo.rightInfo.img" contain></v-img>
      </span>
      <span class="name">{{ matchInfo.rightInfo.name }}</span>
      <span class="team team_two">{{ $t(`Module['客队']`) }}</span>
    </div>
  </div>
  <div class="team_match_info_box" v-else-if="score === 2">
    <div class="team_item team_item_end">
      <span class="team_name">{{ matchInfo.leftInfo.name }}</span>

      <span class="team_logo">
        <!-- <v-img height="60" width="60" :src="matchInfo.leftInfo.img"></v-img> -->
        <page-pageLoad height="60" width="60" :src="matchInfo.leftInfo.img" :contain="true"></page-pageLoad>
      </span>
      <span class="team_score">{{ matchInfo.leftInfo.score }}</span>
    </div>

    <div class="team_match">
      <span>{{ matchInfo.playTime }}</span>
      <span v-show="showHtInfo.show">
        <span v-show="showHtInfo.show">{{ matchInfo.htText }}</span>
        <span v-show="showHtInfo.show" class="ml-10px">{{ matchInfo.ftText }}</span>
      </span>
    </div>

    <div class="team_item pl-8px">
      <span class="team_score">{{ matchInfo.rightInfo.score }}</span>

      <span class="team_logo_away">
        <page-pageLoad height="60" width="60" :src="matchInfo.rightInfo.img" :contain="true"></page-pageLoad>
        <!-- <v-img height="60" width="60" :src="matchInfo.rightInfo.img"></v-img> -->
      </span>
      <span class="team_name">{{ matchInfo.rightInfo.name }}</span>
    </div>
  </div>
</template>
<script>
import { getScore, getIncidents } from '@/api/live.js'
import { setScores, setStartM } from '@/libs/util.js'
export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    score: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: ''
    },
    incidentsSw: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      matchData: {},
      matchNami: {},
      incidentsData: {}
    }
  },
  computed: {
    showHtInfo() {
      let { type, matchNami } = this
      let { statusId } = matchNami

      return {
        show: type === 'FOOTBALL' ? true : false,
        htShow: statusId > 2 ? true : false,
        ftShow: statusId > 4 ? true : false
      }
    },

    matchInfo() {
      let { matchData, type, matchNami, item, incidentsData, incidentsSw } =
        this
      let { statusId, homeScores, awayScores } = matchNami
      let ftText = ''
      let htText = ''
      if (type === 'FOOTBALL') {
        if (incidentsSw) {
          if (Object.keys(incidentsData).length > 0) {
            if (statusId > 2) {
              htText = `HT ${incidentsData.ht_score}`
            }
            if (statusId > 4) {
              ftText = `FT ${incidentsData.ft_score}`
            }
          }
        } else {
          if (Object.keys(item).length > 0) {
            if (statusId > 2) {
              htText = `HT ${item.ht_score}`
            }
            if (statusId > 4) {
              ftText = `FT ${item.ft_score}`
            }
          }
        }
      }
      return {
        leftInfo: {
          img: matchData.homeLogo || '',
          name: matchData.homeName || '',
          score: homeScores
        },
        rightInfo: {
          img: matchData.awayLogo || '',
          name: matchData.awayName || '',
          score: awayScores
        },
        playTime: matchNami.playTime,
        ftText,
        htText
      }
    },
    Color() {
      return this.$store.state.app.appColor
    }
  },
  methods: {
    globalNoticeType() {
      this.$bus.$on(`liveScore`, data => {
        let { matchNami } = this
        this.matchNami = {
          ...this.matchNami,
          awayScores: setScores(data.away_scores, data.sport_type, data.status),
          homeScores: setScores(data.home_scores, data.sport_type, data.status),
          away_scores: data.away_scores,
          home_scores: data.home_scores,
          statusId: data.status_id,
          playTime: setStartM({
            id: data.Id,
            glive_match_id: data.glive_match_id,
            status_id: data.status_id,
            competition_id: matchNami.competitionId,
            bar_remain_time: data.bar_remain_time || 0,
            match_time: matchNami.matchTime,
            kick_off_time: data.kick_off_time || 0,
            sport_type: data.sport_type
          })
        }
        this.$emit('liveMatchScore', {
          matchData: this.matchData,
          matchNami: this.matchNami
        })
        if (this.type === 'FOOTBALL' && this.incidentsSw) {
          this.liveMatchIncidents()
        }
      })
    },
    liveMatchScore() {
      let { id } = this
      getScore({
        glive_match_id: id
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          let { match_data, nami_match } = Data
          this.matchData = {
            id: match_data.Id,
            sportType: match_data.Type,
            awayLogo: match_data.AwayLogo,
            awayName: match_data.Away,
            homeLogo: match_data.HomeLogo,
            homeName: match_data.Home
          }
          this.matchNami = {
            id: match_data.Id,
            nami_match,
            awayScores: setScores(
              nami_match.away_scores,
              nami_match.sport_type,
              2
            ),
            homeScores: setScores(
              nami_match.home_scores,
              nami_match.sport_type,
              2
            ),
            statusId: nami_match.status_id,
            competitionId: nami_match.competition_id,
            matchTime: nami_match.match_time,
            playTime: setStartM({
              id: match_data.Id,
              glive_match_id: nami_match.glive_match_id,
              status_id: nami_match.status_id,
              competition_id: nami_match.competition_id,
              bar_remain_time: nami_match.bar_remain_time || 0,
              match_time: nami_match.match_time,
              kick_off_time: nami_match.kick_off_time || 0,
              sport_type: nami_match.sport_type
            }),
            away_scores: nami_match.away_scores,
            home_scores: nami_match.home_scores
          }

          this.$emit('liveMatchScore', {
            matchData: this.matchData,
            matchNami: this.matchNami
          })
        }
      })
    },
    liveMatchIncidents() {
      let { id } = this
      getIncidents({
        glive_match_id: id
      }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          this.incidentsData = Data || {}
        }
      })
    }
  },
  mounted() {
    this.globalNoticeType()
    this.liveMatchScore()
    if (this.type === 'FOOTBALL' && this.incidentsSw) {
      this.liveMatchIncidents()
    }
  },
  destroyed() {
    let { nami_match, awayScores, homeScores, statusId, playTime } =
      this.matchNami
    if (nami_match && nami_match.id) {
      this.$bus.$emit('pageLiveScore', {
        liveId: nami_match.glive_match_id,
        id: nami_match.id,
        sportType: nami_match.sport_type,
        awayScores,
        homeScores,
        statusId,
        playTime
      })
    }
    this.$bus.$off(`liveScore`)
  }
}
</script>

<style lang="scss" scoped>
.data_team_header {
  @apply flex justify-center items-center pt-20px mb-20px;
  .item {
    @apply flex items-center;
    .team {
      @apply py-3px px-6px text-12px border-1px border-solid flex rounded-4px;
    }
    .team_one {
      @apply text-warning border-warning;
      white-space: nowrap;
    }
    .team_two {
      @apply text-primaryFirst border-primaryFirst;
      white-space: nowrap;
    }
    .name {
      @apply text-20px font-bold mx-10px;
      word-break: break-all;
    }
    .num {
      @apply text-16px text-darkFirst font-bold font-sans mb-10px;
    }
    @apply flex;
    .score_content {
      @apply flex;
      .center {
        @apply mx-10px;
      }
      .txt {
        @apply text-12px text-info;
      }
      .score {
        @apply rounded-4px py-3px px-8px text-lightFirst text-26px font-bold  min-w-32px min-h-32px;
        background: #2BA5FF;
      }
    }
  }
  .item_team {
    @apply w-2/5;
  }
  .item_team_end {
    @apply justify-end;
  }
  .item_center {
    @apply flex-col justify-center items-center w-1/5;
  }
}
.team_match_info_box {
  @apply flex items-center justify-evenly mb-20px;
  .team_item {
    @apply flex items-center flex-1;
    .team_name {
      @apply font-bold text-20px;
    }
    .team_logo {
      @apply ml-20px mr-35px;
    }
    .team_logo_away {
      @apply ml-35px mr-20px;
    }
    .team_score {
      @apply font-sans text-primaryFirst text-32px;
    }
  }
  .team_item_end {
    @apply justify-end;
  }
  .team_match {
    @apply flex flex-col justify-center items-center min-w-200px;
  }
}
</style>
