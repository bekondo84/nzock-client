<template>
  <v-alert
        :density="density"
        :type="type"
        :text="text"
    ></v-alert>
</template>
<script lang="ts">
import { text } from '@fortawesome/fontawesome-svg-core';
import { Options, Vue } from 'vue-class-component';

    @Options({
        props: {
            density: String,
            type: String,
            text: String
       }, 
       data: function() {
           return {

           }
       }, methods: {

       }, computed: {

       }
    })
    export default class NAlert extends Vue {

    }
</script>
<style scoped>
</style>