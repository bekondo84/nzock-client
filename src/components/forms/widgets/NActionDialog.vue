<template>
    <n-loader :overlay="overlay"></n-loader>
    <div class="modal" :id="id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"  :aria-labelledby="backdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
            <div class="modal-header dlg-header-img">
                <h1 class="modal-title fs-5" :id="backdropLabel">{{ dlgTitle }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <n-alert v-if="message"
                   :type="alertType"
                   density="compact"
                   :text="message"></n-alert>
            <div class="modal-body">
                <editor-area v-if="error == null"
                    :editorArea="editorArea"
                    :dialog="id"
                    :item="data"
                    typeOp="create">
                </editor-area>
                <error-page v-else
                     :err="error"></error-page>               
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
        NLoader: defineAsyncComponent(() => import('@/components/forms/widgets/NLoader.vue')),
        ErrorPage: defineAsyncComponent(() => import('@/components/errors/ErrorPage.vue')),
        NAlert: defineAsyncComponent(() => import('@/components/forms/widgets/NAlert.vue')),
    } ,props: {
        action: Object,
        id: String,
        parent: Object,
    }, data: function() {
        return {
           data: null,
           meta: null,
           overlay: false,
           translate: null,
           error: null,
           message: null,
           alertType: null,
        }
    }, methods: {
       closeDialog() {
            var modal = Modal.getInstance(document.getElementById(this.id))
            modal.hide();
       }, async initData() {  
            this.error = null;
            this.message = null;
            this.alertType = null;
            this.overlay = false;
            try {
                if (this.action != null) {
                    if (this.action.modal == true  && this.action.dynamic==true  && this.action.type != null) {
                        let context = {parent: null};
                        if (this.parentPk != null) {
                            context.parent = this.parentPk;
                        }
                        let config = {
                          params: {
                            context: JSON.stringify(context),
                          }
                        };
                        let data = await restService.get(this.pluginname, ['actions', 'custom', 'item', this.action.code], config, true);
                        this.meta = data.meta;
                        this.data = data.data;
                    } else if (this.action.modal == true && this.action.type != null) {
                        this.meta = await restService.get(this.pluginname, ['actions', 'typeCode', 'meta', this.action.name], null, true)
                        let response = await restService.get(this.pluginname, ['core', 'new', this.meta.typeCode], null, true);
                        this.data = Object.assign({}, response);
                    }
              }
            } catch (error) {
                this.error = error;
            }         
            this.overlay = false;
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
            let errors = await validate(this.meta, this.data);
            if (errors.length <= 0) {               
                if (this.action != null) {
                    let data = {data: JSON.stringify(this.data), typeCode:this.meta.typeCode, parent: this.parentPk};
                    let response = await restService.post(this.pluginname, ['actions', 'custom', 'item', this.action.code], data, true);
                    
                    if (response.error) {
                        this.message = response.error ;
                        this.alertType = "error";
                    } else if (response.success) {
                        this.message = response.success ;
                        this.alertType = "success";
                    } else {
                        this.closeDialog();
                    }
                }
               
            } else {
                this.emitter.emit("show-error-toast", errors);
            }
        },errorType() {
            if (this.error) {
                return "error";
            } else if (this.success) {
                return "success";
            }
            return null;
         }
    }, computed: {
        hasTitle() { return this.title != null ;},
        bsTarget() { return '#'.concat(this.id);},
        bsToggle() { return this.dialog == null ? 'modal' : '#'.concat(this.dialog)},
        backdropLabel() { return this.id+'Label'},
        editorArea() { return this.meta != null ? this.meta.editorarea: null ;},
        action() { return this.meta.action; },
        dlgTitle() { 
              return this.meta != null ? this.meta.formViewTitle : "" ;
         }, pluginname() {
            return store.getters.getPlugin.name;
         }, context() { return this.meta != null && this.meta.type != null ? {offset: 0, max: 10, type: this.meta.type} : null;},
         parentPk() { return this.parent != null ? this.parent.pk : null},
         
    }, watch: {
         
       async action(newMeta, oldMeta) {
          await this.initData();
        } 
    }, async mounted() {
        await this.initData();
    },async created() {
        this.translate = await i18n(['close.btn.name', 'save.btn.name', 'select.btn.name']);
    }
  })
  export default class NDialogBtn extends Vue {

  }
</script>
<style scoped lang="scss">
  .dlg-header-img {
        background: red;
        height: 30px; 
   }
</style>