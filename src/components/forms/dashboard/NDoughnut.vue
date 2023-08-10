<template>
    <doughnut-chart :chartData="pieData" :options="options" style=" max-height: 250px; height: 200px; min-height: 100px; "></doughnut-chart>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { defineAsyncComponent } from 'vue';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3';

Chart.register(...registerables);

@Options({
    props: {
        item: Object,
    }, components: {
        DoughnutChart
    }, data: function () {
        return {
            pieData: {
                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                        data: [40, 20, 80, 10]
                    }
                ]
            }, options: {
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
export default class NDoughnut extends Vue {

}
</script>
<style scoped lang="scss"></style>