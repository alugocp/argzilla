import PythonRenderer from "./renderers/python";
import NodeRenderer from "./renderers/node";
import RubyRenderer from "./renderers/ruby";
import CppRenderer from "./renderers/cpp";
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
if(result.command=="init"){
  console.log(`{\n\t"language":"node",\n\t"out":"argparse.js",\n\t"parameters":{}\n\t"options":[],\n\t"flags":[],\n\t"commands":{}\n}`);
  process.exit(0);
}

// Get renderer
let r:Renderer=null;
let lang=result.options.lang || config.language;
if(lang=="javascript") r=new NodeRenderer();
else if(lang=="python") r=new PythonRenderer();
else if(lang=="ruby") r=new RubyRenderer();
else if(lang=="cpp") r=new CppRenderer();
if(!r) throw new Error(`Invalid language ${lang} selected`);

// Write output
let output=r.render(config);
if(result.flags.print) console.log(output);
else fs.writeFileSync(result.options.out || config.out,output);
