<template>
  <div ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ringChart',
  props: {
    // 图表配置项
    options: {
      type: Object,
      required: true
    },
    chartdata: {
      type: Object,
      default: () => ({}),
      required: true
    },
    // 图表宽度
    width: {
      type: String,
      default: '100%'
    },
    // 图表高度
    height: {
      type: String,
      default: '400px'
    }
  },
  watch: {

    chartdata: {
      handler() {
        console.log('this.chartdata', this.chartdata)
        if (this.chartdata && typeof this.chartdata === 'object') {
          this.updateChart();
        }
      },
      deep: true
    }
  },
  mounted() {

    this.chart = echarts.init(this.$refs.chart);
  },
  methods: {
    updateChart() {
      if (this.chart && this.chartdata && this.chartdata.data) {
        this.chart.setOption({
          series: [
            {
              // name: 'Access From',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              itemStyle: {
                normal: {
                  color: function (colors) {
                    var colorList = [
                      '#e35d68',
                      '#2e72ef',
                    ];
                    return colorList[colors.dataIndex];
                  }
                },
              },
              labelLine: {
                show: false
              },
              data: this.chartdata.data
            }

          ]
        });
      }
    }
  },
  destroyed() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style scoped>
/* 让图表的容器填满可用空间 */
div {
  width: 100%;
  height: 100%;
}
</style>