<template>
    <div class="file-input">
      <v-text-field v-if="item != null"
        variant="underlined"
        chips
        multiple
        readonly="true"
        :id="field.name" 
        :label="field.label"
        v-model="item[field.fieldName]"
      ></v-text-field>
      <v-btn v-if="!readOnly" class="margin-top-15"
        variant="text"
        color="success"
        icon="mdi-cloud-upload-outline"
        size="small"
        @click="searchFile()">
        </v-btn>
        <v-btn v-if="canDownload" class="margin-top-15"
        variant="text"
        icon="mdi-cloud-download-outline"
        size="small"
        @click="download()">
        </v-btn>
        <input type="file" :id="id" @change="selectFile($event)"  hidden>
    </div>     
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RestService, { corePlugin } from '@/services/restService';
import  store  from '@/store';


const restService = new RestService();

@Options({
   props: {
    field: Object,
    item: Object,
    readOnly: Boolean,
   }, data: function() {
       return {
          file: undefined,
          id : undefined
       }
   }, methods: {
     searchFile() {
       const filechooser = document.getElementById(this.id);
        if (filechooser != null) {
            filechooser.click()
        }
     }, async selectFile(file) {
          this.file = file.target.files[0] ;
          //console.log('---------------File selected : '+this.file.name)
          if (this.file != null) {
            this.item[this.field.fieldName] = this.file.name;
            store.commit("addResource", this.file);
            /**
            let formData = new FormData();
            formData.append('file', this.file);
            //console.log('---------------File selected : '+this.file.name)
            const response = await restService.uploadFile(corePlugin, formData);
            **/
          }
       },async download() {
           console.log('-----------download request detected ---------'+JSON.stringify(this.fieldName))
           if (this.fileName != null && this.pk != null) {
             await restService.downloadFile(corePlugin, this.item.pk, this.fileName);
           }
       }
   }, computed: {
      pk() {
         return this.item != null ? this.item.pk : null ;
      }, fileName() {
         return this.item != null && this.field != null ? this.item[this.field.fieldName] : null;
      }, canDownload() {
          return this.item == null || this.item[this.field.name]==null ;
      }
   }, mounted() {
      this.id = Math.floor(Math.random() * 10000);
   }
}) 
 export default class NFileInput extends Vue {

 }
</script>
<style scoped>
.file-input {
      display: flex;
      flex-flow: row nowrap;
}
.margin-top-15 {
    margin-top: 15px !important;
}
</style>