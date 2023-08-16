<template>
    <div class="card" @dblclick="onClickEvent">
        <div class= "body" :id="id"></div>
    </div>   
  </template>
<script lang="ts">
import NDomParser from '@/services/domParse';
import { Options, Vue } from 'vue-class-component';

const domParser = new NDomParser();

  @Options({
    props: {
      content: String,
      item: Object,
    }, methods: {
        renderContent() {
            if (this.content != null && this.item != null) {
              domParser.parseFromString(this.content, this.id, this.item, null);
            }
        }, onClickEvent() {
            this.$emit('click-event', this.item);
        }
    }, computed: {
        id() { return 'kbn'+Math.floor(Math.random() * 10000); }, 
    }, watch: {
        content() {
            this.renderContent();
        }
    }, mounted() {
        this.renderContent();
    }/*, render() {
        return h("div", {class:["card", "kaban-item"], style: {width: "15rem"} }, 
        [
            h("div", {class: "card-body"}, [

            ])
        ])
    }*/
  })

  export default class NKaban extends Vue {

  }
</script>
<style lang="scss">
  .card {
    width: 200px; 
    padding: 5px;
    height: 80px; 
    font-size: 15px; 
    margin-left: 5px;
    
  }
  div .card :hover {
    cursor: pointer;
  }
</style>