const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',style:{},classList:{toggle(){},add(){},remove(){}},showModal(){},close(){}});return elements.get(id)};
let saved;const sandbox={document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:()=>null,setItem:(k,v)=>saved=v},Intl,Date,Map,Set,JSON,Number,String,Error,Array,crypto:require('crypto').webcrypto,setTimeout:()=>0,clearTimeout(){},confirm:()=>true};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/v2.js','utf8'),sandbox);
vm.runInContext(`loadDemo();if(state.watches.length!==3)throw Error('demo count');loadDemo();if(state.watches.length!==3)throw Error('duplicate demo');if(!hit(state.watches[0]))throw Error('target');if(!card(state.watches[1]).includes('每人'))throw Error('per person total');validateImport(JSON.parse(JSON.stringify(state)));`,sandbox);
assert.equal(JSON.parse(saved).watches.length,3);
vm.runInContext(`const bad=JSON.parse(JSON.stringify(state));bad.watches[0].id='"><img>';let blocked=false;try{validateImport(bad)}catch{blocked=true}if(!blocked)throw Error('unsafe import accepted');if(esc('<img>')!=='&lt;img&gt;')throw Error('escape failed');`,sandbox);
console.log('PASS: demo deduplication, persistence, target status, price labels, import validation, output escaping');
