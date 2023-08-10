<template>
  <div class="margin-top-20px">
    <div class="section-title" v-if="section.header">{{ section.title }}</div>
   <v-container v-if="isReady">
      <v-row>
        <v-col v-for="section in sections" :key="section.name"
          sm="true"
          align-self="start"
          offset-sm="12"
          cols="12"
          :md="md">
           <n-sub-section 
               :section="section"
               :dialog="dialog"
               :item="item"
               :typeOp="typeOp"
               :publishers="publishers"></n-sub-section>
        </v-col>
        <v-col v-for="field in fields" :key="field.name"
          sm="true"
          align-self="start"
          offset-sm="12"
          cols="12"
          :md="md"
        >
          <n-file-input v-if="isFileInput(field)"
            variant="underlined"
            chips
            multiple
            :readOnly="markReadOnly(field)"
            :field="field"
            :item="item"
          ></n-file-input>
          <v-text-field  v-if="isTextField(field)"
             variant="underlined"
            :label="field.label"
            :id="field.name"   
            :type="field.widget" 
            v-model="item[field.fieldName]"    
            :readonly="markReadOnly(field)"   
            required
          ></v-text-field>   
          <v-select  v-if="isSelect(field)"
            variant="underlined"
            v-model="item[field.fieldName]"
            :readonly="markReadOnly"   
            :label="field.label"
            item-title="name"
            item-value="code"
            :items="field.values"
          ></v-select>
          <v-switch v-if="isSwitch(field)"
              :label="field.label"
              :readonly="markReadOnly(field)"   
              hide-details
              v-model="item[field.fieldName]"
            ></v-switch>
            <v-textarea v-if="isTextArea(field)"
              variant="underlined"
              :readonly="markReadOnly(field)"   
              :autocomplete="field.name"
              :label="field.label"
              v-model="item[field.fieldName]"
              auto-grow
            ></v-textarea>
            <v-checkbox v-if="isCheckBox(field)"
              :label="field.label"
              :readonly="markReadOnly(field)"
              v-model="item[field.fieldName]"
              hide-details
          ></v-checkbox>
          <n-media v-if="isMedia(field)"
              :width="110"
              :field="field"
              :readOnly="markReadOnly(field)"
              :item="item"></n-media>
          <n-image v-if="isImage(field)"
              :width="110"
              :field="field"
              :readOnly="markReadOnly(field)"
              :item="item"></n-image>
          <n-one-to-many v-if="isOneToMany(field)"
              :field="field"
              :item="item"
              :typeOp="typeOp"   
              :dialog="dialog">
          </n-one-to-many>
          <n-many-to-one v-if="isManyToOne(field)"
              :field="field"
              :meta="field.meta"
              :typeOp="typeOp"
              :item="item"
              :publishers="publishers">
          </n-many-to-one>
          <n-many-to-many v-if="isManyToMany(field)"
              :field="field"
              :meta="field.meta"
              :typeOp="typeOp"
              :disabled="markReadOnly(field)"
              :item="item">
          </n-many-to-many>
          <n-many-to-many-list v-if="isManyToManyList(field)"
              :field="field"
              :meta="field.meta"
              :typeOp="typeOp"
              :item="item">
          </n-many-to-many-list>
          <n-localized-text-field v-if="isLocalizedTextField(field)"
              :field="field"
              :item="item"
              :readOnly="markReadOnly(field)">
          </n-localized-text-field>
          <n-localized-text-area v-if="isLocalizedTextArea(field)"
              :field="field"
              :item="item"
              :readOnly="markReadOnly(field)">
          </n-localized-text-area>
          <n-localized-editor v-if="isLocalizedEditorField(field)"
              :field="field"
              :item="item"
              :readOnly="markReadOnly(field)">
          </n-localized-editor>
          <n-editor v-if="isEditor(field)"
              :field="field"
              :item="item"
              :readOnly="markReadOnly(field)">            
          </n-editor>
          <n-card v-if="isCard(field)"
            :item="field"></n-card>
          <n-pie  v-if="isPie(field)"
             :item="field"></n-pie>
          <n-doughnut  v-if="isDoughnut(field)"
             :item="field"></n-doughnut>
          <n-line v-if="isLine(field)"
             :item="field"></n-line>
          <n-bar v-if="isBar(field)"
             :item="field"></n-bar>
        </v-col> 
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import { getPublisher, Publishier } from '@/services/Publisher';
import { defineAsyncComponent } from 'vue';
import {Options, Vue } from 'vue-class-component';

 @Options({
        components: {
          NOneToMany: defineAsyncComponent(() => import('@/components/forms/widgets/NOneToMany.vue')),
          NManyToOne: defineAsyncComponent(() => import('@/components/forms/widgets/NManyToOne.vue')),
          NManyToMany: defineAsyncComponent(() => import('@/components/forms/widgets/NManyToMany.vue')),
          NManyToManyList: defineAsyncComponent(() => import('@/components/forms/widgets/NManyToManyList.vue')),
          NLocalizedTextField: defineAsyncComponent(() => import('@/components/forms/widgets/NLocalizedTextField.vue')),
          NLocalizedTextArea: defineAsyncComponent(() => import('@/components/forms/widgets/NLocalizedTextArea.vue')),
          NLocalizedEditor: defineAsyncComponent(() =>import('@/components/forms/widgets/NLocalizedEditor.vue')),
          NMedia: defineAsyncComponent(() => import('@/components/forms/widgets/NMedia.vue')),
          NImage: defineAsyncComponent(() => import('@/components/forms/widgets/NImage.vue')),
          NEditor: defineAsyncComponent(() => import('@/components/forms/widgets/NEditor.vue')),
          NSubSection: defineAsyncComponent(() => import('@/components/forms/widgets/NSubSection.vue')),
          NCard: defineAsyncComponent(() => import('@/components/forms/dashboard/NCard.vue')),
          NPie: defineAsyncComponent(() => import('@/components/forms/dashboard/NPie.vue')),
          NDoughnut: defineAsyncComponent(() => import('@/components/forms/dashboard/NDoughnut.vue')),
          NLine: defineAsyncComponent(() => import('@/components/forms/dashboard/NLine.vue')),
          NBar: defineAsyncComponent(() => import('@/components/forms/dashboard/NBar.vue')),
          NFileInput: defineAsyncComponent(() => import('@/components/forms/widgets/NFileInput.vue')),
        }, props: {
          section: Object,
          dialog: String,
          item: Object,
          plugin: Object,
          typeOp: String,
          publishers: Array,
        }, data: function() {
            return {
               message: null,
               firstname: null,
               lastname : null,
               email : null
            }
        }, computed: {
            fields() { return this.section != null ? this.section.fields : []},
            sections() { return  this.section != null ? this.section.sections : [] ; },
            md() {
              var col = 2 ;
              if (this.section.columns) {
                col = this.section.columns;
              }
              return 12 / col ;
            }, isReady() {
               return this.item != null || this.typeOp != 'dashboard';
            }, hasFields() {
                return this.fields.length > 0 ;
            }, hasSections() {
              return this.sections.length > 0 ;
            }
        }, methods: {
            md2(section: any) {
              var col = 2 ;
              if (section.columns) {
                col = section.columns;
              }
              //console.log('md2 value :::: '+col+' ::: '+(12/col));
              return 12 / col ;
            }, getPublisher(field: any) {
               return getPublisher(field, this.publishers);
            },
            isMedia(field: any) {
              return this.item != null && field.widget == 'media';
            },isImage(field: any) {
              return this.item != null && field.widget == 'image';
            }, isFileInput(field: any) {
                return field.widget=='file'
            }, isTextField(field: any) {
               return this.item != null && (field.widget=='text' || field.widget=='time'
                    || field.widget=='number' || field.widget=='date' || field.widget == 'password' || field.widget=='datetime-local') ;
            }, isSelect(field: any) {
              return this.item != null && (field.widget == 'select' || field.widget == 'combobox');
            }, isCheckBox(field: any) {
              return this.item != null && field.widget == 'checkbox';
            }, isSwitch(field: any) {
              return this.item != null && field.widget == 'switch';
            }, isTextArea(field: any) {
              return this.item != null && field.widget == 'textarea';
            }, isOneToMany(field: any) {
              return this.item != null && field.widget == 'onetomany';
            }, isManyToOne(field: any) {
              return this.item != null && field.widget == 'manytoone';
            }, isManyToMany(field: any) {
              return this.item != null && field.widget == 'manytomany';
            }, isManyToManyList(field: any) {
              return this.item != null && field.widget == 'manytomanylist'
            },isLocalizedTextField(field : any) {
              return this.item != null && field.widget == 'localized'
            },isLocalizedEditorField(field : any) {
              return this.item != null && field.widget == 'localized-editor'
            },isLocalizedTextArea(field : any) {
              return this.item != null && field.widget == 'localized-area'
            },isEditor(field: any) {
              return this.item != null && (field.widget == 'editor' || field.widget == 'texteditor');
            },isCard(field: any) {
              return field.widget == 'card';
            }, isPie(field: any) {
              return field.widget == 'pie';
            }, isDoughnut(field : any) {
              return field.widget == 'doughnut';
            }, isLine(field: any) {
              return field.widget == 'line';
            },isBar(field: any) {
              return field.widget == 'bar';
            }
            , markReadOnly(field: any) {
              if (field.meta != null && field.meta.createOnField==false){
                return true;
              }
              if (this.typeOp =='view') {
                  return true;
               }
               if (this.typeOp=='create' && !field.editable) {
                  return true;
               }
               if (this.typeOp=='edit' && !field.updatable) {
                 return true ;
               }
               return false ;
            }
        }
  })  
  export default class NSection extends Vue {

  }
</script>
<style scoped lang="scss">
   .align-self-start {
     margin-top: -20px !important;
     padding: 6px 12px 0px 20px !important;
     align-self: flex-start!important;
   }
   .margin-top-20px {
     margin-top: 20px;
     width: 100%;
   }
   .section-title {
      font-family: 'Trebuchet MS','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      color: black;
      margin: 5px 5px 5px 25px;
      text-align: justify;
   }
   .v-textarea {
    text-align: justify;
   }
</style>