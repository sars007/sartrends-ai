"use strict";(()=>{var e={};e.id=307,e.ids=[307],e.modules={3524:e=>{e.exports=require("@prisma/client")},9344:e=>{e.exports=require("jsonwebtoken")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2079:e=>{e.exports=import("openai")},5529:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.r(t),s.d(t,{config:()=>u,default:()=>l,routeModule:()=>c});var r=s(1802),n=s(7153),i=s(6249),o=s(4632),d=e([o]);o=(d.then?(await d)():d)[0];let l=(0,i.l)(o,"default"),u=(0,i.l)(o,"config"),c=new r.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/ai/website",pathname:"/api/ai/website",bundlePath:"",filename:""},userland:o});a()}catch(e){a(e)}})},4632:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.r(t),s.d(t,{default:()=>handler});var r=s(2079),n=s(9823),i=e([r]);r=(i.then?(await i)():i)[0];let o=new r.default({apiKey:process.env.OPENAI_API_KEY});async function handler(e,t){if("POST"!==e.method)return t.status(405).json({message:"Method not allowed"});let s=e.headers.authorization;if(!s||!s.startsWith("Bearer "))return t.status(401).json({message:"Unauthorized"});let a=s.split(" ")[1],r=(0,n.WX)(a);if(!r)return t.status(401).json({message:"Invalid token"});let i=await (0,n.wW)(r.userId,r.role);if(!i)return t.status(402).json({message:"No active subscription"});let{description:d,type:l}=e.body;if(!d||!l)return t.status(400).json({message:"Description and type required"});try{let e=`Generate a complete, deploy-ready website for: "${d}" type: ${l}.
    
Return ONLY full HTML file with embedded CSS/JS. Responsive, modern design using TailwindCSS CDN.
Include:
- Header/nav
- Hero section
- Features/content
- Footer
- Mobile responsive
- Professional

No explanations, pure HTML code.`,s=await o.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:e}],max_tokens:4e3}),a=s.choices[0].message.content;t.status(200).json({website:a})}catch(e){console.error(e),t.status(500).json({message:"Website generation failed"})}}a()}catch(e){a(e)}})}};var t=require("../../../webpack-api-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),s=t.X(0,[222,823],()=>__webpack_exec__(5529));module.exports=s})();