(function(){
  const STORAGE_KEY = "EM_MASTER_DATA_V1";
  const VERSION = "1.0.0";
  const clone = value => JSON.parse(JSON.stringify(value));

  function read(){
    try{
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      return data && data.version === VERSION && data.entities ? data : {version:VERSION,updatedAt:"",entities:{}};
    }catch(error){
      console.warn("本地主数据读取失败，将使用初始数据。", error);
      return {version:VERSION,updatedAt:"",entities:{}};
    }
  }

  let store = read();

  function persist(){
    store.updatedAt = new Date().toISOString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  window.EMMasterData = {
    key: STORAGE_KEY,
    ensure(entity, seed){
      if(!Array.isArray(store.entities[entity])){
        store.entities[entity] = clone(seed || []);
        persist();
      }
      return clone(store.entities[entity]);
    },
    get(entity){
      return Array.isArray(store.entities[entity]) ? clone(store.entities[entity]) : null;
    },
    set(entity, data){
      store.entities[entity] = clone(data || []);
      persist();
    },
    export(){
      return clone(store);
    },
    import(data){
      if(!data || !data.entities || typeof data.entities !== "object") throw new Error("导入文件格式不正确");
      store = {version:VERSION, updatedAt:new Date().toISOString(), entities:clone(data.entities)};
      persist();
    },
    reset(){
      window.localStorage.removeItem(STORAGE_KEY);
      store = {version:VERSION,updatedAt:"",entities:{}};
    }
  };
})();
