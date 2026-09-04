const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch();
 for(const w of [1440,1100,760]){
  const p=await b.newPage({viewport:{width:w,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  await p.goto('file://'+require('path').join(__dirname,'..','docs','index.html')+''); await p.waitForTimeout(500);
  for(const k of ['pa1','pa2','dev']){
    await p.evaluate(k=>{document.querySelectorAll('#wsmenu a').forEach(a=>{if(a.dataset.w===k)a.click()})},k); await p.waitForTimeout(400);
    await p.evaluate(()=>document.querySelector('#wsmenu [data-when="1"]').click()); await p.waitForTimeout(400);
    const navs=await p.evaluate(()=>[...document.querySelectorAll('#nav a')].map(x=>x.dataset.go));
    for(const v of navs){
      await p.evaluate(v=>{document.querySelectorAll('#nav a').forEach(a=>{if(a.dataset.go===v)a.click()})},v); await p.waitForTimeout(450);
      const r=await p.evaluate(()=>{var out={hs:document.documentElement.scrollWidth>document.documentElement.clientWidth+1, over:[]};
        var root=document.querySelector('.view.on'); var rb=root.getBoundingClientRect();
        [...root.querySelectorAll('*')].forEach(function(e){var b=e.getBoundingClientRect(); if(!b.width) return; if(b.right>rb.right+1||b.left<rb.left-1) out.over.push(e.tagName+'.'+(e.className||'').toString().split(' ')[0]+' r='+Math.round(b.right-rb.right));});
        out.over=[...new Set(out.over)].slice(0,4); return out;});
      if(r.hs||r.over.length) console.log(w,k,v,r.hs?'HSCROLL':'',r.over.join(' | '));
    }
    await p.evaluate(()=>document.querySelector('#wsmenu [data-when="0"]').click()); await p.waitForTimeout(300);
  }
  if(errs.length) console.log(w, errs.join('\n'));
  await p.close();
 }
 await b.close(); console.log('first-day scan done');
})();
