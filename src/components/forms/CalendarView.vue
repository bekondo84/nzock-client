<template>
 <div class="calendar-view">
   <FullCalendar :options='calendarOptions' />
 </div>
</template>
<script lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {
      FullCalendar
    },
    data: function() {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin],
                initialView: 'dayGridMonth',
                weekends: false,
                events: [
                { title: 'Meeting', start: new Date() }
                ]
            }
        }
    }
})
export default class CalendarView extends Vue {

}
</script>
<style scoped lang="scss">
  .calendar-view {
    height: 453px;
    overflow-y: auto;
  }
</style>