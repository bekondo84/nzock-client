<template>
   <div class="manytoone">
       <n-loader :overlay="overlay"></n-loader>       
        <v-autocomplete
            variant="underlined"            
            v-model="value"
            :items="items"
            :label="field.label"
            :item-title="searchKey"
            :item-value="searchKey"
            :readonly="!selectable"
            @input="updateValue($event)"
        >       
      </v-autocomplete>
        <n-dialog-btn
             icon="fa-solid fa-plus"
             classe="btn btn-sm link-success"
             viewMode="view"
             opType="create"
             :meta="metadata"
             :item="item"
             :readOnly="!creatable"
             @save-event="saveAction">
        </n-dialog-btn>
        <n-dialog-btn
             icon="fa-solid fa-magnifying-glass"
             classe="btn btn-sm link-secondary"
             viewMode="list"
             :readOnly="!selectable"
             :meta="metadata"
             @dblclick-action="dblClickAction">
        </n-dialog-btn>
   </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import  store  from '@/store';
import RestService from '@/services/restService';
import { validate } from '@/services/validator';
import { getPublisher } from '@/services/Publisher';

const apiUrl = '/api/v1/'
const restService = new RestService();

   @Options({
      components: {
         NDialogBtn: defineAsyncComponent(() => import('@/components/forms/widgets/NDialogBtn.vue')),
         NLoader: defineAsyncComponent(() => import('@/components/forms/widgets/NLoader.vue')),
      },props: {
          field: Object,
          item : Object,
          meta: Object,
          publishers: Array,
          typeOp: String,
       }, data: function() {
          return {
            items: [],
            value: null,
            data: null,
            metadata: Object.assign({}, this.meta),
            overlay: false,
            publisher: null,
          }
       }, methods: {
         updateValue(event: any) {
            console.log('Input event detected for ManyToOne '+event.target.value)
         }, async loadMeta() {
            try {
               let plugin = store.getters.getPlugin;
               let response = await restService.get(plugin.name, ['actions', 'typeCode', 'meta', this.meta.typeCode], null, true)
               this.metadata = Object.assign({}, response);
            } catch(err) {
               console.log(err);
            }
         }, async loadData() {
              let plugin = store.getters.getPlugin;
              let config = { 
                   params: { context: JSON.stringify(this.context) }
              };
               let result = await restService.get(plugin.name, ['actions', this.action, 'fetch'], config, true);
               this.items.splice(0, this.items.length);
               this.items.push(...result.data);
               if (this.item != null) {
                     let obj = this.item[this.fieldName] ;
                     if (obj != null) {
                           this.value = obj[this.searchKey];
                     }
               }
            
         },async dblClickAction(item: any) {
            this.item[this.fieldName] = item;
            if (this.item != null) {
                  let obj = this.item[this.fieldName] ;
                  if (obj != null) {
                        this.value = obj[this.searchKey];
                  }
                  if (this.selectable == true) {  
                    await this.notifyAll(item);
                  }  
            }
         },async saveAction(item: any) {
            this.showLoader();
            try {
               this.errors = await validate(this.meta, item);
               if (this.errors.length <= 0) {
                     let data = {data: JSON.stringify(item), typeCode:this.meta.typeCode};
                     let response =  await restService.post(this.plugin, ['actions', this.action, 'save'], data, true);
                     await this.loadData();
               } else {
                  this.emitter.emit("show-error-toast", this.errors);
               }
           } catch(error) {
              this.emitter.emit("inner-error-event", error);
           }
           this.hideLoader();
         }, showLoader() {
            this.overlay = true;
          }, hideLoader() {
            this.overlay = false;
          },async notifyAll(item: any) {
             this.publisher = getPublisher(this.field, this.publishers);
             if (this.publisher != null) {
                this.emitter.emit("publish-event", {pk: item.pk, publisher: this.publisher});
             }            
          }
       }, computed: {
            context() {
               let ctx = this.meta != null ? {offset: 0, max: 10, type: this.meta.type} : null;
               return ctx ;
            }, searchKey() { return this.meta != null ? this.meta.searchKey : "";},
            fieldName() { return this.field.fieldName ;},
            action() { return this.meta.action; },
            plugin() { return store.getters.getPlugin.name},
            creatable() {
               if (this.typeOp == 'view') {
                  return false ;
               }
            
               if (this.field != null && this.field.meta != null && this.field.meta.canCreate) {
                  if (this.field.editable == true && this.typeOp == 'create'
                      || this.field.updatable == true && this.typeOp == 'edit') {
                     return true ;
                  }
               }
              
               return false;
            }, selectable() {
               if (this.typeOp == 'view') {
                  return false ;
               }
               if ((this.typeOp == 'create'&& this.field.editable)
                 || (this.typeOp=='edit' && this.field.updatable)){
                   return true;
               }
               return false;
            }
       }, watch: {
         item(newVal, oldVal) {
            if (this.item != null) {
                  let obj = this.item[this.fieldName] ;
                  if (obj != null) {
                        this.value = obj[this.searchKey];
                  }
            }
         },async value(newVal, oldVal) {
            let val = this.items.filter(f => f[this.searchKey]==newVal);
            if (val.length > 0) {
               this.item[this.fieldName] = val[0] ; 
               if (this.selectable == true) {  
                 await this.notifyAll(val[0]);
               }          
            }    
         },async meta(newMeta) {
            try {
               await this.loadMeta();
               await this.loadData();
            } catch(error) {
               this.emitter.emit("inner-error-event", error);
            }
         }
       },async mounted() {         
          this.publisher = getPublisher(this.field, this.publishers);
          if (this.context != null) {
            try {
               await this.loadMeta();
               await this.loadData();
            } catch(error) {
               console.error(error);
               //this.emitter.emit("inner-error-event", error);
            }
          }
       }, created() {
        this.emitter.on('dgl-dblclick-action', this.dbClick);
    }
   })
   export default class NManyToOne extends Vue {

   }
</script>
<style scoped lang="scss">
   .manytoone {
      display: flex;
      flex-flow: row nowrap;
   }
</style>