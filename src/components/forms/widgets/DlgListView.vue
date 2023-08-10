<template>
    <div>
      <n-loader :overlay="overlay"></n-loader>
      <div class="search-bar">
          <n-search
             :meta="meta"
             @search-event="searchAction"></n-search>
          <pagination 
              :meta="meta"
              viewType="list"
              :itemsCount="itemsCount"
              @next-event="nextAction"
              @previous-event="previousAction"></pagination>  
      </div>      
      <n-table 
         :meta="meta"
         :items="items"
         :deletable="true"
         :dbClick="true"
         :selectable="selectable"
         @dblclick-action="onDbClick"
         @table-checkboxcolumn-select="checkboxcolumn"
         @sort-event="sortAction"
         @click-action="selectItem">
      </n-table>
    </div>
     
</template>
<script lang="ts">
import RestService from '@/services/restService';
import { defineAsyncComponent } from 'vue';
import  store  from '@/store';
import { Options, Vue } from 'vue-class-component';
import { getFieldName } from '@/utils/utils';

const  restService = new RestService();

  @Options({
   props: {
      meta: Object,
      widget: String,
      items: [],
   },components: {
       NTable: defineAsyncComponent(() => import('@/components/forms/widgets/NTable.vue')),
       Pagination: defineAsyncComponent(() => import('@/components/forms/Pagination.vue')),
       NSearch: defineAsyncComponent(() => import('@/components/forms/widgets/NSearch.vue')),
       NLoader: defineAsyncComponent(() => import('@/components/forms/widgets/NLoader.vue')),
    }, data: function() {
       return {
         //items: [],     
         overlay: false, 
         rules: [],
         itemsCount: 0,
         pagination: null ,
       }
    }, methods: {
      onDbClick(item: any) {        
        this.$emit('dblclick-action', item);
      },async fetchData() {
         if (this.context != null) {
            this.context.sort = this.sort;
            let config = {
               headers: {
                  predicats: JSON.stringify(this.rules),
               }, params: {
                  context: JSON.stringify(this.context),
               }
            } ;   
            try {
               let result = await restService.get(this.pluginname, ['actions', this.action, 'fetch'], config, true)
               this.items.splice(0, this.items.length);
               this.items.push(...result.data);
               this.itemsCount = result.count ;
            } catch(error) {
               this.emitter.emit("inner-error-event", error);
            }
         }  
      }/*, checkboxcolumn(nbre: number) {
         console.log('number of items selected : '+nbre);
      }*/, showLoader() {
         this.overlay = true ;
      }, hideLoader() {
         this.overlay = false ;
      },async searchAction(rules: []) {
            this.showLoader();
            this.rules = rules;
            await this.fetchData();
            this.hideLoader();
      }, async sortAction(sort: any) {
         this.showLoader();
         this.sort ={order: sort.order, name: getFieldName(sort.field)};
         await this.fetchData();
         this.hideLoader();
      }, async nextAction(pagination: any) {
            this.pagination = pagination ;
            this.showLoader();
            await this.fetchData();
            this.hideLoader();
      }, async previousAction(pagination: any) {
            this.pagination = pagination ;
            this.showLoader();
            await this.fetchData();
            this.hideLoader();
      }, selectItem(item: any) {
         this.$emit('click-action', item);
      }
    }, computed: {
      context() { return this.meta != null && this.meta.type != null ? {offset: this.offset, max: store.getters.getPageSize, type: this.meta.type} : null;}
      , pluginname() { return store.getters.getPlugin.name;   },
        offset() {
            return  (this.pagination != null) ? this.pagination.pageSize*this.pagination.page : 0;
        }, action() { return this.meta.action; },
        selectable() {
         return this.widget == 'manytomany';
        }
    }, watch: {         
         async meta(newMeta, oldMeta) {
              if (this.meta != null) {
                await this.fetchData();
              }              
          } 
      }, async mounted() {         
      if (this.context != null) {
         await this.fetchData();
      }
    }, async created() {         
      if (this.context != null) {
         await this.fetchData();
      }
    }
  })
  export default class ListView extends Vue {

  }
</script>
<style scoped lang="scss">
   .search-bar {
      display: flex;
      flex-flow: row nowrap;
     justify-content: space-between;
      .search {
            display: flex;
            flex-flow: row nowrap;   
            align-content:flex-end; 
            width: 60%;      
            margin-top: -20px;
            .input {
                border-top: 0;
                border-left: 0;
                border-right: 0;
                border-bottom: ridge;
                color: black;
            }
        }    
   }
   
 
</style>