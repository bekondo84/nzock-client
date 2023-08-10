<template>
  <v-overlay :model-value="overlay" class="align-center justify-center">
    <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

  @Options({
     props: {
        overlay: Boolean,
     }
  })
  
  export default class NLoader extends Vue {

  }
</script>
<style scoped lang="scss">
</style>