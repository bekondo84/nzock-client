<template>
    <div class="state-bar">
        <div class="btn-group">
            <a v-for="act in actions" :key="act.name" @click="onAction(act)" class="btn" aria-current="page"> <span
                    v-if="act.name != null">{{ act.name }}</span><i v-if="act.icon != null" :class="act.icon"></i></a>
        </div>
        <div v-if="false">
            <ul class="pagination">
                <li class="page-item"><span class="page-link state-padding">Brouillon</span></li>
                <li class="page-item"><span class="page-link state"></span></li>
                <li class="page-item"><span class="page-link state-padding state-bg-color">Comptabilisé</span></li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        meta: Object,
        item: Object,
    }, data: function () {
        return {

        }
    }, methods: {
        onAction(action: any) {
            this.$emit("action-event", action);
        }
    }, computed: {
        actions() {
            let editorarea = this.meta != null ? this.meta.editorarea : null;
            let actions = editorarea != null && editorarea.actions != null ? editorarea.actions : [];
            return actions.filter(a => a.position == 'workflow');
        }
    }
})

export default class NWorkflow extends Vue {

}
</script>
<style lang="scss" scoped>
.state-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    flex: 1;
    width: 200px;
    align-items: center;
}

.state-bg-color {
    background-color: rgb(57, 8, 8);
    border: 0px;
    height: 33px;
}

.state-padding {
    padding: 0px 0px 6px 2px;
    font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;
    color: black;
}

.link-state {
    padding: 2px 16px 2px 16px !important;
    //font-size: 14px !important;
    font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif !important;
    color: rgb(17, 102, 17) !important;
}

.state {
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 15px solid white;
    background-color: rgb(57, 8, 8);
    padding: 0px 0px 3px 2px;
}

.btn {
    background: #Fff;
    border: 1px solid black;
    color: black;
    font-size: 13px;
    font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    text-align: center;
    padding: 2px 1px;
    margin-bottom: 10px;
    width: 90px;
    justify-content: space-between;
}

.btn:hover {
    color: #Fff;
    background: #07569B;
    border-color: #07569B;
}

.btn-group {
    width: 180px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
}

span{
    margin-right: 5px;
}</style>