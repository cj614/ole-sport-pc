<template>
	<div class="zero-timeline">
		<div v-for="(item, index) in incident" :key="index" class="item"
			:style="{ '--bgcolor': item.color ? item.color + '1a' : '#F5F9FF', '--gap': gap, '--left': leftWidth }">

			<div class="left" v-if="showLeft">
				<div v-if="item.position === 1" class="incident_desc">
					<div v-if="item.type == 1" style="margin-right: 36px;">
						{{ item.home_score + '-' + item.away_score }}
					</div>
					<div v-for="(v, i) in item.incidentList" :key="i">
						<div class="time">
							<div v-if="players[v.player_id] && players[v.player_id].name"
								style="width: 280px;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;margin-right: 10px;">
								{{ players[v.player_id].name }}
							</div>
							<el-image class="icon" :src="getIncidentLogo(v.type)"></el-image>
						</div>
					</div>
				</div>
			</div>

			<div class="center">
				<div class="line"></div>
				<div class="dot">
					<span class="content" v-if="centerText(item)"
						:style="item.position == 0 ? 'font-size: 12px;' : 'font-size: 12px;'">{{ centerText(item)
						}}</span>
				</div>
			</div>

			<div class="right">
				<div v-if="item.position === 2" class="incident_desc">
					<div v-if="item.type == 1" style="margin-left: 36px;">
						{{ item.home_score + '-' + item.away_score }}
					</div>
					<div v-for="(v, i) in item.incidentList" :key="i">
						<div class="time">
							<el-image class="icon" :src="getIncidentLogo(v.type)" ></el-image>
							<span v-if="players[v.player_id] && players[v.player_id].name"
								style="width:280px;white-space:nowrap;overflow: hidden; text-overflow: ellipsis;">
								{{ players[v.player_id].name }}
							</span>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { getIncidentLogo } from "@/libs/util";

export default {
	name: "zero-timeline",
	props: {
		incidentData: {
			type: Object,
			default: () => {
			}
		},
		showLeft: {
			type: Boolean,
			default: true
		},
		leftWidth: {
			type: String,
			default: '150px'
		},
		gap: {
			type: String,
			default: '10px'
		}
	},
	data() {
		return {
			// Img: require(`@/${this.$img.Page.Hincidents["Goal"].src}`),
			incident: [],
			players: {},

		}
	},
	mounted() {
		this.incident = this.incidentData.incidents
		this.players = this.incidentData.players
		this.formatIncident()
	},
	methods: {

		formatIncident() {
			let incident = Array.from(this.incident).sort((a, b) => b.second - a.second);
			incident.map((item) => {
				switch (item.type) {
					case 1:
						item.incidentList = [
							{ player_id: item.player_id, type: item.type },
						];
						if ("assist1_id" in item) {
							item.incidentList.push({ player_id: item.assist1_id, type: 18 });
						}
						if ("assist2_id" in item) {
							item.incidentList.push({ player_id: item.assist2_id, type: 18 });
						}

						break;
					case 9:
						item.incidentList = [
							{ player_id: item.in_player_id, type: 'in' },
							{ player_id: item.out_player_id, type: 'out' }
						];
						break;
					default:
						item.incidentList = [
							{ player_id: item.player_id, type: item.type },
						];
				}
			})
			this.incident = incident.filter(item => item.type !== 19 && item.type !== 26 && item.type !== 27);
		},
		getIncidentLogo,
		centerText(item) {
			if (item.position === 0) {
				// FIFA 术语
				switch (item.type) {
					case 10:
						return "KO"; // Kick-off (比赛开始)
					case 11:
					case 13:
						return `HT ${this.incidentData.ht_score}`; // Half-time (中场)
					case 12:
						return `FT ${this.incidentData.ft_score}`; // Full-time (结束)
					case 19:
						return "ST"; // Stoppage Time (伤停补时)
					case 26:
						return `ET ${this.incidentData.et_score}`; // Extra Time Full-time (加时赛结束)
					default:
						return ""; // 未知事件
				}
			}
			return `${item.time}'`
		},
	}
};
</script>

<style lang="scss" scoped>
.zero-timeline {
	position: relative;
	padding: 30px;
	display: flex;
	flex-direction: column;
	background-color: #fff;

	.icon {
		width: 12px;
		height: 12px;
	}

	.incident_desc {
		background-color: #F5F9FF;
		padding: 10px;
		border-radius: 10px;
	}

	.item {
		display: flex;
	}

	.left {
		flex: 4;
		margin: 24px 0;
		overflow: hidden;
		text-align: right;
		white-space: pre-wrap;
		word-wrap: break-word;
		word-break: break-all;

		.time {
			font-size: 12px;
			color: #333333;
			display: flex;
			align-items: center;
			justify-content: end;
			gap: 10px;
		}

		.content {
			.title {
				color: var(--color);
				font-size: 16px;
				font-weight: 500;
			}

			.sub {
				color: #999999;
				font-size: 12px;
			}
		}
	}

	.center {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
		align-items: center;

		.line {
			flex: 1;
			margin: 0 10px;
			width: 2px;
			background: #eeeeee;
			min-height: 24px;
		}

		.dot {
			width: 200px;
			height: 100%;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			justify-content: center;
			align-items: center;
			background: var(--color);
			box-shadow: 0 0 3px 1px var(--color);

			.content {
				display: flex;
				align-items: center;
				background-color: white;
				padding: 6px 0;
			}
		}
	}

	.right {
		flex: 4;
		margin: 24px 0;
		overflow: hidden;
		text-align: left;
		white-space: pre-wrap;
		word-wrap: break-word;
		word-break: break-all;

		.time {
			font-size: 12px;
			color: #333333;
			display: flex;
			align-items: center;
			justify-content: left;
			gap: 10px;
		}

		.content {
			min-height: 50px;
			background: var(--bgcolor);
			border-radius: 10px;
			white-space: pre-wrap;
			word-wrap: break-word;
			word-break: break-all;

			.title {
				font-weight: 600;
				color: var(--color);
				font-size: 16px;
			}

			.sub {
				color: #666666;
				font-size: 14px;
				padding: 5px 0;
			}

			.tips {
				color: #999999;
				font-size: 12px;
			}
		}

	}

}
</style>