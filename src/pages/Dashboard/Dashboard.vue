<template>
   <q-page class="q-pa-sm">

    <card-social icon_position="left" :statistics="statistics" />

    <card-charts :dataset="dataset" />

    <template v-if="pieDataset.length!==0">
      <pie-chart :dataset="pieDataset"></pie-chart>
    </template>

    <div class="row q-col-gutter-sm  q-py-sm">
      <!-- <tab-social />
      <card-with-image /> -->
    </div>

    <div class="row q-col-gutter-sm  q-py-sm">
      <!-- <todo-list /> -->

      <!-- <card-time-line /> -->
    </div>

    <!-- <table-visits /> -->
  </q-page>
</template>
<script>
import axios from 'axios'
export default {
  name:"dashboard",
   components: {
        CardSocial: () =>  import('components/cards/DashboardCard'),
        CardCharts: () =>  import('components/cards/CardCharts'),
        PieChart: () => import('components/charts/PieChart'),
    },
  data(){
    return {
      dataset:[],
      pieDataset:[],
      statistics:{}
    }
  },
  created(){
    axios.get("http://localhost:3000/invoice-master/statistics")
    .then(res=>{
      this.dataset=res.data;
    })

    axios.get("http://localhost:3000/detail-order/statistics").then(articlestats=>{
      const formatted=articlestats.data.map(articleStat=>{
                return {
                  value:parseInt(articleStat.total),
                  name:articleStat.name
                }
              });
      this.pieDataset=formatted;
    })

    axios.get("http://localhost:3000/").then(statistics=>{
      this.statistics=statistics.data;
    })
  }
}
</script>
