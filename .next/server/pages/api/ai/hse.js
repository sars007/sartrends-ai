"use strict";(()=>{var e={};e.id=357,e.ids=[357],e.modules={3524:e=>{e.exports=require("@prisma/client")},9344:e=>{e.exports=require("jsonwebtoken")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2079:e=>{e.exports=import("openai")},1361:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{config:()=>l,default:()=>d,routeModule:()=>c});var r=a(1802),n=a(7153),o=a(6249),i=a(8726),u=e([i]);i=(u.then?(await u)():u)[0];let d=(0,o.l)(i,"default"),l=(0,o.l)(i,"config"),c=new r.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/ai/hse",pathname:"/api/ai/hse",bundlePath:"",filename:""},userland:i});s()}catch(e){s(e)}})},8726:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{default:()=>handler});var r=a(2079),n=a(9823),o=e([r]);r=(o.then?(await o)():o)[0];let i=new r.default({apiKey:process.env.OPENAI_API_KEY});async function handler(e,t){if("POST"!==e.method)return t.status(405).json({message:"Method not allowed"});let a=e.headers.authorization;if(!a||!a.startsWith("Bearer "))return t.status(401).json({message:"Unauthorized"});let s=a.split(" ")[1],r=(0,n.WX)(s);if(!r)return t.status(401).json({message:"Invalid token"});let o=await (0,n.wW)(r.userId,r.role);if(!o)return t.status(402).json({message:"No active subscription"});let{prompt:u,type:d}=e.body;if(!u||!d)return t.status(400).json({message:"Prompt and type required"});try{let e=`Generate HSE (Health Safety Environment) document for trucking industry.
Type: ${d}
Context: ${u}

Format:
- Professional document
- PDF-ready markdown
- Downloadable structure
- Global safety standards

${"interview"===d?"Common interview questions + answers":""}
${"ppt"===d?"Slide structure for presentation":""}
${"report"===d?"Incident report template":""}`,a=await i.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:e}]}),s=a.choices[0].message.content;t.status(200).json({hseDoc:s})}catch(e){console.error(e),t.status(500).json({message:"HSE generation failed"})}}s()}catch(e){s(e)}})}};var t=require("../../../webpack-api-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),a=t.X(0,[222,823],()=>__webpack_exec__(1361));module.exports=a})();