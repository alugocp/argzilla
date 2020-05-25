// Validates Argzilla inputs with regex

function validate(config){

  // Validate required fields
  let keys=Object.keys(config);
  if(keys.indexOf("language")<0) throw new Error("Must specify language in config file");
  if(keys.indexOf("out")<0) throw new Error("Must specify out in config file");

  // Validate options
  let names=[];
  let labels=[];
  let options=config.options || [];
  for(var a in options){
    let option=options[a];
    if(!option.label) throw new Error("Unlabeled option");
    if(typeof(option.label)!="string") throw new Error("Invalid label given");
    if(labels.indexOf(option.label)<0) labels.push(option.label);
    else throw new Error(`Multiple options with label "${option.label}"`);
    if(option.names){
      for(var b in option.names){
        let name=option.names[b];
        if(typeof(name)!="string") throw new Error("Invalid name given");
        if(names.indexOf(name)<0) names.push(name);
        else throw new Error(`Multiple instances of name "${name}"`);
      }
    }
  }

  // Validate flags
  labels=[];
  let flags=config.flags || [];
  for(var a in flags){
    let flag=flags[a];
    if(!flag.label) throw new Error("Unlabeled option");
    if(typeof(flag.label)!="string") throw new Error("Invalid label given");
    if(labels.indexOf(flag.label)<0) labels.push(flag.label);
    else throw new Error(`Multiple options with label "${flag.label}"`);
    if(flag.names){
      for(var b in flag.names){
        let name=flag.names[b];
        if(typeof(name)!="string") throw new Error("Invalid name given");
        if(names.indexOf(name)<0) names.push(name);
        else throw new Error(`Multiple instances of name "${name}"`);
      }
    }
  }
}

module.exports=validate;
