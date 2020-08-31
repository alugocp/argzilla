import Renderer from "../renderer";
import Strings from "../strings";

export default class LuaRenderer extends Renderer{

  initNode(children:string[],minargs?:number):string{
    let code=`-- ${Strings.disclaimer}\n`;
    code+="function argparse()\n";
    code+="\targbox={options={},flags={},args={}}\n";
    code+="\tparams=arg\n";
    code+=children.reduce((x,y) => x+y);
    if(minargs!=undefined){
      code+=`\t\tif table.getn(argbox.args)<${minargs} then\n`;
      code+=`\t\t\terror(\"${Strings.too_few_args}\")\n`;
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
    let code=`\tfor a=${start},(table.getn(params)-1) do\n`;
    code+="\t\tparam=params[a]\n";
    for(var a in children) code+=children[a];
    code+="\tend\n";
    return code;
  }
  flagNode(flag):string{
    let code="";
    for(var a in flag.names){
      code+=`\t\tif param==\"${flag.names[a]}\" then\n`;
      code+=`\t\t\targbox.flags.${flag.label}=true\n`;
      code+="\t\t\tcontinue\n";
      code+="\t\tend\n";
    }
    return code;
  }
  optionNode(option):string{
    let code="";
    for(var a in option.names){
      code+=`\t\tif param==\"${option.names[a]}\" then\n`;
      code+=`\t\t\tif a<table.getn(params)-1 then\n`;
      code+=`\t\t\t\targbox.options.${option.label}=params[a+1]\n`;
      code+="\t\t\t\ta=a+1\n";
      code+="\t\t\t\tcontinue\n";
      code+="\t\t\telse\n";
      code+=`\t\t\t\terror(\"${Strings.missing_option(option.names[a])}\")\n`;
      code+="\t\t\tend\n";
      code+="\t\tend\n";
    }
    return code;
  }
  argNode(maxargs?:number):string{
    let code="";
    if(maxargs==0){
      code+=`\t\terror(\"${Strings.too_many_args}\")\n`;
    }else{
      if(maxargs!=undefined){
        code+=`\t\tif table.getn(argbox.args)==${maxargs} then\n`;
        code+=`\t\t\terror(\"${Strings.too_many_args}\")\n`;
        code+="\t\tend\n";
      }
      code+="\t\ttable.insert(argbox.args,param)\n";
    }
    return code;
  }

}
