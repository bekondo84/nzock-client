<template>
  <router-view />
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RestService, { corePlugin } from '@/services/restService';
import store from './store';

const restService = new RestService();

@Options({
  methods: {
    goto(plugin: any) {
      console.log('Request to load : ------------------------' + JSON.stringify(plugin))
    }, onError(err) {
      if (err.response.status == 401) {
        this.$router.push({ name: 'login' });
      } else if (err.response.status == 500) {
        this.$router.push({ name: 'error500' });
      } else if (err.response.status == 400) {
        this.$router.push({ name: 'error400' });
      } else {
        this.$router.push({ name: 'error404' });
      }
    }
  }, async created() {
    // this.emitter.on('plugin-select-event', this.goto);
    this.emitter.on('error-event', this.onError);
  }
})

export default class App extends Vue {
}
</script>
<style lang="scss">
#app {
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  width: 100%;
  font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;

  color: #000;

  .body-container {
    flex: 1;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #fff;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #8E949A;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #07569B;
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #07569B;

    &.router-link-exact-active {
      color: #fff;
    }
  }
}</style>