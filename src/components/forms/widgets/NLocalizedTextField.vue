<template>
  <div class="localized">   
     <v-text-field
         variant="underlined"
         :label="field.label"
         v-model="value"
         @input="inputValue"
         :readonly="readOnly"
         ></v-text-field>
       <div class="dropdown">
         <button class="btn btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
           {{ key }} <i class="fa-solid fa-globe"></i>
         </button>
         <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li v-for="key in keys" :key="key"><a class="dropdown-item"  @click="setLang(key)">{{key}}</a></li>            
         </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RestService from '@/services/restService';
import { corePlugin } from '@/services/restService';

const localizedStringUrl = 'backoffice/api/v1/core/new/IsisLocalizedString'; 
const keysUrl='backoffice/api/v1/public/i18n/keys';
const restService = new RestService();

@Options({
   props: {
      field: Object,
      readOnly: Boolean,
      item: Object,
   }, data: function() {
      return {
         keys: [],     
         key: null , 
         value: null   
      }
   }, methods: {
      inputValue(event: any) {
         if (this.item != null ) {
            this.item[this.field.fieldName][this.key].value = event.target.value;
         }
      }, async setLang(key: string) {
          try {
            this.key = key;
            if (this.item[this.field.fieldName] == null && key != null) {
               this.item[this.field.fieldName] = {key: null};
            }
            if (this.hasValue && key != null) {
               let obj = this.item[this.field.fieldName];
               if (obj[key] != null) {
                  this.value = obj[key].value;
               } else { 
                  let response = await restService.get(corePlugin, ['core', 'new', 'IsisLocalizedString'], null, true);
                  //(await this.axios.get(localizedStringUrl)).data;
                  response.codeiso = key;
                  this.item[this.field.fieldName][key] = response;
                  this.value = response.value;
               }
            }            
         } catch (error) {
            this.emitter.emit("inner-error-event", error);
         }
      }, async getKeys() { 
          let response = await restService.get(corePlugin, ['public', 'i18n', 'keys']);
          this.keys.splice(0, this.keys.length);
          this.keys.push(...response);  
          if (this.keys.length > 0) {
            await this.setLang(this.keys[0]);
          }
      }
   }, computed: {
      hasValue() {
         return this.item != null && this.item[this.field.fieldName] != null;
      }
   }, watch: {
      item(newVal) {
         this.value = this.key != null && this.item[this.field.fieldName] != null && this.item[this.field.fieldName][this.key] != null ? this.item[this.field.fieldName][this.key].value:""; 
      }
   }, mounted() {
      try {
       this.setLang(this.keys[0]);     
      } catch(error) {
         this.emitter.emit("inner-error-event", error);
      }  
   }, async created() {
      try {
       await this.getKeys();
      } catch(error) {
         this.emitter.emit("inner-error-event", error);
      }
   }
})

export default class NLocalizedTextField extends Vue {

}

</script>
<style scoped lang="scss">
   .localized {
      display: flex;
      flex-flow: row nowrap;
   }
</style>