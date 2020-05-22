const NodeRenderer=require("./renderers/node.js");
const validate=require("./lib/validate.js");
const argparse=require("./argparse.js");
const fs=require("fs");

// Call argparse
let result=argparse(process.argv);
let config=fs.readFileSync(result.options.in || "argzilla.json").toString();
try{
  config=JSON.parse(config);
}catch{
  throw new Error("Invalid Argzilla config file given");
}
validate(config);

// Choose renderer
let renderer=null;
let lang=result.options.lang || config.language;
if(lang=="node") renderer=NodeRenderer(config);
if(!renderer) throw new Error("Invalid language specified");

// Write output
fs.writeFileSync(result.options.out || config.out,renderer.render());
