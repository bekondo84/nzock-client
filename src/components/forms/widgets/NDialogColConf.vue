<template>
   <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
             <div class="modal-body">
                <ul class="list-group">
                    <li v-for="col in columns" :key="col.fieldname" class="list-group-item" style="display: flex;"><input type="checkbox" class="input-margin" v-model="col.search">{{ col.label }}</li>                   
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i></button>
                <button type="button" class="btn btn-sm btn-success" @click="setColConfig"><i class="fa-solid fa-check"></i></button>
            </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Modal } from "bootstrap";


 @Options({
    props: {
      id: Number,
      meta: Object,
    }, data: function() {
        return {
            setColConfig() {
                var modal = Modal.getInstance(document.getElementById(this.id))
                modal.hide();
               this.emitter.emit("refesh-table-header", this.meta)
            }
        }
    }, methods: {
        
    }, computed: {         
        bsTarget() { return '#'.concat(this.id);},
        bsToggle() { return this.dialog == null ? 'modal' : '#'.concat(this.dialog)},
        columns() { return this.meta != null ? this.meta.listView.columns : []; }
    }
 })
 export default class NDialogColConf extends Vue {

 }
</script>
<style scoped lang="scss">
  .input-margin {
     margin: 0px 10px 0px 3px;
  }
</style>