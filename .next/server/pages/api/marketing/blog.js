"use strict";(()=>{var e={};e.id=656,e.ids=[656],e.modules={3524:e=>{e.exports=require("@prisma/client")},9344:e=>{e.exports=require("jsonwebtoken")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2079:e=>{e.exports=import("openai")},8024:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{config:()=>d,default:()=>c,routeModule:()=>u});var o=a(1802),i=a(7153),n=a(6249),s=a(6393),l=e([s]);s=(l.then?(await l)():l)[0];let c=(0,n.l)(s,"default"),d=(0,n.l)(s,"config"),u=new o.PagesAPIRouteModule({definition:{kind:i.x.PAGES_API,page:"/api/marketing/blog",pathname:"/api/marketing/blog",bundlePath:"",filename:""},userland:s});r()}catch(e){r(e)}})},6393:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{default:()=>handler});var o=a(2079),i=a(7864),n=a(9823),s=e([o]);o=(s.then?(await s)():s)[0];let l=new o.default({apiKey:process.env.OPENAI_API_KEY});async function handler(e,t){if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});let a=e.headers.authorization?.split(" ")[1],r=(0,n.WX)(a);if(!r||"admin"!==r.role)return t.status(403).json({error:"Admin only"});try{let{title:a,topic:r}=e.body,o=`Write a 800-1200 word blog post about trucking/dispatch industry topic: "${r}".
    
Structure:
- Engaging title: "${a||"Trucking Tips"}"
- Introduction with hook
- 4-6 subheadings
- Practical advice
- SEO keywords: trucking, dispatch, freight, loads
- Call to action: Visit sartrends.ai for AI tools
- Professional tone

Return ONLY markdown content, no JSON.`,n=await l.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:o}]}),s=n.choices[0].message.content,c=a?.toLowerCase().replace(/ /g,"-").replace(/[^a-z0-9-]/g,"")||"blog-"+Date.now(),d=await i._.blogPost.create({data:{title:a||"AI Trucking Blog",content:s,slug:c,published:!0}});t.json({success:!0,blog:d})}catch(e){console.error(e),t.status(500).json({error:"Blog generation failed"})}}r()}catch(e){r(e)}})}};var t=require("../../../webpack-api-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),a=t.X(0,[222,823],()=>__webpack_exec__(8024));module.exports=a})();