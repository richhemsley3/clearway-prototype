const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900}});
 await p.setContent('<meta charset="utf-8">'+require('fs').readFileSync(require('path').join(__dirname,'..','docs','index.html'),'utf8')); await p.waitForTimeout(300);
 let bad=0;
 async function probe(tag, id, park){
   const n=await p.$$eval('#'+id+' button, #'+id+' .chip', bs=>bs.length);
   for(let i=0;i<n;i++){
     await p.evaluate(({id,park})=>{const e=document.getElementById(id);window.scrollBy(0,e.getBoundingClientRect().top-park)},{id,park});
     await p.waitForTimeout(60);
     const pre=await p.evaluate(id=>({t:document.getElementById(id).getBoundingClientRect().top,y:scrollY,h:document.documentElement.scrollHeight}),id);
     await p.evaluate(({id,i})=>document.querySelectorAll('#'+id+' button, #'+id+' .chip')[i].click(),{id,i});
     await p.waitForTimeout(520);
     const post=await p.evaluate(id=>({t:document.getElementById(id).getBoundingClientRect().top,y:scrollY,h:document.documentElement.scrollHeight}),id);
     const d=Math.round(post.t-pre.t);
     if(Math.abs(d)>1){bad++;console.log(tag,id,'#'+i,'MOVED',d,'y',pre.y+'->'+post.y,'h',pre.h+'->'+post.h);}
   }
 }
 for(const park of [40,200]){
   const navs=await p.evaluate(()=>[...document.querySelectorAll('#nav a')].map(x=>x.dataset.go).filter(Boolean));
   for(const v of navs){
     await p.evaluate(v=>{document.querySelectorAll('#nav a').forEach(a=>{if(a.dataset.go===v)a.click()})},v);
     await p.waitForTimeout(450);
     const ids=await p.evaluate(()=>[...document.querySelectorAll('.view.on .seg, .view.on .chips')].map(s=>{let e=s;while(e&&!e.id)e=e.parentElement;return e?e.id:''}).filter(Boolean));
     for(const id of ids) await probe('park'+park+' '+v, id, park);
   }
   // record view
   await p.evaluate(()=>{document.querySelectorAll('#nav a').forEach(a=>{if(a.dataset.go==='pd-partners')a.click()})});
   await p.waitForTimeout(400);
   await p.evaluate(()=>{var b=document.querySelector('[data-sc="all"]'); if(b)b.click(); var c=document.querySelector('#ptabs [data-f="all"]'); if(c)c.click(); window.scrollTo(0,0)});
   await p.waitForTimeout(600);
   await p.evaluate(()=>document.querySelector('#ptable tbody tr').click());
   await p.waitForTimeout(400);
   const rids=await p.evaluate(()=>[...document.querySelectorAll('.view.on .seg')].map(s=>{let e=s;while(e&&!e.id)e=e.parentElement;return e?e.id:''}).filter(Boolean));
   for(const id of rids) await probe('park'+park+' record', id, park);
 }
 console.log(bad?('FAIL '+bad):'no movement anywhere');
 await b.close();
})();
