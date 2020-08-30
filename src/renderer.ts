
export default abstract class Renderer{

  render(config):string{
    let children=[];
    let start=0;
    if(config.commands!=undefined){
      for(var key in config.commands){
        let com=config.commands[key];
        children.push(this.commandNode([
          ...(com.options?com.options.map(x => this.optionNode(x)):[]),
          ...(com.flags?com.flags.map(x => this.flagNode(x)):[]),
          this.argNode(com.parameters.max)
        ],start++,key));
      }
    }
    children.push(this.commandNode([
      ...(config.options?config.options.map(x => this.optionNode(x)):[]),
      ...(config.flags?config.flags.map(x => this.flagNode(x)):[]),
      this.argNode(config.parameters.max)
    ],start));
    return this.initNode(children,config.parameters.min);
  }
  extraIndent(input:string):string{
    return input.split("\n").map(x => x.length?`\t${x}`:x).join("\n");
  }

  // Node functions
  protected abstract initNode(children:string[],minargs?:number):string;
  protected abstract commandNode(children:string[],i:number,name?:string):string;
  protected abstract loopNode(start:number,children:string[]):string;
  protected abstract flagNode(flag):string;
  protected abstract optionNode(option):string;
  protected abstract argNode(maxargs?:number):string;
}
