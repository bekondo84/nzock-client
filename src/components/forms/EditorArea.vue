<template>
    <div>
        <n-form :form="common"
                :dialog="dialog"
                :item="item"
                :typeOp="typeOp"
                :publishers="publishers">
        </n-form>
        <n-tab-pane :tabs="tabs"
                    :item="item"
                    :dialog="dialog"
                    :typeOp="typeOp"
                    :publishers="publishers">
        </n-tab-pane>
    </div>
</template>
<script lang="ts">
import { Publishier } from '@/services/Publisher';
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';

  @Options({
    components: {
       NForm : defineAsyncComponent(() => import('@/components/forms/widgets/NForm.vue')),
       NTabPane: defineAsyncComponent(() => import('@/components/forms/widgets/NTabPane.vue')),
    }, props: {
        editorArea: Object,
        data: Object,
        dialog: String,
        item: Object,
        typeOp: String,
        publishers: Array,
    }, data: function() {
        return {

        }
    }, computed: {
        common() {
            return this.editorArea != null ? this.editorArea.form : null;
        }, tabs() {
            return this.editorArea != null ? this.editorArea.tabs : [] ;
        }
    }, created() {
        //console.log('inside EditorArea with dialog  : '+JSON.stringify(this.dialog))
    }
  })
 export default class EditorArea extends Vue {

 }
</script>
<style scoped lang="scss">
</style>