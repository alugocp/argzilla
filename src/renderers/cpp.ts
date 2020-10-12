import {Renderer} from "../renderer";
import Strings from "../strings";

export class CppRenderer extends Renderer{

  initNode(children:string[],minargs?:number):string{
    let code=`// ${Strings.disclaimer}\n`;
    code+="#include <string.h>\n";
    code+="#include <vector>\n";
    let errors=Object.keys(Strings.errors);
    for(var e in errors){
      code+=`const int ${Strings.errors[errors[e]]}=${parseInt(e)+1};\n`;
    }
    let flagLabels=this.aggregateFlagLabels();
    code+="typedef struct{\n";
    for(var a in flagLabels) code+=`\tbool ${flagLabels[a]};\n`;
    code+="} Flags;\n";
    let optionLabels=this.aggregateOptionLabels();
    code+="typedef struct{\n";
    for(var a in optionLabels) code+=`\tchar* ${optionLabels[a]};\n`;
    code+="} Options;\n";
    code+="typedef struct{\n";
    code+="\tstd::vector<char*> args;\n";
    code+="\tOptions options;\n";
    code+="\tFlags flags;\n";
    code+="\tchar* command;\n";
    code+="\tint error;\n";
    code+="} ArgBox;\n";
    code+="ArgBox argparse(int argc,char** argv){\n";
    code+="\tArgBox argbox;\n";
    code+=children.reduce((x,y) => x+y);
    if(minargs!=undefined){
      code+=`\t\tif(argbox.args.size()<${minargs}){\n`;
      code+=`\t\t\targbox.error=${Strings.errors.too_few_args};\n`;
      code+="\t\t\treturn argbox;\n";
      code+="\t\t}\n";
    }
    code+="\treturn argbox;\n}\n";
    return code;
  }
  commandNode(children:string[],i:number,name?:string):string{
    let code=null;
    if(i==0){
      if(name) code=`\tif(argc>1 && !strcmp(argv[1],\"${name}\")){\n\t\targbox.command=new char[${name.length+1}];\n\t\tstrcpy(argbox.command,\"${name}\");\n${this.extraIndent(this.loopNode(2,children))}\t}\n`;
      else code=this.loopNode(1,children);
    }else{
      if(name) code=`\telse if(argc>1 && !strcmp(argv[1],\"${name}\")){\n\t\targbox.command=new char[${name.length+1}];\n\t\tstrcpy(argbox.command,\"${name}\");\n${this.extraIndent(this.loopNode(2,children))}\t}\n`;
      else code=`\telse{\n${this.extraIndent(this.loopNode(1,children))}\t}\n`;
    }
    return code;
  }
  loopNode(start:number,children:string[]):string{
    if(!children.length) return "";
    let code=`\tfor(int a=${start};a<argc;a++){\n`;
    code+="\t\tchar* param=argv[a];\n";
    for(var a in children) code+=children[a];
    code+="\t}\n";
    return code;
  }
  flagNode(flag):string{
    let code="";
    for(var a in flag.names){
      code+=`\t\tif(!strcmp(param,\"${flag.names[a]}\")){\n`;
      code+=`\t\t\targbox.flags.${flag.label}=true;\n`;
      code+="\t\t\tcontinue;\n";
      code+="\t\t}\n";
    }
    return code;
  }
  optionNode(option):string{
    let code="";
    for(var a in option.names){
      code+=`\t\tif(!strcmp(param,\"${option.names[a]}\")){\n`;
      code+=`\t\t\tif(a<argc-1){\n`;
      code+=`\t\t\t\targbox.options.${option.label}=argv[++a];\n`;
      code+="\t\t\t\tcontinue;\n";
      code+="\t\t\t}else{\n";
      code+=`\t\t\t\targbox.error=${Strings.errors.missing_option};\n`;
      code+="\t\t\t\treturn argbox;\n";
      code+="\t\t\t}\n";
      code+="\t\t}\n";
    }
    return code;
  }
  argNode(maxargs?:number):string{
    let code="";
    if(maxargs==0){
      code+=`\t\targbox.error=${Strings.errors.too_many_args};\n`;
      code+="\t\treturn argbox;\n";
    }else{
      if(maxargs!=undefined){
        code+=`\t\tif(argbox.args.size()==${maxargs}){\n`;
        code+=`\t\t\targbox.error=${Strings.errors.too_many_args};\n`;
        code+="\t\t\treturn argbox;\n";
        code+="\t\t}\n";
      }
      code+="\t\targbox.args.push_back(param);\n";
    }
    return code;
  }

}
