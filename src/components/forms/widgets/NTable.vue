<template>
    <n-loader :overlay="overlay"></n-loader>
    <div class="table-responsive-sm">
        <table class="table table-hover table-sm table-light">
            <thead>
                <tr class="table-header">
                    <th scope="col" v-if="selectable" class="checkbox"><input type="checkbox" class="form-check-input"
                            v-model="selectAll" @click="toggleAll"></th>
                    <th scope="col" v-for="header in headers" :key="header" @click="selectHeader(header)"
                        :class="{ 'active-th': showSorted(header) }">
                        <div class="sortable-column">
                            <div>{{ header.label }}</div>
                            <div class="sorted-status-icon" v-if="showSorted(header)"><span v-if="sort == 'desc'"><i
                                        class="fa-solid fa-chevron-down"></i></span><span v-if="sort == 'asc'"><i
                                        class="fa-solid fa-chevron-up"></i></span></div>
                        </div>
                    </th>
                    <th scope="col" v-if="configurable">
                        <div class="dropdown">
                            <button class="btn btn-sm" type="button" @click="customizeEvent">
                                <i class="fa-solid fa-shuffle"></i>
                            </button>
                        </div>
                    </th>
                </tr>
                <tr v-if="creatable">
                    <th :colspan="colspan">
                        <div>
                            <n-dialog-btn icon="fa-solid fa-circle-plus" classe="btn btn-sm link-success" :dialog="dialog"
                                :viewMode="viewMode" opType="create" :dbClick="dbClick" :readOnly="!creatable" :meta="meta"
                                :item="emptyItem" :widget="widget" @save-event="addItemAction" @dblclick-action="onDbClick"
                                @selected-items="selectItems">
                            </n-dialog-btn>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items" :key="index" @click="selectItem(item)" @dblclick="onDbClick(item)"
                    :class="{ 'table-active': isCurrent(item) }">
                    <th scope="row" v-if="selectable"><input type="checkbox" class="form-check-input"
                            v-model="item.selected" @click="toggle(item)"></th>
                    <td v-for="header in headers" :key="header">
                        <input type="checkbox" class="form-check-input" v-if="header.widget == 'checkbox'"
                            v-model="item[header.fieldName]" disabled>
                        <img :src="item[header.fieldName]" width="45" v-else-if="header.widget == 'image'">
                        <span style="font-weight: initial;" v-else>{{ getValue(item, header) }}</span>
                    </td>
                    <td v-for="action in actions" :key="action.name">
                        <a class="link link-secondary" @click="customAction(action, item)"><i :class="action.icon"></i></a>
                    </td>
                    <td v-if="updatable">
                        <n-dialog-btn icon="fa-solid fa-pen" classe="btn btn-sm link-success" :dialog="dialog"
                            :viewMode="viewMode" opType="edit" :readOnly="!updatable" :meta="meta" :item="item"
                            @save-event="addItemAction" @update-event="updateAction">
                        </n-dialog-btn>
                    </td>
                    <td v-if="removable"><a class="link link-danger" @click="deleteAction(item, index)"><i
                                class="fa-solid fa-trash"></i></a></td>
                    <td v-if="configurable"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import store from '@/store';
import RestService from '@/services/restService';
import { i18n } from '@/services/i18nService';
import { validate } from '@/services/validator';

const apiUrl = '/api/v1/'
const restService = new RestService();

