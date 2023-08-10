<template>
    <div class="image">
        <img :src="url" 
            :width="width"> 
            <div class="actions">
            <button type="button" class="btn btn-sm link-success" @click="searchFile" v-if="!readOnly">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
        <input type="file" :id="id" @change="uploadImage($event)" accept=".jpg, .png, .jpeg, .gif" hidden>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { defineAsyncComponent } from 'vue';
import { corePlugin, urlBuilder } from '@/services/restService';

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
        getImage() {
            this.url = urlBuilder(corePlugin, ['public', 'media', 'imagenotfound.png']);
            if (this.field != null && this.item[this.field.fieldName] != null) {
                this.url = this.item[this.field.fieldName];
            }     
        }, searchFile() {
            const filechooser = document.getElementById(this.id);
            if (filechooser != null) {
                filechooser.click()
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