/* ЭКИПАЖ — демо продукта: экраны и навигация */
const D = window.EKIPAZH_DEMO;
(function(){
"use strict";
const app=document.getElementById("app");
const el=(t,c,h)=>{const n=document.createElement(t);if(c)n.className=c;if(h!=null)n.innerHTML=h;return n};
const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const M={}; D.team.forEach(m=>M[m.short]=m);
const photo=(n,cls)=>M[n]?'<img class="ph '+(cls||"")+'" src="'+M[n].photo+'" alt="'+esc(n)+'">':"";
const tsl=(ts,who,k)=>'<button class="tsl" data-tr="'+(k||"les")+'" data-ts="'+esc(ts)+'"'+(who?' data-who="'+esc(who)+'"':'')+' title="Открыть в стенограмме">'+esc(ts)+'</button>';
const quote=(ts,who,t,k)=>'<div class="quote"><div class="qwho">'+photo(who,"sm")+'<span class="ts">'+tsl(ts,who,k)+'</span> '+esc(who)+'</div>«'+esc(t)+'»</div>';
const TAGS={"предложение":"pr","вопрос":"q","оспаривание":"ch","фиксация":"fx","данные":"dt"};
const TAGS_ALL=["предложение","вопрос","оспаривание","фиксация","данные"];
const tagB=t=>t?'<span class="tg '+TAGS[t]+'">'+esc(t)+'</span>':"";
const fmtN=x=>String(x).replace(".",",");
const bef=x=>x.before.indexOf(x.b_val+" — ")===0?x.before.slice(x.b_val.length+3):x.before;
const CASE=n=>D.cases[n-1];
const caseChip=n=>'<button class="chip" data-case="'+n+'">Кейс '+n+' · '+esc(CASE(n).name)+'</button>';
const ICON={
  diag:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6M11 8v6"/></svg>',
  map:'<svg viewBox="0 0 24 24"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>',
  path:'<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H14a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h5.5"/></svg>',
  track:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M8 4v5M16 4v5M7 14h4M7 17h7"/></svg>',
  again:'<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/></svg>',
  rule:'<svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>'
};
const STEPS=[
  {t:"О программе"},
  {t:"Диагностика", ic:"diag", d:"Команда решает кейс 45 минут. Разбор по стенограмме — кто что сказал и когда."},
  {t:"Карта сыгранности", ic:"map", d:"Где команда теряет результат: наблюдение, доказательство из стенограммы, влияние и что тренируем."},
  {t:"Траектории", ic:"path", d:"Каждому — наблюдения из сессии, следующее действие и задачи на каждый кейс."},
  {t:"Программа развития", ic:"track", d:"Собирается под разрывы команды. Пример — 6 кейсов для проектной команды."},
  {t:"Повторная диагностика", ic:"again", d:"Новый кейс — те же слабые места. Что сдвинулось, что дальше."},
];
let cur=0, caseN=0, tab="passport";

function nav(){
  const w=document.getElementById("steps"); w.innerHTML="";
  STEPS.forEach((s,i)=>{
    if(!i) return;
    const b=el("button",(i===cur?"on":i<cur?"done":""),(i?'<span class="n">'+i+'</span>':"")+esc(s.t));
    b.onclick=()=>go(i); w.appendChild(b);
  });
}
function go(i,opts){
  cur=i; caseN=(opts&&opts.caseN)||0; if(opts&&opts.tab) tab=opts.tab;
  app.innerHTML=""; const v=el("section","view"); app.appendChild(v);
  [start,diag,map,traj,track,again][i](v);
  nav(); bind(v);
  window.scrollTo({top:0,behavior:"smooth"});
}
function bind(root){
  root.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(+b.dataset.go));
  root.querySelectorAll("[data-case]").forEach(b=>b.onclick=()=>go(4,{caseN:+b.dataset.case,tab:"passport"}));
}
document.querySelector(".brand").onclick=()=>go(1);
const nextBtns=(i)=>'<div class="actions">'+(i>1?'<button class="btn btn-ghost" data-go="'+(i-1)+'">← '+esc(STEPS[i-1].t)+'</button>':"")+
  (i<5?'<button class="btn btn-primary" data-go="'+(i+1)+'">Дальше: '+esc(STEPS[i+1].t)+' →</button>':'<button class="btn btn-primary" data-go="1">К диагностике</button>')+
  (i===5?'<button class="btn btn-ghost btn-rep" data-rep>'+REP_IC+'Отчёт по сессии · печать / PDF</button>':'')+'</div>';
const REP_IC='<svg viewBox="0 0 24 24"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>';
document.addEventListener("click",e=>{if(e.target.closest("[data-rep]")){e.preventDefault();printReport();}});

/* ================= 0. О программе ================= */
function start(v){
  v.innerHTML=
  '<div class="hero"><div>'+
    '<div class="eyebrow">Программа развития команд</div>'+
    '<h1>Сыгранность команды — <em>это навык.</em> Его можно развить.</h1>'+
    '<p class="lead">ЭКИПАЖ наблюдает, как команда решает реальную задачу, показывает, где взаимодействие снижает результат, '+
    'и превращает эти наблюдения в персональные и командные упражнения. Повторный прогон показывает, что действительно изменилось.</p>'+
    '<div class="actions" style="margin-top:0"><button class="btn btn-primary" data-go="1">Как это работает · MVP →</button></div>'+
  '</div>'+
  '<div class="hero-card"><div class="k">Как устроена программа</div>'+
    '<div class="row"><b>45</b><span>минут — диагностика: команда решает кейс, разбор идёт по стенограмме</span></div>'+
    '<div class="row"><b>3–6</b><span>кейсов в программе развития — число и порядок подбираются под разрывы команды</span></div>'+
    '<div class="row"><b>5</b><span>личных траекторий — у каждого следующее действие и задачи на каждый кейс</span></div>'+
    '<div class="row"><b>1</b><span>кодекс экипажа — рабочие договорённости, которые команда уносит в реальные проекты</span></div>'+
  '</div></div>'+
  '<div class="gap-l">'+changeBlock(true)+'</div>'+
  '<div class="gap-l"><div class="lab">Путь команды · пять шагов</div><div class="flow" id="flow"></div></div>'+
  '<section class="airole gap-l"><div class="lab">Роль ИИ</div><div class="ai-g">'+
    '<div class="ai-c ai"><div class="hd"><span class="ic"><svg viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 4v3M9 12h.01M15 12h.01M9.5 15h5"/></svg></span>Что делает ИИ</div><ul><li>разделяет и структурирует обсуждение</li><li>связывает наблюдение с конкретной репликой или эпизодом</li><li>размечает заданные поведенческие индикаторы</li><li>помогает собрать персональные рекомендации</li><li>сравнивает динамику между прогонами</li></ul></div>'+
    '<div class="ai-c hu"><div class="hd"><span class="ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 19.5c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"/></svg></span>Что остаётся за методикой и человеком</div><ul><li>какие компетенции и паттерны оцениваются</li><li>критерии сильного поведения</li><li>правила интерпретации</li><li>финальная проверка спорных выводов</li><li>дизайн развивающей интервенции</li></ul></div>'+
  '</div></section>'+
  '<div class="gap-l grid2">'+
    '<div class="card soft"><div class="h3">Команда в демонстрации</div>'+
      '<p style="color:var(--muted);font-size:14px;margin-bottom:16px">Пять руководителей. Сначала они решали управленческие кейсы и увидели: '+
      'проигрывают не умом, а сыгранностью. Эту команду мы и проведём по всему пути.</p>'+
      '<div class="team-strip" id="teamStrip"></div></div>'+
    '<div class="card soft"><div class="h3">Что остаётся у команды</div><div class="outcomes" style="grid-template-columns:1fr">'+
      '<div class="oc"><div class="t">План развития команды</div><div class="d">Разрывы команды, кейсы под них и порядок прохождения.</div></div>'+
      '<div class="oc"><div class="t">Личная карта развития</div><div class="d">У каждого участника — что сработало в сессии, где вклад можно усилить, и следующее действие.</div></div>'+
      '<div class="oc"><div class="t">Кодекс экипажа</div><div class="d">Собственный набор рабочих правил команды: договорённости из кейсов, которые применяются в реальных проектах без напоминания.</div></div>'+
    '</div></div>'+
  '</div>';
  const f=v.querySelector("#flow");
  STEPS.slice(1).forEach((s,i)=>{
    const b=el("button","fstep",'<span class="no">'+(i+1)+'</span><div class="ic">'+ICON[s.ic]+'</div><div class="t">'+esc(s.t)+'</div><div class="d">'+esc(s.d)+'</div>');
    b.dataset.go=i+1; f.appendChild(b);
  });
  const ts=v.querySelector("#teamStrip");
  D.team.forEach(m=>ts.appendChild(el("div","tm",'<img class="ph" src="'+m.photo+'" alt=""><div><div class="n">'+esc(m.name)+'</div></div>')));
}

/* ================= MVP: встроенный прототип, открывается в новой вкладке ================= */
let MVP_HTML=null; const MVP_URLS={};
const MVP_DEEP='<script>window.addEventListener("load",function(){setTimeout(function(){try{'+
  'var bar=document.getElementById("ekp-tabbar");if(bar&&bar.children[4])bar.children[4].click();'+
  'setTimeout(function(){var r=window.MTR||document;var s=r.querySelector("#caseSel");'+
  'if(s){s.value="lesnogorsk";s.dispatchEvent(new Event("change"));}},250);}catch(e){}},250);});<\/script>';
async function openMVP(ev){
  const mode=(ev&&ev.currentTarget&&ev.currentTarget.dataset.mvp)||"";
  const tab=window.open("","_blank");
  try{
    if(!MVP_URLS[mode]){
      if(MVP_HTML===null){
        const src=document.getElementById("mvp-gz");
        if(!src||!src.textContent.trim()) throw new Error("нет встроенного MVP");
        const bin=Uint8Array.from(atob(src.textContent.trim()),c=>c.charCodeAt(0));
        MVP_HTML=await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
      }
      const html=mode==="lesnogorsk"?MVP_HTML.replace(/<\/body>(?![\s\S]*<\/body>)/,MVP_DEEP+"</body>"):MVP_HTML;
      MVP_URLS[mode]=URL.createObjectURL(new Blob([html],{type:"text/html;charset=utf-8"}));
    }
    if(tab) tab.location.href=MVP_URLS[mode]; else location.href=MVP_URLS[mode];
  }catch(e){
    const rel="ЭКИПАЖ_прототип.html";
    if(tab) tab.location.href=rel; else location.href=rel;
  }
}

/* ================= стенограмма с разметкой ================= */
function trSrc(k){return k==="vec"?{title:D.vec.title,rows:D.tr.vec}:{title:D.diag.title,rows:D.tr.les};}
let trLast=null;
function openTr(k,ts,who){
  const S=trSrc(k), rows=S.rows;
  const old=document.querySelector(".trm"); if(old) old.remove();
  trLast=document.activeElement;
  const cnt={}; rows.forEach(r=>{if(r[3]) cnt[r[3]]=(cnt[r[3]]||0)+1;});
  const ov=el("div","trm");
  ov.setAttribute("role","dialog"); ov.setAttribute("aria-modal","true"); ov.setAttribute("aria-label","Стенограмма "+S.title);
  ov.innerHTML='<div class="trm-box">'+
    '<div class="trm-h"><div><div class="lab" style="margin-bottom:4px">Стенограмма с разметкой</div><div class="h3">'+esc(S.title)+'</div>'+
      '<div class="s">'+rows.length+' реплик · 45 минут · у каждой реплики — тип вклада в работу команды</div></div>'+
      '<button class="x" aria-label="Закрыть">×</button></div>'+
    '<div class="trm-f"><div class="g" id="fw"><span>Кто</span><button class="fb on" data-w="">Все</button>'+
      D.team.map(m=>'<button class="fb" data-w="'+esc(m.short)+'"><img src="'+m.photo+'" alt="">'+esc(m.short)+'</button>').join("")+'</div>'+
      '<div class="g" id="ft"><span>Тип</span><button class="fb on" data-t="">Все</button>'+
      TAGS_ALL.map(t=>'<button class="fb" data-t="'+t+'">'+tagB(t).replace('class="tg','style="margin:0" class="tg')+'<small>'+(cnt[t]||0)+'</small></button>').join("")+'</div></div>'+
    '<div class="trm-l" id="trl"></div>'+
    '<div class="trm-n">Разметка — не оценка: она показывает, что делала реплика для работы команды. Ведущий подсвечен серым и в разбор не входит.</div>'+
  '</div>';
  const list=ov.querySelector("#trl");
  rows.forEach((r,i)=>{
    const m=M[r[1]];
    const d=el("div","tr2"+(m?"":" host"),'<span class="ts">'+r[0]+'</span><span class="sp"><i style="background:'+(m?m.color:"#B7BFCD")+'"></i>'+esc(r[1])+'</span><span class="tx">'+tagB(r[3])+esc(r[2])+'</span>');
    d.dataset.w=r[1]; d.dataset.t=r[3]; d.dataset.i=i; list.appendChild(d);
  });
  const empty=el("div","trm-e hidden","Таких реплик нет."); list.appendChild(empty);
  let fw="",ft="";
  const apply=()=>{let n=0;list.querySelectorAll(".tr2").forEach(d=>{const on=(!fw||d.dataset.w===fw)&&(!ft||d.dataset.t===ft);d.classList.toggle("hidden",!on);if(on)n++;});empty.classList.toggle("hidden",n>0);};
  ov.querySelectorAll("#fw .fb").forEach(b=>b.onclick=()=>{fw=b.dataset.w;ov.querySelectorAll("#fw .fb").forEach(x=>x.classList.toggle("on",x===b));apply();});
  ov.querySelectorAll("#ft .fb").forEach(b=>b.onclick=()=>{ft=b.dataset.t;ov.querySelectorAll("#ft .fb").forEach(x=>x.classList.toggle("on",x===b));apply();});
  const close=()=>{ov.remove();document.documentElement.classList.remove("modal-open");document.removeEventListener("keydown",onKey);if(trLast&&trLast.focus)trLast.focus();};
  const onKey=e=>{if(e.key==="Escape")close();};
  ov.querySelector(".x").onclick=close;
  ov.addEventListener("click",e=>{if(e.target===ov)close();});
  document.addEventListener("keydown",onKey);
  document.body.appendChild(ov); document.documentElement.classList.add("modal-open");
  ov.querySelector(".x").focus();
  if(ts){
    let i=rows.findIndex(r=>r[0]===ts&&(!who||r[1]===who)); if(i<0) i=rows.findIndex(r=>r[0]===ts);
    if(i<0){const sec=t=>{const[a,b]=t.split(":");return +a*60+ +b;};const tt=sec(ts);i=rows.findIndex(r=>sec(r[0])>=tt);}
    if(i>=0){const d=list.children[i];d.classList.add("hl");requestAnimationFrame(()=>{list.scrollTop=d.offsetTop-list.clientHeight/2+d.clientHeight/2;});}
  }
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-tr]");if(b){e.preventDefault();openTr(b.dataset.tr,b.dataset.ts,b.dataset.who);}});

/* ================= эталон кейса ================= */
function etalon(k){
  const E=D.etalon[k], c=E.cnt;
  const item=(x,i)=>'<li class="'+x.s+'"><span class="ic">'+(x.s==="pass"?"✓":x.s==="partial"?"½":"✕")+'</span><div><div class="t">'+esc(x.t)+'</div>'+
    (x.ts?'<div class="e">'+tsl(x.ts,x.who,k)+' <b>'+esc(x.who)+'</b> — «'+esc(x.q)+'»</div>':"")+
    (x.why?'<div class="e">'+esc(x.why)+'</div>':"")+'</div></li>';
  const open=E.items.filter(x=>x.s!=="pass"), done=E.items.filter(x=>x.s==="pass");
  return '<div class="et-h"><div class="et-v"><b>'+E.pct+'%</b><span>эталона закрыто</span></div><div>'+
      '<div class="h3">Полнота решения по эталону кейса</div>'+
      '<p>Эталон — признаки сильного решения, которые методолог задаёт до сессии. Засчитывается только то, что прозвучало в обсуждении: '+
      'пункт закрыт — 1, частично — 0,5. Итог — <b>'+fmtN(E.score)+' из '+E.n+'</b>.</p></div></div>'+
    '<div class="et-bar"><i class="p" style="width:'+(100*c.pass/E.n)+'%"></i><i class="h" style="width:'+(100*c.partial/E.n)+'%"></i><i class="n" style="width:'+(100*c.no/E.n)+'%"></i></div>'+
    '<div class="et-lg"><span><i style="background:var(--good)"></i>закрыто — '+c.pass+'</span><span><i style="background:#F2C14E"></i>частично — '+c.partial+'</span><span><i style="background:#E7B3B5"></i>не прозвучало — '+c.no+'</span></div>'+
    '<div class="lab" style="margin:16px 0 0">Что не закрыто или закрыто частично</div><ul class="et-l">'+open.map(item).join("")+'</ul>'+
    '<details class="et-more"><summary>Закрытые пункты — '+done.length+'</summary><ul class="et-l">'+done.map(item).join("")+'</ul></details>';
}

/* ================= отчёт по сессии: печать / PDF ================= */
const ST={done:"достигнута",part:"частично",no:"не достигнута"};
const VD={up:"сдвиг есть",flat:"сдвиг небольшой",none:"сдвига нет",hold:"уровень удержан"};
function printReport(){
  let r=document.getElementById("rep"); if(!r){r=el("div");r.id="rep";document.body.appendChild(r);}
  const q=(ts,who,t)=>'<div class="q"><b>'+esc(ts)+'</b> '+esc(who)+' — '+(/[«»]/.test(t)?esc(t):'«'+esc(t)+'»')+'</div>';
  const E=D.etalon.les;
  r.innerHTML='<div class="k">ЭКИПАЖ · развитие сыгранности команды</div><h1>Отчёт по сессии</h1>'+
    '<div class="meta">Команда: '+D.team.map(m=>esc(m.name)).join(", ")+'<br>Диагностика — '+esc(D.diag.title)+' · повторная диагностика — '+esc(D.vec.title)+'</div>'+
    '<h2>1. Где команда теряет результат</h2>'+D.weak.map((x,i)=>'<div class="blk"><h3>'+(i+1)+'. '+esc(x.title)+'</h3>'+
      '<div><span class="k">Наблюдение.</span> '+esc(x.obs)+'</div>'+x.evidence.map(e=>q(e[0],e[1],e[2])).join("")+
      '<div><span class="k">Влияние.</span> '+esc(x.impact)+'</div><div><span class="k">Что тренируем.</span> '+esc(x.train)+'</div></div>').join("")+
    '<h2>2. На что команда может опереться</h2><ul>'+D.strong.map(([ts,t,d])=>'<li><b>'+esc(ts)+'</b> '+esc(t)+'. '+esc(d)+'</li>').join("")+'</ul>'+
    '<h2>3. Полнота решения по эталону кейса</h2><p>'+fmtN(E.score)+' из '+E.n+' ('+E.pct+'%): закрыто '+E.cnt.pass+', частично '+E.cnt.partial+', не прозвучало '+E.cnt.no+'.</p>'+
      '<ul>'+E.items.filter(x=>x.s!=="pass").map(x=>'<li>'+(x.s==="partial"?"частично: ":"нет: ")+esc(x.t)+'</li>').join("")+'</ul>'+
    '<h2>4. Индивидуальные траектории</h2>'+D.traj.map(t=>'<div class="blk"><h3>'+esc(t.name)+'</h3>'+
      '<div><span class="k">Что сработало.</span> '+esc(t.good)+'</div><div><span class="k">Где вклад можно усилить.</span> '+esc(t.missed)+'</div>'+
      '<div><span class="k">Следующее действие.</span> '+esc(t.action)+'</div></div>').join("")+
    '<h2>5. Программа развития и договор на повторную диагностику</h2>'+
      '<div>Начать с кейсов: '+D.priority.map(n=>n+' «'+esc(CASE(n).name)+'»').join(" → ")+', затем 4, 5, 6.</div>'+
      '<table><tr><th>Что смотрим</th><th>Сейчас</th><th>Цель</th><th>Как добиться</th></tr>'+
      D.compare.map(x=>'<tr><td>'+esc(x.title)+'</td><td>'+esc(x.b_val)+' — '+esc(bef(x))+'</td><td>'+esc(x.goal)+'</td><td>'+esc(x.how)+'</td></tr>').join("")+'</table>'+
      '<div class="blk" style="margin-top:3mm"><span class="k">Кодекс экипажа.</span><ol>'+[1,2,3,4,5,6].map(n=>'<li>'+esc(D.rules[n])+'</li>').join("")+'</ol></div>'+
    '<h2>6. Повторная диагностика: что сдвинулось</h2>'+
      '<table><tr><th>Что смотрим</th><th>До</th><th>После</th><th>Итог</th><th>Цель по договору</th></tr>'+
      D.compare.map(x=>'<tr><td>'+esc(x.title)+'</td><td>'+esc(x.b_val)+'</td><td>'+esc(x.a_val)+'</td><td>'+VD[x.verdict]+'</td><td>'+esc(x.goal)+' — '+ST[x.status]+'</td></tr>').join("")+'</table>'+
      '<p style="margin-top:2mm">'+esc(D.next.text)+'</p>'+
    '<div class="foot">Отчёт описывает поведение команды в конкретных сессиях, а не личные качества участников. Каждый вывод связан с минутой стенограммы.</div>';
  window.print();
}

/* ================= блок «Главное — изменение» ================= */
function changeBlock(withLink,label){
  const ar='<div class="ar"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>';
  const ex=["info","goal"].map(k=>D.compare.find(x=>x.key===k)).filter(Boolean)
    .map(x=>'<span class="pill">'+esc(x.title)+': <b>'+esc(x.b_val)+'</b><span class="to">→</span><b>'+esc(x.a_val)+'</b></span>').join("");
  return '<section class="change"><div class="eyebrow">'+(label||"Повторная диагностика")+'</div>'+
    '<h2>Главное — не оценка. <span>Главное — изменение.</span></h2>'+
    '<div class="cflow">'+
      '<div class="cs"><div class="no">01</div><div class="t">Первый прогон</div><div class="d">Находим проблемный поведенческий паттерн — с минутой и цитатой.</div></div>'+ar+
      '<div class="cs"><div class="no">02</div><div class="t">Тренировка</div><div class="d">Кейсы программы тренируют именно этот паттерн.</div></div>'+ar+
      '<div class="cs"><div class="no">03</div><div class="t">Новый кейс</div><div class="d">Та же команда, те же 45 минут, другой сюжет.</div></div>'+ar+
      '<div class="cs fin"><div class="no">04</div><div class="t">Смотрим, изменилось ли именно это поведение</div><div class="d">В тех же местах, где был разрыв, — а не «в среднем по команде».</div></div>'+
    '</div>'+
    '<div class="cnote"><span class="lbl">Как сравниваем</span><div class="q">Сравниваем <b>не результаты разных кейсов</b>, а <b>поведение команды в тех местах, где был выявлен разрыв</b>.</div></div>'+
    (ex?'<div class="cex"><span class="k">В демонстрации — минута, когда это произошло впервые, до и после:</span>'+ex+'</div>':'')+
    (withLink?'<div class="go"><button class="btn btn-white" data-go="5">Посмотреть повторную диагностику →</button></div>':'')+
  '</section>';
}

/* ================= 1. Диагностика ================= */
function diag(v){
  const C=D.diag;
  v.innerHTML='<div class="eyebrow">Шаг 1 · Диагностика</div>'+
  '<h2 class="title">Команда решает кейс так, как работает на самом деле</h2>'+
  '<p class="lead">45 минут, реальный управленческий кейс, у каждого — своя закрытая информация. Роли заранее '+
  'не назначены: как команда распределится сама — уже часть диагностики. Разговор записывается, разбор идёт по стенограмме.</p>'+
  '<div class="card"><div class="case-row"><div class="ct"><div class="lab">Кейс диагностики</div><div class="h3">'+esc(C.title)+'</div></div>'+
    '<button class="btn btn-ghost" id="caseBtn">Свернуть кейс ↑</button></div>'+
    '<div class="case-open" id="caseBox"><div class="grid2">'+
      '<div><p style="margin-bottom:12px">'+esc(C.summary)+'</p><p style="color:var(--muted);font-size:14px">'+esc(C.task)+'</p>'+
        '</div>'+
      '<div class="card soft"><div class="lab">Что происходит на диагностике</div><ul class="dl">'+
        '<li>Команда работает 45 минут без вмешательства ведущего — только три вброса по ходу</li>'+
        '<li>Стенограмма размечается автоматически: кто что сказал, когда, какой это вклад</li>'+
        '<li>Наставник разбирает результаты с командой — не в виде оценки, а в виде карты сыгранности</li></ul></div>'+
    '</div></div></div>'+
  '<div class="gap-l"><div class="lab">Кто в команде и с чем пришёл</div><div class="who-grid" id="who"></div></div>'+
  '<div class="gap-l card"><div class="h3">Как шёл разговор · ключевые моменты</div><div class="moments" id="mom"></div>'+
    '<button class="btn btn-ghost btn-sm" data-tr="les" style="margin-top:14px">Стенограмма с разметкой · '+D.tr.les.length+' реплик</button></div>'+
  '<div class="gap-l card">'+etalon("les")+'</div>'+
  nextBtns(1);
  v.querySelector("#caseBtn").onclick=e=>{const b=v.querySelector("#caseBox");b.classList.toggle("hidden");e.target.textContent=b.classList.contains("hidden")?"Посмотреть кейс ↓":"Свернуть кейс ↑";};
  v.querySelectorAll("[data-mvp]").forEach(b=>b.onclick=openMVP);
  const w=v.querySelector("#who");
  D.team.forEach(m=>w.appendChild(el("div","who",'<img class="ph lg" src="'+m.photo+'" alt=""><div class="n">'+esc(m.name)+'</div>'+
    '<div class="c">Карточка: '+esc(D.stakeholder[m.short])+'</div><div class="r"><span class="chip grey">роль не закреплена</span></div>')));
  const mo=v.querySelector("#mom");
  D.moments.forEach(([ts,tone,t,d])=>mo.appendChild(el("div","mo "+tone,'<div class="ts">'+tsl(ts)+'</div><div class="dot"></div><div><div class="t">'+esc(t)+'</div><div class="d">'+esc(d)+'</div></div>')));
}

/* ================= 2. Карта сыгранности ================= */
function map(v){
  v.innerHTML='<div class="eyebrow">Шаг 2 · Карта сыгранности</div>'+
  '<h2 class="title">Где команда теряет результат</h2>'+
  '<p class="lead">Не баллы, а пять мест, где взаимодействие снижало результат. По каждому — что видно в работе команды, '+
  'чем это подтверждается в стенограмме, на что повлияло и что тренируем.</p>'+
  '<div id="weak"></div>'+
  '<div class="gap-l"><div class="lab">На что команда уже может опереться</div><div class="strong" id="strong"></div></div>'+
  '<div class="gap-l"><details class="metrics"><summary>Показатели диагностики</summary>'+
    '<p style="font-size:13.5px;color:var(--muted);margin-bottom:12px">Для наставника. Показатели не складываются в общий балл — '+
    'каждый отвечает на свой вопрос и нужен, чтобы через цикл увидеть сдвиг.</p><table class="mt" id="mt"></table></details></div>'+
  nextBtns(2);
  const w=v.querySelector("#weak");
  D.weak.forEach((x,i)=>{
    const ev=x.evidence.map(e=>'<li><span class="ts">'+tsl(e[0],e[1])+'</span>'+(photo(e[1],"sm")||'<span></span>')+'<span class="tx"><b>'+esc(e[1])+'</b> — '+esc(e[2])+'</span></li>').join("");
    w.appendChild(el("div","wk",
      '<div class="wk-h"><span class="n">'+String(i+1).padStart(2,"0")+'</span><span class="t">'+esc(x.title)+'</span></div>'+
      '<div class="chain">'+
        '<div class="lnk"><div class="k"><i>1</i>Наблюдение</div><div class="x">'+esc(x.obs)+'</div></div>'+
        '<div class="lnk ev"><div class="k"><i>2</i>Доказательство · стенограмма</div><ul class="ev-l">'+ev+'</ul></div>'+
        '<div class="lnk im"><div class="k"><i>3</i>Влияние</div><div class="x">'+esc(x.impact)+'</div></div>'+
        '<div class="lnk tr"><div class="k"><i>4</i>Что тренируем</div><div class="x">'+esc(x.train)+'</div></div>'+
      '</div>'+
      '<div class="wk-f"><span><b>Кейсы программы:</b></span>'+x.cases.map(caseChip).join("")+
        '<span><b>Правило в кодекс:</b> '+esc(D.rules[x.rule])+'</span></div>'));
  });
  const s=v.querySelector("#strong");
  D.strong.forEach(([ts,t,d])=>s.appendChild(el("div","st",'<div class="ts">'+tsl(ts)+'</div><div class="t">'+esc(t)+'</div><div class="d">'+esc(d)+'</div>')));
  const mt=v.querySelector("#mt");
  D.metrics.forEach(r=>mt.appendChild(el("tr",null,'<td class="v">'+r.v+'</td><td><b>'+esc(r.n)+'</b><div class="h">'+esc(r.h)+'</div></td>')));
}

/* ================= 3. Траектории ================= */
function traj(v){
  v.innerHTML='<div class="eyebrow">Шаг 3 · Индивидуальные траектории</div>'+
  '<h2 class="title">Что каждый может тренировать дальше</h2>'+
  '<p class="lead">Это не профиль личности и не ярлык роли. Здесь только то, что было видно в этой сессии, — '+
  'в конкретных эпизодах с минутой стенограммы. В другом кейсе картина может быть другой: на это и рассчитана программа развития. '+
  'Приоритетные кейсы для этой команды выделены.</p>'+
  '<div class="card" id="tj"></div>'+nextBtns(3);
  const w=v.querySelector("#tj");
  D.traj.forEach(t=>{
    const tasks=[1,2,3,4,5,6].map(n=>'<div class="task'+(D.priority.includes(n)?" pri":"")+'"><b>'+n+'</b><span>'+esc(D.tasks[t.short][n])+'</span></div>').join("");
    w.appendChild(el("div","tj",
      '<div class="pers">'+photo(t.short,"lg")+'<div class="n">'+esc(t.name)+'</div><div class="w">'+esc(D.how[t.short])+'</div></div>'+
      '<div><div class="cols">'+
        '<div class="box g"><div class="k">Что сработало в этой сессии</div><div class="x">'+esc(t.good)+'</div>'+quote(t.good_quote.ts,t.short,t.good_quote.text)+'</div>'+
        '<div class="box r"><div class="k">Где вклад можно было усилить</div><div class="x">'+esc(t.missed)+'</div>'+quote(t.missed_quote.ts,t.short,t.missed_quote.text)+'</div>'+
      '</div>'+
      '<div class="act"><div class="k">Следующее действие для тренировки</div>'+esc(t.action)+'</div>'+
      '<div class="lab" style="margin-top:18px;margin-bottom:0">Что тренировать в каждом кейсе программы</div><div class="tasks">'+tasks+'</div></div>'));
  });
}

/* ================= 4. Командный трек ================= */
function track(v){
  if(caseN) return caseView(v, CASE(caseN));
  v.innerHTML='<div class="eyebrow">Шаг 4 · Программа развития</div>'+
  '<h2 class="title">Программа развития — под разрывы этой команды</h2>'+
  '<p class="lead">После диагностики ЭКИПАЖ собирает программу развития под конкретные разрывы команды: какие паттерны тренировать, '+
  'в каком порядке и сколько кейсов на это нужно. Каждый кейс тренирует один паттерн, после каждого — разбор с наставником.</p>'+
  '<div class="card"><div class="h3">План развития этой команды</div><div class="plan" id="plan"></div>'+
    '<div class="prio"><b>Начать с:</b>'+D.priority.map(caseChip).join('<span class="arrow">→</span>')+'<span class="arrow">→</span><span class="chip grey">затем 4, 5, 6</span></div></div>'+
  '<div class="card gap"><div class="h3">Договор на повторную диагностику</div>'+
    '<p style="color:var(--muted);font-size:14px;margin-bottom:8px">До начала программы команда договаривается, что именно должно сдвинуться и как этого добиться. '+
    'На повторной диагностике проверяем по этим же строкам.</p>'+
    '<div class="ctr-w"><table class="ctr"><tr><th>Что смотрим</th><th>Сейчас</th><th>Цель</th><th>Как добиться</th></tr>'+
    D.compare.map(x=>'<tr><td class="m">'+esc(x.title)+'</td><td class="now"><b>'+esc(x.b_val)+'</b>'+esc(bef(x))+'</td><td class="goal"><b>'+esc(x.goal)+'</b></td><td class="how">'+esc(x.how)+'</td></tr>').join("")+
    '</table></div></div>'+
  '<div class="gap-l"><div class="lab">Форматы программ</div>'+
    '<div class="fmt-len"><span class="k">Длина</span>'+
      '<span class="fl-c"><b>3 кейса</b>под один-два главных разрыва</span>'+
      '<span class="fl-c on"><b>6 кейсов</b>под весь профиль разрывов · пример ниже</span>'+
      '<span class="fl-c"><b>больше</b>под задачу команды</span></div>'+
    '<div class="fmts">'+
      '<div class="fm"><div class="t">Команда первых лиц</div><div class="d">Коллегиальное решение, распределение ответственности на уровне правления.</div></div>'+
      '<div class="fm on"><span class="chip">пример ниже</span><div class="t">Проектные команды</div><div class="d">Роли, цель, план, изменения и синхронизация исполнения.</div></div>'+
      '<div class="fm"><div class="t">Кросс-функциональные команды</div><div class="d">Интересы функций, общий результат и согласование без эскалаций.</div></div>'+
      '<div class="fm"><div class="t">Молодые лидеры</div><div class="d">Брать функцию в команде вслух и вносить свою экспертизу вовремя.</div></div>'+
    '</div></div>'+
  '<section class="example gap-l"><div class="eyebrow">Пример программы для проектной команды</div>'+
    '<h3 class="ex-t">Командный трек · 6 кейсов на одном сквозном проекте</h3>'+
    '<p class="ex-s">В демонстрационной программе — 6 кейсов: запуск распределительного центра от первой встречи до синхронизации исполнения. '+
    'Каждый кейс тренирует один конкретный паттерн. Это пример, а не жёсткая конструкция: число кейсов, их порядок и сюжет '+
    'собираются под команду.</p>'+
    '<div class="track" id="track"></div>'+
    '<div class="gap-l codex"><div class="ck">Кодекс экипажа</div><h3>Что команда уносит в реальную работу</h3>'+
      '<div class="s">В ходе кейсов команда формирует собственный набор рабочих правил — конкретных договорённостей, '+
      'которые можно применять в реальных проектах. В этом примере их шесть, по одной на кейс; у другой команды набор будет своим.</div>'+
      '<ol id="codex"></ol>'+
      '<div class="cx-test"><span class="ic"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"/></svg></span>'+
        '<div><b>Критерий готовности — правила соблюдаются без напоминания.</b> Команда сама начинает встречу с ролей, '+
        'сама возвращает отложенное и сама назначает владельца каждому решению — без наставника в комнате.</div></div></div>'+
  '</section>'+
  nextBtns(4);
  const pl=v.querySelector("#plan");
  D.weak.forEach((x,i)=>pl.appendChild(el("div","pl",'<div class="w"><i>'+(i+1)+'</i><span>'+esc(x.title)+'</span></div><div class="c">'+
    x.cases.map(n=>'<button class="chip" data-case="'+n+'">Кейс '+n+'</button>').join("")+'</div><div class="r">'+esc(D.rules[x.rule])+'</div>')));
  const tr=v.querySelector("#track");
  D.cases.forEach(c=>{
    const pri=D.priority.includes(c.n);
    const b=el("button","tc"+(pri?" pri":""),'<div class="top"><span class="no">'+String(c.n).padStart(2,"0")+'</span>'+
      (pri?'<span class="chip red">приоритет · '+(D.priority.indexOf(c.n)+1)+'</span>':'<span class="chip grey">45 + 15 минут</span>')+'</div>'+
      '<div class="t">'+esc(c.title)+'</div><div class="nm">«'+esc(c.name)+'»</div>'+
      '<div class="rule"><b>Правило</b>'+esc(D.rules[c.n])+'</div>');
    b.dataset.case=c.n; tr.appendChild(b);
  });
  const cx=v.querySelector("#codex");
  [1,2,3,4,5,6].forEach(n=>cx.appendChild(el("li",null,esc(D.rules[n]))));
}

function caseView(v,c){
  const TABS=[["passport","Паспорт кейса"],["cards","Закрытые карточки"],["sheet","Лист задания"],["debrief","Разбор после кейса"]];
  v.innerHTML='<button class="back" data-go="4">← Программа развития</button>'+
  '<div class="case-h"><span class="chip">Кейс '+c.n+' из 6</span><span class="chip grey">45 минут + 15 минут разбора</span>'+
    (D.priority.includes(c.n)?'<span class="chip red">приоритет для команды</span>':"")+'</div>'+
  '<h2 class="title" style="margin-bottom:6px">'+esc(c.title)+'</h2>'+
  '<div style="color:var(--blue);font-weight:600;font-size:17px;margin-bottom:18px">«'+esc(c.name)+'»</div>'+
  '<div class="skill"><b>Что развивает кейс</b>'+esc(c.skill)+'</div>'+
  '<div class="rulebox">'+ICON.rule+'<div><div class="k">Правило, которое тренируем</div><div class="v">'+esc(D.rules[c.n])+'</div></div></div>'+
  '<div class="tabs" id="tabs">'+TABS.map(([k,t])=>'<button data-t="'+k+'" class="'+(k===tab?"on":"")+'">'+t+'</button>').join("")+'</div>'+
  '<div id="pane"></div>'+
  '<div class="actions">'+(c.n>1?'<button class="btn btn-ghost" data-case="'+(c.n-1)+'">← Кейс '+(c.n-1)+'</button>':"")+
    (c.n<6?'<button class="btn btn-primary" data-case="'+(c.n+1)+'">Кейс '+(c.n+1)+' →</button>':'<button class="btn btn-primary" data-go="5">Дальше: повторная диагностика →</button>')+'</div>';
  v.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{tab=b.dataset.t;
    v.querySelectorAll("#tabs button").forEach(x=>x.classList.toggle("on",x===b)); pane(v,c);});
  pane(v,c);
}

