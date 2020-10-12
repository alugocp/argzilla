import {Renderer} from "../renderer";
import Strings from "../strings";

export class BashRenderer extends Renderer{

  initNode(children:string[],minargs?:number):string{
    let code=`# ${Strings.disclaimer}\n`;
    let errors=Object.keys(Strings.errors);
    for(var e in errors){
      code+=`${Strings.errors[errors[e]]}=${parseInt(e)+1}\n`;
    }
    code+="params=( $@ )\n";
    code+="argbox_args=( )\n";
    code+="argbox_command=0\n";
    code+="declare -A argbox_flags\n";
    code+="declare -A argbox_options\n";
    code+="function argparse {\n";
    code+=children.reduce((x,y) => x+y);
    if(minargs!=undefined){
      code+=`\t\tif [ \$\{#argbox_args[@]\} < ${minargs} ]; then\n`;
      code+=`\t\t\treturn ${Strings.errors.too_few_args}\n`;
      code+="\t\tfi\n";
    }
    code+="\treturn 0\n";
    code+="}\n";
    return code;
  }
  commandNode(children:string[],i:number,name?:string):string{
    let code=null;
    if(i==0){
      if(name) code=`\tif [ \"\$\{params[0]\}\" == \"${name}\" ]; then\n\t\targbox_command=\"${name}\"\n${this.extraIndent(this.loopNode(1,children))}`;
      else code=this.loopNode(0,children);
    }else{
      if(name) code=`\telse if [ \"\$\{params[0]\}\"==\"${name}\" ]; then\n\t\targbox_command=\"${name}\"\n${this.extraIndent(this.loopNode(1,children))}`;
      else code=`\telse\n${this.extraIndent(this.loopNode(1,children))}\tfi\n`;
    }
    return code;
  }
  loopNode(start:number,children:string[]):string{
    if(!children.length) return "";
    let code=`\tfor ((a=${start};a<\$\{#params[@]\};a++)); do\n`;
    code+="\t\tparam=\"\$\{params[$a]\}\"\n";
    for(var a in children) code+=children[a];
    code+="\tdone\n";
    return code;
  }
  flagNode(flag):string{
    let code="";
    for(var a in flag.names){
      code+=`\t\tif [ \"$param\" == \"${flag.names[a]}\" ]; then\n`;
      code+=`\t\t\targbox_flags[\"${flag.label}\"]=1\n`;
      code+="\t\t\tcontinue\n";
      code+="\t\tfi\n";
    }
    return code;
  }
  optionNode(option):string{
    let code="";
    for(var a in option.names){
      code+=`\t\tif [ \"$param\" == \"${option.names[a]}\" ]; then\n`;
      code+=`\t\t\tif [ \"\$a\" -lt \"$(expr \$\{#params[@]\} - 1)\" ]; then\n`;
      code+=`\t\t\t\targbox_options[\"${option.label}\"]=params[a+1]\n`;
      code+="\t\t\t\ta+=1\n";
      code+="\t\t\t\tcontinue\n";
      code+="\t\t\telse\n";
      code+=`\t\t\treturn ${Strings.errors.missing_option}\n`;
      code+="\t\t\tfi\n";
      code+="\t\tfi\n";
    }
    return code;
  }
  argNode(maxargs?:number):string{
    let code="";
    if(maxargs==0){
      code+=`\t\treturn ${Strings.errors.too_many_args}\n`;
    }else{
      if(maxargs!=undefined){
        code+=`\t\tif [ \$\{#argbox[\"args\"]\} == ${maxargs} ]; then\n`;
        code+=`\t\t\treturn ${Strings.errors.too_many_args}\n`;
        code+="\t\tfi\n";
      }
      code+="\t\targbox_args=( ${argbox_args[@]} param )\n";
    }
    return code;
  }

}
