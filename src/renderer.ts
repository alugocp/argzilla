
export default abstract class Renderer{

  render(config):string{
    let children=[
      ...config.options.map(x => this.optionNode(x)),
      ...config.flags.map(x => this.flagNode(x)),
      this.argNode(config.parameters.max)
    ];
    return this.initNode(children,config.parameters.min);
  }

  // Node functions
  protected abstract initNode(children:string[],minargs?:number):string;
  protected abstract commandNode():string;
  protected abstract loopNode(children:string[]):string;
  protected abstract flagNode(flag):string;
  protected abstract optionNode(option):string;
  protected abstract argNode(maxargs?:number):string;
}