function pane(v,c){
  const p=v.querySelector("#pane"); p.innerHTML="";
  if(tab==="passport"){
    p.innerHTML='<div class="grid2"><div class="card"><div class="lab">Ситуация</div><div class="txt">'+c.situation.map(x=>"<p>"+esc(x)+"</p>").join("")+'</div>'+
      '<div class="lab" style="margin-top:20px">Задание команде</div><ul class="dl">'+c.task.map(x=>"<li>"+esc(x)+"</li>").join("")+'</ul>'+
      '<div class="lab" style="margin-top:20px">Вбросы ведущего</div>'+c.injections.map(j=>'<div class="inj"><b>'+esc(j.at)+'</b>'+esc(j.text)+'</div>').join("")+'</div>'+
      '<div><div class="card"><div class="lab">Личные задачи участников</div>'+
        D.team.map(m=>'<div class="pt">'+photo(m.short,"sm")+'<div><b>'+esc(m.short)+':</b> '+esc(D.tasks[m.short][c.n])+'</div></div>').join("")+'</div>'+
      '<div class="card gap"><div class="lab">Ограничения</div><div class="cons">'+c.constraints.map(x=>'<div class="con"><div class="v">'+esc(x.v)+'</div><div class="l">'+esc(x.l)+'</div></div>').join("")+'</div>'+
        '<div class="lab" style="margin-top:18px">Что команда сдаёт в конце</div><ul class="dl">'+c.deliverables.map(x=>"<li>"+esc(x)+"</li>").join("")+'</ul></div></div></div>';
  }else if(tab==="cards"){
    p.innerHTML='<p class="lead" style="font-size:15px;margin-bottom:18px">Каждый получает свою карточку. Часть фактов есть только у него — '+
      'как ими распорядиться, решает он сам. На разборе смотрим, дошла ли информация до общего решения.</p><div class="pcards" id="pc"></div>';
    const w=p.querySelector("#pc");
    D.team.forEach(m=>{
      const key=D.card_of[m.short], fn=D.functions[key];
      w.appendChild(el("div","pc",'<div class="hd">'+photo(m.short)+'<div><div class="n">'+esc(m.name)+'</div><div class="f">'+esc(fn)+'</div></div></div>'+
        '<div class="bd"><div class="conf">Что знаете только вы</div><ul class="dl">'+c.cards[key].map(x=>"<li>"+esc(x)+"</li>").join("")+'</ul></div>'));
    });
  }else if(tab==="sheet"){
    renderSheet(p,c);
  }else{
    const key=c.contradictions||c.blockers;
    p.innerHTML='<div class="grid2"><div class="card"><div class="h3">Вопросы наставника</div>'+
      '<p style="color:var(--muted);font-size:14px;margin-bottom:8px">15 минут сразу после кейса. Команда отвечает сама — наставник не оценивает, а помогает увидеть.</p>'+
      '<ol class="refl">'+D.reflection[c.n].map(q=>"<li>"+esc(q)+"</li>").join("")+'</ol></div>'+
      '<div class="card soft"><div class="h3">Что проверить на разборе</div><ul class="dl">'+c.focus.criteria.map(x=>"<li>"+esc(x.charAt(0).toUpperCase()+x.slice(1))+"</li>").join("")+'</ul>'+
      '<div class="lab" style="margin-top:20px">Правило в кодекс</div><div style="font-weight:600">'+esc(D.rules[c.n])+'</div></div></div>'+
      '<details class="mentor"><summary>Материалы наставника: признаки сильного решения'+(key?" и ключ кейса":"")+'</summary>'+
      '<ol class="ck">'+c.checklist.map(x=>"<li>"+esc(x)+"</li>").join("")+'</ol>'+
      (key?'<div class="lab">'+(c.contradictions?"Противоречия в карточках":"Блокеры в статусах")+'</div><ol class="ck">'+key.map(x=>"<li>"+esc(x)+"</li>").join("")+'</ol>':"")+
      '</details>';
  }
}

