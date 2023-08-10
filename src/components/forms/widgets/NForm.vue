<template>
    <div>
        <n-section v-for="section in sections" :key="section.name+dialogVal" 
               :section="section"
               :dialog="dialog"
               :item="item"
               :typeOp="typeOp"
               :publishers="publishers">
        </n-section>
    </div>
</template>
<script lang="ts">
import { Publishier } from '@/services/Publisher';
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';

   @Options({
      components: {
          NSection: defineAsyncComponent(() => import('@/components/forms/widgets/NSection.vue')),
      },props: {
        form: Object,
        dialog: String,
        item: Object,
        plugin: Object,
        typeOp: String,
        publishers: Array,
      }, methods: {
          sectionkey(section: any) {
              return section.name+(this.dialog != null ? this.dialog : '');
          }
      }, computed: {
            sections() {
                return this.form != null ? this.form.sections : [] ;
            }, dialogVal() { return this.dialog != null ? this.dialog : '';}
      }, created() {
        //console.log('Inside NFORM with value : '+JSON.stringify(this.typeOp))
      }
   })

   export default class NForm extends Vue {

   }
</script>
<style scoped lang="scss">
</style>