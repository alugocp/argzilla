const NodeRenderer=require("./renderers/node.js");

function argzilla(config){
  /*let renderer=options.target;
  let render=require(`./renderers/${renderer}.js`);*/
  return NodeRenderer(config).render();
}

let data=argzilla({
  target:"node",
  parameters:{
    //min:0,
    max:2
  },
  flags:[
    {
      label:"hello",
      names:["-hello","--hello","-h"]
    },
    {
      label:"goodbye",
      names:["-bye","--goodbye","-b"]
    }
  ],
  options:[
    {
      label:"name",
      names:["name","n"],
      required:true
    }
  ]
});
console.log(data);
