import {Renderer} from "../renderer";
import Strings from "../strings";

export class PythonRenderer extends Renderer{

  initNode(children:string[],minargs?:number):string{
    let code=`# ${Strings.disclaimer}\n`;
    code+="import sys\n";
    let errors=Object.keys(Strings.errors);
    for(var e in errors){
      code+=`${Strings.errors[errors[e]]}=${parseInt(e)+1}\n`;
    }
    code+="def argparse():\n";
    code+="\targbox={\"options\":{},\"flags\":{},\"args\":[],\"command\":None,\"error\":0}\n";
    code+="\tparams=sys.argv\n";
    code+=children.reduce((x,y) => x+y);
    if(minargs!=undefined){
      code+=`\t\tif len(argbox[\"args\"])<${minargs}:\n`;
      code+=`\t\t\targbox["error"]=${Strings.errors.too_few_args}\n`;
      code+="\t\t\treturn argbox\n"
    }
    code+="\treturn argbox\n";
    return code;
  }
  commandNode(children:string[],i:number,name?:string):string{
    let code=null;
    if(i==0){
      if(name) code=`\tif len(params)>1 and params[1]==\"${name}\":\n\t\targbox[\"command\"]=\"${name}\"\n${this.extraIndent(this.loopNode(2,children))}`;
      else code=this.loopNode(1,children);
    }else{
      if(name) code=`\telif len(params)>1 and params[1]==\"${name}\":\n\t\targbox[\"command\"]=\"${name}\"\n${this.extraIndent(this.loopNode(2,children))}`;
      else code=`\telse:\n${this.extraIndent(this.loopNode(1,children))}`;
    }
    return code;
  }
  loopNode(start:number,children:string[]):string{
    if(!children.length) return "";
    let code=`\tfor a in range(${start},len(params)):\n`;
    code+="\t\tparam=params[a]\n";
    for(var a in children) code+=children[a];
    return code;
  }
  flagNode(flag):string{
    let code="";
    for(var a in flag.names){
      code+=`\t\tif param==\"${flag.names[a]}\":\n`;
      code+=`\t\t\targbox[\"flags\"][\"${flag.label}\"]=True\n`;
      code+="\t\t\tcontinue\n";
    }
    return code;
  }
  optionNode(option):string{
    let code="";
    for(var a in option.names){
      code+=`\t\tif param==\"${option.names[a]}\":\n`;
      code+=`\t\t\tif a<len(params)-1:\n`;
      code+=`\t\t\t\targbox[\"options\"][\"${option.label}\"]=params[a+1]\n`;
      code+="\t\t\t\ta+=1\n";
      code+="\t\t\t\tcontinue\n";
      code+="\t\t\telse:\n";
      code+=`\t\t\t\targbox["error"]=${Strings.errors.missing_option}\n`;
      code+="\t\t\t\treturn argbox\n";
    }
    return code;
  }
  argNode(maxargs?:number):string{
    let code="";
    if(maxargs==0){
      code+=`\t\targbox["error"]=${Strings.errors.too_many_args}\n`;
      code+="\t\treturn\n";
    }else{
      if(maxargs!=undefined){
        code+=`\t\tif len(argbox[\"args\"])==${maxargs}:\n`;
        code+=`\t\t\targbox["error"]=${Strings.errors.too_many_args}\n`;
        code+="\t\t\treturn argbox\n";
      }
      code+="\t\targbox[\"args\"].append(param)\n";
    }
    return code;
  }

}
