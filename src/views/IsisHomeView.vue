<template>
  <n-loader :overlay="overlay"></n-loader>
  <div class="home-container">
    <div class="header-border">
      <Header :plugin="plugin" @plugin-select-event="runPlugin" @password-change-event="actionEventHandler">
      </Header>
    </div>
    <validation-error :errors="errors"></validation-error>
    <div class="content-container" v-if="isPluginMode">
      <div class="menu-container">
        <div class="menu-company-logo"></div>
        <div class="menu-company">
          <VMenusBar :plugin="plugin"></VMenusBar>
        </div>
      </div>
      <div class="op-container">
        <form-view v-if="isViewMode" :meta="meta" :item="item" :typeOp="typeOp" :items="items"
          @save-item-event="saveAction" @next-event="nextAction" @previous-event="previousAction"
          @action-event="actionEventHandler" @back-event="backEventHandler" @create-new-event="createAction"
          @delete-event="deleteAction" @update-event="updateAction" @duplicate-event="duplicateAction">
        </form-view>
        <list-form v-if="isListView" :meta="meta" :menu="menu" :plugin="plugin" :parent="parent"
          @data-fetch-event="fetchDataAction" @action-event="actionEventHandlerList" @create-new-event="createAction"
          @dblclick-action="setItem" @rollback-action="backEventHandler">
        </list-form>
        <dashboard-view v-if="isDashboardMode" :meta="meta"></dashboard-view>
        <error-page v-if="isErrorMode" :err="error"></error-page>
      </div>
    </div>
    <n-action-dialog :id="actionDialogId" :action="action" :parent="parent"></n-action-dialog>
  </div>
  <form>
    <input type="file" :id="fileInputId" @change.prevent="selectFile($event)" hidden>
  </form>
</template>
<script lang="ts">
import Header from '@/components/navigations/Header.vue';
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import store from '@/store';
import RestService, { url } from '@/services/restService';
import { corePlugin } from '@/services/restService';
import { ErrorMsge, validate } from '@/services/validator';
import { Modal, bootstrap } from "bootstrap";



const apiUrl = '/api/v1/';
const baseUrl = 'backoffice' + apiUrl + 'module/';
const restService = new RestService();

