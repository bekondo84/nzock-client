<template>
   <div>
      <ul class="nav nav-tabs">
         <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle nav-link-padding" data-bs-toggle="dropdown" href="#" role="button"
               aria-expanded="false"><i class="fa-solid fa-gear"></i>{{ t('actions.btn.name') }}</a>
            <ul class="dropdown-menu">
               <li><a class="dropdown-item nav-link-padding action-node" @click="exportAction()"><span>{{
                  t('export.btn.name') }}</span><i class="fa-solid fa-download"></i></a></li>
               <li v-if="meta.canDelete"><a class="dropdown-item nav-link-padding action-node"
                     @click="deleteAction()"><span>{{ t('delete.btn.name') }}</span><i class="fa-solid fa-trash"></i></a>
               </li>
               <li v-if="actions.length > 0">
                  <hr class="dropdown-divider">
               </li>
               <li v-for="(action, index) in actions" :key="index"><a class="dropdown-item nav-link-padding action-node"
                     @click="onAction(action)"><span>{{ action.name }}</span><i :class="action.icon"></i></a></li>
            </ul>
         </li>
      </ul>
   </div>
</template>
<script lang="ts">
import { i18n } from '@/services/i18nService';
import { Options, Vue } from 'vue-class-component';


@Options({
   props: {
      meta: Object,
      translate: Array
   }, data: function () {
      return {

      }
   }, methods: {
      onAction(action: any) {
         this.$emit("action-event", action);
      }, exportAction() {
         this.$emit("export-event");
      }, deleteAction() {
         this.$emit("delete-event");
      }, t(key: string) {
         if (this.translate != null) {
            return this.translate[key];
         }
         return null;
      }
   }, computed: {
      actions() {
         return this.meta != null && this.meta.listView != null ? this.meta.listView.actions : [];
      }
   }
})
export default class Actions extends Vue {

}
</script>
<style scoped lang="scss">
.btn-padding {
   padding: 4px 3px 4px 0px;
}

.actions-bar {
   display: flex;
   flex-flow: row nowrap;
   justify-content: space-between;
   margin-top: -20px;
}

.nav-link-padding {
   padding: 2px 15px 2px 15px !important;
   font-size: 14px !important;
   font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;
   color: black;
   background: white;
   height: 100%;
}

.action-node {
   display: flex;
   justify-content: space-between;

}

.nav-link-padding:hover {
   cursor: pointer;
   background: #07569B;
   border-color: #07569B;
   color: white;
}

.fa-gear {
   margin-right: 5px;
}
</style>