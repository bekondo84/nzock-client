<template>
    <div class="followers">
        <div class="tool-bar">
            <div >
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link nav-link-padding active" aria-current="page" href="#">Envoyer un message</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link nav-link-padding" href="#">Enregistrer un note</a>
                    </li>               
                </ul>
            </div>
            <div>Followers bloc</div>
       </div>
        <div>Historique</div>
    </div>
    
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

   @Options({
        methods: {
            
        }
   })
   
   export default class Followers extends Vue {

   }
</script>
<style scoped lang="scss">
.followers {
    display: flex;
    flex-flow: column nowrap;
    background: red;
    .tool-bar {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    .nav-link-padding {
        padding: 2px 16px 2px 16px!important;
        //font-size: 14px !important;
        font-family: 'Trebuchet MS','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;
       color: black;
    }
    
}
</style>