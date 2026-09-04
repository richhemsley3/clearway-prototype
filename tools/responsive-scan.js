const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const b=await chromium.launch();
 for(const w of [1440,1280,1100,900,760]){
  const p=await b.newPage({viewport:{width:w,height:900}});
  await p.setContent('<meta charset="utf-8">'+fs.readFileSync(require('path').join(__dirname,'..','docs','index.html'),'utf8'));
  await p.waitForTimeout(500);
  const wss=await p.evaluate(()=>[...document.querySelectorAll('#wsmenu a')].map(a=>a.dataset.w));
  for(const k of wss){
    await p.evaluate(k=>{document.querySelectorAll('#wsmenu a').forEach(a=>{if(a.dataset.w===k)a.click()})},k);
    await p.waitForTimeout(450);
    const navs=await p.evaluate(()=>[...document.querySelectorAll('#nav a')].map(x=>x.dataset.go));
    for(const v of navs){
      await p.evaluate(v=>{document.querySelectorAll('#nav a').forEach(a=>{if(a.dataset.go===v)a.click()})},v);
      await p.waitForTimeout(500);
      const r=await p.evaluate(()=>{
        var out={hs:document.documentElement.scrollWidth>document.documentElement.clientWidth+1, over:[]};
        var root=document.querySelector('.view.on'); if(!root) return out;
        var rb=root.getBoundingClientRect();
        [...root.querySelectorAll('*')].forEach(function(e){
          var b=e.getBoundingClientRect(); if(!b.width) return;
          if(b.right>rb.right+1||b.left<rb.left-1) out.over.push(e.tagName+'.'+(e.className||'').toString().split(' ')[0]+' r='+Math.round(b.right-rb.right));
        });
        out.over=[...new Set(out.over)].slice(0,4); return out;
      });
      if(r.hs||r.over.length) console.log(w,k,v,r.hs?'HSCROLL':'',r.over.join(' | '));
      if(w===900||w===760) await p.screenshot({path:`/tmp/n${w}_${k}_${v}.png`});
    }
  }
  await p.close();
 }
 await b.close(); console.log('scan done');
})();
