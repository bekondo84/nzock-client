<template>
   <n-loader :overlay="overlay"></n-loader>     
    <div class="data-form-container">
        <div class="data-form-header">
          <div class="search-bar">
            <breadcrumb></breadcrumb>     
            <n-search
                :meta="meta"
                @search-event="searchAction"></n-search>      
          </div>
          <tool-bar 
             :meta="meta"
             :menu="menu"
             :items="items"
             viewType="list"
             :itemsCount="itemsCount"
             @view-change-event="changeViewType"
             @next-event="nextAction"
             @previous-event="previousAction"
             @delete-items-event="deleteItemsAction"
             @export-data-event="exportAction"
             @action-event="actionEventHandler"
             @create-new-event="createEventHandler"
             @rollback-action="roolback"></tool-bar>
       </div>
       <div class="data-form-content">
          <calendar-view v-if="showCalendar"></calendar-view>
          <list-view  v-if="showList"
               :meta="meta"
               :items="items" 
               selectable="true" 
               removable="true"
               configurable="true"
               @number-select-items="checkboxcolumn"
               @sort-event="sortAction"
               @delete-item-event="deleteAction"
               @dblclick-action="dblClickEventHandler">
         </list-view>
          <kaban-view v-if="showKaban"
             :meta="meta"
             :items="items"
             @click-event="dblClickEventHandler"></kaban-view>
       </div>
   </div>
</template>
<script lang="ts">
  import { Options, Vue } from 'vue-class-component'; 
  import { defineAsyncComponent } from 'vue';
  import RestService from '@/services/restService';
  import { getFieldName } from '@/utils/utils';
