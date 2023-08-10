<template>
  <div class="list-view">
    <n-table  :items="item[field.fieldName]"
              :removable="removable"
              :dialog="dialog"
              viewMode="list"
              :creatable="editable"
              :updatable="updatable"
              :meta="meta"
              widget="manytomany"
              @deleteitem-action="deleteItemAction"
              @dblclick-action="dblClickAction">
    </n-table>  
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
      typeOp: String,
      item: Object,
    }, components: {
        NTable: defineAsyncComponent(() => import('@/components/forms/widgets/NTable.vue')),
       
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
        },async getMeta() {
            let plugin = store.getters.getPlugin;
            try {
              let data = await restService.get(plugin.name, ['actions', 'typeCode', 'meta', this.field.meta.typeCode], null, true)
               this.meta = Object.assign({}, data); 
            } catch (error) {
              this.emitter.emit("inner-error-event", error);
            }
        }, dblClickAction(item: any) { 
           let items = this.item[this.field.fieldName] ;
             if (items != null) {
             let exist = items.map(function(it){
               return it.pk == item.pk; 
             }).includes(item.pk);
             if (exist == false) {
              items.push(item);
             }           
          } 
        }
    }, computed: {
       metadata() { return this.field != null && this.field.meta != null ? this.field.meta: {}},
       typecode() { return this.meta != null ? this.meta.typeCode : null;},
       editable() {
          if (this.typeOp == 'view') {
              return false;
          }       
          if (this.field != null && this.field.editable == true ) {
              return true ;
          }
          if (this.field != null && this.field.meta != null && this.field.meta.canCreate) {
              return true ;
          }
          return false;
        }, removable() {
          if (this.typeOp == 'view') {
              return false;
          }       
          if (this.field != null && this.field.meta != null && this.field.meta.canDelete) {
              return true ;
          }
          return false;
      }, updatable() {
          return false ;
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