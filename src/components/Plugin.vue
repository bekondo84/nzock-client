<template>
    <div class="apps-item" @click="goto(plugin)">
        <div class="card apps-card">
        </div>
        <div>{{ plugin.name }}</div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        plugin: Object
    }, methods: {
        goto(plugin: any) {
            //this.emitter.emit('plugin-select-event', this.plugin);
            this.$emit("plugin-select-event", this.plugin)
        }
    }
})
export default class Plugin extends Vue {

}
</script>
<style scoped lang="scss">
.apps-item {
    display: block;
    font-size: 17px;
    margin: 8px;
    text-align: center;
}

.apps-card {
    height: 4rem;
    width: 6rem;
    background-image: url(../assets/tete.png);
    background-position: center;
    background-size: contain;
}

.apps-item:hover {
    cursor: pointer;
}
</style>