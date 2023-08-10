<template>
     <div class="actions-bar">
        <div class="create-block">
            <button type="button" v-if="hasPrevious"
                    class="link btn-sm link-secondary margin-left"
                    @click="leave()"><i class="fa-solid fa-reply-all"></i></button>
            <button v-if="meta.canCreate" type="button" class="btn btn-sm btn-outline-success margin-left" @click="createBtn">{{ t('create.btn.name') }}</button>
            <actions 
               :meta="meta"
               :translate="translate"
               @action-event="onAction"
               @export-event="exportAction"
               @delete-event="deleteAction"
             ></actions>
        </div>
        <preference v-if="false"></preference>
        <Pagination 
           :meta="meta"
           :viewType="viewType"
           :itemsCount="itemsCount"
           @next-event="nextAction"
           @previous-event="previousAction"></Pagination>
        <div v-if="viewModes.length>1">
            <button v-for="v in viewModes" :key="v" type="button" class="btn btn-sm btn-padding" @click="changeView(v)"><i :class="getFaForViewMode(v)"></i></button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import Pagination from './Pagination.vue';
import { i18n } from '@/services/i18nService';
import  RestService  from '@/services/restService';
import store from '@/store';

const restService = new RestService();

   @Options({
       props: {
          meta: Object,
          menu: Object,
          items: Array,
          viewType: String,
          itemsCount: Number,
       }, components: {
          Pagination: defineAsyncComponent(() => import('./Pagination.vue')),
          Preference: defineAsyncComponent(() => import('./Preference.vue')),
          Actions: defineAsyncComponent(() => import('@/components/forms/widgets/Actions.vue')),
       },data: function() {
          return {
             translate: null,
             canCreate: false,
             enableActions: false,
             actionLink: null,
          }
       },methods: {
        leave() {
           this.$emit('rollback-action')
        }, changeView(type: string) {
            this.$emit('view-change-event', type);
        }, createBtn() {
            this.$emit('create-new-event');
        }, getFaForViewMode(viewMode: string) {
            if (viewMode=='kaban') {
                return 'fa-brands fa-microsoft';
            } else if (viewMode=='calendar') {
                return 'fa-regular fa-calendar';
            }
            return 'fa-solid fa-bars';
        }, enableActions(selected: boolean) {
            this.enableActions = selected;
        }, t(key: string) {
            if (this.translate != null) {
                return this.translate[key];
            }
            return null;
        }, setNbreOfselecteditems(nbre: number) {
            this.enableActions = nbre >0 ;
        }, nextAction(pagination: any) {
            this.$emit("next-event", pagination);
        }, previousAction(pagination: any) {
            this.$emit("previous-event", pagination);
        }, deleteAction() {
            this.$emit('delete-items-event', this.items.filter(t =>t.selected));
        }, exportAction() {
            this.$emit('export-data-event');
        }, onAction(action: any) {
            if (this.showConfirmModal(action)) {
               let answer = confirm("Voulez vous continuer ?");
               if (answer) {
                  this.$emit("action-event", action);
               }
            } else {
              this.$emit("action-event", action);
            }  
        }, showConfirmModal(action: any) {
            return action.redirect ==false && action.modal == false && action.typeOp != 'import';
        }
       }, computed: {
          viewModes() { return this.menu != null ? this.menu.viewMode.trim().split(',').filter(t => t!='view') : [];},
           enableActions() { 
             return this.items!=null ? this.items.filter(t =>t.selected).length>0:false;
           }, actions() {
             return this.meta != null && this.meta.listView != null ? this.meta.listView.actions : [];
           }, plugin() {
              return store.getters.plugin.name;
           }, hasPrevious() {
              return store.getters.getStackSize > 1;
           }
        }, async created() {
            this.emitter.on("number-select-items", this.setNbreOfselecteditems);
            this.translate =  await i18n(['create.btn.name', 'actions.btn.name', 'export.btn.name', 'delete.btn.name', 'filters.btn.name', 'groupby.btn.name', 'favorite.btn.name', 'favorite.current.session', 'favorite.all.session']);
        }


   })
   
   export default class ToolBar  extends Vue{

   } 
</script>
<style scoped lang="scss">
.create-block {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    width: 220px;
    padding: 0px 10px;
    margin-bottom: 5px;
    color: black;
    
}
.btn-padding {
    padding: 4px 3px 4px 0px;
    color: black;
}
 .actions-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-top: -20px;
 }
 .nav-link-padding {
    padding: 2px 16px 2px 16px!important;
    font-size: 13px !important;
    color: black!important;
    font-family: 'Trebuchet MS','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  
 }
 .action-node {
    display: flex;
    justify-content: space-between;
    
 }

 .nav-link-padding:hover {
    cursor: pointer;
 }
 li a :active {
    background-color: #e9ecef;
    color: black;
 }
 .btn {
  background: #Fff;
  border: 1px solid black;
  color: black;
  font-size: 14px;
  font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-align: center;
  height: 30px;
  padding: 2px 7px;
}

.btn:hover {
  color: #Fff;
  background: #07569B;
  border-color: #07569B;
}   
</style>