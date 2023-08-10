<template>
  <div class="data-form-container">
    <div class="data-form-header">
      <div class="search-bar">
        <breadcrumb class="titre"></breadcrumb>     
        <n-search
            :meta="meta"
            @search-event="searchAction"></n-search>      
      </div>
    </div>    
    <div class="data-form-content">
       <n-section v-for="(section, index) in sections" :key="index"
          :section="section"
          :plugin="plugin"
          :typeOp="dashboard"></n-section>
    </div>
  </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
      meta: Object,
      plugin: Object,
    }, components: {
        Breadcrumb: defineAsyncComponent(() => import('@/components/forms/Breadcrumb.vue')),
        NSearch: defineAsyncComponent(() => import('@/components/forms/widgets/NSearch.vue')),
        NCard: defineAsyncComponent(() => import('@/components/forms/dashboard/NCard.vue')),
        NSection: defineAsyncComponent(() => import('@/components/forms/widgets/NSection.vue')),
    }, data() {
        return {
          item: {},
        }
    }, methods: {
      searchAction() {
        console.log('---------Inside Dashboard ---- ');
      }
    }, computed: {
       sections() { return this.meta != null ? this.meta.sections : [] ;}
    }, created() {
       console.log('---------------------Dashboard-----------------')
    }
})

export default class DashboardView extends Vue {
  
}
</script>
<style scoped lang="scss">

.data-form-container {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;  
      width: 100%;    
   }

   .data-form-header {
    
    border-bottom: 5px solid white ;
    height: 85px;
    padding: 5px;

    .search-bar {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      .title {
        font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        color: black;
        font-size: 25px;
      }    
   }
   .actions-bar {
       display: flex;
       flex-flow: row nowrap;
       justify-content: space-between;
       color: black;
       background: white;
    }
 }
 .data-form-content {
     display: flex;
     flex-flow: column wrap;
     flex: 1;
     width: 100%;
 }
 .titre{
  color: black
 }
</style>