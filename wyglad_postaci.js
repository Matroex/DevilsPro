/* DevilsPro: wyłącznie odczyt aktualnego ekwipunku; brak nowych kluczy zapisu. */
(function(){
'use strict';
const gearNames={weapon:'Broń',helmet:'Hełm',armor:'Zbroja',gloves:'Rękawice',pants:'Spodnie',boots:'Buty',necklace:'Naszyjnik',ring:'Pierścień',core:'Rdzeń'};
const gearIcons={weapon:'⚔️',helmet:'🪖',armor:'🧥',gloves:'🧤',pants:'👖',boots:'🥾',necklace:'📿',ring:'💍',core:'🔮'};
const user=sessionStorage.getItem('idleLoggedUser');
const rawSlot=sessionStorage.getItem('idleActiveSlot');
const slot=rawSlot===null?NaN:Number(rawSlot);
if(!user||!Number.isInteger(slot)||slot<0||slot>4)return;
const key='idleDemoEquipment_'+user+'_'+slot;
function read(){try{const value=JSON.parse(localStorage.getItem(key)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return {}}}
function readPvp(){try{const value=JSON.parse(localStorage.getItem(key+'_pvp')||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return {}}}
function variant(item,slotName){
 if(!item)return 'brak';
 const value=String(item.visualId||item.appearanceId||item.name||'').toLowerCase();
 if(slotName==='weapon')return /kostur|staff|różdż|rozdz|berł|berl/.test(value)?'kostur':'miecz';
 if(/legend|smocz|bosk|królew|krolew/.test(value))return 'legendarna';
 return 'mistyczna';
}
function update(){
 const eq=window.DevilsActiveEquipmentSet==='pvp'?readPvp():read();const armor=variant(eq.armor,'armor')==='brak'?'start':variant(eq.armor,'armor');const weapon=variant(eq.weapon,'weapon');
 const image='wyglad_postaci/'+armor+'_'+weapon+'.webp';
 const name=eq.armor?.name||'Strój startowy';const weaponName=eq.weapon?.name||'Bez broni';
 for(const target of [document.getElementById('devilsGearPreview')]){
  if(!target)continue;
  target.classList.add('devils-look');target.textContent='';
  const title=document.createElement('div');title.className='look-title';title.textContent='Wygląd bohaterki';
  const img=document.createElement('img');img.src=image;img.alt='Bohaterka: '+name+', '+weaponName;img.loading='eager';
  img.onerror=()=>{const error=document.createElement('div');error.className='look-error';error.textContent='Brak grafiki: '+image;img.replaceWith(error)};
  const sub=document.createElement('div');sub.className='look-sub';sub.textContent=name+' · '+weaponName;
  target.append(title,img,sub);
 }
 const slots=document.getElementById('devilsEquippedSlots');
 if(slots){slots.textContent='';for(const [id,label] of Object.entries(gearNames)){
  const el=document.createElement('div');el.className='equipment-slot';el.title=eq[id]?.name||'Pusty slot: '+label;
  el.textContent=eq[id]?(gearIcons[id]+' '+eq[id].name):label;slots.appendChild(el);
 }}
}
window.DevilsCharacterLook={update};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();
window.addEventListener('storage',e=>{if(e.key===key)update()});
// W ekwipunku renderGear jest wywoływane po każdej zmianie przedmiotu.
// Owijamy funkcję bez modyfikowania jej istniejącej logiki.
if(document.body?.dataset.devilsPage==='ekwipunek'&&typeof window.renderGear==='function'){
 const original=window.renderGear;
 window.renderGear=function(){const result=original.apply(this,arguments);update();return result};
}
})();
