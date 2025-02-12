import {Renderer} from "../renderer";
import Strings from "../strings";

export class LuaRenderer extends Renderer{

  continue_counter=0

  initNode(children:string[],minargs?:number):string{
    let code=`-- ${Strings.disclaimer}\n`;
    let errors=Object.keys(Strings.errors);
    for(var e in errors){
      code+=`${Strings.errors[errors[e]]}=${parseInt(e)+1}\n`;
    }
    code+="function argparse()\n";
    code+="\targbox={options={},flags={},args={},error=0}\n";
    code+="\tparams=arg\n";
    code+=children.reduce((x,y) => x+y);
    if(minargs!=undefined){
      code+=`\t\tif #argbox.args<${minargs} then\n`;
      code+=`\t\t\targbox.error=${Strings.errors.too_few_args}\n`;
      code+="\t\t\tif argbox.error>0 then return argbox end\n";
      code+="\t\tend\n";
    }
    code+="\treturn argbox\nend\n";
    return code;
  }
  commandNode(children:string[],i:number,name?:string):string{
    let code=null;
    if(i==0){
      if(name) code=`\tif params[1]==\"${name}\" then\n\t\targbox.command=\"${name}\"\n${this.extraIndent(this.loopNode(2,children))}`;
      else code=this.loopNode(1,children);
    }else{
      if(name) code=`\telseif params[1]==\"${name}\" then\n\t\targbox.command=\"${name}\"\n${this.extraIndent(this.loopNode(2,children))}`;
      else code=`\telse\n${this.extraIndent(this.loopNode(1,children))}\tend\n`;
    }
    return code;
  }
  loopNode(start:number,children:string[]):string{
    if(!children.length) return "";
    let code=`\tfor a=${start},(#params-1) do\n`;
    code+="\t\tparam=params[a]\n";
    for(var a in children) code+=children[a];
    code+=`\t\t::continue${this.continue_counter++}::\n`
    code+="\tend\n";
    return code;
  }
  flagNode(flag):string{
    let code="";
    for(var a in flag.names){
      code+=`\t\tif param==\"${flag.names[a]}\" then\n`;
      code+=`\t\t\targbox.flags[\"${flag.label}\"]=true\n`;
      code+=`\t\t\tgoto continue${this.continue_counter}\n`;
      code+="\t\tend\n";
    }
    return code;
  }
  optionNode(option):string{
    let code="";
    for(var a in option.names){
      code+=`\t\tif param==\"${option.names[a]}\" then\n`;
      code+=`\t\t\tif a<#params-1 then\n`;
      code+=`\t\t\t\targbox.options[\"${option.label}\"]=params[a+1]\n`;
      code+="\t\t\t\ta=a+1\n";
      code+=`\t\t\t\tgoto continue${this.continue_counter}\n`;
      code+="\t\t\telse\n";
      code+=`\t\t\t\targbox.error=${Strings.errors.missing_option}\n`;
      code+=`\t\t\t\tif argbox.error>0 then return argbox end\n`;
      code+="\t\t\tend\n";
      code+="\t\tend\n";
    }
    return code;
  }
  argNode(maxargs?:number):string{
    let code="";
    if(maxargs==0){
      code+=`\t\targbox.error=${Strings.errors.too_many_args}\n`;
      code+=`\t\tif argbox.error>0 then return argbox end\n`;
    }else{
      if(maxargs!=undefined){
        code+=`\t\tif #argbox.args==${maxargs} then\n`;
        code+=`\t\t\targbox.error=${Strings.errors.too_many_args}\n`;
        code+=`\t\tif argbox.error>0 then return argbox end\n`;
        code+="\t\tend\n";
      }
      code+="\t\ttable.insert(argbox.args,param)\n";
    }
    return code;
  }

}