/* лист задания — пустой бланк команды */
const CYCLE=["","R","A","C","I"];
function renderSheet(p,c){
  const S=c.sheet, w=el("div","sheet");
  w.appendChild(el("div","sheet-h",'<div><div class="t">'+esc(S.title)+'</div><div class="s">'+esc(S.hint)+'</div></div>'+
    '<div class="w">Кейс '+c.n+' · РЦ «Северный»<br>Дата: ____________</div>'));
  S.blocks.forEach(b=>{
    const blk=el("div","blk");
    if(b.type==="raci"){
      blk.appendChild(el("div","blk-t","Пакеты работ × участники"));
      const sc=el("div","tscroll"), t=el("table","sh raci");
      t.innerHTML='<tr><th>Пакет работ</th>'+D.team.map(m=>'<th class="m">'+esc(m.short)+'</th>').join("")+'</tr>';
      b.rows.forEach((r,i)=>{
        const tr=el("tr",null,'<td class="pre">'+(i+1)+". "+esc(r)+'</td>');
        D.team.forEach(()=>{const cd=el("td","c"); cd.dataset.v="";
          cd.onclick=()=>{const nv=CYCLE[(CYCLE.indexOf(cd.dataset.v)+1)%CYCLE.length]; cd.dataset.v=nv; cd.textContent=nv; cd.className="c"+(nv?" "+nv:"");
            const cs=[...tr.querySelectorAll("td.c")]; tr.classList.toggle("bad", cs.some(x=>x.dataset.v)&&cs.filter(x=>x.dataset.v==="A").length!==1);};
          tr.appendChild(cd);});
        t.appendChild(tr);
      });
      sc.appendChild(t); blk.appendChild(sc);
      blk.appendChild(el("div","raci-leg",'<span><b style="background:var(--blue-50);color:var(--blue)">R</b>исполняет</span><span><b style="background:var(--blue);color:#fff">A</b>отвечает за результат</span>'+
        '<span><b style="background:var(--warn-50);color:var(--warn)">C</b>согласует</span><span><b style="background:var(--soft);color:var(--muted)">I</b>информируется</span>'));
    }else if(b.type==="fields"){
      b.items.forEach(([lb,hint,lines])=>{
        const f=el("div","fld",'<div class="lb">'+esc(lb)+'<small>'+esc(hint)+'</small></div>');
        const inp=el("div","in"); inp.contentEditable="true"; inp.style.minHeight=(36+35*(lines-1))+"px"; f.appendChild(inp); blk.appendChild(f);
      });
    }else{
      blk.appendChild(el("div","blk-t",esc(b.title)));
      const sc=el("div","tscroll"), t=el("table","sh");
      t.innerHTML="<tr>"+b.cols.map(x=>"<th>"+esc(x)+"</th>").join("")+"</tr>";
      (b.rows||Array.from({length:b.n},()=>[])).forEach(pre=>{
        const tr=el("tr");
        b.cols.forEach((cn,ci)=>{ if(ci<pre.length) tr.appendChild(el("td",cn==="№"?"pre num":"pre",esc(pre[ci])));
          else {const td=el("td"); td.contentEditable="true"; tr.appendChild(td);} });
        t.appendChild(tr);
      });
      sc.appendChild(t); blk.appendChild(sc);
    }
    w.appendChild(blk);
  });
  p.appendChild(w);
  const a=el("div","actions",'<button class="btn btn-ghost btn-sm" id="clr">Очистить лист</button><button class="btn btn-ghost btn-sm" id="prn">Распечатать</button>'+
    '<span style="font-size:13px;color:var(--muted)">Лист выдаётся команде пустым. Здесь его можно заполнить для демонстрации — данные не сохраняются.</span>');
  a.style.marginTop="16px"; p.appendChild(a);
  p.querySelector("#clr").onclick=()=>{p.innerHTML="";renderSheet(p,c)};
  p.querySelector("#prn").onclick=()=>window.print();
}

