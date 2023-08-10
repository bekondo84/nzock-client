
export default class Utils {
    
}

export function capitalizeFirstLetter(texte: string) {
    return texte.charAt(0).toUpperCase()+texte.slice(1);
}
export function firstCapitalizeLetter(texte: string) {
    return texte.charAt(0).toUpperCase();
}

export function getFieldName(item: any) {
    if (item.meta != null) {
        if (item.meta.searchKey != null) {
          return item.fieldName.concat('.').concat(item.meta.searchKey);
        } else {
            return item.fieldName.concat('.pk');
        }
    }
    return item.fieldName;
}