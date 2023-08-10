<template>
    <header class="barre">
      <nav class="navbar navbar-expand-lg navbar-dark  p-0  header-background-img">
          <div class="container-fluid">
            <a class="navbar-brand" data-bs-toggle="offcanvas" data-bs-target="#offcanvasApps" href="#offcanvasApps" role="button" aria-controls="offcanvasApps"><i class="fa-brands fa-windows"></i></a>
            <h1 class="titre">{{ pluginName }}</h1>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
          
            <div class=" collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav ms-auto ">                
                <li class="nav-item dropdown">
                  <a class="nav-link mx-2 dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                        <v-avatar
                          color="#07569B"
                          size="x-small"
                        >
                          <span class="" style="color: #fff;">{{ firstLetter }}</span>
                        </v-avatar><span class="connect-user">{{ connectUser }}</span>
                  </a>
                  <ul class="dropdown-menu  dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                    <li><a class="dropdown-item nav-link-padding"  @click="aboutUs()"><span class="menu-text">{{ t('aboutus.btn.name') }}</span><i class="fa-solid fa-circle-exclamation"></i></a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item nav-link-padding"  @click="changeCurrentUserPassword()"><span class="menu-text">{{ t('changepassword.btn.name') }}</span><i class="fa-solid fa-user-pen"></i></a></li>
                    <li><a class="dropdown-item nav-link-padding"  @click="lockout()"><span class="menu-text">{{ t('lockout.btn.name') }}</span><i class="fa-solid fa-power-off"></i></a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          </nav>   
          <apps-component
             @plugin-select-event="pluginSelectEventHandler"></apps-component>       
      </header>
      <!-- <div class="contenu">
<div class="block">
  <h1>BIENVENUE SUR NZOCK</h1>
<div class="fond">
</div> -->
<!-- 
</div>
      </div> -->
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import store from '@/store';
import { i18n } from '@/services/i18nService';
import { capitalizeFirstLetter, firstCapitalizeLetter } from '@/utils/utils';

@Options({
    props: {
      plugin: Object,
    }, components : {
        AppsComponent : defineAsyncComponent(() => import('@/components/navigations/Apps.vue'))
    }, data: function() {
         return {
            session : null ,
            translate: null,
         }
    }, methods: {
      lockout() {
        this.axios.defaults.headers.common['Authorization'] = null;
        store.commit('setSession', null);
        store.commit('setPlugin', null);
        store.commit('resetStack');
        console.log("before this.$router.push({name: 'login'})");
        this.$router.push({name: 'login'});
      }, t(key: string) {
          if (this.translate != null) {
            return this.translate[key];
          }
          return key;
      }, aboutUs() {
         console.log('click on about out ............');
      }, pluginSelectEventHandler(plugin: any) {
          this.$emit("plugin-select-event", plugin);
      }, changeCurrentUserPassword() {
        let action = {name:"change.password", code:"change.password", modal:true, dynamic:true, type:"changePasswordMeta"}
        this.$emit("password-change-event", action);
      }
    }, computed: {
        connectUser() { return this.session != null ? this.session.username.substring(1) : null},
        firstLetter() { return this.session != null ? firstCapitalizeLetter(this.session.username) : null},
        pluginName() {
          return capitalizeFirstLetter(this.plugin == null ? 'applications' : this.plugin.name);
        }
    }, async created() {
        this.session = store.getters.getSession ;
        this.translate =  await i18n(['lockout.btn.name', 'aboutus.btn.name', 'applications', 'changepassword.btn.name']);
    }
})
  
export default class Header extends Vue {

}
</script>
<style scoped lang="scss">
   .menu-text {
      margin: 0px 5px 0px 0px;
      font-family: 'Trebuchet MS','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;

   }
   .barre {
        background: #8E949A;
        height: 50px;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        border-bottom: 5px solid #fff;
       font-size: 20px;
        color: #fff;
   }
   .connect-user {
       font-size: 20px;
   }

  .nav-link-padding {
    //padding: 8px 2px 8px 5px!important;
    font-size: 14px !important;
    color: black;
    display: flex;
    justify-content: space-between;
  }
  .nav-link-padding:hover {
    //padding: 8px 2px 8px 5px!important;
    font-size: 14px !important;
    color: white;
    display: flex;
    justify-content: space-between;
    background: #07569B;
  }
  // .contenue{
  //   height: 100vh;
  //   width: 100%;
  //   display: none;
  //   justify-content: space-between;
  //   align-items: center;
  // }
  // .fond{
  //   background-image: url(../../assets/tete.png);
  //   width: 500px;
  //   height: 500px;
  //   background-position: initial;
  //   background-size: 100%;
  // }
  // .block{
  //   width: 100%;
  //   height: 50%;
  //   float: right;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: space-between;
  //   align-items: center;
  //   margin-top: 6%;

  // }
  .titre{
    font-size: 23px;
    margin-top: 5px;
  }
</style>