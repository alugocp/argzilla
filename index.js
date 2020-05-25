const ClangRenderer=require("./renderers/clang.js");
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

// Handle init
if(result.params.length && result.params[0]=="init"){
  console.log(`{\n\t"language":"node",\n\t"out":"argparse.js",\n\t"options":[],\n\t"flags":[]\n}`);
  process.exit(0);
}

// Choose renderer
let renderer=null;
let lang=result.options.lang || config.language;
if(lang=="node") renderer=NodeRenderer(config);
else if(lang=="c") renderer=ClangRenderer(config);
if(!renderer) throw new Error("Invalid language specified");

// Write output
let output=renderer.render();
if(result.flags.print) console.log(output);
else fs.writeFileSync(result.options.out || config.out,output);
