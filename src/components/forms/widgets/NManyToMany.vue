<template>
   <div class="manytoone">
        <v-autocomplete
            variant="underlined"            
            v-model="value"
            :items="items"
            :label="field.label"
            :item-title="searchKey"
            :item-value="searchKey"
            :readonly="!selectable"
            chips
            closable-chips
            multiple
            @input="updateValue($event)"
        >       
      </v-autocomplete>
        <n-dialog-btn
             icon="fa-solid fa-plus"
             classe="btn btn-sm link-success"
             viewMode="view"
             opType="create"
             :readOnly="creatable"
             :meta="metadata"
             :item="item"
             @save-event="saveAction">
        </n-dialog-btn>
        <n-dialog-btn
             icon="fa-solid fa-magnifying-glass"
             classe="btn btn-sm link-secondary"
             viewMode="list"
             :meta="metadata"
             :readOnly="selectable"
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
         NDialogBtn: defineAsyncComponent(() => import('@/components/forms/widgets/NDialogBtn.vue'))
      },props: {
          field: Object,
          item : Object,
          meta: Object,
          publishers: Array,
          typeOp: String,
       }, data: function() {
          return {
            items: [],
            value: [],
            data: null,
            metadata: null,
          }
       }, methods: {
         updateValue(event: any) {
            console.log('Input event detected for ManyToOne '+event.target.value)
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
         }, async loadMeta() {
               let plugin = store.getters.getPlugin;
               let response = await restService.get(plugin.name, ['actions', 'typeCode', 'meta', this.meta.typeCode], null, true);
               this.metadata = Object.assign({}, response);
            
         }, async loadData() {
               let plugin = store.getters.getPlugin;
               let config = {
                  params: {
                     context: JSON.stringify(this.context),
                  }
               }
               let params = { };
               let result = await restService.get(plugin.name, ['actions', this.action, 'fetch'], config, true);
               this.items.splice(0, this.items.length);
               this.items.push(...result.data);
         },async notifyAll(item: any) {
             this.publisher = getPublisher(this.field, this.publishers);
             if (this.publisher != null) {
                this.emitter.emit("publish-event", {pk: item.pk, publisher: this.publisher});
             }            
          }, dblClickAction(item: any) {
            this.item[this.fieldName] = item;
            if (this.item != null) {
                  let obj = this.item[this.fieldName] ;
                  if (obj != null) {
                        this.value = obj[this.searchKey];
                  }
            }
         }, initValue() {
            if (this.item != null && this.item[this.fieldName] != null) {
               this.value.splice(0, this.items.length);
               for (let i = 0 ; i < this.item[this.fieldName].length; i++) {
                  let item =  this.item[this.fieldName][i];   
                  this.value.push(item[this.searchKey]);
               }
           }

         }
       }, computed: {
            context() {
               let ctx = this.meta != null ? {offset: 0, max: 10, type: this.meta.type} : null;
               return ctx ;
            }, searchKey() { return this.meta != null ? this.meta.searchKey : "";},
            fieldName() { return this.field.fieldName ;},
            action() { return this.meta.action ;},
            creatable() {
               if (this.typeOp == 'view') {
                  return false ;
               }
               if (this.field != null && this.field.creatable == true) {
                   return true ;
               }
               if (this.field != null && this.field.meta != null && this.field.meta.canCreate == true) {
                  return  true ;
               }
               return false;
            }, selectable() {
               if (this.typeOp == 'view') {
                  return false ;
               }
               if ((this.typeOp == 'create' || this.typeOp=='edit') 
                    && (this.field.creatable || this.field.updatable)){
                   return true;
               }
               return false;
            }
       }, watch: {
         item(newVal) {
            if (this.item != null) {
                  let obj = this.item[this.fieldName] ;
                  if (obj != null) {
                        this.value = obj.map(e =>e[this.searchKey]);
                  }
            }
         },async value(newVal, oldVal) {
            let items = this.item[this.fieldName] ;
            items.splice(0, items.length)
            
            for (let i = 0; i < this.value.length; i++) {
               const val = this.value[i];
               const item = this.items.filter(elt => elt[this.searchKey]==val);
               if (item != null && item.length > 0) {
                  //console.log('---------------- : '+val+' ------- : '+JSON.stringify(item))
                  items.push(item[0]);
               } 
            } 
            if (this.selectable == true) {  
                 await this.notifyAll(items);
               }      
         }
       },async mounted() {
          if (this.context != null) {
            try {
               this.initValue();
               await this.loadMeta();
               await this.loadData();
            } catch(error) {
               console.error(error);
               this.emitter.emit("inner-error-event", error);
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