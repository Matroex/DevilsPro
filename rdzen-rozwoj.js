/* DevilsPro: prototyp rozwoju Rdzenia Błyskawicy. Wartości testowe można edytować tutaj. */
(function(){
'use strict';
const CFG={maxPercent:5,pointsPerPercent:100,successMin:5,successMax:15,failureMin:5,failureMax:15,successChanceByQuality:{gray:.40,green:.40,purple:.30,red:.20,gold:.40}};
const KEY='devilsCoreDevelopment_v1';
const css=`
#devilsCoreTooltip{position:fixed;z-index:100001;pointer-events:none;box-sizing:border-box;max-width:min(310px,calc(100vw - 16px));padding:15px 15px 13px;color:#e9e0ce;background:radial-gradient(ellipse at 50% 30%,#302019 0%,#1b1211 62%,#100d0e 100%);border:1px solid #a47e38;box-shadow:0 10px 32px #000d,inset 0 0 0 2px #392b1d;font:13px/1.45 Georgia,'Times New Roman',serif;text-align:center;display:none}

#dp-core-overlay{position:fixed;inset:0;z-index:20000;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;padding:16px;font:13px Arial,sans-serif;color:#e9ddc5}
#dp-core-overlay[hidden]{display:none!important}
.dp-core-window{position:relative;width:min(900px,96vw);max-height:94vh;overflow:auto;background:radial-gradient(ellipse at 30% 10%,#282034,#111014 70%);border:2px solid #9b7b3b;box-shadow:0 0 0 3px #211b12,0 18px 70px #000;padding:24px}
.dp-core-help{position:absolute;right:49px;top:12px;width:27px;height:27px;padding:0;border:1px solid #94743d;background:#231a16;color:#e8c97e;border-radius:3px;font:bold 17px Georgia,serif}.dp-core-help:hover,.dp-core-help:focus-visible{background:#6a4d21;border-color:#f2d58d;box-shadow:0 0 9px #e5b85880}.dp-core-awakening-wrap{display:inline-flex;align-items:stretch}.dp-core-rebirth{border-color:#a17a40;color:#f3d394}.dp-core-rebirth:disabled{opacity:.45;cursor:default}.dp-core-close{position:absolute;right:12px;top:9px;font-size:22px;border:0;background:none;color:#d4b66b;padding:4px 10px}
.dp-core-top{display:flex;align-items:center;gap:14px;padding-right:28px}.dp-core-icon{height:82px;width:82px;object-fit:contain;border:1px solid #8c6b36;background:#151118;padding:7px;flex-shrink:0}.dp-core-top-main{flex:1;min-width:0}.dp-core-name{font:700 19px Georgia,serif;color:#e4c47a;margin:0 0 16px}.dp-core-lvl{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:#e1d5bc;margin-bottom:5px}
.dp-core-track{height:12px;border:1px solid #977b47;background:#0d0d10;overflow:hidden}.dp-core-fill{height:100%;width:0;background:linear-gradient(90deg,#b98200,#ffdf43);transition:width .2s}
.dp-core-body{display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:30px;margin-top:25px}.dp-core-section{font-weight:bold;color:#d8b978;margin:0 0 15px}.dp-core-stat{display:grid;grid-template-columns:minmax(180px,1fr) 210px;align-items:center;gap:12px;margin:0 0 12px;min-height:25px}.dp-core-stat-label{font-size:12px}.dp-core-stat-label.active{font-weight:bold}.dp-core-stat-label.green{color:#63d48a}.dp-core-stat-label.purple{color:#b480ee}.dp-core-stat-label.red{color:#f16d6d}.dp-core-stat-label.gold{color:#e6b94e}.dp-core-stat-value.max{color:#72d58d;font-weight:700}.dp-core-stat-value{text-align:right;font-size:11px;margin-bottom:4px}.dp-core-stat .dp-core-track{height:9px;position:relative}.dp-core-preview{position:absolute;top:0;bottom:0;background:rgba(165,165,165,.88);pointer-events:none;z-index:2}.dp-core-stat-value .dp-core-delta{font-weight:700;margin-right:5px}.dp-core-delta.good{color:#69d88a}.dp-core-delta.bad{color:#ef7777}.dp-core-empty{opacity:.43}.dp-core-stat-actions{display:flex;align-items:center;gap:5px}.dp-core-bless{width:23px;height:23px;flex:0 0 23px;font:700 14px Arial,sans-serif;line-height:18px;padding:0;border:1px solid #9d7b3d;border-radius:3px;background:#302416;color:#e4c678;cursor:pointer}.dp-core-bless:hover{background:#60471f;border-color:#e3bf66}.dp-core-bless-slot{width:23px;flex:0 0 23px}.dp-core-stat-actions{margin-left:0;position:relative;display:block;width:210px;min-width:0}.dp-core-stat-actions>.dp-core-bless,.dp-core-stat-actions>.dp-core-bless-slot{position:absolute;right:calc(100% + 12px);top:9px}.dp-core-stat-actions>div{width:100%}.dp-core-bless:disabled{opacity:.4}.dp-core-stat-label.gray{color:#a6a6a6}.dp-core-aside{display:flex;flex-direction:column;gap:14px}.dp-core-info{color:#a9a2a1;font-size:11px;line-height:1.5}.dp-core-element{padding:10px;border:1px solid #4f422e;text-align:center;color:#b8b0a2}.dp-core-footer{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:25px;padding-top:15px;border-top:1px solid #564329;flex-wrap:wrap}.dp-core-footer button{padding:9px 17px}.dp-core-message{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;color:#c7b8a0;font-size:12px}.dp-core-message.good{color:#73d995}.dp-core-message.bad{color:#ee9999}.dp-core-note{font-size:11px;color:#948b80;margin-top:8px}
@media(max-width:680px){.dp-core-body{grid-template-columns:1fr;gap:10px}.dp-core-stat{grid-template-columns:minmax(100px,1fr) 120px}.dp-core-stat-actions{width:120px}.dp-core-stat-actions>.dp-core-bless,.dp-core-stat-actions>.dp-core-bless-slot{right:calc(100% + 5px)}.dp-core-window{padding:15px}.dp-core-name{font-size:16px}}
`;

// Wszystkie parametry rozwoju są edytowalne w tym pliku.
const CORE={maxLevel:20,expPerReset:2,expStep:50,unlockLevels:[2,5,10,20],blessingName:'błogosławieństwo',maxPoints:500};
// Wartości docelowe odpowiadają 500 punktom (100/100/100/200).
const POOL=[
 {id:'crit',label:'Szansa na trafienie krytyczne',max:10,unit:'%'},
 {id:'double_exp',label:'Szansa na podwójną ilość EXP',max:20,unit:'%'},
 {id:'double_gold',label:'Szansa na podwójną ilość złota',max:20,unit:'%'},
 {id:'poison',label:'Szansa na otrucie',max:5,unit:'%'},
 {id:'triple_exp',label:'Szansa na potrójną ilość EXP',max:10,unit:'%'},
 {id:'training',label:'Bonus do wartości treningu',max:100,unit:'%'},
 {id:'attack',label:'Wartość ataku',max:20,unit:''},
 {id:'speed',label:'Szybkość',max:10,unit:''},
 {id:'intelligence',label:'Inteligencja',max:10,unit:''},
 {id:'stamina',label:'Wytrzymałość',max:10,unit:''},
 {id:'strength',label:'Siła',max:10,unit:''},
 {id:'hp',label:'PŻ',max:1000,unit:''},
 {id:'magic_resistance',label:'Odporność na magię',max:5,unit:'%'}
];
const SPECIAL={id:'piercing',label:'Szansa na przeszywające uderzenie',max:5,unit:'%'};
const MILESTONES=[0,100,200,300,500];
const maxLevelFor=rebirth=>20*(Math.min(2,Math.max(0,rebirth))+1);
const intrinsicMax=rebirth=>[5,8,10][Math.min(2,Math.max(0,rebirth))];
const unlocksFor=rebirth=>[2,5,10,20,...(rebirth>=1?[40]:[]),...(rebirth>=2?[60]:[])];
const rebirthInfo='Bonusy 1-5 zdobywasz poprzez ulepszanie rdzenia do poziomu 20.\nBonus 6 zdobędziesz po pierwszym przebudzeniu i osiągnięciu 40 lvl rdzenia.\nBonus 7 zdobędziesz po drugim przebudzeniu i osiągnięciu 60 lvl rdzenia.';

let overlay=null,current=null,draft=null,rolls=null,dirty=false;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(Number(v))?Number(v):a));
const normalizeBonus=b=>{const reference=[SPECIAL,...POOL].find(x=>x.id===b.id)||[SPECIAL,...POOL].find(x=>x.label===b.label);const base=reference||{id:b.id||'unknown',label:b.label||'Nieznany bonus',max:Number.isFinite(Number(b.max))?Number(b.max):0,unit:b.unit||''};return {...b,id:base.id,label:base.label,max:base.max,unit:base.unit,points:clamp(b.points,0,500),floor:clamp(b.floor,0,500)};};
const milestone=p=>MILESTONES.filter(v=>v<=p).at(-1)||0;
function stage(p){if(p>=500)return {start:300,size:200,name:'gold'};if(p>=300)return {start:300,size:200,name:'red'};if(p>=200)return {start:200,size:100,name:'purple'};if(p>=100)return {start:100,size:100,name:'green'};return {start:0,size:100,name:'gray'}}
function nextExp(level){return level*CORE.expStep}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function isCore(item){return !!item&&(String(item.type||'').toLowerCase()==='energy_core'||/rdze[nń]/i.test(String(item.name||'')))}
function isLightning(item){return /błyskaw|blyskaw/i.test(String(item?.name||item?.id||''))}
// Materiały są pobierane z aktywnego ekwipunku (także ze stacków).
const MATERIALS={blessing:'blogoslawienstwo_rdzenia',fragment:'odlamek_energii_rdzenia'};
function itemMatches(item,id){
 if(!item)return false;
 const resolved=window.DevilsItems?.resolve(item)||item;
 const keys=[item.id,item.catalogId,item.itemId,resolved.id,resolved.catalogId];
 if(keys.some(key=>String(key||'')===id))return true;
 if(id===MATERIALS.blessing&&keys.some(key=>['blogoslawienstwo','blogoslawienstwo_rdzenia'].includes(String(key||''))))return true;
 const name=String(item.name||resolved.name||'').toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 return id===MATERIALS.blessing?name.includes('blogoslawienstwo'):name.includes('odlamek energii rdzenia');
}
function materialIndex(id){try{return typeof inventory!=='undefined'&&Array.isArray(inventory)?inventory.findIndex(x=>itemMatches(x,id)):-1}catch{return -1}}
function materialCount(id){try{if(typeof inventory==='undefined'||!Array.isArray(inventory))return 0;return inventory.reduce((sum,x)=>sum+(itemMatches(x,id)?Math.max(1,Math.floor(Number(x.quantity??x.count??1)||1)):0),0)}catch{return 0}}
function consumeMaterial(id){
 const i=materialIndex(id);if(i<0)return false;
 const x=inventory[i],n=Math.max(1,Math.floor(Number(x.quantity??x.count??1)||1));
 if(n>1){x.quantity=n-1;delete x.count}else inventory[i]=null;
 if(typeof saveInventory==='function')saveInventory();
 if(typeof renderBag==='function')renderBag();
 return true;
}
function availableBlessing(){return materialIndex(MATERIALS.blessing)}
function consumeBlessing(){return consumeMaterial(MATERIALS.blessing)}
// Bonusy są unikalne pomiędzy slotami; zmieniany slot nie blokuje własnego typu.
function bonusCandidates(stats, excludedIndex=-1){
 const occupied=new Set(stats.filter((_,i)=>i!==excludedIndex).map(b=>b.id));
 return POOL.filter(b=>!occupied.has(b.id));
}
function pickBonus(existing){
 const options=bonusCandidates(existing);
 return options.length?{...options[rand(0,options.length-1)]}:null;
}
function load(item){const old=item.coreDevelopment||{};let stats=Array.isArray(old.bonuses)?old.bonuses.map(normalizeBonus):[];
 const first=clamp(Number(old.piercingPoints)||0,0,500);if(!stats.some(b=>b.id==='piercing'))stats.unshift({...SPECIAL,points:first,floor:clamp(Number(old.piercingFloor)||milestone(first),0,500)});
 const rebirth=clamp(Math.floor(Number(old.rebirth)||0),0,2);const limit=maxLevelFor(rebirth);let level=clamp(Math.floor(Number(old.level)||1),1,limit),exp=Math.max(0,Math.floor(Number(old.exp)||0));
 while(level<limit&&exp>=nextExp(level)){exp-=nextExp(level);level++}
 return {level,exp,stats,rebirth};}
