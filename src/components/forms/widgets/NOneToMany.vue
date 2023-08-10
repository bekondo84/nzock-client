<template>
  <div class="list-view">
    <n-dialog ></n-dialog>
    <n-table  :items="item[field.fieldName]"
              :actions="field.actions"
              :removable="removable"
              :dialog="dialog"
              viewMode="view"
              :typeOp="typeOp"
              :creatable="editable"
              :updatable="updatable"
              @newitem-action="createDialog"
              @deleteitem-action="deleteItemAction"
              @dblclick-action="dbClick"
              :meta="meta"></n-table>  
  </div>  
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import  store  from '@/store';
import RestService from '@/services/restService';

const apiUrl = '/api/v1/'
const restService = new RestService();

  @Options({
    props: {
      dialog: String,
      field: Object,
      readOnly: Boolean,
      item: Object,
      typeOp: String,
    }, components: {
        NTable: defineAsyncComponent(() => import('@/components/forms/widgets/NTable.vue')),
        NDialog: defineAsyncComponent(() => import('@/components/forms/widgets/NDialogBtn.vue')),
      }, data: function() {
        return {
          meta: Object.assign({}, this.metadata),
        }
    }, methods: {
        deleteItemAction(elt: any) {
          let index = elt.index;
          let item = elt.item ;
          
          if (this.field != null && this.item != null) {
              let items = this.item[this.field.fieldName];
              items.splice(index, 1);
          }
        }, async getMeta() {
            let plugin = store.getters.getPlugin;
            try {
              let data = await restService.get(plugin.name, ['actions', 'typeCode', 'meta', this.field.meta.typeCode], null, true)
              this.meta = Object.assign({}, data); 
            } catch (error) {
              this.emitter.emit("inner-error-event", error);
            }
        }, dbClick(item: any) {
          console.log('------- ........');
        }
    }, computed: {
       metadata() { return this.field != null && this.field.meta != null ? this.field.meta: {}},
       typecode() { return this.meta != null ? this.meta.typeCode : null;},
       updatable() {  
         if (this.typeOp == 'view') {
            return false;
         }       
         if (this.field != null && this.field.updatable == false ) {
             return false ;
         }
         if (this.field != null && this.field.meta != null && this.field.meta.canUpdate == false) {
             return false ;
         }
         return true;
        }, editable() {
          if (this.typeOp == 'view') {
              return false;
          }       
          if (this.field != null && this.field.editable == false ) {
              return false ;
          }
          if (this.field != null && this.field.meta != null && this.field.meta.canCreate == false) {
              return false ;
          }
          return true;
      }, removable() {
          if (this.typeOp == 'view') {
              return false;
          }       
          if (this.field != null && this.field.meta != null && this.field.meta.canDelete ==false) {
              return false ;
          }
          return true;
      }
    },async mounted() {
      if (this.field != null && this.field.meta != null) {
        await this.getMeta();        
      }
    }
  })
  export default class NOneToMany extends Vue {

  }
</script>
<style scoped lang="scss">
  .list-view {
      text-align-last:left;
      -ms-text-align-last: left;
      -moz-text-align-last:left;
      max-height: 329px;
      overflow-y: auto;
      .checkbox {
          width: 30px;
      }
  } 
</style>