
window.ModuleRegistry = {
  modules: {},
  register(name, module){
    this.modules[name] = module;
  },
  get(name){ return this.modules[name]; }
};
