<template>
  <div class="card isis-card">
    <v-progress-linear v-if="loading == 'false'" :indeterminate="loading"></v-progress-linear>
    <div class="isis-card-header">
      <div class="isis-card-title">{{ value }}</div>
      <div class="isis-card-title"><i class="fa-solid fa-pen-to-square"></i></div>
    </div>
    <div class="isis-card-body">{{ label }}</div>
  </div>
</template>
<script lang="ts">
import RestService from '@/services/restService';
import store from '@/store';
import { Options, Vue } from 'vue-class-component';

const restService = new RestService();

@Options({
  props: {
    item: Object,
  }, data: function () {
    return {
      card: null,
      loading: false,
    }
  }, methods: {
    async getData() {
      this.showLoader();
      let config = {
        params: {
          context: JSON.stringify({ type: "card" })
        }
      };
      try {
        let response = await restService.get(this.plugin.name, ["actions", "custom", "item", this.item.handler], config, true);
        this.card = Object.assign({}, response.data);
      } catch (error) {
        console.error(error);
      }
      this.hideLoader();

    }, showLoader() {
      this.loading = true;
    }, hideLoader() {
      this.loading = false;
    }
  }, computed: {
    plugin() { return store.getters.getPlugin; },
    value() { return this.card != null ? this.card.value : null; },
    icon() { return this.card != null ? this.card.icon : null; },
    label() { return this.card != null ? this.card.label : null; },
    color() { return this.card != null ? this.card.color : null; }
  }, async mounted() {
    await this.getData();
  }
})

export default class Card extends Vue {
  color: any;

}
</script>
<style scoped lang="scss">
.isis-card {
  width: 250px;
  height: 90px;
  color: white;
  background: #07569B;
  padding: 5px 10px;
  text-align: center;
  font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

  .isis-card-body {
    height: 35px;
    font-size: 15px;
  }
}

.isis-card-header {
  display: flex;
  height: 40px;
  justify-content: space-between;
  .isis-card-title {
    font-size: 20px;
    color: white;

  }
}

</style>