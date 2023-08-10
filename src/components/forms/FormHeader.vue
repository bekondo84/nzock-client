<template>
  <div class="header">
    <div class="title-bar">
      <breadcrumb></breadcrumb>
      <div class="bloc" v-if="showActions">
        <div class="actions">
          <ul class="nav nav-tabs">
            <li class="nav-item dropdown" v-if="printActions.length > 0">
              <a class="nav-link dropdown-toggle nav-link-padding" data-bs-toggle="dropdown" href="#" role="button"
                aria-expanded="false"><i class="fa-solid fa-print"></i>{{ t('printer.btn.name') }}</a>
              <ul class="dropdown-menu">
                <li v-for="(action, index) in printActions" :key="index"><a class="dropdown-item nav-link-padding"
                    @click="onAction(action)"><span>{{ action.name }}</span><i :class="action.icon"></i></a></li>
              </ul>
            </li>
            <li class="nav-item dropdown" v-if="!hideactionMenu()">
              <a class="nav-link dropdown-toggle nav-link-padding" data-bs-toggle="dropdown" href="#" role="button"
                aria-expanded="false"><i class="fa-solid fa-gear"></i>{{ t('actions.btn.name') }}</a>
              <ul class="dropdown-menu">
                <li v-if="meta.canUpdate"><a class="dropdown-item nav-link-padding action-node" @click="updateAction">{{
                  t('update.btn.name') }}</a></li>
                <li v-if="meta.canCreate"><a class="dropdown-item nav-link-padding action-node"
                    @click="duplicateAction">{{ t('duplicate.btn.name') }}</a></li>
                <li v-if="meta.canDelete"><a class="dropdown-item nav-link-padding action-node" @click="deleteAction">{{
                  t('delete.btn.name') }}</a></li>
                <li v-if="actions.length > 0">
                  <hr class="dropdown-divider">
                </li>
                <li v-for="(action, index) in actions" :key="index"><a class="dropdown-item nav-link-padding action-node"
                    @click="onAction(action)"><span>{{ action.name }}</span><i :class="action.icon"></i></a></li>
              </ul>
            </li>
          </ul>
        </div>
        <Pagination viewType="view" :meta="meta" :itemsCount="itemsCount" :index="index" @next-item-event="nextAction"
          @previous-item-event="previousAction"></Pagination>
        <div v-if="meta.canCreate">
          <button type="button" class="btn" @click="createAction()">{{ t('create.btn.name')
          }}</button>
        </div>
      </div>
    </div>
    <div class="state-bar">
      <div>
        <button type="button" v-if="hasPrevious" class="link btn-sm link-secondary v" @click="leave()"><i
            class="fa-solid fa-reply-all"></i></button>
        <button v-if="showSaveBtn" type="button" class="btn" @click="save()">{{
          t('save.btn.name') }}</button>
      </div>
      <workflow v-if="showWorkflow" :item="item" :meta="meta" @action-event="onAction"></workflow>
    </div>
    <confirm ref="confirm"></confirm>
  </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { i18n } from '@/services/i18nService';
import store from '@/store';

@Options({
  props: {
    typeOp: String,
    meta: Object,
    viewType: String,
    itemsCount: Number,
    index: Number,
  }, components: {
    Pagination: defineAsyncComponent(() => import('./Pagination.vue')),
    Breadcrumb: defineAsyncComponent(() => import('./Breadcrumb.vue')),
    Workflow: defineAsyncComponent(() => import('./widgets/NWorkflow.vue')),
    Confirm: defineAsyncComponent(() => import('@/components/dialog/ConfirmDlgComponent.vue')),
  }, data: function () {
    return {
      hideActions: false,
      translate: null,
    }
  }, methods: {
    leave() {
      this.$emit("back-event");
    }, save() {
      this.emitter.emit("save-event");
    }, async updateAction() {
      this.$emit("update-event");
    }, duplicateAction() {
      this.$emit("duplicate-event");
    }, deleteAction() {
      let answer = confirm("Voulez vous continuer ?");
      if (answer) {
        this.$emit("delete-event");
      }
    }, createAction() {
      this.$emit("create-new-event");
    }, async onAction(action: any) {
      if (this.showConfirmModal(action)) {
        let answer = confirm("Voulez vous continuer ?");
        if (answer) {
          this.$emit("action-event", action);
        }
      } else {
        this.$emit("action-event", action);
      }
    }, t(key: string) {
      if (this.translate != null) {
        return this.translate[key];
      }
      return null;
    }, nextAction(pagination: any) {
      this.$emit("next-event", pagination);
    }, previousAction(pagination: any) {
      this.$emit("previous-event", pagination);
    }, hideactionMenu() {
      if (this.meta == null) return true;
      if (this.meta.canCreate == true || this.meta.canDelete == true
        || this.meta.canUpdate == true || this.actions.length > 0) {
        return false;
      }
      return true;
    }, showConfirmModal(action: any) {
      return action.redirect == false && action.modal == false;
    }
  }, computed: {
    showActions() {
      return this.typeOp != 'create';
    }, showSaveBtn() {
      return this.typeOp == 'create' || this.typeOp == 'edit';
    }, actions() {
      return this.meta != null && this.meta.editorarea != null && this.meta.editorarea.actions != null ? this.meta.editorarea.actions.filter(a => a.position == 'actions' && a.typeOp != 'print') : [];
    }, showWorkflow() {
      if (this.typeOp == 'create' || this.typeOp == 'edit') {
        return false;
      }
      let actions = this.meta != null && this.meta.editorarea != null && this.meta.editorarea.actions != null ? this.meta.editorarea.actions.filter(a => a.position == 'workflow') : [];
      return actions.length > 0;
    }, printActions() {
      return this.meta != null && this.meta.editorarea != null && this.meta.editorarea.actions != null ? this.meta.editorarea.actions.filter(a => a.typeOp == 'print' && a.position != 'workflow') : [];
    }, hasPrevious() {
      return store.getters.getStackSize > 1;
    }
  }, async created() {
    this.translate = await i18n(['create.btn.name', 'save.btn.name', 'actions.btn.name', 'printer.btn.name', 'update.btn.name', 'duplicate.btn.name', 'delete.btn.name'])
  }
})
export default class FormHeader extends Vue {

}
</script>
<style scoped lang="scss">
.header {
  height: 85px;
  display: flex;
  flex-flow: column nowrap;
  color: black;
  font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;
  border-bottom: 5px solid #Fff;
  background: lightgray;
  padding: 5px;

  .title-bar {
    display: flex;
    flex-flow: row nowrap;
    color: black;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;

    .bloc {
      display: flex;
      flex-flow: row nowrap;
      font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;

      .actions {
        margin: 0px 5px 5px 0px;
        background: white;
      }
    }
  }

  .state-bar {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    height: 30px; 
    align-items: center;
    text-align: center;
  }
}

.nav-link-padding {
  padding: 2px 15px 2px 15px !important;
  font-size: 14px !important;
  font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;
  color: black;
  background: white;
  height: 100%;
}

.nav-link-padding:hover {
  cursor: pointer;
  background: #07569B;
  border-color: #07569B;
  color: white;
}

.action-node {
  display: flex;
  justify-content: space-between;
  color: black;
}

.btn {
  background: #Fff;
  border: 1px solid black;
  color: black;
  font-size: 14px;
  font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-align: center;
  height: 30px;
  padding: 2px 5px;
}

.btn:hover {
  color: #Fff;
  background: #07569B;
  border-color: #07569B;
}

.fa-reply-all {
  text-align: center;
  align-items: center;
  color: black;
  padding: 3px;
  font-size: 15px;
}
</style>