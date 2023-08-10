<template>
    <line-chart class="b" :chartData="lineData"
                   :options="options"
                   style="height: 400px;">
                </line-chart>  
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { defineAsyncComponent } from 'vue';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { LineChart, useLineChart } from 'vue-chart-3';

Chart.register(...registerables);

@Options({
    props: {
       item: Object,
    },  components: {
        LineChart
    }, data: function() {
        return {
            lineData :  {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Noverber', 'December'],
                datasets: [
                    {
                        label: 'Data One',
                        backgroundColor: '#07569B',
                        color: '#000',
                        data: [40, 39, 10, 40, 39, 95, 40, 40, 39, 10, 40, 39]
                    }
                ]
            },options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
        }
    }
})
export default class NLine extends Vue {

}
</script>
<style scoped lang="scss">
</style>