@Options({
    components: {
        NDialogBtn: defineAsyncComponent(() => import('@/components/forms/widgets/NDialogBtn.vue')),
        NLoader: defineAsyncComponent(() => import('@/components/forms/widgets/NLoader.vue')),
    }, props: {
        dialog: String,
        items: Array,
        removable: Boolean,
        selectable: Boolean,
        configurable: Boolean,
        creatable: Boolean,
        updatable: Boolean,
        meta: Object,
        dbClick: Boolean,
        viewMode: String,
        actions: Array,
        typeOp: String,
        widget: String,
    }, data: function () {
        return {
            selectAll: false,
            item: null,
            headers: [],
            emptyItem: null,
            activeHeader: null,
            sort: 'desc',
            translate: null,
            overlay: false,
        }
    }, methods: {
        selectItems(items: any[]) {
            const pks = this.items.map(this.getPk);
            const values = items.filter(f => f.selected && !pks.includes(f.pk));
            if (values != null && values.length > 0) {
                this.items.push(...values);
            }
        }, getPk(item: any) {
            return item.pk;
        }, async customAction(action: any, item: any) {
            this.showLoader();
            this.errors = await validate(this.meta, item);
            if (this.errors.length <= 0) {
                let data = { data: JSON.stringify(item), typeCode: this.meta.typeCode };
                let response = await restService.post(this.plugin.name, ['actions', 'custom', 'item', action.code], data, true);
                if (action.typeOp == 'delete') {
                    const index = this.items.findIndex(it => it.pk == item.pk);
                    this.items.splice(index, 1);
                }
                //process the case of view action.viewMode='print'     
                this.hideLoader();
            } else {
                this.hideLoader();
                this.emitter.emit("show-error-toast", this.errors);
            }
        }, addItemAction(item: any) {
            this.items.unshift(item);
        }, customizeEvent() {
            this.$emit('table-header-customize-event');
        }, getValue(item: any, header: any) {
            if (header.widget == 'manytoone') {
                let searchKey = header.meta.searchKey;
                if (searchKey != null && item[header.fieldName] != null) {
                    return item[header.fieldName][searchKey];
                } else {
                    return item[header.fieldName];
                }
            } else if (header.widget == 'localized') {
                let session = store.getters.getSession;
                if (session != null && session.lang != null) {
                    if (item[header.fieldName] != null) {
                        let val = item[header.fieldName][session.lang];
                        return val != null ? val.value : null;
                    }
                }
                return null;
            } else if (header.widget == 'date' || header.widget == 'datetime-local') {
                if (item[header.fieldName] != null) {
                    const timestamp = item[header.fieldName];
                    const date = new Date(timestamp);
                    if (header.widget == 'date') {
                        return date.toLocaleDateString('en-GB');
                    } else {
                        return date.toLocaleString('en-GB');
                    }
                }
            }
            return item[header.fieldName];
        }, toggleAll() {
            if (this.items != null) {
                this.selectAll = !this.selectAll;

                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    item.selected = this.selectAll;
                }
                this.$emit('table-checkboxcolumn-select', this.items.filter(it => it.selected).length);
            }
        }, toggle(item: any) {
            item.selected = !item.selected;
            this.$emit('table-checkboxcolumn-select', this.items.filter(it => it.selected).length);
        }, selectItem(item: any) {
            this.item = item;
            this.$emit('click-action', item);
        }, addAction() {
            this.$emit('newitem-action');
        }, deleteAction(item: any, index: number) {
            this.$emit('deleteitem-action', { item: item, index: index });
        }, updateAction(item: any) {
            Object.assign(this.item, item);
        }, dbClickAction(item: any) {
            this.$emit('dblclick-action', item);
        }, onDbClick(item: any) {
            this.$emit('dblclick-action', item);
        }, refeshHeader(meta: any) {
            let columns = this.meta != null && meta.listView != null ? meta.listView.columns.filter(f => f.search == true) : [];
            this.headers.splice(0, this.headers.length);
            this.headers.push(...columns);
        }, async newItem(meta: any) {
            this.showLoader();
            let plugin = store.getters.getPlugin;
            try {
                this.emptyItem = await restService.get(plugin.name + apiUrl, ['core', 'new', meta.typeCode], null, true);
            } catch (error) {
                this.emitter.emit("inner-error-event", error);
            }
            this.hideLoader();
        }, selectHeader(header: any) {
            if (this.activeHeader == null) {
                this.activeHeader = header;
                this.sort = 'desc';
            } else if (this.activeHeader.fieldName == header.fieldName) {
                if (this.sort == 'desc') {
                    this.sort = 'asc';
                } else {
                    this.sort = 'desc';
                }
            } else {
                this.activeHeader = header;
                this.sort = 'desc';
            }
            this.$emit('sort-event', { field: header, order: this.sort })
        }, showSorted(header: any) {
            return this.activeHeader != null && this.activeHeader.fieldName == header.fieldName;
        }, isCurrent(item: any) {
            return this.item != null && this.item.pk == item.pk;
        }, t(key: string) {
            return this.translate != null ? this.translate[key] : key;
        }, showLoader() {
            this.overlay = true;
        }, hideLoader() {
            this.overlay = false;
        }

    }, computed: {
        plugin() {
            return store.getters.getPlugin;
        }, colspan() {
            let size = this.headers != null ? this.headers.length : 0;
            if (this.selectable) {
                size++
            }
            if (this.configurable) {
                size++;
            }
            return size;
        }, columns() { return this.meta != null ? this.meta.listView.columns : [] },
        canCreate() { return this.meta != null && this.meta.canCreate == true && this.meta.createOnField == true ? true : false }
    }, watch: {
        meta(newVal, oldVal) {
            this.refeshHeader(newVal);
            this.selectAll = true;
            this.toggleAll();
        }
    }, async mounted() {
        if (this.meta != null) {
            await this.refeshHeader(this.meta);
        }
    }, async created() {
        this.emitter.on("refesh-table-header", this.refeshHeader);
        this.translate = await i18n(['ajouter.btn.name', 'update.btn.name', 'remove.btn.name']);
    }, icon() { return this.sort == 'desc' ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-up" },
})
export default class NTable extends Vue {

}
</script>
<style scoped lang="scss">   

   .table-header {
       font-family: 'Trebuchet MS','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
       color: #8E949A;
       font-size: 15px;
       height: 25px;
   }

   tbody tr {
       display: table-row;

       td {
           display: table-cell;
           font-size: small;
       }
   }

   th header div {
       height: 25px !important;
   }

   .sortable-column {
       display: flex;
       flex-flow: row nowrap;
       justify-content: space-between;
   }

   .sorted-status-icon {
       text-align: center;
       font-size: x-small;
       margin-right: 9px;
   }

   th:hover,
   .active-th {
       background: #e5e6e7;
   }

   tbody tr :hover {
       cursor: pointer;
       
   }

   .row {
       font-weight: initial !important;
   }</style>