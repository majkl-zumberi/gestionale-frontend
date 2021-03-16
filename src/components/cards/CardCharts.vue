<template>
  <div class="row q-col-gutter-sm  q-py-sm">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs" style="background-color: #1e88e5">
        <q-card-section class="text-h6 text-white">
          Fatture Emesse
        </q-card-section>
        <q-card-section class="q-pa-none">
          <IEcharts style="height: 250px" :option="formatDS" :resizable="true"/>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/full.js'
import { date } from 'quasar'
export default {
  name: 'CardCharts',
  components: {
    IEcharts
  },
  props:['dataset'],
  data () {
    return {}
  },
  computed:{
    formatDS(){
       const formattedDS=this.dataset.map(ds=>{
        return {
          month:date.formatDate(new Date(ds.year_val,ds.month_val+1), 'MMM YYYY'),
          "fattura emessa":ds.total,
        }
      });
      return {
          "tooltip": {"show": true},
          "title": {"show": true, "textStyle": {"color": "rgba(0, 0, 0 , .87)", "fontFamily": "sans-serif"}},
          "grid": {"containLabel": true, "left": "0", "bottom": "0", "right": "0"},
          "xAxis": {
              "show": false,
              "type": "category",
              "axisLine": {"lineStyle": {"color": "rgba(0, 0, 0 , .54)", "type": "dashed"}},
              "axisTick": {
                  "show": true,
                  "alignWithLabel": true,
                  "lineStyle": {"show": true, "color": "rgba(0, 0, 0 , .54)", "type": "dashed"}
              },
              "axisLabel": {"show": false},
              "boundaryGap": false
          },
          "yAxis": {
              "show": false,
              "type": "value",
              "axisLine": {"lineStyle": {"color": "rgba(0, 0, 0 , .54)", "type": "dashed"}},
              "axisLabel": {"show": false},
              "splitLine": {"lineStyle": {"type": "dashed"}},
              "axisTick": {
                  "show": true,
                  "lineStyle": {"show": true, "color": "rgba(0, 0, 0 , .54)", "type": "dashed"}
              }
          },
          "series": [{"type": "line", "areaStyle": {}, "smooth": true}],
          "dataset": {
              "source": [...formattedDS]
          },
          "color": ["#2196f3"]
      }
    }
  }
}
</script>
