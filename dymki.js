/* DevilsPro — dymki, tylko odczyt: nie zmieniają przedmiotów ani zapisów. */
(function(){'use strict';
const css=`
#devilsItemTooltip{position:fixed;z-index:99999;pointer-events:none;box-sizing:border-box;width:310px;max-width:calc(100vw - 16px);padding:11px 13px 10px;color:#e9e0ce;background:radial-gradient(ellipse at 50% 30%,#302019 0%,#1b1211 62%,#100d0e 100%);border:1px solid #a47e38;box-shadow:0 10px 32px #000d,inset 0 0 0 2px #392b1d;font:12px/1.25 Arial,Helvetica,sans-serif;text-align:center;display:none}
#devilsItemTooltip.visible{display:block}
#devilsItemTooltip .tip-name{font-size:16px;line-height:1.25;color:#f4d58b;font-weight:600;margin:0 0 4px}
#devilsItemTooltip .tip-line,#devilsItemTooltip .tip-bonus{color:#e9e3d8;font-weight:400;line-height:1.25;margin:0}
#devilsItemTooltip .tip-negative{color:#df766e;font-weight:400}
#devilsItemTooltip .tip-muted{color:#91764c}
#devilsItemTooltip .tip-rarity{font-size:10px;letter-spacing:1.4px;color:#b6a17c;margin-top:4px;text-transform:uppercase}
`;
const runeCss=`
#devilsItemTooltip .devils-rune-sockets{display:flex;flex-direction:column;align-items:stretch;gap:3px;margin:4px 0 4px;width:100%;text-align:left}
#devilsItemTooltip .devils-rune-row{display:flex;align-items:center;gap:7px;min-height:29px;width:100%}
#devilsItemTooltip .devils-rune-row.empty{justify-content:center}
#devilsItemTooltip .devils-rune-row.occupied{justify-content:flex-start}
#devilsItemTooltip .devils-rune-cell{flex:0 0 29px;width:29px;height:29px;box-sizing:border-box;border:1px solid #6c5432;background:linear-gradient(135deg,#241c18,#130e0d);display:flex;align-items:center;justify-content:center}
#devilsItemTooltip .devils-rune-cell.filled{border-color:#b58c46}
#devilsItemTooltip .devils-rune-cell.broken{border-color:#8a3d42}
#devilsItemTooltip .devils-rune-cell img{width:25px;height:25px;object-fit:contain}
#devilsItemTooltip .devils-rune-description{flex:1;min-width:0;font-size:12px;line-height:1.25;overflow-wrap:break-word}
#devilsItemTooltip .devils-rune-title{font-weight:600;color:#e8c987}
#devilsItemTooltip .devils-rune-effect{color:#f0e7d6;font-weight:400}
#devilsItemTooltip .devils-rune-effect.failed{color:#df766e}
`;
const bonusCss=`
#devilsItemTooltip .devils-extra-bonuses{margin:1px 0 0;text-align:center}
#devilsItemTooltip .devils-extra-bonuses + .devils-extra-bonuses{margin-top:1px}
#devilsItemTooltip .devils-normal-bonus{color:#a9dfff;font-weight:400;font-size:inherit;line-height:1.25;margin:0}
#devilsItemTooltip .devils-normal-bonus.maxed{color:#4286dc;font-weight:600}
#devilsItemTooltip .devils-special-bonus{color:#f1c76a;font-weight:600;font-size:inherit;line-height:1.25;margin:0;text-shadow:0 0 6px #6c471b66}
#devilsItemTooltip .devils-tooltip-separator{height:1px;margin:5px 0 4px;background:linear-gradient(90deg,transparent,#9c793f,transparent)}
`;
const typographyCss=`
#devilsItemTooltip, #devilsItemTooltip *{font-family:Arial,Helvetica,sans-serif;letter-spacing:normal;font-style:normal;box-sizing:border-box}
#devilsItemTooltip .tip-line,#devilsItemTooltip .tip-bonus,#devilsItemTooltip .tip-negative,#devilsItemTooltip .devils-normal-bonus,#devilsItemTooltip .devils-special-bonus,#devilsItemTooltip .devils-rune-title,#devilsItemTooltip .devils-rune-effect{font-size:12px!important;line-height:15px!important;min-height:0;margin-top:0;margin-bottom:0;text-transform:none}
#devilsItemTooltip .devils-normal-bonus{font-weight:400}
#devilsItemTooltip .devils-normal-bonus.maxed,#devilsItemTooltip .devils-special-bonus,#devilsItemTooltip .devils-rune-title{font-weight:600}
#devilsItemTooltip .devils-rune-effect{font-weight:400}
`;
const style=document.createElement('style');style.textContent=css+runeCss+bonusCss+typographyCss;document.head.appendChild(style);
let panel=null,active=null;
function ensure(){if(!panel){panel=document.createElement('div');panel.id='devilsItemTooltip';panel.setAttribute('role','tooltip');document.body.appendChild(panel)}return panel}
function line(text,cls='tip-line'){const el=document.createElement('div');el.className=cls;el.textContent=text;return el}
function populate(item){const data=window.DevilsItems?.resolve(item)||item;if(!data)return;const p=ensure();p.replaceChildren();const level=Number(data.upgradeLevel??data.upgrade??data.plus??0);p.appendChild(line((data.name||'Przedmiot')+(data.upgradeable&&level>0?' +'+level:''),'tip-name'));
if(data.quality!=null)p.appendChild(line('Jakość: '+data.quality+(data.maxQuality?'/'+data.maxQuality:'')));
if(data.image){const img=document.createElement('img');img.src=data.image;img.alt='';img.style.cssText='width:62px;height:62px;object-fit:contain;display:block;margin:1px auto 3px';p.appendChild(img)}
if(data.requiredLevel!=null)p.appendChild(line('Od poziomu: '+data.requiredLevel));
const fields=[['damage','Obrażenia broni',''],['magic','Magiczne obrażenia broni',''],['defense','Obrona',''],['block','Blok','%'],['crit','Szansa na trafienie krytyczne','%'],['speed','Szybkość ataku','%']];let count=0;
for(const [key,label,suffix] of fields){const n=Number(data[key]);if(Number.isFinite(n)&&n!==0){p.appendChild(line(label+' '+(n>0?'+':'')+n+suffix,n<0?'tip-negative':'tip-bonus'));count++}}
if(data.stats&&typeof data.stats==='object'){for(const [name,value] of Object.entries(data.stats)){const n=Number(value);if(Number.isFinite(n)&&n!==0){p.appendChild(line(name+' '+(n>0?'+':'')+n,n<0?'tip-negative':'tip-bonus'));count++}}}
if(data.bonuses&&typeof data.bonuses==='object'&&!Array.isArray(data.bonuses)){for(const [name,value] of Object.entries(data.bonuses)){const n=Number(value);if(Number.isFinite(n)&&n!==0){p.appendChild(line(name+' '+(n>0?'+':'')+n,n<0?'tip-negative':'tip-bonus'));count++}}}
// Bonusy dodane kamieniami: zwykłe (1–4) błękitne, wyjątkowe (6–7) złote.
// Dane pobieramy z zapisanego przedmiotu, nie z sumy statystyk, aby nie dublować run.
function renderAddedBonuses(entries,kind){
 if(!Array.isArray(entries)||!entries.length)return;
 const section=document.createElement('div');section.className='devils-extra-bonuses';
 for(const bonus of entries){
  if(!bonus||typeof bonus!=='object')continue;
  const amount=Number(bonus.value);
  if(!Number.isFinite(amount))continue;
  const label=String(bonus.label||bonus.key||'Bonus');
  const unit=String(bonus.unit||'');
  const prefix=amount>0?'+':'';
  // Maksymalna wartość zwykłego bonusu pochodzi z edytowalnej puli konfiguracji.
  // Opcjonalne bonus.maxValue pozwala określić próg osobno dla konkretnego przedmiotu.
  const configured=window.DevilsRunes?.CONFIG?.normalPool;
  const row=Array.isArray(configured)?configured.find(entry=>Array.isArray(entry)&&entry[0]===bonus.key):null;
  const maximum=bonus.maxValue!=null?Number(bonus.maxValue):(row?Number(row[2]):NaN);
  const maxed=kind==='normal'&&Number.isFinite(maximum)&&maximum>0&&amount>=maximum;
  section.appendChild(line(prefix+amount+unit+' '+label,kind==='special'?'devils-special-bonus':('devils-normal-bonus'+(maxed?' maxed':''))));
 }
 if(section.childNodes.length)p.appendChild(section);
}
renderAddedBonuses(data.normalBonuses,'normal');
renderAddedBonuses(data.specialBonuses,'special');
// Trzy gniazda run wyświetlane w dymku broni i zbroi, także przed osadzeniem.
if(['weapon','armor'].includes(data.slot)||['weapon','armor'].includes(data.category)){
 const sockets=Array.isArray(data.runeSockets)?data.runeSockets:(data.weaponRune?[data.weaponRune]:[]);
 const section=document.createElement('div');section.className='devils-rune-sockets';
 for(let i=0;i<(window.DevilsRunes?.CONFIG.runeSlots||3);i++){
  const rune=sockets[i];const row=document.createElement('div');row.className='devils-rune-row '+(rune?'occupied':'empty');
  const cell=document.createElement('div');cell.className='devils-rune-cell'+(rune?(rune.damaged?' broken':' filled'):'');
  row.appendChild(cell);
  if(rune){
   const icon=document.createElement('img');icon.src=rune.damaged?'itemy/runa_uszkodzona.png':(rune.kind==='berserkera'?'itemy/runa_berserkera.png':'itemy/runa_nieskonczonosci.png');icon.alt=rune.damaged?'Uszkodzona runa':'Runa';cell.appendChild(icon);
   const desc=document.createElement('div');desc.className='devils-rune-description';
   const title=document.createElement('div');title.className='devils-rune-title';
   const kindName=rune.kind==='berserkera'?'Runa Berserkera':rune.kind==='nieskonczonosci'?'Runa Nieskończoności':rune.label||'Runa';
   title.textContent=rune.damaged?'– Uszkodzona runa':kindName+(Number.isFinite(Number(rune.level))?' +'+Number(rune.level):'');
   const effect=document.createElement('div');effect.className='devils-rune-effect'+(rune.damaged?' failed':'');
   effect.textContent=rune.damaged?'':'+'+rune.value+'% '+(rune.label||(rune.kind==='berserkera'?'Silny przeciwko potworom':'Szansa na trafienie krytyczne'));
   desc.append(title,effect);row.appendChild(desc);
   cell.title=title.textContent;
  }else cell.title='Wolne gniazdo runy';
  section.appendChild(row);
 }
 p.appendChild(section);
}
const separator=document.createElement('div');separator.className='devils-tooltip-separator';p.appendChild(separator);
if(data.requiredClass)p.appendChild(line(data.requiredClass));
const rarity=data.rarity||'Pospolity';const rl=line(rarity,'tip-rarity');rl.style.color=({Pospolity:'#b7b7b7',Zwykły:'#4fd26a',Rzadki:'#b68bff',Epicki:'#ff6262',Legendarny:'#ffd35e'})[rarity]||'#b7b7b7';p.appendChild(rl);
}
function position(e){const p=ensure();const gap=16;let x=e.clientX+gap,y=e.clientY+gap;const rect=p.getBoundingClientRect();if(x+rect.width>innerWidth-8)x=e.clientX-rect.width-gap;if(y+rect.height>innerHeight-8)y=e.clientY-rect.height-gap;p.style.left=Math.max(8,x)+'px';p.style.top=Math.max(8,y)+'px'}
function show(item,e){if(!item)return;active=item;populate(item);ensure().classList.add('visible');position(e)}
function hide(){active=null;if(panel)panel.classList.remove('visible')}
function bind(element,item){if(!element||!item)return;element.addEventListener('mouseenter',e=>show(item,e));element.addEventListener('mousemove',e=>{if(active)position(e)});element.addEventListener('mouseleave',hide);element.addEventListener('dragstart',hide);element.addEventListener('focus',e=>{const r=element.getBoundingClientRect();show(item,{clientX:r.right,clientY:r.top})});element.addEventListener('blur',hide)}
window.DevilsTooltips={bind,hide};document.addEventListener('scroll',hide,true);window.addEventListener('blur',hide);
})();
