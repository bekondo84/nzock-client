import axios from "axios";
import { emitter } from "./emitter";
import { baseUrl } from "./restService";

export async function i18n(keys: string[]) {
    const url = baseUrl()+'/backoffice/api/v1/public/i18n?keys='+keys.join(',');
    try {
      return (await axios.get(url)).data;
    } catch(error)  {
        emitter.emit('error-event', error);
    }
}

