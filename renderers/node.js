const {Renderer,errors}=require("../lib/renderer.js");

// Renderer for Node.js targets
function NodeRenderer(config){

  let r=Renderer(config);

  r.comment = msg => `// ${msg}\n`
  r.prestring = () => "module.exports=function(argv){\n\tlet result={flags:{},options:{},params:[]};\n";
  r.poststring = () => "\treturn result;\n}";
  r.parse_loop = () => "\tfor(var a=2;a<argv.length;a++){\n"+r.mid_loop()+"\t}\n";
  r.check_flag = flag => (flag.names || [])
    .map(x => `\t\tif(argv[a]=="${x}"){\n\t\t\tresult.flags.${flag.label}=true;\n\t\t\tcontinue;\n\t\t}\n`)
    .reduce((a,v) => a+v,"");
  r.check_option = option => (option.names || [])
    .map(x => `\t\tif(argv[a]=="${x}"){\n\t\t\tif(a==argv.length-1) throw new Error("${errors.not_provided} '${x}'");\n\t\t\tresult.options.${option.label}=argv[++a];\n\t\t\tcontinue;\n\t\t}\n`)
    .reduce((a,v) => a+v,"");
  r.check_param = () => "\t\tresult.params.push(argv[a]);\n";
  r.check_pnum = function(params){
    if(params){
      let conditions=[];
      if(params.min!=undefined) conditions.push(`result.params.length<${params.min}`);
      if(params.max!=undefined) conditions.push(`result.params.length>${params.max}`);
      if(conditions.length) return `\tif(${conditions.join(" || ")}) throw new Error("${errors.invalid_pnum}");\n`
    }else return `\tif(result.params.length) throw new Error("${errors.invalid_pnum}");\n`;
  };
  r.check_required = option => `\tif(!result.options.${option.label}) throw new Error("${errors.missing_required}");\n`;

  return r;
}

module.exports=NodeRenderer;
