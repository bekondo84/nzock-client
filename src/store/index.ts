import { createStore } from 'vuex'

type Resources = Array<File>;

export default createStore({
  state: {
    plugin: null,
    stack :[null],
    session: null,
    items : [],
    pageSize: 25,
    resources: [null],
  },
  getters: {
    getPlugin(state) {
           return state.plugin;
    }, getStack(state) {
         return state.stack;
    }, getSession(state) {
        return state.session ;
    }, getPageSize(state) {
        return state.pageSize;
    }, getStackSize(state) {
        return state.stack.length;
    }, popStack(state) {
      return state.stack.pop();
    }, getResources(state) {
       return state.resources ;
    }  

  },
  mutations: {
    setPlugin(state, plugin) {
      state.plugin = Object.assign({}, plugin) ;
    }, pushStack(state, data) {
      if (!state.stack.find(s => s != null && s['id']==data.id)) {        
          state.stack.push(data);
      }
    }, resetStack(state) {
        state.stack = [];
    }, setSession(state, session) {
         state.session = session ;
    }, setItems(state, items: []) {
        state.items.splice(0, state.items.length);
        state.items.push(...items);
    }, setPageSize(state, value: number) {
        state.pageSize = value ;
    }, addResource(state, resource: any) {
        //console.log('adding new resource : '+resource)
        state.resources.push(resource);
    }, resetResource(state) {
        state.resources.splice(0, state.resources.length);
    }
  },
  actions: {
  },
  modules: {
  }
})