@Options({
  components: {
    VMenusBar: defineAsyncComponent(() => import('./../components/navigations/VMenusBar.vue')),
    Header: defineAsyncComponent(() => import('./../components/navigations/Header.vue')),
    ListForm: defineAsyncComponent(() => import('./../components/forms/ListForm.vue')),
    FormView: defineAsyncComponent(() => import('./../components/forms/FormView.vue')),
    DashboardView: defineAsyncComponent(() => import('@/components/forms/DashbordView.vue')),
    ValidationError: defineAsyncComponent(() => import('@/components/forms/widgets/ValidationError.vue')),
    ErrorPage: defineAsyncComponent(() => import('@/components/errors/ErrorPage.vue')),
    NLoader: defineAsyncComponent(() => import('@/components/forms/widgets/NLoader.vue')),
    NActionDialog: defineAsyncComponent(() => import('@/components/forms/widgets/NActionDialog.vue')),
  }, data() {
    return {
      plugin: null,
      menu: null,
      viewType: 'view',
      viewModes: [],
      menus: [],
      meta: null,
      item: null,
      typeOp: null,
      errors: [],
      overlay: false,
      error: null,
      items: [],
      parent: null,
      action: null,
    }
  }, methods: {
    async selectFile(file) {
      this.showLoader();
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      let formData = new FormData();
      formData.append('file', file.target.files[0]);
      formData.append('action', this.action.code);
      try {
        await restService.post(this.plugin.name, ['actions', 'upload'], formData, true);
      } catch (error) {
        console.log(error);
      }
      this.hideLoader();
    }, async backEventHandler() {
      let stack = store.getters.getStack;
      let data = stack.pop();
      data = stack[stack.length - 1];
      if (data != null) {
        if (data.viewMode == 'view') {
          this.meta = data.meta;
          this.viewType = data.viewMode;
          let item = await restService.getItem(this.plugin.name, data.meta, this.parentId, data.item.pk);
          this.item = item.data;
        } else if (data.viewMode == 'dashbord') {
          console.log('case of dashbord .................')
        } else {
          this.meta = data.meta;
          this.viewType = data.viewMode;
        }

      }
    }, fetchDataAction(items: []) {
      this.items.splice(0, this.items.length);
      this.items.push(...items);
    }, async processOnlyViewMode() {
      if (this.viewModes[0] == 'view') {
        let config = {
          params: {
            context: JSON.stringify({ type: this.meta.type, parent: this.parentId })
          }
        };
        let item = await restService.get(this.plugin.name, ['actions', this.meta.action, 'fetchSingle'], config, true);
        this.item = item.data;
        if (this.item.pk == null) {
          this.typeOp = 'create';
        } else {
          this.typeOp = 'view';
        }
      }
    }, async process(meta: any) {
      await this.processOnlyViewMode(meta.action);
      this.viewType = this.viewModes[0];
      this.refreshBreadcrumb();
    }, setContextParams(menu: any) {
      this.parent = null;
      this.action = null;
      this.menu = menu;
      this.viewModes = this.menu != null ? this.menu.viewMode.trim().split(',') : [];
      //this.viewType = this.viewModes[0];
    }, async processMenu(menu: any) {
      this.showLoader();
      try {
        this.setContextParams(menu);
        if (this.viewModes[0] == 'dashboard') {
          let meta = await restService.get(this.plugin.name, ['actions', 'nav', 'dashboard', menu.code], null, true);
          this.meta = Object.assign({}, meta);
          this.viewType = this.viewModes[0];
          store.commit('resetStack');
          this.refreshBreadcrumb();
        } else {
          let meta = await restService.get(this.plugin.name, ['actions', 'nav', 'meta', menu.code], null, true);
          this.meta = Object.assign({}, meta);
          this.viewType = this.viewModes[0];
          store.commit('resetStack');
          await this.process(meta);
        }
      } catch (err) {
        this.error = err;
        this.viewType = "error";
      }
      this.hideLoader();
    }, async processActionForMeta(typeCode: string, viewMode: string) {
      this.showLoader();
      try {
        let config = {
          params: {
            context: JSON.stringify({ action: this.action != null ? this.action.code : '' })
          }
        };
        let meta = await restService.get(this.plugin.name, ['actions', 'typeCode', 'meta', typeCode], config, true);
        this.meta = Object.assign({}, meta);
        this.viewType = viewMode;
        store.commit('resetStack');
        this.refreshBreadcrumb();
      } catch (error) {
        this.error = error;
        this.viewType = "error";
      }
      this.hideLoader();
    }, async createAction() {
      this.showLoader();
      try {
        let view = this.viewModes.filter(v => v == 'view');
        if (view != null) {
          let response = await restService.get(this.pluginname, ['core', 'new', this.meta.typeCode], null, true);
          this.item = Object.assign({}, response);
          this.viewType = view;
          this.typeOp = 'create';
          this.refreshBreadcrumb();
        }
      } catch (error) {
        this.error = error;
        this.viewType = "error";
      }
      this.hideLoader();
    }, async runPlugin(plugin: any) {
      this.showLoader();
      store.commit("resetResource");
      if (plugin.type.code == 'WEB') {
        window.location.href = url(plugin);
      } else if (plugin.type.code == 'APPLICATION') {
        let result = await restService.get(corePlugin, ['module', 'load', plugin.name])
        //console.log(' ------------------- '+this.plugin+' _____ '+JSON.stringify(result));
        try {
          this.plugin = Object.assign({}, result);
        } catch (err) {
          this.plugin = plugin;
        }
        store.commit('setPlugin', result);
        store.commit('resetStack');
        if (plugin.name != null) {
          this.$router.push('/' + plugin.name);
        }
      }
      this.hideLoader();
    }, async initApplication() {
      this.showLoader();
      this.parent = null;
      this.action = null;
      /**
       let nbreOfPlugins = await restService.get(corePlugin, ['module', 'install', 'count']);
       if (nbreOfPlugins == 1) {
         let plugins = await restService.get(corePlugin, ['install', '0', '1']);
         this.plugin = Object.assign({}, plugins[0]);
        }   
       */
      this.hideLoader();
    }, async setItem(item: any) {
      this.showLoader();
      try {
        store.commit("resetResource");
        let view = this.viewModes.filter(v => v == 'view');
        if (view != null) {
          let config = {
            params: {
              context: JSON.stringify({ type: this.meta.type, pk: item.pk, parent: this.parentId })
            }
          };
          let response = await restService.get(this.pluginname, ['actions', this.actionname, 'fetchSingle'], config, true)
          this.item = Object.assign({}, response.data);
          this.viewType = view[0];
          this.typeOp = 'view';
          this.refreshBreadcrumb();
        }
      } catch (error) {
        console.log(error)
        this.error = error;
        this.viewType = "error";
      }
      this.hideLoader();
    }, refreshBreadcrumb() {
      let stat = { id: this.statId(), meta: this.meta, viewMode: this.viewType, item: this.item };
      store.commit('pushStack', stat);
      this.emitter.emit('breadcrumb-refresh-event');
    }, updateAction() {
      this.typeOp = 'edit';
      store.commit("resetResource");
    }, statId() { return this.meta.typeCode + '-' + this.viewType; },
    duplicateAction() {
      store.commit("resetResource");
      this.item = Object.assign({}, this.item);
      this.item.pk = null;
      this.item.dateCreation = null;
      this.item.dateModification = null;
      this.typeOp = 'create';
    }, async deleteAction(item: number) {
      this.showLoader();
      store.commit("resetResource");
      let items = new Array<any>();
      items.push(item);
      try {
        let config = {
          headers: {
            allItems: "false",
            items: JSON.stringify(items),
            predicats: [],
          }, params: {
            context: JSON.stringify({ type: this.meta.type, parent: this.parentId }),
          }
        };
        await restService.delete(this.pluginName, ['actions', this.meta.action, 'delete'], config);
        await this.backEventHandler();
      } catch (error) {
        this.emitter.emit("inner-error-event", error);
      }
      this.hideLoader();
    }, async saveAction() {
      this.showLoader();
      try {
        this.errors = await validate(this.meta, this.item);
        if (this.errors.length <= 0) {
          let data = { data: JSON.stringify(this.item), typeCode: this.meta.typeCode, parent: this.parentId };
          let response = await restService.post(this.plugin.name, ['actions', this.actionname, 'save'], data, true);
          this.item = Object.assign({}, JSON.parse(response.data));
          await this.processResources(this.item);
          this.typeOp = 'view';
        } else {
          this.hideLoader();
          this.emitter.emit("show-error-toast", this.errors);
        }
      } catch (error) {
        this.error = error;
        this.viewType = "error";
      }
      this.hideLoader();
    }, async processResources(item: any) {
      //Upload resources if exists
      //const resources = store.getters.getResources ;              
      if (this.resources != null && this.resources.length > 0) {
        let file = this.resources.pop();
        while (file != null) {
          let formData = new FormData();
          formData.append('file', file);
          formData.append('pk', item.pk)
          await restService.uploadFile(corePlugin, formData, item);
          file = this.resources.pop();
        }
      }
    }, showLoader() {
      this.overlay = true;
    }, hideLoader() {
      this.overlay = false;
    }, getAction(menu: any) {
      if (menu.action == null || menu.action == '') {
        return 'defaultAction';
      }
      return menu.action;
    }, errorhandler(err) {
      this.error = err;
      this.viewType = "error";
    }, async nextAction(pagination: any) {
      let item = this.items[pagination.page];
      await this.setItem(item);
    }, async previousAction(pagination: any) {
      let item = this.items[pagination.page - 2];
      await this.setItem(item);
    }, async actionEventHandler(action: any) {
      this.showLoader();
      store.commit("resetResource");
      this.action = action;
      this.parent = Object.assign({}, this.item);
      try {
        if (action.modal == false && action.redirect == false && action.typeOp != 'import') {
          await this.processBackendAction(action);
        } else if (action.modal == true) {
          let dialog = new Modal(document.getElementById(this.actionDialogId), {});
          dialog.show();
        } else if (action.redirect == true) {
          let type = action.type;
          this.viewModes = action.viewMode.split(',');
          if (action.dynamic == true && action.code != null && this.item != null) {
            type = this.item[action.code];
          }
          let config = {
            params: {
              action: JSON.stringify({ action: this.action != null ? this.action.code : '' })
            }
          };
          let meta = await restService.get(this.plugin.name, ['actions', 'typeCode', 'meta', type], config, true);
          this.meta = Object.assign({}, meta);
          await this.process(meta);
        } else if (action.typeOp == 'import') {
          console.log('----------Import action --- ')
        }
      } catch (error) {
        this.error = error;
        this.viewType = "error";
      }
      this.hideLoader();
    }, async processBackendAction(action: any) {
      this.errors = await validate(this.meta, this.item);
      if (this.errors.length <= 0) {
        let data = { data: JSON.stringify(this.item), typeCode: this.meta.typeCode, parent: this.parentId };
        let response = await restService.post(this.plugin.name, ['actions', 'custom', 'item', action.code], data, true);
        this.item = Object.assign({}, JSON.parse(response.data));
      } else {
        this.hideLoader();
        this.emitter.emit("show-error-toast", this.errors);
      }
    }, async processListBackendAction(action: any) {
      let data = {
        data: JSON.stringify(this.items.filter(i => i.selected)
          .map(m => m.pk)), typeCode: this.meta.typeCode, parent: this.parentId
      };
      await restService.post(this.plugin.name, ['actions', 'custom', 'items', action.code], data, true);
    }, async actionEventHandlerList(action: any) {
      this.showLoader();
      this.action = action;
      try {
        if (action.modal == false && action.redirect == false && action.typeOp != 'import') {
          await this.processListBackendAction(action);
        } else if (action.modal == true) {
          console.log('-----------Process action for modal : ----' + this.viewModes);
        } else if (action.redirect == true) {
          console.log('-----------Open Error Modal : ----' + this.viewModes);
        } else if (action.typeOp == 'import') {
          this.action = action;
          this.searchFile();
        }
      } catch (error) {
        this.error = error;
        this.viewType = "error";
      }
      this.hideLoader();
    }, searchFile() {
      const filechooser = document.getElementById(this.fileInputId);
      if (filechooser != null) {
        filechooser.click()
      }
    }
  }, computed: {
    fileInputId() {
      return "fi-" + Math.floor(Math.random() * 10000);
    }, actionDialogId() { return "dlg-" + Math.floor(Math.random() * 10000); },
    parentId() { return this.parent != null ? this.parent.pk : ''; },
    isErrorMode() {
      return this.viewType == 'error';
    }, isViewMode() {
      return this.meta != null && this.viewType == 'view';
    }, isDashboardMode() {
      return this.meta != null && this.viewType == 'dashboard';
    }, showMenu() {
      return this.menus.length > 0;
    }, isPluginMode() {
      return this.plugin != null;
    }, pluginname() { return this.plugin.name; },
    pluginName() { return this.plugin != null ? this.plugin.name : null },
    actionname() { return this.meta.action; },
    resources() { return store.getters.getResources; },
    isListView() { return this.meta != null && ['list', 'kaban', 'calendar'].includes(this.viewType) }
  }, async created() {
    //this.emitter.on('plugin-select-event', await this.runPlugin);
    this.emitter.on('menu-selected-event', await this.processMenu);
    //this.emitter.on('create-new-event', await this.createAction);
    //this.emitter.on('dblclick-action', await this.setItem); 
    //this.emitter.on('update-event', await this.updateAction);
    //this.emitter.on('duplicate-event', await this.duplicateAction); 
    //this.emitter.on('delete-event', await this.deleteAction); 
    this.emitter.on('inner-error-event', this.errorhandler);

  }, async mounted() {
    store.commit('resetStack');
    let pageSize = await restService.get(corePlugin, ['settings', 'pageSize']);
    store.commit('setPageSize', pageSize);
    (await this.initApplication());
  }
})

export default class IsisHomeView extends Vue {

}
</script>
<style scoped lang="scss">
.home-container {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;

  .content-container {
    flex: 1;
  }
}

.header-border {
  color: black;
}

.content-container {
  display: flex;
  flex-flow: row nowrap;

  .menu-container {
    height: 100%;
    width: 300px;
  }

  .menu-container {
    display: flex;
    flex-flow: column nowrap;
  }

  .menu-company-logo {
    height: 85px;
    background-size: 100%;
    background-position: initial;
    background-image: url(./../assets/ff.png);
    width: 100%;
  }

  .menu-company {
    flex: 1;
    justify-content: space-between;
    display: flex;
  }

  .op-container {
    background: lightgray;
    height: 100%;
    width: 100%;

  }
}
</style>