import Renderer from "../renderer";
import Strings from "../strings";

export default class RubyRenderer extends Renderer{

  initNode(children:string[],minargs?:number):string{
    let code=`# ${Strings.disclaimer}\n`;
    code+="def argparse\n";
    code+="\targbox={options:{},flags:{},args:[]}\n";
    code+="\tparams=ARGV\n";
    code+=children.reduce((x,y) => x+y);
    if(minargs!=undefined){
      code+=`\t\tif argbox[:args].length<${minargs} then\n`;
      code+=`\t\t\traise \"${Strings.too_few_args}\"\n`;
      code+="\t\tend\n";
    }
    code+="\treturn argbox\nend\n";
    return code;
  }
  commandNode(children:string[],i:number,name?:string):string{
    let code=null;
    if(i==0){
      if(name) code=`\tif params[1]==\"${name}\" then\n\t\targbox[:command]=\"${name}\"\n${this.loopNode(2,children)}`;
      else code=this.loopNode(1,children);
    }else{
      if(name) code=`\telsif params[1]==\"${name}\" then\n\t\targbox[:command]=\"${name}\"\n${this.loopNode(2,children)}`;
      else code=`\telse\n${this.loopNode(1,children)}\tend\n`;
    }
    return code;
  }
  loopNode(start:number,children:string[]):string{
    if(!children.length) return "";
    let code=`\tfor a in ${start}..(params.length-1) do\n`;
    code+="\t\tparam=params[a]\n";
    for(var a in children) code+=children[a];
    code+="\tend\n";
    return code;
  }
  flagNode(flag):string{
    let code="";
    for(var a in flag.names){
      code+=`\t\tif param==\"${flag.names[a]}\" then\n`;
      code+=`\t\t\targbox[:flags][:${flag.label}]=true\n`;
      code+="\t\t\tcontinue\n";
      code+="\t\tend\n";
    }
    return code;
  }
  optionNode(option):string{
    let code="";
    for(var a in option.names){
      code+=`\t\tif param==\"${option.names[a]}\" then\n`;
      code+=`\t\t\tif a<params.length-1 then\n`;
      code+=`\t\t\t\targbox[:options][:${option.label}]=params[a+1]\n`;
      code+="\t\t\t\ta+=1\n";
      code+="\t\t\t\tcontinue\n";
      code+="\t\t\telse\n";
      code+=`\t\t\t\traise \"${Strings.missing_option(option.names[a])}\"\n`;
      code+="\t\t\tend\n";
      code+="\t\tend\n";
    }
    return code;
  }
  argNode(maxargs?:number):string{
    let code="";
    if(maxargs==0){
      code+=`\t\traise \"${Strings.too_many_args}\"\n`;
    }else{
      if(maxargs!=undefined){
        code+=`\t\tif argbox[:args].length==${maxargs} then\n`;
        code+=`\t\t\traise \"${Strings.too_many_args}\"\n`;
        code+="\t\tend\n";
      }
      code+="\t\targbox[:args].push(param)\n";
    }
    return code;
  }

}