function syncUnlock(){const desired=1+unlocksFor(draft.rebirth).filter(n=>draft.level>=n).length;while(draft.stats.length<desired){const next=pickBonus(draft.stats);if(!next)break;draft.stats.push({...next,points:0,floor:0});dirty=true}}
function persist(){if(!current)return;const first=draft.stats[0];current.item.coreDevelopment={level:draft.level,exp:draft.exp,rebirth:draft.rebirth,bonuses:draft.stats.map(b=>({...b})),piercingPoints:first.points,piercingChance:first.points/100,piercingFloor:first.floor};if(typeof saveInventory==='function')saveInventory();try{if(typeof saveGear==='function'&&typeof equipment!=='undefined'&&Object.values(equipment).includes(current.item))saveGear()}catch{}dirty=false}
function message(txt,cls=''){const el=overlay.querySelector('#dp-core-msg');el.textContent=txt;el.className='dp-core-message '+cls}
function fmt(v){return Number(Number.isFinite(v)?v:0).toLocaleString('pl-PL',{maximumFractionDigits:2})}
function value(b){const max=b.id==='piercing'?intrinsicMax(draft?.rebirth||0):(Number.isFinite(Number(b.max))?Number(b.max):([SPECIAL,...POOL].find(x=>x.id===b.id)?.max||0));return clamp(b.points,0,500)/500*max}
function display(b){return '+'+fmt(value(b))+(b.unit||'')}
function rollDelta(bonus){const quality=stage(bonus.points).name;const chance=CFG.successChanceByQuality[quality]??.40;const up=Math.random()<chance;return (up?1:-1)*rand(up?CFG.successMin:CFG.failureMin,up?CFG.successMax:CFG.failureMax)}
function draw(){
 overlay.querySelector('#dp-core-rebirth-count').textContent=draft.rebirth+'/2';const levelLimit=maxLevelFor(draft.rebirth);const levelText=draft.level>=levelLimit?'MAX':`${draft.exp}/${nextExp(draft.level)} EXP`;
 overlay.querySelector('#dp-core-level').textContent=`Lvl ${draft.level}/${levelLimit} · ${levelText}`;
 overlay.querySelector('#dp-core-level-fill').style.width=(draft.level>=levelLimit?100:100*draft.exp/nextExp(draft.level))+'%';
 overlay.querySelector('#dp-core-stats').innerHTML=draft.stats.map((b,i)=>{
  const s=stage(b.points),max=b.points>=500,progress=max?200:b.points-s.start;
  const raw=rolls?.[i],target=raw==null?b.points:clamp(b.points+raw,Math.max(b.floor,milestone(b.points)),500),delta=target-b.points;
  const left=delta>=0?progress:Math.max(0,progress+delta),width=Math.min(Math.abs(delta),s.size);
  const deltaLabel=raw==null?'':`<span class="dp-core-delta ${delta>=0?'good':'bad'}">(${delta>0?'+':''}${delta})</span>`;
  const bless=i>0&&availableBlessing()>=0?`<button type="button" class="dp-core-bless" data-bless="${i}" data-core-tip="Zmień bonus dzięki Błogosławieństwu (zużywa 1 sztukę)" aria-label="Zmień bonus dzięki Błogosławieństwu">↻</button>`:'<span class="dp-core-bless-slot"></span>';
  return `<div class="dp-core-stat"><span class="dp-core-stat-label ${s.name} ${b.points>=100?'active':''}">${b.label} ${display(b)}</span><div class="dp-core-stat-actions">${bless}<div><div class="dp-core-stat-value ${max?'max':''}">${deltaLabel}${max?'MAX':progress+'/'+s.size}</div><div class="dp-core-track"><div class="dp-core-fill" style="width:${max?100:100*progress/s.size}%;background:linear-gradient(90deg,#b98200,#ffdf43)"></div>${raw!=null&&width>0?`<div class="dp-core-preview" style="left:${100*left/s.size}%;width:${100*width/s.size}%"></div>`:''}</div></div></div></div>`;
 }).join('')+Array.from({length:Math.max(0,5-draft.stats.length)},(_,i)=>`<div class="dp-core-stat dp-core-empty"><span class="dp-core-stat-label">Bonus ${draft.stats.length+i+1} — odblokowanie: lvl ${unlocksFor(draft.rebirth)[draft.stats.length+i-1]||levelLimit}</span><div class="dp-core-track"><div class="dp-core-fill"></div></div></div>`).join('');
 overlay.querySelector('#dp-core-upgrade').disabled=!rolls||draft.stats.every(b=>b.points>=500);
 overlay.querySelector('#dp-core-reset').disabled=materialCount(MATERIALS.fragment)<1||(draft.level>=levelLimit&&draft.stats.every(b=>b.points>=500));
 const rebirthButton=overlay.querySelector('#dp-core-rebirth');rebirthButton.hidden=draft.rebirth>=2;rebirthButton.disabled=draft.level<levelLimit||mainCharacterRebirths()<draft.rebirth+1;rebirthButton.closest('.dp-core-awakening-wrap').dataset.coreTip=awakeningRequirement();rebirthButton.textContent='Przebudzenie '+(draft.rebirth+1)+'/2';
 overlay.querySelectorAll('[data-bless]').forEach(btn=>btn.onclick=()=>bless(Number(btn.dataset.bless)));
 overlay.querySelectorAll('[data-core-tip]').forEach(btn=>{btn.addEventListener('mouseenter',e=>showCoreTip(e,btn.dataset.coreTip));btn.addEventListener('mousemove',moveCoreTip);btn.addEventListener('mouseleave',hideCoreTip);btn.addEventListener('focus',e=>showCoreTip({clientX:btn.getBoundingClientRect().right,clientY:btn.getBoundingClientRect().top},btn.dataset.coreTip));btn.addEventListener('blur',hideCoreTip)});
}
let coreTip=null;
function showCoreTip(e,txt){
 if(!coreTip){coreTip=document.createElement('div');coreTip.id='devilsCoreTooltip';coreTip.setAttribute('role','tooltip');document.body.appendChild(coreTip)}
 coreTip.textContent=txt;coreTip.style.whiteSpace='pre-line';coreTip.style.display='block';moveCoreTip(e);
}
function moveCoreTip(e){if(!coreTip||coreTip.style.display==='none')return;const x=Number(e.clientX)||0,y=Number(e.clientY)||0;coreTip.style.left=Math.min(x+15,innerWidth-coreTip.offsetWidth-8)+'px';coreTip.style.top=Math.min(y+15,innerHeight-coreTip.offsetHeight-8)+'px'}
function hideCoreTip(){if(coreTip)coreTip.style.display='none'}
function build(){if(overlay)return;const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);overlay=document.createElement('div');overlay.id='dp-core-overlay';overlay.hidden=true;
 overlay.innerHTML=`<div class="dp-core-window" role="dialog" aria-modal="true" aria-label="Rozwój Rdzenia Błyskawicy"><button class="dp-core-help" type="button" aria-label="Warunki odblokowywania bonusów">?</button><button class="dp-core-close" type="button" aria-label="Zamknij">×</button><div class="dp-core-top"><img class="dp-core-icon" id="dp-core-img" alt="Rdzeń Błyskawicy"><div class="dp-core-top-main"><h2 class="dp-core-name">Rdzeń Błyskawicy</h2><div class="dp-core-lvl"><span>Rozwój rdzenia · Przebudzenia: <span id="dp-core-rebirth-count">0/2</span></span><span id="dp-core-level"></span></div><div class="dp-core-track"><div class="dp-core-fill" id="dp-core-level-fill"></div></div></div></div><div class="dp-core-body"><section><p class="dp-core-section">Statystyki</p><div id="dp-core-stats"></div></section><aside class="dp-core-aside"><button type="button" disabled>Dodaj żywioł (wkrótce)</button><div class="dp-core-element">Miejsce na żywioł I</div><div class="dp-core-element">Miejsce na żywioł II</div><div class="dp-core-info">Resetuj: zużywa 1 Odłamek energii rdzenia, daje +2 EXP i podgląd losowych zmian wszystkich odblokowanych bonusów. Ulepsz: zatwierdza zmiany. Nowe bonusy na poziomach 2, 5, 10 i 20. Błogosławieństwo zmienia rodzaj dodatkowego bonusu. Szansa na dodatni wynik: szary/zielony 40%, fioletowy 30%, czerwony 20% (reszta to wynik ujemny).</div></aside></div><div class="dp-core-footer"><span class="dp-core-message" id="dp-core-msg" role="status"></span><span class="dp-core-awakening-wrap" data-core-tip="Wymogi przebudzenia"><button type="button" class="dp-core-rebirth" id="dp-core-rebirth">Przebudzenie</button></span><button type="button" id="dp-core-upgrade">Ulepsz</button><button type="button" id="dp-core-reset">Resetuj</button><button type="button" id="dp-core-save">Zapisz</button></div></div>`;
 document.body.appendChild(overlay);overlay.querySelector('.dp-core-close').onclick=close;overlay.addEventListener('mousedown',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close()});overlay.querySelector('#dp-core-rebirth').onclick=rebirth;const help=overlay.querySelector('.dp-core-help');help.addEventListener('mouseenter',e=>showCoreTip(e,rebirthInfo));help.addEventListener('mousemove',moveCoreTip);help.addEventListener('mouseleave',hideCoreTip);help.addEventListener('focus',()=>{const r=help.getBoundingClientRect();showCoreTip({clientX:r.left,clientY:r.bottom},rebirthInfo)});help.addEventListener('blur',hideCoreTip);overlay.querySelector('#dp-core-upgrade').onclick=upgrade;overlay.querySelector('#dp-core-reset').onclick=reset;overlay.querySelector('#dp-core-save').onclick=save;
}
function open(item,index){if(!isLightning(item)){alert('Na razie rozwijamy wyłącznie Rdzeń Błyskawicy.');return}build();current={item,index};draft=load(item);syncUnlock();rolls=null;dirty=false;const img=overlay.querySelector('#dp-core-img');
 const paths=['itemy/rdzen_blyskawicy.png','rdzen_blyskawicy.png'];let imageTry=0;
 img.style.visibility='visible';img.onerror=()=>{if(++imageTry<paths.length)img.src=paths[imageTry];else img.style.visibility='hidden'};img.src=paths[0];overlay.hidden=false;message('Resetuj kosztuje 1 Odłamek energii rdzenia i daje +2 EXP. Masz: '+materialCount(MATERIALS.fragment)+' odłamków.');draw()}
