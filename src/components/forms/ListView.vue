<template>
    <div class=" list-view">
      <n-table 
         :meta="meta"
         :items="items"
         :dbClick="true"
         :configurable="configurable"
         selectable="true"
         @dblclick-action="onDbClick"
         @table-checkboxcolumn-select="checkboxcolumn"
         @table-header-customize-event="openDialog"
         @sort-event="sortEvent"
         @delete-item-event="deleteAction"></n-table>
    </div>     
    <n-dialog-col-conf  
             :id="id"
             :meta="meta"></n-dialog-col-conf>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Modal } from "bootstrap";

  @Options({
   props: {
      items: Array,
      meta: Object,
      configurable: Object,
      removable: Boolean,
   },components: {
       NTable: defineAsyncComponent(() => import('@/components/forms/widgets/NTable.vue')),
       NDialogColConf: defineAsyncComponent(() => import('@/components/forms/widgets/NDialogColConf.vue')),
    }, methods: {
      onDbClick(item: any) {
        this.$emit('dblclick-action', item);
      }, checkboxcolumn(nbre: number) {
          this.emitter.emit("number-select-items", nbre);
      }, openDialog() {
          let dialog = new Modal(document.getElementById(this.id), {});
          dialog.show();
       }, sortEvent(sortdata: any) {
          this.$emit("sort-event", sortdata);
       }, deleteAction(item: any) {
         this.$emit('delete-item-event', item);
      }
    }, computed: {
       canDelete() {
          return this.meta != null ? this.meta.canDelete : false ;
       }, id() { return 'btn'+Math.floor(Math.random() * 10000); },
    }
  })
  export default class ListView extends Vue {

  }
</script>
<style scoped lang="scss">
  .list-view {
        text-align-last:left;
        -ms-text-align-last: left;
        -moz-text-align-last:left;
        height: auto;
        width: 100%;
        overflow-y: auto;
        .checkbox {
            width: 30px;
        }
    } 
</style>