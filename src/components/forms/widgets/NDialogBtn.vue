<template>
    <n-loader ></n-loader>
    <!-- Button trigger modal -->
    <button type="button" :class="classe" @click="openDialog" v-if="!readOnly">
       <span><i :class="icon"></i></span><span v-if="hasTitle">{{ title }}</span>
    </button>

    <!-- Modal -->
    <div class="modal" :id="id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"  :aria-labelledby="backdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
            <div class="modal-header dlg-header-img">
                <h1 class="modal-title fs-5" :id="backdropLabel">{{ dlgTitle }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <editor-area v-if="isView"
                    :editorArea="editorArea"
                    :dialog="id"
                    :item="data"
                    :typeOp="opType">
                </editor-area>     
                <dlg-list-view v-else 
                            :items="items"
                            :meta="meta"
                            :widget="widget"
                            @dblclick-action="dbClick"
                            @click-action="selectItem">
                </dlg-list-view>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">{{ t('close.btn.name') }}</button>
                <button type="button" class="btn btn-primary btn-sm" @click="executeAction">{{ actionBtnName() }}</button>
            </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Modal, bootstrap } from "bootstrap";
import  store  from '@/store';
import RestService from '@/services/restService';
import { i18n } from '@/services/i18nService';
import { validate } from '@/services/validator';


const restService = new RestService();


@Options({
    components: {
        EditorArea : defineAsyncComponent(() => import('@/components/forms/EditorArea.vue')),
        DlgListView: defineAsyncComponent(() => import('@/components/forms/widgets/DlgListView.vue')),
        NLoader: defineAsyncComponent(() => import('@/components/forms/widgets/NLoader.vue')),
    } ,props: {
        icon: String,
        title: String,
        meta: Object,
        viewMode: String,
        dialog: String,
        classe: String,
        item: Object,
        opType: String,
        widget: String,
        readOnly: Boolean,
    }, data: function() {
        return {
           data: null,
           items: [],
           overlay: false,
           translate: null,
        }
    }, methods: {
      async openDialog() {          
          if (this.isView) {
            this.overlay = true ;
            if (this.opType=='create') {
                await this.newItem(this.meta);
            } else if (this.opType=='update'){
                this.data = Object.assign({}, this.item);
            }
            this.overlay = false ;
          }         
          let dialog = new Modal(document.getElementById(this.id), {});
          dialog.show();
       }, closeDialog() {
            var modal = Modal.getInstance(document.getElementById(this.id))
            modal.hide();
       }, async initData() {           
            if (this.viewMode == 'view') {
                this.data = Object.assign({}, this.item);
            } 
       }, async newItem() {
           let plugin = store.getters.getPlugin;
           try {
             this.data = await restService.get(plugin.name, ['core', 'new', this.meta.typeCode], null, true);      
           } catch(error) {
              this.emitter.emit("inner-error-event", error);
           }     
        }, dbClick(item: any) {
            let dialog = Modal.getInstance(document.getElementById(this.id), {});
            dialog.hide();       
            this.$emit('dblclick-action', item);               
        }, t(key: string) {
            if (this.translate != null) {
                return this.translate[key];
            }
            return null;
        }, actionBtnName() {
             if (this.viewMode == 'view') {
                return this.t('save.btn.name');
             }
             return this.t('select.btn.name');
        }, selectItem(item: any) {
            this.data = item;   
        }, async executeAction() {
            if (this.viewMode == 'list') {  
                const values = this.items.filter(f => f.selected);
                if (this.selectable && values.length > 0) {
                    console.log('-INSIDE SELECTETABLE')
                   this.$emit("selected-items", values);
                   this.closeDialog();
                } else {
                    this.dbClick(this.data)
                }
            } else if (this.viewMode == 'view') {
                let errors = await validate(this.meta, this.data);
                if (errors.length <= 0) {
                    if (this.opType == 'create') {
                      this.$emit("save-event", this.data);
                    } else {
                        this.$emit("update-event", this.data);
                    }
                  this.closeDialog();
                } else {
                    this.emitter.emit("show-error-toast", errors);
                }
            }
        }
    }, computed: {
        id() { return 'btn'+Math.floor(Math.random() * 10000); }, 
        isView() { return this.viewMode == 'view'; },
        hasIcon() { return this.icon != null ;},
        hasTitle() { return this.title != null ;},
        bsTarget() { return '#'.concat(this.id);},
        bsToggle() { return this.dialog == null ? 'modal' : '#'.concat(this.dialog)},
        backdropLabel() { return this.id+'Label'},
        editorArea() { return this.meta != null ? this.meta.editorarea: null ;},
        action() { return this.meta.action; },
        selectable() { return this.widget == 'manytomany';},
        dlgTitle() { 
            if (this.meta == null) {
                return "";
            }
            if (this.viewMode=='view') {
                return this.meta.formViewTitle;
            }
            return this.meta.listViewTitle ;
         }, pluginname() {
            return store.getters.getPlugin.name;
         }, context() { return this.meta != null && this.meta.type != null ? {offset: 0, max: 10, type: this.meta.type} : null;}
    }, watch: {
         
       async meta(newMeta, oldMeta) {
            if (this.meta != null) {
            // await this.initData();
            }            
        } 
    }, async mounted() {
        if (this.context != null) {
           await this.initData();
        } 
    },async created() {
        this.translate = await i18n(['close.btn.name', 'save.btn.name', 'select.btn.name']);
    }
  })
  export default class NDialogBtn extends Vue {

  }
</script>
<style scoped lang="scss">
  .dlg-header-img {
        background-image: url('@/assets/headerbackgroung.png');
        background-repeat: repeat;  
        height: 30px; 
   }
</style>