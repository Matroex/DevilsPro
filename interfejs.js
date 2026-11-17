
/* DEVILS — wspólny interfejs. Dodawaj nowe zakładki WYŁĄCZNIE w NAV. */
(()=>{'use strict';
const NAV=[
 {title:'Nawigacja',id:'nav',items:[['📖','Bestiariusz',null],['🏠','Pulpit','pulpit.html'],['🗺️','Mapa','mapa.html']]},
 {title:'Postać',id:'character',items:[['🧙','Postać','postac.html'],['🎒','Ekwipunek','ekwipunek.html'],['✨','Atrybuty','atrybuty.html'],['📜','Umiejętności',null],['⚔️','Ustawienia walki',null],['👥','Wybór postaci','postacie.html']]},
 {title:'Zakon / Piekło',id:'world',items:[['🔨','Kowal',null],['🌿','Zielarka',null],['🛠️','Rzemieślnik',null],['🧙‍♂️','Mistrz',null],['🏋️','Sala treningowa',null],...Array.from({length:10},(_,i)=>['👤',i===0?'Alek':'NPC '+(i+1),i===0?'npc-alek':null])]},
 {title:'HANDEL',id:'trade',items:[['⚖️','Targ',null],['🛍️','Item Shop',null]]},
 {title:'Społeczność',id:'social',items:[['✉️','Poczta',null],['🤝','Przyjaciele',null],['🛡️','Gildia',null]]},
 {title:'Fabuła i progres',id:'story',items:[['📜','Misje',null],['🏆','Ranking',null],['⚔️','Arena PvP',null]]}
];
const QUICK=[['🧙','Postać',null],['📜','Misje',null],['🔔','Alerty',null],['💬','Chat',null],['❔','Pomoc',null],['✉️','Poczta',null],['⚙️','Ustawienia',null]];
const $=(s,root=document)=>root.querySelector(s);const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
function toast(label){const t=$('#devils-toast');t.textContent=label+' — ta funkcja pojawi się w przyszłej aktualizacji.';t.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.hidden=true,3500)}
function getHero(){try{const user=sessionStorage.getItem('idleLoggedUser'),slot=sessionStorage.getItem('idleActiveSlot');if(!user||slot===null)return null;const arr=JSON.parse(localStorage.getItem('idleSlots_'+user)||'[]');return arr[Number(slot)]?.hero||null}catch{return null}}
function readNumber(obj,keys){for(const k of keys){if(obj?.[k]!==undefined&&obj[k]!==null&&obj[k]!==''){const n=Number(obj[k]);if(Number.isFinite(n))return n}}return null}
function readText(obj,keys){for(const k of keys){if(typeof obj?.[k]==='string'&&obj[k].trim())return obj[k]}return null}
function navigate(url){if(url==='postacie.html')sessionStorage.removeItem('idleActiveSlot');if(document.body.dataset.devilsPage==='walka' && typeof window.leaveBattle==='function'){window.leaveBattle(url);return}location.assign(url)}
function mount(){if($('#devils-shell'))return;document.body.classList.add('devils-ui');const shell=el('div');shell.id='devils-shell';const top=el('header','dv-topbar');
const toggle=el('button','dv-mobile-toggle','☰');toggle.type='button';toggle.setAttribute('aria-label','Otwórz nawigację');toggle.onclick=()=>$('#devils-sidebar').classList.toggle('mobile-open');top.appendChild(toggle);
const avatar=el('div','dv-avatar','⚔️');avatar.title='Awatar postaci';top.appendChild(avatar);
const profile=el('div','dv-profile');
const vitals=el('div','dv-vitals');
function makeVital(kind,title){const wrap=el('div','dv-vital');const bar=el('div','dv-vitalbar dv-'+kind);const fill=el('span');bar.appendChild(fill);bar.title=title;bar.setAttribute('aria-label',title);wrap.append(bar);vitals.appendChild(wrap);return {fill,bar,title}}
const hpUI=makeVital('hp','HP'),manaUI=makeVital('mana','Mana');
const identity=el('div','dv-identity');const nameUI=el('div','dv-name','Nie wybrano postaci');const lvlUI=el('div','dv-level','LVL —');identity.append(nameUI,lvlUI);
const resources=el('div','dv-resources');const xpBar=el('div','dv-xp');const xpFill=el('span');xpBar.appendChild(xpFill);xpBar.setAttribute('role','progressbar');xpBar.setAttribute('aria-label','Postęp EXP');xpBar.setAttribute('aria-valuemin','0');xpBar.setAttribute('aria-valuemax','100');const currencies=el('div','dv-currencies');const goldUI=el('span','dv-currency','Złoto: —');const honUI=el('span','dv-currency','Hon: —');const shenUI=el('span','dv-currency','Shen: —');currencies.append(goldUI,honUI,shenUI);resources.append(xpBar,currencies);profile.append(vitals,identity,resources);top.appendChild(profile);
function updateProfile(){const hero=getHero();const battle=window.devilsBattleVitals;nameUI.textContent=readText(hero,['nick','nickname','heroName','name','nazwa','characterName'])||'Nie wybrano postaci';const lvl=readNumber(hero,['level','lvl','poziom']);lvlUI.textContent='LVL '+(lvl??'—');
function setVital(ui,curKeys,maxKeys){const current=readNumber(hero,curKeys),max=readNumber(hero,maxKeys);ui.fill.style.width=current!==null&&max>0?Math.max(0,Math.min(100,current/max*100))+'%':'0%';ui.bar.title=ui.title+' '+(current??'—')+'/'+(max??'—')}
if(battle && document.body.dataset.devilsPage==='walka'){hpUI.fill.style.width=Math.max(0,Math.min(100,battle.hp/battle.maxHp*100))+'%';hpUI.bar.title='HP '+Math.ceil(battle.hp)+'/'+battle.maxHp;manaUI.fill.style.width=Math.max(0,Math.min(100,battle.mp/battle.maxMp*100))+'%';manaUI.bar.title='Mana '+Math.ceil(battle.mp)+'/'+battle.maxMp;}else{setVital(hpUI,['hp','health','currentHp','currentHP','zycie','życie'],['maxHp','maxHP','hpMax','maxHealth','maxZycie','maksZycie']);setVital(manaUI,['mana','mp','currentMana','currentMP'],['maxMana','maxMP','manaMax','mpMax']);}
const xp=readNumber(hero,['exp','xp','experience','doswiadczenie','doświadczenie']);const xpNeeded=readNumber(hero,['expToNext','xpToNext','nextLevelExp','expRequired','xpRequired','expNext','nextExp','expNeeded','xpNeeded']);const xpTotal=readNumber(hero,['maxExp','maxXp','expMax','xpMax']);const xpTarget=xpNeeded??xpTotal;const percent=xp!==null&&xpTarget>0?Math.min(100,Math.max(0,xp/xpTarget*100)):0;xpFill.style.width=percent+'%';xpBar.title=xpTarget>0?'EXP: '+(xp??0)+' / '+xpTarget+' ('+percent.toFixed(1)+'%)': 'EXP: '+(xp??'—')+' (brak danych o wymaganym EXP)';xpBar.setAttribute('aria-valuenow',String(Math.round(percent)));xpBar.setAttribute('aria-valuetext',xpBar.title);
goldUI.textContent='Złoto: '+(readNumber(hero,['gold','zloto','złoto'])??'—');honUI.textContent='Hon: '+(readNumber(hero,['hon','honor','honPoints'])??'—');shenUI.textContent='Shen: '+(readNumber(hero,['shen','shenPoints'])??'—');}
updateProfile();setInterval(updateProfile,1000);window.addEventListener('storage',updateProfile);
top.appendChild(el('div','dv-brand','DEVILS'));
const quick=el('div','dv-quick');QUICK.forEach(([icon,label,url])=>{const b=el('button','',icon);b.type='button';b.title=label;b.setAttribute('aria-label',label);b.onclick=()=>url?navigate(url):toast(label);quick.appendChild(b)});top.appendChild(quick);shell.appendChild(top);
const aside=el('aside','dv-sidebar');aside.id='devils-sidebar';aside.appendChild(el('div','dv-sidebar-title','Nawigacja'));const scroll=el('nav','dv-navscroll');scroll.setAttribute('aria-label','Menu gry');const current=decodeURIComponent(location.pathname.split('/').pop()||'pulpit.html').toLowerCase();let open={};try{open=JSON.parse(localStorage.getItem('devilsMenuSections')||'{}')||{}}catch{};
NAV.forEach(group=>{const section=el('section','dv-group');const head=el('button','dv-grouphead');head.type='button';const heroRace=String(readText(getHero(),['race','rasa','faction','frakcja','type','typ','characterClass'])||'').toLowerCase();const worldTitle=group.id==='world'?(heroRace.includes('demon')||heroRace.includes('piek')?'Piekło':heroRace.includes('anio')||heroRace.includes('angel')?'Zakon':'Zakon / Piekło'):group.title;const label=el('span','',worldTitle);const chevron=el('span','dv-chevron','⌃');head.append(label,chevron);const list=el('div','dv-groupitems');const expanded=open[group.id]!==false;head.setAttribute('aria-expanded',String(expanded));list.hidden=!expanded;head.onclick=()=>{const next=head.getAttribute('aria-expanded')!=='true';head.setAttribute('aria-expanded',String(next));list.hidden=!next;open[group.id]=next;localStorage.setItem('devilsMenuSections',JSON.stringify(open))};section.appendChild(head);
 group.items.forEach(([icon,title,url])=>{const link=el(url&&url!=='npc-alek'?'a':'button','dv-link');if(url&&url!=='npc-alek'){link.href=url;link.addEventListener('click',event=>{event.preventDefault();navigate(url)});if(url.toLowerCase()===current){link.classList.add('active');link.setAttribute('aria-current','page')}}else{link.type='button';link.setAttribute('aria-disabled','true');link.onclick=()=>url==='npc-alek'&&window.DevilsAlek?window.DevilsAlek.open():toast(title)}link.append(el('span','dv-ico',icon),el('span','',title));if(!url)link.appendChild(el('span','dv-soon','wkrótce'));list.appendChild(link)});section.appendChild(list);scroll.appendChild(section)});aside.appendChild(scroll);shell.appendChild(aside);
const t=el('div','dv-toast');t.id='devils-toast';t.hidden=true;t.setAttribute('role','status');shell.appendChild(t);document.body.prepend(shell);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();


// NPC Alek — osobny moduł, bez ingerencji w układ interfejsu.
(function(){if(document.querySelector('script[data-devils-alek]'))return;const s=document.createElement('script');s.src='npc-alek.js';s.dataset.devilsAlek='1';document.head.appendChild(s)})();


/* DEVILS: punkty pasywne naliczane niezależnie od zadania Alka. */
(function(){'use strict';
 function sync(){
  const user=sessionStorage.getItem('idleLoggedUser'),slot=sessionStorage.getItem('idleActiveSlot');
  if(!user||slot===null)return;
  let hero;try{hero=JSON.parse(localStorage.getItem('idleSlots_'+user)||'[]')?.[Number(slot)]?.hero}catch{return}
  if(!hero)return;
  const raw=hero.level??hero.lvl??hero.poziom;
  const level=Number(raw);if(!Number.isFinite(level)||level<1)return;
  const key='devilsAttributes_v2_'+user+'_'+slot;
  let state;try{state=JSON.parse(localStorage.getItem(key)||'null')}catch{}
  if(!state||typeof state!=='object')state={main:null,unlocked:false,lastLevel:null,mainPoints:0,otherPoints:0,levels:{}};
  const rebirth=Math.max(0,Number(hero.rebirths??hero.rebirth??hero.odrodzenia??hero.rebirthCount??0)||0,Number(localStorage.getItem('devilsRebirths_'+user+'_'+slot))||0);
  if(state.seenRebirth==null)state.seenRebirth=rebirth;
  if(rebirth>state.seenRebirth){
   state.seenRebirth=rebirth;state.main=null;state.mainPoints=0;state.otherPoints=0;
   state.lastLevel=1;state.unlocked=false;
   if(state.levels&&typeof state.levels==='object')for(const e of Object.keys(state.levels))if(Array.isArray(state.levels[e]))state.levels[e]=state.levels[e].map(()=>0);
  }
  let last=Number(state.lastLevel);
  if(!Number.isFinite(last)||last<1)last=1;
  state.mainPoints=Math.max(0,Number(state.mainPoints)||0);
  state.otherPoints=Math.max(0,Number(state.otherPoints)||0);
  // Jednorazowa naprawa: stary system gubił punkty za poziomy przed questem.
  if(!state.pointsMigrationV3){
   const spent=Object.values(state.levels||{}).reduce((sum,a)=>sum+(Array.isArray(a)?a.reduce((s,n)=>s+(Number(n)||0),0):0),0);
   if(spent===0&&state.mainPoints===0&&state.otherPoints===0&&last>1)last=1;
   state.pointsMigrationV3=true;
  }
  if(level>last){const gained=Math.floor(level-last);state.mainPoints+=3*gained;state.otherPoints+=gained;state.lastLevel=Math.floor(level)}
  else if(state.lastLevel==null)state.lastLevel=last;
  // Odblokowanie jest wyłącznie po queście, ale punkty naliczamy wcześniej.
  let quest;try{quest=JSON.parse(localStorage.getItem('devilsQuestAlek_'+user+'_'+slot)||'null')}catch{}
  const energy=Number(hero.energy??hero.energia??hero.Energia??0);
  if(quest?.status==='completed'&&quest.element&&level>=2&&energy>=50){
   state.unlocked=true;
   if(rebirth===0)state.main=quest.element;
  }
  const serialized=JSON.stringify(state);
  if(localStorage.getItem(key)!==serialized){localStorage.setItem(key,serialized);window.dispatchEvent(new CustomEvent('devils-points-updated',{detail:{main:state.mainPoints,other:state.otherPoints}}))}
 }
 window.DevilsPoints={sync};sync();window.addEventListener('storage',sync);setInterval(sync,1000);
})();


/* DEVILS GM — dołączenie panelu na stronach gry bez zmian w interfejsie. */
(function () {
  'use strict';
  if (document.querySelector('script[data-devils-gm]')) return;
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'gm.css';
  css.dataset.devilsGmStyle = '1';
  document.head.appendChild(css);
  const script = document.createElement('script');
  script.src = 'gm.js';
  script.defer = true;
  script.dataset.devilsGm = '1';
  document.head.appendChild(script);
})();
