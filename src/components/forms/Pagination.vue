<template>
    <div v-if="show" class="pagination-bar">
        <button type="button" class="btn btn-sm" @click="previous()"><i class="fa-solid fa-chevron-left"></i></button>
        <div v-if="viewType == 'list'">{{ first }}-{{ last }} / {{ itemsCount }}</div>
        <div v-if="viewType == 'view'">{{ index }} / {{ itemsCount }}</div>
        <button type="button" class="btn btn-sm" @click="next()"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
</template>
<script lang="ts">
import RestService, { corePlugin } from '@/services/restService';
import store from '@/store';
import { Options, Vue } from 'vue-class-component';

const restService = new RestService();

@Options({
    props: {
        meta: Object,
        viewType: String,
        itemsCount: Number,
        index: Number,
    }, data: function () {
        return {
            pageSize: null,
            currentPage: 0,
        }
    }, methods: {
        next() {
            let range = this.currentPage * this.pageSize + this.pageSize;
            if (range < this.itemsCount && this.viewType == 'list') {
                this.currentPage += 1;
                this.$emit("next-event", { pageSize: this.pageSize, itemsCount: this.itemsCount, viewType: this.viewType, page: this.currentPage });
            }
            if (this.viewType == 'view') {
                if (this.index < this.itemsCount) {
                    this.$emit("next-item-event", { pageSize: this.pageSize, itemsCount: this.itemsCount, viewType: this.viewType, page: this.index });
                }
            }
        }, previous() {
            if (this.currentPage > 0 && this.viewType == 'list') {
                this.currentPage -= 1;
                this.$emit("previous-event", { pageSize: this.pageSize, itemsCount: this.itemsCount, viewType: this.viewType, page: this.currentPage });
            }
            if (this.viewType == 'view') {
                if (this.index > 1) {
                    this.$emit("previous-item-event", { pageSize: this.pageSize, itemsCount: this.itemsCount, viewType: this.viewType, page: this.index });
                }
            }
        }
    }, computed: {
        show() {
            if (this.itemsCount == null || this.pageSize == null) {
                return false;
            } else if ((this.viewType == 'list') && (this.itemsCount <= this.pageSize)) {
                return false;
            }
            return true;
        }, first() { return this.currentPage * this.pageSize + 1 },
        last() {
            let value = this.pageSize * this.currentPage + this.pageSize;
            if (value > this.itemsCount) {
                return this.itemsCount;
            }
            return value;
        }
    }, watch: {
        viewType() {
            console.log('Create pagination w' + this.viewType)
        }, meta(newMeta: any) {
            this.currentPage = 1;
        }
    }, async created() {
        this.pageSize = store.getters.getPageSize;
    }
})

export default class Pagination extends Vue {

}
</script>
<style scoped lang="scss">
.pagination-bar {
    display: flex;
    flex-flow: row nowrap;
    font-size: 15px;
    margin-left: 5px;
    margin-right: 5px;
    color: black;
    height: 30px;
    align-items: center;
    justify-content: center;
    font-family: 'Trebuchet MS', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

}
</style>