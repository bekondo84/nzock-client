import store from "@/store";
import { config } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import { emitter } from "./emitter";

const loginUrl = baseUrl()+"/backoffice/api/v1/public/authenticate";
const apiUrl="/api/v1/";
const FILE_URL_UPLOADER="/api/v1/resources/upload"
const MULTIFILE_URL_UPLOADER="/api/v1/resources/upload/files"
const FILE_DOWNLOAD_URL="/api/v1/resources/download/"
export const corePlugin= "backoffice";

export function baseUrl() {
    const BASE_URL = window.location.origin ;
    //console.log('----BASE-URL : '+BASE_URL.replace('/nzock', ''));
    return BASE_URL.replace('/nzock', '');
}

export function urlBuilder(plugin: string, elt: string[]) {

    if (plugin != null) {
      return baseUrl()+'/'+plugin.concat(apiUrl).concat(elt.join("/"));
    } else {
        return baseUrl()+'/'+elt.join("/");
    }
}

export function url(module: any) {
    const protocol = module.protocol.concat("://")
                       .concat(module.host).concat(":")
                       .concat(module.port);
    return [protocol, module.name].join("/");
}
export default class RestService {

    async login(credential: any) {       
            const response = (await axios.post(loginUrl, credential)). data;
            axios.defaults.headers.common['Authorization'] = 'Bearer '+response['access_token'];
            const session = {lang: response.lang, username: credential.username};
            store.commit('setSession', session);
            return response;       
    }

   async get(plugin: string, elt: string[], config?: any ,excp?: boolean) {
        try {
            if (config == null) {
            return (await axios.get(urlBuilder(plugin, elt))).data;
            } else {
                return (await axios.get(urlBuilder(plugin, elt), config)).data;
            }
        } catch(error) {
            if (excp == true) {
               throw error;
            }
            emitter.emit('error-event', error);
        }
    }

    async post(plugin: string, elt: string[], data: any, excp?: boolean) {
        try {
          return (await axios.post(urlBuilder(plugin, elt), data)).data;
        } catch(error) {
            if (excp == true) {
                throw error;
             }
            emitter.emit('error-event', error);
        }
    }

    async postWithConfig(plugin: string, elt: string[], data: any, config?: any, excp?: boolean) {
      try {
        return (await axios.post(urlBuilder(plugin, elt), data)).data;
      } catch(error) {
          if (excp == true) {
              throw error;
           }
          emitter.emit('error-event', error);
      }
  }

    async delete(plugin: string, elt: string[], config? : any, excp?: boolean) {
         try {
            (await axios.delete(urlBuilder(plugin, elt), config)).data;
         } catch (error) {
            if (excp == true) {
               throw error;
            }
            emitter.emit('error-event', error);
         }
    } 

    async getItem(plugin: string, meta: any, parent: number, pk: number) {
        const config = {
            params: {
              context: JSON.stringify({type: meta.type, pk: pk, parent: parent})
            }
          };
       const item = await this.get(plugin, ['actions', meta.action, 'fetchSingle'], config, true);
       return item ;
    }

    async getItems(plugin: string, meta: any, parent: number) {
        const config = {
            params: {
              context: JSON.stringify({type: meta.type, parent: parent})
            }
          };
       const response = await this.get(plugin, ['actions', meta.action, 'fetch'], config, true);
       return response ;
    }

    async uploadFile(plugin: string, data: any, item: any) {
        const url = baseUrl()+'/'+plugin+FILE_URL_UPLOADER ;
        const config = {
           headers: {
             'Content-Type': 'multipart/form-data'
           }
        };
        const response = (await axios.post(url, data, config)).data;
        return response;
    }

    async uploadFiles(plugin: string, data: any) {
        const url = baseUrl()+'/'+plugin+MULTIFILE_URL_UPLOADER ;
        const config = {
          headers: {
             'Content-Type': 'multipart/form-data'
           }
        };
        const response = (await axios.post(url, data, config)).data;
        return response;
    }

    async downloadFile(plugin: string, pk: number, filename:string) {
       const url = baseUrl()+'/'+plugin+FILE_DOWNLOAD_URL+pk+"/"+filename;
       const config: any = {
          responseType: 'blob'
       }
       const response = (await axios.get(url, config)).data;
       const FILE = window.URL.createObjectURL(new Blob([response]));
       const docUrl = document.createElement('a');
       docUrl.href = FILE;
       docUrl.setAttribute('download', filename);
       document.body.appendChild(docUrl);
       docUrl.click();
       docUrl.remove();
    }
}
 