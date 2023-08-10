<template>
  <div class="kaban-view">
      <n-kaban v-for="item in items" :key="item.pk"
       :content="content"
       :item="item"
       @click-event="clickEventHandler"></n-kaban>
  </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';

  @Options({
    props: {
       meta: Object,
       items: Array,
    }, components: {
       NKaban: defineAsyncComponent(() =>import('@/components/forms/widgets/NKaban.vue')),
     }, data: function() {
        return {
          content : null
        }
     }, methods: {
        clickEventHandler(item: any) {
          this.$emit('click-event', item);
        }
     }, watch: {
        meta() {
          this.content = this.meta.kabanView.template;
        }
     }, mounted() {
         if (this.meta != null && this.meta.kabanView != null) {
            this.content = this.meta.kabanView.template;
         }
     }
  })
  
  export default class KabanView extends Vue {

  }
</script>
<style scoped lang="scss">
  .kaban-view {
    display: flex;
    flex-flow: row wrap;
    margin: 10px;    
  }
</style>