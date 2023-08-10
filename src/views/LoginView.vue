<template>
  <div class="fond">
    <div class="cadre">
      <div class="logo">
      </div>
      <v-form v-model="form" @submit.prevent="login">
        <div class="form">
          <div v-if="error != null" class="card-header error-msge">{{ translate['bad.credentials.message'] }}</div>
          <div v-else class="card-header">{{ translate['login.page.welcome'] }}</div>
          <label for="">{{ translate['login.page.username'] }}</label>
          <v-text-field v-model="username" :readonly="loading" :rules="[required]" class="mb-2" hide-details="auto"
            ></v-text-field>
          <label for="">{{ translate['login.page.password'] }}</label>
          <v-text-field v-model="password" :readonly="loading" :rules="[required]" hide-details="auto"
             :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'" @click:append="show = !show"></v-text-field>
        </div>
        <div class="footer">
          <v-btn type="submit" class="btn-connexion">{{ translate['login.page.signin'] }}</v-btn>

          <a class="pwd-forgetten" href="#">{{ translate['login.page.forgetten'] }}</a>
          <v-checkbox :label="translate['login.page.rememberme']"></v-checkbox>

        </div>
      </v-form>
    </div>
  </div>
</template>
<script>
import { Options, Vue } from 'vue-class-component';
import store from '@/store';
import { defineAsyncComponent } from 'vue';
import RestService from '@/services/restService';
import { i18n } from '@/services/i18nService';

const restService = new RestService();

@Options({
  components: {
    NLoader: defineAsyncComponent(() => import('@/components/forms/widgets/NLoader.vue')),
  }, data: function () {
    return {
      show: false,
      username: null,
      password: null,
      error: null,
      overlay: false,
      translate: [],
    }
  }, methods: {
    async login() {
      this.showLoader();
      let credentials = {
        username: this.username,
        password: this.password
      }

      try {
        await restService.login(credentials);
        this.$router.push('/');
      } catch (error) {
        this.error = error;
      }
      this.hideLoader();
    }, showLoader() {
      this.ovelay = true;
    }, hideLoader() {
      this.ovelay = false;
    }
  }, async created() {
    this.translate = await i18n(['login.page.welcome', 'login.page.password', 'login.page.username', 'login.page.rememberme', 'login.page.signin', 'login.page.forgetten', 'bad.credentials.message']);
  }
})
export default class LoginView extends Vue {

}
</script>
<style scoped lang="scss">
.fond {
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100%;
  background: #8E949A;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

}

.cadre {
  width: 450px;
  height: 550px;
  background: #fff;
  border: 2px solid #07569B;
  box-shadow: #000 10 10;
  padding: 25px;
  border-radius: 25px;
}

.logo {
  height: 100px;
  width: 100%;
  background-image: url(../assets/ff.png);
  background-size: 90%;
  background-position: center;
}

.card-header {
  color: #000;
  font-size: 15px;
  font-weight: bold;
}

label {
  display: block;
  color: #000;
  margin-top: 3%;
  margin-bottom: 1%;
}

.v-checkbox {
  color: #07569B;
  font-size: 11px;
  margin: 0;
  padding: 0;
  height: 70px;
}

.form {
  height: auto;
  widows: 100%;
  margin-bottom: 10px;
  margin-top: 10px;
}

.footer {
  width: 100%;
  height: 100px;
  margin: 0;
  padding: 0;
}

.btn-connexion {
  color: #8E949A;
  background: #fff;
  border: 2px solid #8E949A;
  height: 45px;
  width: 100%;
  border-radius: 15px;
  font-size: 25px;
  margin-bottom: 2%;
  margin-top: 3%;
}

.btn-connexion:hover {
  color: #fff;
  background: #07569B;
  border-color: #07569B;
}

.bas {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

a {
  text-decoration: none;
  color: #07569B;
  font-weight: lighter;
  font-size: 15px
}

.error-msge {
  color: #f00;
}
</style>