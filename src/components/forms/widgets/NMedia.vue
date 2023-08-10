<template>
    <div class="image">
        <img :src="url" 
            :width="width">
        <div class="actions">
            <button type="button" class="btn btn-sm link-success" @click="searchFile" v-if="!readOnly">
                <i class="fa-solid fa-plus"></i>
            </button>
            <n-dialog-btn
                icon="fa-solid fa-magnifying-glass"
                classe="btn btn-sm link-secondary"
                viewMode="list"
                :meta="field.meta"
                :item="item"
                :readOnly="readOnly">
           </n-dialog-btn>      
        </div>
        <input type="file" :id="id" @change="uploadImage($event)" accept=".jpg, .png, .jpeg, .gif" hidden>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RestService, { corePlugin, url, urlBuilder } from '@/services/restService';
import NDialogBtn from '@/components/forms/widgets/NDialogBtn.vue';
import { defineAsyncComponent } from 'vue';

const restService = new RestService();
 
 @Options({
    components: {
        NDialogBtn: defineAsyncComponent(() => import('@/components/forms/widgets/NDialogBtn.vue')),
    }, props: {
        readOnly: Boolean,
        field: Object,
        item: Object,
        width: Number,
    }, data: function() {
        return {
            url : null ,
            id: null,
        }
    }, methods: {
        searchFile() {
            const filechooser = document.getElementById(this.id);
            if (filechooser != null) {
                filechooser.click()
            }
        }, async getImage() {
            this.url = urlBuilder(corePlugin, ['public', 'media', 'imagenotfound.png']);
            let media = this.field != null && this.item != null ? this.item[this.field.fieldName] : null ;
            if (media != null) {
                if (media.confidential == false) {
                    this.url = urlBuilder(corePlugin, ['public', 'media', media.code]);
                } else  {
                    let config = {
                            responseType: 'blob',                        
                        } ;  
                    let data =  await restService.get(corePlugin, ['public','media','12345.png'], config, true);
                    this.url = data;
                    return 
                }
            }         
        }, uploadImage(e: any) {
              console.log('upload file action detected : '+JSON.stringify(e));
          }
    }, computed: {        

    }, watch: {
       async item(newVal) {
          await this.getImage();
       }
    },async mounted() {
        this.id = Math.floor(Math.random() * 10000);
        await this.getImage();
    }
 })

 export default class NImage extends Vue {

 }
</script>
<style scoped lang="scss">
  .image {
     display: flex;
     margin: 3px 0px 10px 0px;

     .actions {
        display: flex;
        flex-flow: column;
        justify-content: space-around;
     }
  }
</style>