<template>
    <div>
        <ul class="nav nav-tabs">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle nav-link-padding" data-bs-toggle="dropdown" href="#" role="button"
                    aria-expanded="false"><i class="fa-solid fa-filter"></i>{{ t('filters.btn.name') }}</a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item nav-link-padding" href="#">Filters</a></li>
                    <li><a class="dropdown-item nav-link-padding" href="#">Another action</a></li>
                    <li><a class="dropdown-item nav-link-padding" href="#">Something else here</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item nav-link-padding" href="#">Ajouter un filter personnalisé</a></li>
                </ul>
            </li>
            <li class="nav-item dropdown" v-if="false">
                <a class="nav-link dropdown-toggle nav-link-padding" data-bs-toggle="dropdown" href="#" role="button"
                    aria-expanded="false"><i class="fa-solid fa-layer-group"></i>{{ t('groupby.btn.name') }}</a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item nav-link-padding" href="#">Filters</a></li>
                    <li><a class="dropdown-item nav-link-padding" href="#">Another action</a></li>
                    <li><a class="dropdown-item nav-link-padding" href="#">Something else here</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item nav-link-padding" href="#">Separated link</a></li>
                </ul>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle nav-link-padding" data-bs-toggle="dropdown" href="#" role="button"
                    aria-expanded="false"><i class="fa-solid fa-star"></i>{{ t('favorite.btn.name') }}</a>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item nav-link-padding" href="#">{{ t('favorite.current.session') }}</a>
                    </li>
                    <li><a class="dropdown-item nav-link-padding" href="#">{{ t('favorite.all.session') }}</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item nav-link-padding" href="#">Separated link</a></li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RestService from '@/services/restService';
import { i18n } from '@/services/i18nService';

const restService = new RestService();

@Options({
    props: {

    }, data: function () {
        return {
            translate: null,
        }
    }, methods: {
        t(key: string) {
            if (this.translate != null) {
                return this.translate[key];
            }
            return null;
        }
    }, async created() {
        this.translate = await i18n(['create.btn.name', 'actions.btn.name', 'export.btn.name', 'delete.btn.name', 'filters.btn.name', 'groupby.btn.name', 'favorite.btn.name', 'favorite.current.session', 'favorite.all.session']);
    }
})

export default class Preference extends Vue {

}
</script>
<style scoped>.nav-link-padding {
    padding: 2px 16px 2px 16px !important;
    font-size: 16px !important;
    color: black;
    font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

}</style>