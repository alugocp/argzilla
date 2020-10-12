#!/usr/bin/env nodejs
const argzilla=require("./bin/index.js");
const argparse=require("./argparse.js");
const fs=require("fs");

// Call argparse
let config=null;
let result=argparse(process.argv);

if(result.flags["help"]){
  console.log("Argzilla command-line tool by LugoCorp");
  console.log("");
  console.log("Usage: argzilla [command] <options>");
  console.log("");
  console.log("Commands:");
  console.log("  init  -  prints out a blank argzilla.json file");
  console.log("");
  console.log("Options:");
  console.log("  -p, --print     Prints the output instead of writing to a file");
  console.log("  -o file         Selects which file to write to");
  console.log("  -f file         Selects an argzilla.json file to read from");
  console.log("  -l lang         Selects which language to render in (python, node, ruby, bash, lua, cpp)");
  console.log("  --help          Displays usage");
  process.exit(0);
}

// Handle init
if(result.command=="init"){
  if(fs.existsSync("argzilla.json")){
    argzilla.error("'argzilla.json' already exists here");
    process.exit(1);
  }
  fs.writeFileSync("argzilla.json",`{\n\t"language":"node",\n\t"out":"argparse.js",\n\t"parameters":{\n\t\t"min":0,\n\t\t"max":2\n\t},\n\t"options":[\n\t\t{\n\t\t\t"label":"option1",\n\t\t\t"names":["-option","--option"]\n\t\t}\n\t],\n\t"flags":[\n\t\t{\n\t\t\t"label":"flag1",\n\t\t\t"names":["-flag","--flag"]\n\t\t}\n\t],\n\t"commands":{\n\t\t"command1":{\n\t\t\t"options":[],\n\t\t\t"flags":[]\n\t\t}\n\t}\n}`);
  process.exit(0);
}

// Read local argzilla.json file
let fname=result.options.in || "argzilla.json";
if(!fs.existsSync(fname)){
  argzilla.error(`File '${fname}' does not exist`);
}
let data=fs.readFileSync(fname).toString();
try{
  config=JSON.parse(data);
}catch(err){
  argzilla.error("Invalid Argzilla config file given");
}
argzilla.validate(config);

// Get renderer
let r=null;
let lang=result.options.lang || config.language;
if(lang=="python") r=new argzilla.PythonRenderer();
else if(lang=="node") r=new argzilla.NodeRenderer();
//else if(lang=="java") r=new argzilla.JavaRenderer(); // INCOMPLETE
else if(lang=="ruby") r=new argzilla.RubyRenderer();
else if(lang=="bash") r=new argzilla.BashRenderer();
else if(lang=="lua") r=new argzilla.LuaRenderer();
else if(lang=="cpp") r=new argzilla.CppRenderer();
if(!r) argzilla.error(`Invalid language ${lang} selected`);

// Write output
let output=r.render(config);
if(result.flags.print) console.log(output);
else fs.writeFileSync(result.options.out || config.out,output);
