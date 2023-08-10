<template>
    <div v-if="showTab">
        <ul class="nav nav-tabs" role="tablist" id="myTab">
            <li class="nav-item" role="presentation" v-for="tab in tabs" :key="tab.name">
                <button class="nav-link" @click="selectTab(tab)" :class="{active: isActive(tab)}" :id="id(tab)" data-bs-toggle="tab" :data-bs-target="databs(tab)" type="button" role="tab" :aria-controls="tab.name" aria-selected="true">{{tab.title}}</button>
            </li>            
        </ul>
        <div class="tab-content" id="myTabContent">
            <div v-for="tab in tabs" :key="id(tab)" class="tab-pane fade show"  :class="{active: isActive(tab )}"  :id="tab.name" role="tabpanel">
               <n-form :form="tab.form"
                       :item="item"
                       :typeOp="typeOp"
                       :publishers="publishers">
               </n-form>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';


  @Options({
    components: {
       NForm : defineAsyncComponent(() => import('@/components/forms/widgets/NForm.vue')),
    },
    props: {
       tabs: Array,
       item:Object,
       dialog: String,
       plugin: Object,
       typeOp: String,
       publishers: Array,
    }, data: function() {
        return {
            activeTab: this.tabs != null ? this.tabs[0] : null
        }
    }, methods: {
       id(tab: any) {
          return tab.name.replace('.', '')+(this.dialog != null ? this.dialog:'')+'-tab'
       },databs(tab: any) {
          return '#'+tab.name.replace('.', '')+(this.dialog != null ? this.dialog:'');
       }, isActive(tab: any) {
          return this.activeTab == tab ;
       }, selectTab(tab: any) {
           this.activeTab = tab ;
       }
    }, computed : {
        showTab() {
            return this.tabs.length > 0;
        }
    }, created() {
        //console.log('Inside NTabPane component ---------------- : '+JSON.stringify(this.tabs))
    }
  })
  export default class NTabPane extends Vue {

  }
</script>
<style scoped lang="scss">
</style>