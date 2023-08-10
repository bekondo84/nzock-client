<template>
  <div>
    <nav aria-label="breadcrumb" class="breadcrumb-padding">
        <ol class="breadcrumb">
            <li v-for="(item, index) in items" :key="index" 
                 class="breadcrumb-item" 
                 :class="{active:isActive(item, index)}" 
                 aria-current="step">
                 <a v-if="!isActive(item, index)" @click="goto(item, index)">{{getTitle(item)}}</a>
                 <span v-else>{{ getTitle(item) }}</span>
            </li>           
        </ol>
    </nav>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import  store  from '@/store';
  
  @Options({
      data: function() {
          return {
             
          }
      }, methods: {
          refreshBreadcrumb() {
           // this.items.splice(0, this.items.length);
            //this.items.push(...store.getters.getStack);
            //console.log('Inside Breadcrumb ---'+JSON.stringify(this.data))
            
          }, getTitle(item: any) {
            let meta = item.meta ;
            if (item.viewMode=='view') {
               if (item.item != null && item.item.pk == null) {
                return meta.formViewTitle ;
               } else {
                  let itemId = item!= null && item.item != null ? item.item.pk : '';
                  if (item != null && item.item != null && meta.searchKey != null) {
                    itemId = item.item[meta.searchKey];
                  }
                  return meta != null && meta.formViewTitle!=null ? " ".concat(itemId) : null;
               }
            } else if (item.viewMode == 'dashboard') {
               return meta.title;
            }
            return meta != null ? meta.listViewTitle : null;
          }, isActive(item: any, index:number) {
               let endIndex = store.getters.getStack.length-1;
               let lastItem = store.getters.getStack[endIndex];
               return lastItem.id == item.id ;
          }, goto(item: any, index: number) {
            let value = {item: item, index: index};
            this.emitter.on('breadcrumb-event', value);
          }
      }, computed: {
         items() { return store.getters.getStack; }
      }, created() { 
          this.emitter.on('breadcrumb-refresh-event', this.refreshBreadcrumb);
      }
  })
  
  export default class Breadcrumb extends Vue {

  }
</script>
<style scoped lang="scss">
   .breadcrumb-padding {
     padding: 0px !important;
     margin-left: 8px !important;
   }
   a:hover {
     cursor: pointer;
   }
   .breadcrumb-item{
    color: #8E949A;
    font-size: 15px;
   }
   span{
    color: #07569B;
    font-size: 17px;
    font-weight: bold;
   }
</style>