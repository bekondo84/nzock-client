<template>
  <div class="n-input">
    <label :for="id" class="form-label">{{label}}</label>
    <input type="email" class="form-control form-control-sm" :id="id">
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
    @Options({
        props: {
            id: String,
            label: String,
            data: Object,
            field: String,
            type: String,
        }
    })
   
   export default class NInput extends Vue {

   }
</script>
<style scoped lang="scss">
 .n-input {
   display: flex;
   flex-flow: row nowrap;
 }
</style>