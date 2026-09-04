const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:1200}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
 await p.setContent('<meta charset="utf-8">'+fs.readFileSync(require('path').join(__dirname,'..','docs','app.html'),'utf8'));
 await p.waitForTimeout(500);
 const ws=async k=>{await p.evaluate(k=>{document.querySelectorAll('#wsmenu a').forEach(a=>{if(a.dataset.w===k)a.click()})},k);await p.waitForTimeout(520)};
 const nav=async v=>{await p.evaluate(v=>{const a=[...document.querySelectorAll('#nav a')].find(x=>x.dataset.go===v); if(a) a.click(); else go(v);},v);await p.waitForTimeout(600)};
 const clk=async s=>{await p.evaluate(s=>{const e=document.querySelector(s); if(e)e.click(); else console.log('MISSING '+s);},s);await p.waitForTimeout(700)};
 const shot=async n=>{await p.screenshot({path:'/tmp/f_'+n+'.png'})};
 const navtxt=async()=>await p.evaluate(()=>[...document.querySelectorAll('#nav a')].map(a=>a.textContent.trim()).join(' | '));

 // A. developer fixes AUTH-14, then the agent and participant should both know
 await ws('dev'); await nav('dv-tool');
 await clk('#tkRun'); await p.waitForTimeout(1400); await shot('dev_fixed'); console.log('dev nav:', await navtxt());
 await ws('pa2'); await nav('pa-board'); await shot('board_after_fix');
 await ws('cw'); await nav('pd-integr'); await shot('integr_after_fix');
 await clk('[data-i="prep"]'); await shot('integr_prep_after_fix');

 // B. agent chases the signature and risk, then hands off
 await nav('pd-onboard'); await shot('onboard_start');
 await clk('#obChase'); await shot('onboard_signed');
 await p.evaluate(()=>window.scrollTo(0,700)); await p.waitForTimeout(200);
 await clk('#obRisk'); await p.waitForTimeout(300); await shot('onboard_riskcleared');
 await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(200); await shot('onboard_ready');
 await clk('#obHand'); await shot('onboard_handed'); console.log('cw nav:', await navtxt());
 await nav('pd-integr'); await clk('[data-i="other"]'); await shot('integr_ridgeline');

 // C. the participant sees contracting closed
 await ws('pa1'); await nav('pa-apply'); await shot('apply_after'); console.log('pa1 nav:', await navtxt());
 await nav('pa-rules');
 await p.evaluate(()=>document.querySelector('#paRules tr[data-p="2"]').click()); await p.waitForTimeout(500);
 await clk('#pnlGo'); await p.waitForTimeout(400); await shot('rules_acked'); console.log('pa1 nav after ack:', await navtxt());

 console.log(errs.length?('ERRORS\n'+errs.join('\n')):'no page errors');
 await b.close();
})();
