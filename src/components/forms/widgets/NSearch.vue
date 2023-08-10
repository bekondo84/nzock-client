<template>
    <div class="search" v-click-outside="outsideEvent">
        <div class="input-group mb-3">
            <div v-if="translate != null">
                <ul class="dropdown-menu dropdown-menu" :id="id" >
                    <li v-for="item in items" :key="item.fieldName"><a class="dropdown-item search-link" @click="addRule(item)"><span class="search-text"><i class="fa-solid fa-play"></i></span>{{ buildMessage(item) }}</a></li>                    
                </ul>
          </div>
          <div class="search-text-bloc">            
            <div class="search-text-item">
                <v-text-field
                    variant="underlined"
                    v-model="searchKey"
                    @input="searchInput">
                  <template v-slot:prepend-inner>
                    <div class="search-text-bloc">
                        <div v-for="rule in rules" :key="rule.fieldName">
                          <v-chip :closable="true" 
                                  density="compact"
                                  rounded="0"
                                  variant="elevated"
                                  @click:close="vChipClose(rule)"><span>{{ rule.label }} :</span><span>{{ rule.value }}</span></v-chip>                 
                      </div>   
                    </div>  
                </template>
                </v-text-field>
            </div>
          </div>
        </div>              
        <button type="button" class="btn btn-sm search-btn-logo" @click="searchAction" disabled><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Dropdown } from 'bootstrap';
import { i18n } from '@/services/i18nService';
import { getFieldName } from '@/utils/utils';

 @Options({
      props: {
         meta: Object,
      }, data: function() {
        return {
            searchKey: null,
            active: false,
            items: [],
            translate: null,
            rules: [],
        }
      }, methods: {
        dropdownCtrl(show: boolean) {
            var dropdownElt = document.getElementById(this.id); 
            if (show) {
                if (dropdownElt != null) {
                    dropdownElt.classList.remove("hide-menu");
                    dropdownElt.classList.add("show-menu"); 
                }
            } else {
                if (dropdownElt != null) {
                    dropdownElt.classList.remove("show-menu"); 
                    dropdownElt.classList.add("hide-menu");                    
                }
            }
        }, searchInput(event: any) {           
            if (this.searchKey!= null && this.searchKey.length > 0) {
                if (!this.active) {                    
                    this.active = true;
                    this.dropdownCtrl(this.active);                    
                }
            } else {                
                this.active = false ;
                this.dropdownCtrl(this.active); 
            }
           
        }, buildMessage(item: any) {
            if (this.translate != null) {
             return this.translate['find.message.first']+" '"+this.searchKey+"' "+this.translate['find.message.second']+' '+item.label;
            }
            return null;
        }, resetSearch() {
            this.searchKey = null ,
            this.active = false ;
            this.dropdownCtrl(this.active);
        }, outsideEvent() {
            this.resetSearch();
        }, addRule(item: any) {
            let v = this.rules.filter(ru => ru.name==item.fieldName);
            if (v.length==0) {
                this.rules.push({name:getFieldName(item), label: item.label, cond: item.cond,value: this.searchKey});
                this.resetSearch();
                this.$emit("search-event", this.rules);
            }
        }, removeRule(item: any) {
            let v = this.rules.findIndex(ru => ru.name==item.name);
            if (v >= 0) {
                this.rules.splice(v, 1);
                this.resetSearch();
                this.$emit("search-event", this.rules);
            }
        }, vChipClose(rule: any) {
            this.removeRule(rule);            
        }/*, getRuleName(item: any) {
            if (item.meta != null) {
                if (item.meta.searchKey != null) {
                  return item.fieldName.concat('.').concat(item.meta.searchKey);
                } else {
                    return item.fieldName.concat('.pk');
                }
            }
            return item.fieldName;
        }*/
      }, computed: {
        id() { return 'btn'+Math.floor(Math.random() * 10000); },         
      }, mounted() {
         if (this.meta != null && this.meta.listView!= null ) {
            this.items.splice(0, this.items.length);
            this.items.push(...this.meta.listView.columns.filter(p => p.search==true))
         }         
         this.resetSearch();
      }, async created() {
        this.translate = await i18n(['find.message.first', 'find.message.second']);
        
      }, watch: {
         meta(newMeta: any, oldMeta: any) {
            if (this.meta != null && this.meta.listView!= null ) {
                this.items.splice(0, this.items.length);
                this.items.push(...this.meta.listView.columns.filter(p => p.search==true))
            }   
            this.resetSearch();
            this.rules.splice(0, this.rules.length);
         } 
      }
 })
 export default class NSearch extends Vue {

 }
</script>
<style scoped lang="scss">
.search {
    display: flex;
    flex-flow: row nowrap;     
    width: 55%;      
    margin-top: -20px;
    color: black;
    .input {
        border-top: 0 ; 
        border-left: 0;
        border-right: 0;
        border-bottom: ridge;
    }
}  
.dropdown-btn {
    border: none !important;
    margin-top: 20px;
    margin-bottom: 0px;
}  
.dropdown-menu {
    margin-top: 0px !important;   
}
.show-menu {
    z-index: 1000;
    display: block;
    margin-top: 50px !important;
    width: 100%;
}
.hide-menu {
    display: none;    
}
.search-text {
    margin: 0px 10px 0px 4px;
    font-size: xx-small;
    
}
.search-link {
    font-size: smaller;
    font-family: 'Trebuchet MS','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.search-btn-logo {
        margin-left: 2px 0px 2px 0px;
        font-size: 16px;
        border: none;
        color: black;
}
.search-text-bloc {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    .search-text-item {
        flex: 1;
    }
}
.chip-first {
    background-color: #dd4b39;
}

div.v-input__details  {
     min-height: 0px !important; 
}
div.v-messages  {
     min-height: 0px !important; 
}
</style>