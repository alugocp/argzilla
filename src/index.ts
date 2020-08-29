import NodeRenderer from "./renderers/node";
let argparse=require("./argparse.js");
import Renderer from "./renderer";
import validate from "./validate";
import * as fs from "fs";

// Call argparse
let config=null;
let result=argparse(process.argv);
let data=fs.readFileSync(result.options.in || "argzilla.json").toString();
try{
  config=JSON.parse(data);
}catch(err){
  throw new Error("Invalid Argzilla config file given");
}
validate(config);

// Handle init
/*if(result.params.length && result.params[0]=="init"){
  console.log(`{\n\t"language":"node",\n\t"out":"argparse.js",\n\t"options":[],\n\t"flags":[]\n}`);
  process.exit(0);
}*/

// Get renderer
let r:Renderer=null;
let lang=result.options.lang || config.language;
if(lang=="javascript") r=new NodeRenderer();
if(!r) throw new Error(`Invalid language ${lang} selected`);

// Write output
let output=r.render(config);
if(result.flags.print) console.log(output);
else fs.writeFileSync(result.options.out || config.out,output);