import store from '@/store';

  const apiUrl = "api/v1/"
  const restService = new RestService();

  @Options({
     props: {
        meta: Object,
        menu: Object,
        plugin: Object,
        parent: Object,
     }, components : {
       NSearch: defineAsyncComponent(() => import('@/components/forms/widgets/NSearch.vue')),
       ToolBar: defineAsyncComponent(() => import('@/components/forms/ToolBar.vue')),
       ListView: defineAsyncComponent(() => import('@/components/forms/ListView.vue')),
       KabanView: defineAsyncComponent(() => import('@/components/forms/KabanView.vue')),
       CalendarView: defineAsyncComponent(() => import('@/components/forms/CalendarView.vue')),
       Breadcrumb: defineAsyncComponent(() => import('@/components/forms/Breadcrumb.vue')),
       NLoader: defineAsyncComponent(() => import('@/components/forms/widgets/NLoader.vue')),
      }, data: function() {
         return {
            viewType: 'list',
            items: [],
            searchKey: null,
            rules: [],
            sort: null,
            overlay: false,
            itemsCount: 0,
            pagination: null ,
         }
     }, methods: {
         roolback() {
            this.$emit('rollback-action')
         }, changeViewType(type:string) {
            this.viewType = type;
         },async fetchData() {
               let config = {
                  headers: {
                     predicats: JSON.stringify(this.rules),
                  }, params: {
                     context: JSON.stringify(this.context),
                  }
               } ;       
               
               let result = await restService.get(this.pluginName, ['actions', this.action, 'fetch'], config, true);
               this.items.splice(0, this.items.length);
               this.items.push(...result.data);    
               this.itemsCount = result.count ;    
               this.$emit('data-fetch-event', this.items);      
         }, checkboxcolumn(nbre: number) {
            console.log('number of items selected : '+nbre);
         }, async fetchDataWithLoader(){
             try {
               this.showLoader();
               await this.fetchData();
               this.hideLoader();
             } catch (error) {
               this.emitter.emit("inner-error-event", error);
             }
         },async searchAction(rules: []) {
            this.rules = rules;
            await this.fetchDataWithLoader();
         },async sortAction(sort: any) {
            this.sort ={order: sort.order, name: getFieldName(sort.field)};
            await this.fetchDataWithLoader();
         }, async nextAction(pagination: any) {
            this.pagination = pagination ;
            await this.fetchDataWithLoader();
         }, async previousAction(pagination: any) {
            this.pagination = pagination ;
            await this.fetchDataWithLoader();
         }, initContext() {
             this.rules.splice(0, this.rules.length);
             this.sort = null;
             if (this.viewModes.length > 0) {
               this.viewType = this.viewModes[0]
             }
         }, showLoader() {
            this.overlay = true ;
         }, hideLoader() {
            this.overlay = false ;
         },async deleteAction(item: any) {
               var answer = confirm('Are you sure you want to continue ?')
               if (answer) {
                  this.showLoader();
                  try {
                     let config = {
                        headers: {
                           allItems: JSON.stringify(this.exportAll()),
                           items: this.exportItems(),
                           predicats: JSON.stringify(this.rules),
                        }, params: {
                           context: JSON.stringify(this.context),
                        }
                     };
                     await restService.delete(this.pluginName, ['actions', this.action, 'delete'], config);
                     await this.fetchData();
                 } catch(error) {
                    this.emitter.emit("inner-error-event", error);
                 }
                  this.hideLoader();
               }
         }, async deleteItemsAction(items: []) {
            let selectedItems = this.items.filter(i => i.selected);
            if (selectedItems == null || selectedItems.length <=0) {
               alert('Veuillez selectionner au moins une ligne !');
               return ;
            }
            var answer = confirm('Are you sure you want to continue ?')
               if (answer) {
                  this.showLoader();
                  try {
                     let config = {
                        headers: {
                           allItems: JSON.stringify(this.exportAll()),
                           items: this.exportItems(),
                           predicats: JSON.stringify(this.rules),
                        }, params: {
                           context: JSON.stringify(this.context),
                        }
                     };
                     await restService.delete(this.pluginName, ['actions', this.action, 'delete'], config);
                     await this.fetchData();
                 } catch(error) {
                    this.emitter.emit("inner-error-event", error);
                 }
                  this.hideLoader();
               }
         },async exportAction() {
            let selectedItems = this.items.filter(i => i.selected);
            if (selectedItems == null || selectedItems.length <=0) {
               alert('Veuillez selectionner au moins une ligne !');
               return ;
            }
            this.showLoader();
            try {
               let config = {
                        responseType: 'blob',
                        headers: {                        
                           predicats: JSON.stringify(this.rules),
                           allItems: JSON.stringify(this.exportAll()),
                           items: this.exportItems(),
                           columns: JSON.stringify(this.columns.filter(i => i.search)),
                        }, params: {
                           context: JSON.stringify(this.context),
                        }
                     } ;     
               let result = await restService.get(this.pluginName, ['actions', 'exported', 'excel'], config, true);
               var FILE = window.URL.createObjectURL(new Blob([result]));
               var docUrl = document.createElement('a');
               docUrl.href = FILE;
               docUrl.setAttribute('download', "attachment.xlsx");
               document.body.appendChild(docUrl);
               docUrl.click();
               docUrl.remove();
            } catch(error) {
               this.emitter.emit("inner-error-event", error);
            }
            this.hideLoader();
         }, exportAll() { 
              return (this.items.filter(i => i.selected == false).length == 0);
         }, exportItems() {
            /**if (this.exportAll() == true) {
               return null
            }**/
            let selectedItems = this.items.filter(i => i.selected);
            return JSON.stringify(selectedItems.map(i => i.pk));
        }, actionEventHandler(action: any) {
            this.$emit("action-event", action);
        }, createEventHandler() {
           this.$emit('create-new-event');
        }, dblClickEventHandler(item: any) {
           this.$emit('dblclick-action', item);
        }
     }, computed: {
        parentId() {return this.parent != null ? this.parent.pk : '';},
        showList() {return this.viewType=='list';},
        showKaban() { return this.viewType == 'kaban'},
        showCalendar() { return this.viewType == 'calendar';},        
        viewModes() { return this.menu != null ? this.menu.viewMode.trim().split(',') : []; },
        pluginName() { return this.plugin != null ? this.plugin.name : null},
        action() { return this.meta.action ;},
        offset() {
            return  (this.pagination != null) ? this.pagination.pageSize*this.pagination.page : 0;
        }, context() {
             let ctx = {offset: this.offset, max: store.getters.getPageSize, type: this.meta.type
               , sort: this.sort, parent: this.parentId}
             return ctx ;
        }, columns() { return this.meta != null ? this.meta.listView.columns : []}
     }, watch : {
        async meta(newMeta, oldMeta) {
            if (newMeta != null) {
               this.fetchData();
               this.initContext();
            }
         }
     },async mounted() {
            store.commit("resetResource");
            if (this.meta != null) {
               this.fetchData();    
               this.initContext();
            }
     }
  })
  export default class ListForm extends Vue {

  }
 </script>
<style scoped lang="scss">
   .data-form-container {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;    
      color: black;  
      font-family: 'Trebuchet MS','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

   }
   .data-form-header {
    
      border-bottom: 5px solid white ;
      font-family: 'Trebuchet MS','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      color: black;  

      .search-bar {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin: 5px 5px 0px 0px;
        .title {
          margin-left: 10px;
          font-family: 'Trebuchet MS','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          font-size: 25px;
          color: black;
        }    
     }
     .actions-bar {
         display: flex;
         flex-flow: row nowrap;
         justify-content: space-between;
         color: black;
         
      }
   }
   .data-form-content {
       flex: 1;
   }

</style>