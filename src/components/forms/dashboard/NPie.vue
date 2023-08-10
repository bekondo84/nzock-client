<template>
    <pie-chart :chartData="pieData"
                   :options="options"></pie-chart>  
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { defineAsyncComponent } from 'vue';
import { Chart, ChartData, ArcElement, Tooltip, ChartOptions, registerables } from 'chart.js';
import { PieChart, usePieChart } from 'vue-chart-3';

Chart.register(ArcElement, Tooltip);

@Options({
    props: {
       item: Object ,
    },  components: {
       PieChart
    }, data: function() {
        return {
            pieData :  {
                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                datasets: [
                    {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                    data: [40, 20, 80, 10]
                    }
                ]
            },options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
        }
    }
})
export default class NPie extends Vue {

}
</script>
<style scoped lang="scss">
</style>