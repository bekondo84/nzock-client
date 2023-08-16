<template>
   <div class="form-view">
      <n-loader :overlay="overlay"></n-loader>
      <form-header 
            :typeOp="typeOp"
            :meta="meta"
            viewType="view"
            :itemsCount="itemsCount"
            :index="index"
            @next-event="nextAction"
            @previous-event="previousAction"
            @action-event="actionEventHandler"
            @back-event="backEventHandler"
            @create-new-event="createAction"
            @delete-event="onDelateAction"
            @update-event="onUpdateAction"
            @duplicate-event="onDuplicateAction">           
      </form-header>
      <div class="form-body">
          <div class="form-body-content">           
            <editor-area 
                 :editorArea="editorarea"
                 :item="item"
                 :typeOp="typeOp"
                 :publishers="publishers">
            </editor-area>
          </div>
           <followers v-if="false"></followers>          
      </div>      
   </div>
</template>
<script lang="ts">
import { buildPublishers, Publishier } from '@/services/Publisher';
import RestService from '@/services/restService';
import store from '@/store';
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';

const restService = new RestService();

@Options({
    props: {
        meta : Object,
        item: Object,
        typeOp: String,
        items: Array
    }, components: {        
        FormHeader : defineAsyncComponent(() => import('./FormHeader.vue')),
        Followers: defineAsyncComponent(() => import('@/components/forms/Followers.vue')),
        EditorArea : defineAsyncComponent(() => import('@/components/forms/EditorArea.vue'))
    }, data: function() {
        return {
           publishers: [],
           overlay: false,
        }
    }, computed: {
        editorarea() {
            return this.meta != null ? this.meta.editorarea : null
        }, itemsCount() { return this.items != null ? this.items.length : 0 ;},
        index() { return this.item != null && this.items != null ? this.items.findIndex(i => i.pk == this.item.pk) + 1 : 0 ;},
        plugin() { return store.getters.getPlugin.name},
    }, methods: {
        save() {
          this.$emit('save-item-event')
        }, nextAction(pagination: any) {
            this.$emit("next-event", pagination);
        },async previousAction(pagination: any) {
            this.$emit("previous-event", pagination);
        }, actionEventHandler(action: any) {
            this.$emit("action-event", action);
        }, backEventHandler() {
            this.$emit("back-event");  
        }, createAction() {
            this.$emit("create-new-event");
         }, showLoader() {
            this.overlay = true;
        }, hideLoader() {
          this.overlay = false;
        }, onDelateAction() {
            this.$emit("delete-event", this.item.pk);
        }, onUpdateAction() {
            this.$emit("update-event", this.item);
        }, onDuplicateAction() {
            this.$emit("duplicate-event", this.item);
        },async onPublishEvent(event: any) {
             this.showLoader();
             let publisher = event.publisher ;
             if (publisher != null) {
                  let config = {
                     params: {
                        context: JSON.stringify({pk: event.pk}),
                     }
                  };
                  for (let i = 0; i < publisher._subscribers.length; i++) {
                     const subscriber = publisher._subscribers[i];
                     const result = await restService.get(this.plugin, ['actions', 'custom', 'item', subscriber._handler], config, true);
                     const data = result.data ;
                     const subscriberField = subscriber._field;
                     if (data != null && subscriberField != null) {                    
                        if (['onetomany', 'manytomany', 'manytomanylist'].includes(subscriberField.widget)){
                            let items = this.item[subscriberField.fieldName];
                            if (items != null) {
                                items.splice(0, items.length);
                                items.push(...data);
                            }
                        } else if (subscriberField.widget == 'manytoone') {
                            this.item[subscriberField.fieldName] = Object.assign({}, data);
                        } else if (['text'].includes(subscriberField.widget)) {
                            this.item[subscriberField.fieldName] = data;
                        }
                    }
                  }
                 
             }
             this.hideLoader();
        }
    }, mounted() {
        let resut = buildPublishers(this.meta, this.item);
        store.commit("resetResource");
        this.publishers.splice(0, this.publishers.length);
        this.publishers.push(...resut);
    }, created() {
        this.emitter.on("save-event", this.save);
        this.emitter.on("publish-event", this.onPublishEvent);
    }
})
 export default class FormView extends Vue {

 }
</script>
<style scoped lang="scss">
  .form-view {
    display: flex;
    flex-flow: column wrap;  
    height: auto;
    
    
    .form-body {
       // flex: 1;       
        height: auto;
        width: 100%;
    }
    .form-body-content {
        //border: solid 1px;
        display: flex;
        flex-flow: column wrap;
        width: 100%;
        height: auto;
        background: white;
    }
  }  
</style>