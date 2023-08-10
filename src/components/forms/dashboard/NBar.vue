<template>
    <bar-chart :chartData="barData" :options="options"></bar-chart>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { defineAsyncComponent } from 'vue';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { BarChart, useBarChart } from 'vue-chart-3';

Chart.register(...registerables);

@Options({
    props: {
        item: Object,
    }, components: {
        BarChart
    }, data: function () {
        return {
            barData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Noverber', 'December'],
                datasets: [
                    {
                        label: 'Data One',
                        backgroundColor: '#07569B',
                        data: [40, 39, 10, 40, 39, 95, 40, 40, 39, 10, 40, 39,]
                    }
                ]
            }, options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    }
})
export default class NLine extends Vue {

}
</script>
<style scoped lang="scss"></style>