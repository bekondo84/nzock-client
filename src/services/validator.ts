
import RestService from "./restService";
import { corePlugin } from "./restService";

const restService = new RestService();

function processMandatoryRule(field: any, item: any) {
    if (field.mandatory) {
        if (field.widget=='manytoone' && item[field.fieldName]==null) {
         return new ErrorMsge(field.fieldName, field.label, 'mandatory.error.name');
        }
        if ((field.widget=='onetomany' || field.widget.includes('manytomany')) 
        && (item[field.fieldName]==null || item[field.fieldName].length <= 0)) {
           return new ErrorMsge(field.fieldName, field.label, 'mandatory.error.name');
        }
        if (['text', 'number', 'date', 'time', 'password'].includes(field.widget) && (item[field.fieldName]== null || item[field.fieldName]=="")) {
            return new ErrorMsge(field.fieldName, field.label, 'mandatory.error.name');
        }
    } 
    return null;
}

async function processUnicityRule(field: any, item: any, typeCode: string) {
   
    if (field.unique && item[field.fieldName] != null && item[field.fieldName] != "" && item.pk == null) { 
        let value =  item[field.fieldName] ;
        if (value.pk != undefined) {
            value = value.pk; 
        }
        /** 
        const response = await restService.get(corePlugin, ['core', 'exists', typeCode, field.fieldName, value], null, true)
        if (response) {
            return new ErrorMsge(field.fieldName, field.label, 'unicity.error.name');
        } */ 
    }
     return null;
}
async function validateField(field: any, item: any, typeCode: string, errors: ErrorMsge[]) {
     let error = processMandatoryRule(field, item);
     if (error != null) {
        errors.push(error);
     }
     error = await processUnicityRule(field, item, typeCode);
     if (error != null) {
        errors.push(error);
     }
}

async function validateSection(section: any, item:any, typeCode: string , errors: ErrorMsge[]) {
    for (let i=0; i < section.fields.length; i++ ) {
        await validateField(section.fields[i], item, typeCode, errors);
    }
}

async function validateForm(form: any, item: any, typeCode: string, errors :ErrorMsge[]) {
    if (form != null) {
        for (let i=0; i < form.sections.length; i++)  {
            await validateSection(form.sections[i], item, typeCode, errors);
        }
    }
}

export async function validate(meta: any, item: any) {
    const errors: ErrorMsge[] = [];
    if (meta != null && meta.editorarea != null) {
        const editorarea = meta.editorarea;
        if (editorarea.form != null) {
           await validateForm(editorarea.form, item, meta.typeCode, errors);
        }

        if (editorarea.tabs != null) {
            for (let i= 0 ; i < editorarea.tabs.length; i++) {
                const tab = editorarea.tabs[i] ;
                if (tab.form != null) {
                  await validateForm(tab.form, item, meta.typeCode,  errors);
                }
            }
        }
    }

    return errors ;
}

export default class  Validator {

}

export class ErrorMsge {
    private _name: string;
    private _label: string ;
    private _error: string

    constructor(name: string, label: string, error: string) {
        this._name = name ;
        this._label = label;
        this._error = error;
    }

    public get name() {
        return this._name;
    }
    public get label() {
        return this._label;
    }

    public get error() {
        return this._error;
    }
}