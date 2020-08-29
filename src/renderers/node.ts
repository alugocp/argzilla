import Renderer from "../renderer";
import Strings from "../strings";

export default class NodeRenderer extends Renderer{

  initNode(children:string[],minargs?:number):string{
    let code=`// ${Strings.disclaimer}\n`;
    code+="module.exports=function(){\n";
    code+="\tlet argbox={options:{},flags:{},args:[]};\n";
    code+="\tlet params=process.argv;\n";
    code+="\tlet start=2;\n";
    code+=this.loopNode(children);
    if(minargs!=undefined){
      code+=`\t\tif(argbox.args.length<${minargs}){\n`;
      code+=`\t\t\tthrow new Error(\"${Strings.too_few_args}\");\n`;
      code+="\t\t}\n";
    }
    code+="\treturn argbox;\n}\n";
    return code;
  }
  commandNode():string{
    return "toots";
  }
  loopNode(children:string[]):string{
    if(!children.length) return "";
    let code="\tfor(var a=start;a<params.length;a++){\n";
    code+="\t\tlet param=params[a];\n";
    for(var a in children) code+=children[a];
    code+="\t}\n";
    return code;
  }
  flagNode(flag):string{
    let code="";
    for(var a in flag.names){
      code+=`\t\tif(param==\"${flag.names[a]}\"){\n`;
      code+=`\t\t\targbox.flags.${flag.label}=true;\n`;
      code+="\t\t\tcontinue;\n";
      code+="\t\t}\n";
    }
    return code;
  }
  optionNode(option):string{
    let code="";
    for(var a in option.names){
      code+=`\t\tif(param==\"${option.names[a]}\"){\n`;
      code+=`\t\t\tif(a<params.length-1){\n`;
      code+=`\t\t\t\targbox.options.${option.label}=params[++a];\n`;
      code+="\t\t\t\tcontinue;\n";
      code+="\t\t\t}else{\n";
      code+=`\t\t\t\tthrow new Error(\"${Strings.missing_option(option.names[a])}\");\n`;
      code+="\t\t\t}\n";
      code+="\t\t}\n";
    }
    return code;
  }
  argNode(maxargs?:number):string{
    let code="";
    if(maxargs==0){
      code+=`\t\tthrow new Error(\"${Strings.too_many_args}\");\n`;
    }else{
      if(maxargs!=undefined){
        code+=`\t\tif(argbox.args.length==${maxargs}){\n`;
        code+=`\t\t\tthrow new Error(\"${Strings.too_many_args}\");\n`;
        code+="\t\t}\n";
      }
      code+="\t\targbox.args.push(param);\n";
    }
    return code;
  }

}
