const {Renderer,errors}=require("../lib/renderer.js");

// Renderer for Node.js targets
function ClangRenderer(config){

  let r=Renderer(config);

  r.comment = msg => `// ${msg}\n`
  r.prestring = function(){
    let flags=(r.config.flags || []).map(x => `\tint ${x.label};\n`).reduce((a,v) => a+v,"");
    let options=(r.config.options || []).map(x => `\tchar* ${x.label};\n`).reduce((a,v) => a+v,"");
    return `struct ArgResult{\n\tchar* params[25];\n\tint nparams;\n${flags}${options}};\nArgResult* argparse(int argc,char** argv){\n\tArgResult* result=(ArgResult*)calloc(1,sizeof(ArgResult));\n`
  }
  r.poststring = () => "\treturn result;\n}";
  r.parse_loop = () => "\tfor(int a=1;a<argc;a++){\n"+r.mid_loop()+"\t}\n";
  r.check_flag = flag => (flag.names || [])
    .map(x => `\t\tif(!strcmp(argv[a],"${x}")){\n\t\t\tresult->${flag.label}=1;\n\t\t\tcontinue;\n\t\t}\n`)
    .reduce((a,v) => a+v,"");
  r.check_option = option => (option.names || [])
    .map(x => `\t\tif(!strcmp(argv[a],"${x}")){\n\t\t\tif(a==argc-1){\n\t\t\t\tfprintf(stderr,"${errors.not_provided} '${x}'\\n");\n\t\t\t\texit(1);\n\t\t\t}\n\t\t\tresult->${option.label}=argv[++a];\n\t\t\tcontinue;\n\t\t}\n`)
    .reduce((a,v) => a+v,"");
  r.check_param = () => "\t\tresult->params[(result->nparams)++]=argv[a];\n";
  r.check_pnum = function(params){
    if(params){
      let conditions=[];
      if(params.min!=undefined) conditions.push(`result->nparams<${params.min}`);
      if(params.max!=undefined) conditions.push(`result->nparams>${params.max}`);
      if(conditions.length) return `\tif(${conditions.join(" || ")}){\n\t\tfprintf(stderr,"${errors.invalid_pnum}\\n");\n\t\texit(1);\n\t}\n`
    }else return `\tif(result->nparams){\n\t\tfprintf(stderr,"${errors.invalid_pnum}\\n");\n\t\texit(1);\n\t}\n`;
  };
  r.check_required = option => `\tif(!result->${option.label}){\n\t\tfprintf(stderr,"${errors.missing_required}\\n");\n\t\texit(1);\n\t}\n`;

  return r;
}

module.exports=ClangRenderer;
