/* Devils — Alek: Zaproszenie na imprezę, wybór żywiołu, rdzeń. Nie zmienia interfejsu. */
(()=>{'use strict';
const TYPES=[
 {id:'ogien',name:'Ogień',icon:'🔥',answer:'Wchodzę pierwszy. Niech wszyscy poczują moją energię!',desc:'Siła ataku i moc'},
 {id:'wiatr',name:'Wiatr',icon:'🌪️',answer:'Pójdę, ale najpierw rozejrzę się i wyczuję atmosferę.',desc:'Zwinność i odporności'},
 {id:'blyskawica',name:'Błyskawica',icon:'⚡',answer:'Jasne! Ruszamy natychmiast, szkoda każdej sekundy!',desc:'Szybkość i destrukcja'},
 {id:'ziemia',name:'Ziemia',icon:'🪨',answer:'Przyjdę. Dopilnuję, żeby wszyscy bezpiecznie wrócili.',desc:'Wytrzymałość, życie i odporności'},
 {id:'woda',name:'Woda',icon:'💧',answer:'Chętnie. Zabiorę coś do picia i zadbam o znajomych.',desc:'Regeneracja, zdrowie, mana'}
];
function context(){const user=sessionStorage.getItem('idleLoggedUser'),slot=sessionStorage.getItem('idleActiveSlot');if(!user||slot===null)return null;const key='idleSlots_'+user;let slots;try{slots=JSON.parse(localStorage.getItem(key)||'[]')}catch{return null}const index=Number(slot);if(!Number.isInteger(index)||!slots[index]?.hero)return null;return {user,slot,key,slots,index,hero:slots[index].hero,questKey:'devilsQuestAlek_'+user+'_'+slot,attributeKey:'devilsAttributes_v2_'+user+'_'+slot}}
function readQuest(c){try{return JSON.parse(localStorage.getItem(c.questKey)||'null')||{status:'new'}}catch{return {status:'new'}}}
function el(tag,text,cls){const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x}
const css=document.createElement('style');css.textContent=`#alek-overlay{position:fixed;inset:0;background:#000c;z-index:99999;display:none;align-items:center;justify-content:center;padding:16px}#alek-overlay.open{display:flex}#alek-dialog{width:min(640px,100%);max-height:90vh;overflow:auto;background:linear-gradient(150deg,#302719,#17191b);border:2px solid #bd934c;border-radius:12px;color:#ead9b7;box-shadow:0 15px 65px #000;padding:24px;font:15px/1.55 Arial,sans-serif}#alek-dialog h2{margin:0 0 12px;color:#f4cc7e;font-size:24px}#alek-dialog p{margin:10px 0}#alek-dialog .alek-reward{background:#362b1b;border:1px solid #896734;border-radius:7px;padding:10px;margin-top:15px}#alek-dialog .alek-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:20px}#alek-dialog button{border:1px solid #a8884b;border-radius:6px;background:#76572b;color:#fff0c8;padding:10px 15px;cursor:pointer}#alek-dialog button.alek-cancel{background:#343638;border-color:#646464}#alek-dialog .alek-option{display:block;text-align:left;width:100%;margin:7px 0;background:#272728}#alek-dialog .alek-option:hover{border-color:#ffda87;background:#49391e}#alek-dialog small{color:#bcae90}`;document.head.appendChild(css);
const overlay=el('div');overlay.id='alek-overlay';const dialog=el('div');dialog.id='alek-dialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Rozmowa z Alkiem');overlay.appendChild(dialog);
function close(){overlay.classList.remove('open')}
function button(text,fn,secondary=false){const b=el('button',text,secondary?'alek-cancel':'');b.type='button';b.onclick=fn;return b}
function actions(...buttons){const a=el('div',undefined,'alek-actions');buttons.forEach(b=>a.appendChild(b));dialog.appendChild(a)}
function notice(text){dialog.appendChild(el('div',text,'alek-reward'))}
function open(){const c=context();dialog.replaceChildren();dialog.appendChild(el('h2','🧙 Alek — Zaproszenie na imprezę'));
if(!c){dialog.appendChild(el('p','Najpierw wybierz postać.'));actions(button('Zamknij',close,true));overlay.classList.add('open');return}
const q=readQuest(c),level=Number(c.hero.level??c.hero.lvl??c.hero.poziom??1);
if(q.status==='completed'&&q.element){dialog.appendChild(el('p','Alek: Świetna impreza! Twój wybór obudził prawdziwą moc. Dbaj o swój rdzeń.'));notice('✅ Zadanie ukończone • Żywioł przewodni: '+TYPES.find(t=>t.id===q.element)?.name+' • Rdzeń Energii odebrany');actions(button('Zamknij',close,true));}
else if(level<2){dialog.appendChild(el('p','Alek: Hej! Znajomi organizują imprezę, ale najpierw nabierz trochę doświadczenia. Wróć do mnie na 2. poziomie.'));notice('🔒 Wymagany poziom postaci: 2 • Aktualny: '+level);actions(button('Wrócę później',close,true));}
else if(q.status==='accepted'||q.status==='completed'){showChoices(c,q.status==='completed');}
else {dialog.appendChild(el('p','Alek: Słuchaj, znajomi zapraszają nas dziś na imprezę! Każdy reaguje na takie zaproszenie inaczej. Twoja odpowiedź pokaże, jaka energia drzemie w Tobie.'));dialog.appendChild(el('p','Zadanie: „Zaproszenie od Alka”. Przyjmij zaproszenie, wybierz swoją odpowiedź, a obudzisz żywioł przewodni.'));notice('🎁 Nagroda: +50 Energii i Rdzeń Energii odpowiadający wybranemu żywiołowi.');actions(button('Akceptuj zadanie',()=>{localStorage.setItem(c.questKey,JSON.stringify({status:'accepted'}));open()}),button('Odrzuć',close,true));}
overlay.classList.add('open');}
function showChoices(c,legacy){dialog.replaceChildren();dialog.appendChild(el('h2','🧙 Alek — Co odpowiesz?'));dialog.appendChild(el('p','Alek: To jak, idziesz z nami? Powiedz, jak podchodzisz do tej imprezy. Twoja odpowiedź określi żywioł przewodni na to życie.'));if(legacy)notice('Poprzednia wersja zadania została już ukończona. Wybierz żywioł i odbierz rdzeń — bez ponownego dodawania 50 Energii.');
TYPES.forEach(t=>{const b=button(t.icon+' '+t.answer+'  →  '+t.name,()=>confirmChoice(c,t,legacy));b.className='alek-option';b.title=t.desc;dialog.appendChild(b)});actions(button('Później',close,true));overlay.classList.add('open')}
function confirmChoice(c,t,legacy){if(!confirm('Wybierasz '+t.name+' jako żywioł przewodni? Zmiana będzie możliwa dopiero po odrodzeniu.'))return;complete(c,t,legacy)}
function complete(old,t,legacy){const c=context();if(!c||c.questKey!==old.questKey)return open();const q=readQuest(c);if(q.status==='completed'&&q.element)return open();if(!['accepted','completed'].includes(q.status)||Number(c.hero.level??c.hero.lvl??1)<2)return open();
const h=c.hero;const current=Number(h.stats?.['Energia']??h.energy??h.energia??0)||0;const energy=current+(legacy?0:50);if(!h.stats||typeof h.stats!=='object')h.stats={};h.stats['Energia']=energy;h.energy=energy;
const inventory=Array.isArray(c.slots[c.index].inventory)?c.slots[c.index].inventory:[];const item={id:'alek-core-'+c.user+'-'+c.slot,type:'energy_core',slot:'core',element:t.id,name:'Rdzeń Energii — '+t.name,icon:t.icon,stats:{},description:'Rdzeń zdobyty za zadanie Alka. Statystyki zostaną ustalone później.',quest:'alek'};
if(!inventory.some(x=>x&&typeof x==='object'&&x.id===item.id)){let idx=inventory.findIndex(x=>!x);if(idx<0)idx=inventory.length;if(idx>=400){alert('Brak miejsca w ekwipunku (400/400). Zwolnij miejsce i wróć do Alka.');return}inventory[idx]=item}
c.slots[c.index].inventory=inventory;c.slots[c.index].hero=h;
let attrs;try{attrs=JSON.parse(localStorage.getItem(c.attributeKey)||'null')||{}}catch{attrs={}}
attrs.main=t.id;attrs.unlocked=true;attrs.lastLevel=Number(h.level??h.lvl??1);attrs.mainPoints=Number(attrs.mainPoints)||0;attrs.otherPoints=Number(attrs.otherPoints)||0;attrs.levels=attrs.levels||{};
try{localStorage.setItem(c.key,JSON.stringify(c.slots));localStorage.setItem(c.attributeKey,JSON.stringify(attrs));localStorage.setItem(c.questKey,JSON.stringify({status:'completed',element:t.id,coreId:item.id,updatedAt:Date.now()}))}catch(e){alert('Nie udało się zapisać zadania. Sprawdź miejsce w pamięci przeglądarki.');return}
open();}
overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(overlay));else document.body.appendChild(overlay);window.DevilsAlek={open,close};
})();
