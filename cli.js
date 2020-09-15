#!/usr/bin/env nodejs 
const argzilla=require("./bin/index.js");
const argparse=require("./argparse.js");
const fs=require("fs");

// Call argparse
let config=null;
let result=argparse(process.argv);
let data=fs.readFileSync(result.options.in || "argzilla.json").toString();
try{
  config=JSON.parse(data);
}catch(err){
  throw new Error("Invalid Argzilla config file given");
}
argzilla.validate(config);

// Handle init
if(result.command=="init"){
  console.log(`{\n\t"language":"node",\n\t"out":"argparse.js",\n\t"parameters":{}\n\t"options":[],\n\t"flags":[],\n\t"commands":{}\n}`);
  process.exit(0);
}

// Get renderer
let r=null;
let lang=result.options.lang || config.language;
if(lang=="javascript") r=new argzilla.NodeRenderer();
else if(lang=="python") r=new argzilla.PythonRenderer();
else if(lang=="java") r=new argzilla.JavaRenderer();
else if(lang=="ruby") r=new argzilla.RubyRenderer();
else if(lang=="bash") r=new argzilla.BashRenderer();
else if(lang=="lua") r=new argzilla.LuaRenderer();
else if(lang=="cpp") r=new argzilla.CppRenderer();
if(!r) throw new Error(`Invalid language ${lang} selected`);

// Write output
let output=r.render(config);
if(result.flags.print) console.log(output);
else fs.writeFileSync(result.options.out || config.out,output);
