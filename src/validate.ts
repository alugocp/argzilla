// Validates Argzilla inputs with regex

export default function validate(config){

  // Validation helpers
  function validateKeys(obj,required:string[],optional?:string[]){
    let keys=Object.keys(obj);
    for(var a in required){
      if(keys.indexOf(required[a])<0) throw new Error(`Missing key \"${required[a]}\"`);
      keys.splice(keys.indexOf(required[a]),1);
    }
    for(var a in keys){
      if(optional.indexOf(keys[a])<0) throw new Error(`Unknown key \"${keys[a]}\"`);
    }
  }
  function ensureList(obj,l?:number){
    if(!(typeof(obj)=="object" && obj.length!=undefined)) throw new Error("Invalid type (list expected)");
    if(l!=undefined && obj.length<l)throw new Error(`Too few arguments (At least ${l} expected)`);
  }
  function ensureString(obj){
    if(typeof(obj)!="string") throw new Error("Invalid type (string expected)");
  }

  // Top-level validation
  validateKeys(config,["language","out"],["parameters","options","flags"]);
  ensureString(config.language);
  ensureString(config.out);

  // Validate options
  if(config.options!=undefined){
    ensureList(config.options,1);
    for(var a in config.options){
      let obj=config.options[a];
      validateKeys(obj,["names","label"]);
      ensureString(obj.label);
      ensureList(obj.names,1);
      for(var b in obj.names){
        ensureString(obj.names[b]);
      }
    }
  }

  // Validate flags
  if(config.flags!=undefined){
    ensureList(config.flags,1);
    for(var a in config.flags){
      let obj=config.flags[a];
      validateKeys(obj,["names","label"]);
      ensureString(obj.label);
      ensureList(obj.names,1);
      for(var b in obj.names){
        ensureString(obj.names[b]);
      }
    }
  }

  // Validate args
  if(config.parameters!=undefined){
    validateKeys(config.parameters,[],["min","max"]);
    if(config.parameters.max==undefined) config.parameters.max=undefined;
    if(config.parameters.min==undefined) config.parameters.min=undefined;
  }else config.parameters={max:undefined,min:undefined};
}
