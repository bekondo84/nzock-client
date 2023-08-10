<template>
    <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasApps"
        aria-labelledby="offcanvasAppsLabel">
        <div class="offcanvas-header apps-offcanvas-header-img">
            <h5 class="offcanvas-title" id="offcanvasAppsLabel">Applications</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body apps-container">
            <div class="apps-search">
                <v-text-field variant="underlined">
                </v-text-field>
                <button type="button" class="btn btn-sm search-btn-logo" @click="searchAction" disabled><i
                        class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div class="apps-plugins">
                <Plugin-component v-for="plugin in plugins" :key="plugin.name" :plugin="plugin"
                    @plugin-select-event="onPluginSelect"></Plugin-component>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Offcanvas } from 'bootstrap';
import RestService from '@/services/restService';
import { corePlugin } from '@/services/restService';


const restService = new RestService();

@Options({
    components: {
        PluginComponent: defineAsyncComponent(() => import('@/components/Plugin.vue'))
    }, data: function () {
        return {
            plugins: []
        }
    }, methods: {
        onPluginSelect(plugin: any) {
            var offcanvas = document.getElementById("offcanvasApps");
            console.log('onncanva elt : ' + offcanvas);
            // var bsOffcanvas = new Offcanvas(offcanvas);
            // bsOffcanvas.hide();
            this.$emit("plugin-select-event", plugin);
        }
    }, async created() {
        let values = await restService.get(corePlugin, ['module', 'user-modules']);
        if (values != null) {
            this.plugins.splice(0, this.plugins.length);
            this.plugins.push(...values)
        }
        if (values.length == 1) {
            this.onPluginSelect(values[0]);
        }
        //this.emitter.on('plugin-select-event', this.onPluginSelect);     
        //   
    }
})

export default class Apps extends Vue {

}

</script>
<style scoped lang="scss">
.apps-container {
    background: #07569B;
    font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;

}

.apps-plugins {
    flex: 1;
    display: flex;
    flex-flow: row wrap;

}

.apps-search {
    display: flex;
    flex-flow: row nowrap;
    margin: -15px 15px 10px 0px;
}

.apps-search-btn-logo {
    background-size: cover;
    background-position: center;
    background-image: url(./../../assets/search.png);
    width: 24px;
    height: 26px;
    margin-left: 2px;
}

.apps-search label {
    font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

}

div.apps-search input {
    width: 100%;
    border: outset;
}

.apps-offcanvas-header-img {
    background: #8E949A;
    border-bottom: 5px solid #fff;
    height: 50px;
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

.search-btn-logo {
    margin-left: 2px 0px 2px 0px;
    font-size: 14px;
    border: none;
}</style>