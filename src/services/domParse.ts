function processImageNode(node: any, source: any) {
    const attr = node.getAttribute("src");
    let src ="/backoffice/api/v1/public/media/imagenotfound.png";
    if (attr != null && source[attr] != null) {
       src = source[attr].downloadUrl;
    }
    node.setAttribute("src", src);
}
function processNode(node: any, source: any) {
    let value = node.getAttribute("value");
    if (value != null) {
        const values = value.split('.');
        value = source;
        for (let i=0; i < values.length; i++) {
            if (value != null) {
              value = value[values[i]];
            }
        }
        node.innerText = value!= null ? value : "";
    }
}
export default class NDomParser {
    
    parseFromString(content: string, id: string, source: any, meta: any) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const nodes = doc.getElementsByName("$");
        for (let i=0; i < nodes.length; i++) {
            const node = nodes [i];
            if (node.nodeName=='IMG') {
               processImageNode(node, source);
            } else {
               processNode(node, source);                           
             }
        }
        const html = document.getElementById(id);
        if (html != null && doc != null && doc.body != null) {
            html.appendChild(doc.body);
        }
    }
}