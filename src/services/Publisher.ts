import RestService from "./restService";


const restService = new RestService();


export function getPublisher(field: any, publishers: any[]) {
       if (publishers != null) {
            const result = publishers.find(p => p._name == field.fieldName);
            return result;
       }
       return null;
}

export function buildPublishers(meta: any, data: any) {
      const result = new Array<Publishier>();
      if (meta == null || data == null || meta.editorarea == null) {
          return result;
      }
      const editorarea = meta.editorarea;
      buildPublishersForm(editorarea.form, meta, data, result);
      if (editorarea.tabs != null) {
          editorarea.tabs.forEach(function(tab) {
             buildPublishersForm(tab.form, meta, data, result);
          })
      }
      return result;
}

function buildPublishersForm(form : any, meta: any, data: any, result: Publishier[]) {
    if (form != null) {
            form.sections.forEach(function(section){
             section.fields.forEach(function(field) {
                 const publisher = buildPublisherForField(field, meta, data);
                 if (publisher != null) {
                    result.push(publisher);
                 }
             }) 
        })
    }
}

 function buildPublisherForField(field: any, meta: any, data: any) {
    if(field.observable == true) {
        const publisher = new Publishier(field.fieldName, meta.action, data);
        if (meta == null || meta.editorarea == null) {
            return null ;
        }
        const form = meta.editorarea.form;
        subscriberForForm(form, field, publisher);
        const tabs = meta.editorarea.tabs;
        if (tabs != null) {
            tabs.forEach(function(tab) {
                const form = tab.form ;
                subscriberForForm(form, field, publisher);
            })
        }   
        return Object.assign({}, publisher);    
    }
    return null ;
}

function subscriberForForm(form: any, field: any, publisher: Publishier) {
    if (form != null && form.sections != null) {
        form.sections.forEach(function(section){
            section.fields.forEach(function(f) {
                if (field.fieldName == f.observe){
                    publisher.add(new Subscriber(f, f.handler));
                 }
            });
        });
    }
}

export  class Publishier {
    private _subscribers : Subscriber[];
    private _name : string ;
    private _action: string ;
    private _data : any ;


    constructor(name: string, action: string, data: any) {
        this._subscribers = [];
        this._name = name;
        this._data = data ;
        this._action = action;
    }

    public get subscribers() {
          return this._subscribers;
    }

    public get name () {
       return this._name ;
    }

    public add(sub : Subscriber) {
        this._subscribers.push(sub);
    }

    public remove(sub: Subscriber) {
        const index = this._subscribers.findIndex(s => s.name == sub.name);
        if (index >=0 && index < this._subscribers.length) {
            this._subscribers.splice(index, 1);
        }
    }

    public async notifyAll(context : string) {
       
        for (let i = 0; i < this._subscribers.length; i++) {
            console.log("Notification of subscriber : "+this._subscribers[i].name);
        }
    }
}

export class Subscriber {
     private _name: string ;
     private _handler: string ;
     private _field: any;

     constructor(field: any, handler: string) {
        this._handler = handler;
        this._name = field.fieldName ;
        this._field = field;
     }

     public get name() {
        return this._name ;
     }

     public get handler() {
        return this._handler;
     }

     public get field() {
        return this._field ;
     }
}

