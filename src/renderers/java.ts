import Renderer from "../renderer";
import Strings from "../strings";

export default class JavaRenderer extends Renderer{

  initNode(children:string[],minargs?:number):string{
    let code=`// ${Strings.disclaimer}\n`;
    code+="import java.util.ArrayList;\n";
    code+="\n";
    code+="class ArgBox{\n"
    let flagLabels=this.aggregateFlagLabels();
    code+="\tclass Flags{\n";
    for(var a in flagLabels) code+=`\t\tboolean ${flagLabels[a]}=false;\n`;
    code+="\t}\n";
    let optionLabels=this.aggregateOptionLabels();
    code+="\tclass Options{\n";
    for(var a in optionLabels) code+=`\t\tString ${optionLabels[a]}=null;\n`;
    code+="\t}\n";
    code+="\tArrayList<String> args=new ArrayList<>();\n";
    code+="\tOptions options=new Options();\n";
    code+="\tFlags flags=new Flags();\n";
    code+="\tString command=null;\n";
    code+="\n";
    code+="\tvoid argparse(String[] argv){\n";
    for(var a in flagLabels) code+=`\t\tflags.${flagLabels[a]}=false;\n`;
    for(var a in optionLabels) code+=`\t\toptions.${optionLabels[a]}=null;\n`;
    code+=children.reduce((x,y) => x+y);
    if(minargs!=undefined){
      code+=`\t\tif(args.size()<${minargs}){\n`;
      code+=`\t\t\t//throw new Error(\"${Strings.too_few_args}\");\n`;
      code+="\t\t}\n";
    }
    code+="\t}\n}\n";
    return code;
  }
  commandNode(children:string[],i:number,name?:string):string{
    let code=null;
    if(i==0){
      if(name) code=`\t\tif(argv[1].equals(\"${name}\")){\n\t\t\tcommand=\"${name}\";\n${this.extraIndent(this.loopNode(2,children))}\t\t}\n`;
      else code=this.loopNode(1,children);
    }else{
      if(name) code=`\t\telse if(argv[1].equals(\"${name}\")){\n\t\t\tcommand=\"${name}\";\n${this.extraIndent(this.loopNode(2,children))}\t\t}\n`;
      else code=`\t\telse{\n${this.extraIndent(this.loopNode(1,children))}\t\t}\n`;
    }
    return code;
  }
  loopNode(start:number,children:string[]):string{
    if(!children.length) return "";
    let code=`\t\tfor(int a=${start};a<argv.length;a++){\n`;
    code+="\t\t\tString param=argv[a];\n";
    for(var a in children) code+=children[a];
    code+="\t\t}\n";
    return code;
  }
  flagNode(flag):string{
    let code="";
    for(var a in flag.names){
      code+=`\t\t\tif(param.equals(\"${flag.names[a]}\")){\n`;
      code+=`\t\t\t\tflags.${flag.label}=true;\n`;
      code+="\t\t\t\tcontinue;\n";
      code+="\t\t\t}\n";
    }
    return code;
  }
  optionNode(option):string{
    let code="";
    for(var a in option.names){
      code+=`\t\t\tif(param.equals(\"${option.names[a]}\")){\n`;
      code+=`\t\t\t\tif(a<argv.length-1){\n`;
      code+=`\t\t\t\t\toptions.${option.label}=argv[++a];\n`;
      code+="\t\t\t\t\tcontinue;\n";
      code+="\t\t\t\t}else{\n";
      code+=`\t\t\t\t\t//throw new Error(\"${Strings.missing_option(option.names[a])}\");\n`;
      code+="\t\t\t\t}\n";
      code+="\t\t\t}\n";
    }
    return code;
  }
  argNode(maxargs?:number):string{
    let code="";
    if(maxargs==0){
      code+=`\t\t\t//throw new Error(\"${Strings.too_many_args}\");\n`;
    }else{
      if(maxargs!=undefined){
        code+=`\t\t\tif(args.size()==${maxargs}){\n`;
        code+=`\t\t\t\t//throw new Error(\"${Strings.too_many_args}\");\n`;
        code+="\t\t\t}\n";
      }
      code+="\t\t\targs.add(param);\n";
    }
    return code;
  }

}