/* ================= 5. Повторная диагностика ================= */
function again(v){
  const A=D.after;
  v.innerHTML='<div class="eyebrow">Шаг 5 · Повторная диагностика</div>'+
  '<h2 class="title">Та же команда после программы: что сдвинулось</h2>'+
  '<p class="lead">Новый кейс, те же 45 минут, та же разметка. Это одна из главных частей продукта: '+
  'программа считается сработавшей, только если изменилось поведение в найденных местах.</p>'+
  changeBlock(false,"Как читать этот шаг")+'<div class="gap-l"></div>'+
  '<div class="grid2"><div class="card soft"><div class="lab">Первая диагностика</div><div class="h3">'+esc(D.diag.title)+'</div>'+
    '<p style="font-size:14px;color:var(--muted)">Роли не распределены, команда впервые работает вместе.</p></div>'+
  '<div class="card" style="border-color:var(--blue)"><div class="lab" style="color:var(--blue)">Повторная диагностика</div><div class="h3">'+esc(A.title)+'</div>'+
    '<p style="font-size:14px;color:var(--muted);margin-bottom:14px">'+esc(A.summary)+'</p>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" id="vcBtn">Посмотреть кейс ↓</button>'+
    '<button class="btn btn-ghost btn-sm" data-tr="vec">Стенограмма · '+D.tr.vec.length+' реплик</button></div></div></div>'+
  '<div class="card gap hidden" id="vcBox"><div class="grid2"><div><div class="lab">Ситуация</div><p style="margin-bottom:12px">'+esc(D.vec.summary)+'</p>'+
      '<div class="lab">Задание</div><p style="color:var(--ink2);font-size:14.5px">'+esc(D.vec.task)+'</p></div>'+
    '<div class="card soft"><div class="lab">Что на этот раз было на карточках</div><ul class="dl">'+
      D.team.map(m=>'<li><b>'+esc(m.short)+'</b> — '+esc(D.vec.cards[m.short])+'</li>').join("")+'</ul>'+
      '<p style="font-size:13.5px;color:var(--muted);margin-top:10px">Роли распределены до старта. Те же 45 минут и та же разметка, что на первой диагностике.</p></div></div></div>'+
  '<div class="card gap"><div class="h3">Как шёл разговор · ключевые моменты</div><div class="moments" id="vmom"></div></div>'+
  '<div class="gap-l"><div class="lab">Что сдвинулось · по строкам договора</div><div class="ctr-sum" id="csum"></div></div>'+
  '<div class="card" id="cmp"></div>'+
  '<div class="card gap">'+etalon("vec")+'</div>'+
  '<div class="card gap" style="background:var(--blue-50);border-color:transparent"><div class="h3">Следующий цикл</div>'+
    '<p style="margin-bottom:14px">'+esc(D.next.text)+'</p><div style="display:flex;gap:8px;flex-wrap:wrap">'+D.next.cases.map(caseChip).join("")+'</div></div>'+
  nextBtns(5);
  v.querySelector("#vcBtn").onclick=e=>{const b=v.querySelector("#vcBox");b.classList.toggle("hidden");e.target.textContent=b.classList.contains("hidden")?"Посмотреть кейс ↓":"Свернуть кейс ↑";};
  const vm=v.querySelector("#vmom");
  D.vec.moments.forEach(([ts,tone,t,d])=>vm.appendChild(el("div","mo "+tone,'<div class="ts">'+tsl(ts,null,"vec")+'</div><div class="dot"></div><div><div class="t">'+esc(t)+'</div><div class="d">'+esc(d)+'</div></div>')));
  const cs={done:0,part:0,no:0}; D.compare.forEach(x=>cs[x.status]++);
  v.querySelector("#csum").innerHTML='<span class="cs-s done">достигнуто — '+cs.done+'</span><span class="cs-s part">частично — '+cs.part+'</span><span class="cs-s no">не достигнуто — '+cs.no+'</span>';
  const w=v.querySelector("#cmp");
  D.compare.forEach(x=>{
    w.appendChild(el("div","cmp",'<div class="t">'+esc(x.title)+'<div><span class="vd '+x.verdict+'">'+VD[x.verdict]+'</span></div></div>'+
      '<div class="side b"><div class="k">До программы</div><div class="v">'+esc(x.b_val)+'</div><div class="l">'+esc(x.before)+'</div></div>'+
      '<div class="arr">→</div>'+
      '<div class="side a"><div class="k">После программы</div><div class="v">'+esc(x.a_val)+'</div><div class="l">'+esc(x.after)+'</div></div>'+
      '<div class="cg"><span class="k">Цель по договору</span>'+esc(x.goal)+'<span class="cs-s '+x.status+'">'+ST[x.status]+'</span><span style="color:var(--muted)">факт: '+esc(x.fact)+'</span></div>'+
      (x.quote?'<div class="quote" style="grid-column:2/-1"><div class="qwho">'+photo(x.quote[1],"sm")+'<span class="ts">'+tsl(x.quote[0],x.quote[1],"vec")+'</span> '+esc(x.quote[1])+'</div>«'+esc(x.quote[2])+'»</div>':"")+
      (x.note?'<div class="note">'+esc(x.note)+'</div>':"")));
  });
}

go(1);
})();
