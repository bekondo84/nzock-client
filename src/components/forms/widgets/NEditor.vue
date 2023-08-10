<template>
   <div>
      <n-loader :overlay="overlay"></n-loader> 
      <div class="editor-actions" v-if="actions.length > 0">
         <a v-for="action in actions" :key="action.name" class="btn btn-sm btn-secondary" @click="customAction(action, item)"><span>{{ action.name }}</span><i :class="action.icon"></i></a>
      </div>
      <div>
         <quill-editor theme="snow"
            toolbar="full"
            contentType="text"
            :enable="!readOnly"
            :placeholder="field.label"
            v-model:content="content">
         </quill-editor>
     </div>
   </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import { validate } from '@/services/validator';
import RestService from '@/services/restService';
import store from '@/store';

const restService = new RestService();

@Options({
   components: {
       QuillEditor,
       NLoader: defineAsyncComponent(() => import('@/components/forms/widgets/NLoader.vue')),
   }, props: {
     field: Object,
     item: Object,
     readOnly: Boolean,
   }, data: function() {
      return {
         content: "  ",
         overlay: false
      }
   }, methods: {
       async customAction(action: any) {
                this.showLoader();
                let data = {data: JSON.stringify(this.item)};
                let response =  await restService.post(this.plugin.name, ['actions', 'custom', 'item', action.code], data, true);
               
                if (response.data != null) {
                   Object.assign(this.item, response.data);
                }
                //process the case of view action.viewMode='print'     
                this.hideLoader();          
           }, showLoader() {
               this.overlay = true ;
            }, hideLoader() {
               this.overlay = false ;
            }
   }, computed: {
      actions() { return this.field != null ? this.field.actions : [] ;},
      plugin() { return store.getters.getPlugin ;}
   }, watch: {
      content() {
        this.item[this.field.fieldName] = this.content;
      }
   }, mounted() {
      if (this.item[this.field.fieldName] != null) {
        this.content =  this.item[this.field.fieldName];
      }
   }
})
export default class NEditor extends Vue {

}
</script>
<style lang="scss" scoped>

.editor-actions {
   display: flex;
   flex-flow: column nowrap;
   align-items: flex-start;
}
.sc-editor-container
{
    display: flex;
    flex-flow: row nowrap;
    //height: 57vh;
}
.sc-editor
{
    width: 96%;
	height: 45vh;
	white-space: nowrap;
	background: rgba(8, 0, 7, 0.81);
	color: white ;
	overflow: auto;
}
</style>