function reset(){if(!current)return;if(!consumeMaterial(MATERIALS.fragment)){message('Brakuje Odłamka energii rdzenia.','bad');draw();return}rolls=draft.stats.map(b=>b.points>=500?0:rollDelta(b));if(draft.level<maxLevelFor(draft.rebirth)){draft.exp+=CORE.expPerReset;while(draft.level<maxLevelFor(draft.rebirth)&&draft.exp>=nextExp(draft.level)){draft.exp-=nextExp(draft.level);draft.level++;syncUnlock();while(rolls.length<draft.stats.length)rolls.push(rollDelta(draft.stats[rolls.length]))}if(draft.level===maxLevelFor(draft.rebirth))draft.exp=0;dirty=true}
 // EXP jest przyznawany od razu za Resetuj; zapisujemy go, aby nie znikał po zamknięciu.
 persist();message('Zużyto 1 Odłamek energii rdzenia. Wylosowano zmiany i przyznano +2 EXP. Kliknij „Ulepsz”.','good');draw()}
function mainCharacterRebirths(){
 try{
  const user=sessionStorage.getItem('idleLoggedUser')||'';
  const slot=sessionStorage.getItem('idleActiveSlot');
  const slots=JSON.parse(localStorage.getItem('idleSlots_'+user)||'[]');
  const h=slots?.[Number(slot)]?.hero||{};
  const fromHero=Number(h.rebirths??h.rebirth??h.odrodzenia??h.rebirthCount??0)||0;
  const fromStorage=Number(localStorage.getItem('devilsRebirths_'+user+'_'+slot)||0)||0;
  return Math.max(0,fromHero,fromStorage);
 }catch{return 0}
}
function awakeningRequirement(){
 const needed=draft.rebirth+1;
 const levelLimit=maxLevelFor(draft.rebirth);
 return `Wymogi przebudzenia ${needed}/2:\n• Odrodzenie postaci głównej: ${mainCharacterRebirths()}/${needed}\n• Maksymalny poziom rdzenia: ${draft.level}/${levelLimit}`;
}
function rebirth(){
 if(!current||draft.rebirth>=2||draft.level<maxLevelFor(draft.rebirth)||mainCharacterRebirths()<draft.rebirth+1)return;
 const next=draft.rebirth+1;
 if(!confirm(`Przebudzić rdzeń po raz ${next}? Poziom i EXP wrócą do początku, a nowy limit wyniesie ${maxLevelFor(next)}. Zachowasz wylosowane bonusy i ich postęp.`))return;
 draft.rebirth=next;draft.level=1;draft.exp=0;rolls=null;dirty=true;
 persist();draw();
}
function upgrade(){if(!current||!rolls)return;let changed=false;draft.stats.forEach((b,i)=>{const prev=b.points;const change=Number.isFinite(rolls[i])?rolls[i]:0;b.points=clamp(prev+change,Math.max(b.floor,milestone(prev)),500);b.floor=Math.max(b.floor,milestone(b.points));if(prev!==b.points)changed=true});rolls=null;dirty=changed;message('Zatwierdzono zmiany bonusów.','good');draw()}
function bless(index){
 if(!current||index<1||index>=draft.stats.length||availableBlessing()<0)return;
 const previous=draft.stats[index];
 const alternatives=bonusCandidates(draft.stats,index);
 if(!alternatives.length){message('Brak dostępnych bonusów do wylosowania.','bad');return}
 // Błogosławieństwo zmienia bonus od razu, bez systemowego okna potwierdzenia.
 if(!consumeBlessing()){message('Brakuje Błogosławieństwa.','bad');draw();return}
 const replacement=alternatives[rand(0,alternatives.length-1)];
 // Także ponowne trafienie tego samego bonusu zeruje jego rozwój.
 draft.stats[index]=normalizeBonus({...replacement,points:0,floor:0});
 // Odrzucamy poprzedni podgląd losowań, żeby nie zastosować go do nowego bonusu.
 rolls=null;dirty=true;
 persist();
 message('Zmieniono bonus na: '+replacement.label+'. Rozwój bonusu zaczyna się od początku.','good');
 draw();
}

function save(){if(!current)return;persist();rolls=null;message('Zapisano rozwój rdzenia.','good');draw();if(typeof renderBag==='function')renderBag()}
function close(){hideCoreTip();if(dirty&&!confirm('Masz niezapisane zmiany bonusów. Zamknąć bez zapisywania?'))return;overlay.hidden=true;current=null;draft=null;rolls=null}
window.DevilsCoreUpgrade={isCore,open,config:CORE,bonusPool:POOL,materialCount};
})();
