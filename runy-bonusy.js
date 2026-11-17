/* DevilsPro: wszystkie szanse, poziomy i pule można edytować tutaj. */
(function(){'use strict';
const CONFIG={
 runeChance:.5,normalChance:.5,specialChance:.5,runeSlots:3,
 berserkera:[2,5,8,10,15,20],nieskonczonosci:[1,2,5,10,15,20],
 normalMax:4,specialMax:2,
 normalPool:[
 ['strength','Siła',5,''],['intelligence','Inteligencja',5,''],['vitality','Wytrzymałość',5,''],['agility','Szybkość',5,''],['energy','Energia',5,''],
 ['weaponDamage','Obrażenia broni',10,''],['magicDamage','Obrażenia magiczne',10,''],['defense','Obrona',10,''],['block','Blok',3,'%'],['dodge','Szansa na uniknięcie ciosu',3,'%'],['critical','Szansa na trafienie krytyczne',3,'%'],['attackSpeed','Szybkość ataku',3,'%'],['monsterStrength','Silny przeciwko potworom',5,'%'],['exp','Bonus do doświadczenia',5,'%'],['gold','Bonus do złota',5,'%']
 ],
 specialPool:[
 ['attackValue','Wartość ataku',100,''],['strongDemons','Silny przeciwko Demonom',20,'%'],['strongDevils','Silny przeciwko Devilom',20,'%'],['strongHunters','Silny przeciwko Łowcom',20,'%'],['resistDevils','Odporność na Devile',20,'%'],['resistDemons','Odporność na Demony',20,'%'],['resistHunters','Odporność na Łowców',20,'%'],['hp','PŻ',2000,''],['mana','Mana',1000,''],['defense','Obrona',100,''],['monsterStrength','Silny przeciwko potworom',15,'%'],['totalDamage','Całkowite obrażenia',5,'%'],['criticalReduction','Redukcja obrażeń krytycznych',20,'%']
 ]
};
function resolve(item){return window.DevilsItems?.resolve(item)||item||{}}
function isMaterial(item){const r=resolve(item);return r.type==='weapon_rune'||r.type==='bonus_stone'}
function bonusObj(row){return {key:row[0],label:row[1],value:row[2],unit:row[3]}}
function apply(material,target){
 const reagent=resolve(material);if(!target||target.slot==='core'||target.type==='energy_core')return {accepted:false,message:'Na rdzeń nie można nakładać tych materiałów.'};
 if(reagent.type==='weapon_rune'){
  if(!['weapon','armor'].includes(target.slot))return {accepted:false,message:'Runy można osadzać wyłącznie w broni lub zbroi.'};
  // Trzy niezależne gniazda. Dawny pojedynczy zapis pozostaje kompatybilny.
  const sockets=Array.isArray(target.runeSockets)?target.runeSockets.slice(0,CONFIG.runeSlots):[];
  if(!sockets.length&&target.weaponRune)sockets.push(target.weaponRune);
  while(sockets.length<CONFIG.runeSlots)sockets.push(null);
  const free=sockets.findIndex(x=>!x);
  if(free<0)return {accepted:false,message:'Wszystkie '+CONFIG.runeSlots+' gniazda run w tym przedmiocie są zajęte.'};
  const kind=reagent.runeKind,level=Number(reagent.runeLevel);
  if(!CONFIG[kind]||!Number.isInteger(level)||level<0||level>5)return {accepted:false,message:'Nieznana runa.'};
  const success=Math.random()<CONFIG.runeChance,value=success?CONFIG[kind][level]:0;
  const label=kind==='berserkera'?'Silny przeciwko potworom':'Szansa na trafienie krytyczne';
  sockets[free]={kind,level,damaged:!success,value,label};
  target.runeSockets=sockets;
  // Migracja ze starego modelu: nie dublujemy bonusu po przeniesieniu.
  delete target.weaponRune;
  delete target.runeBonus;
  return {accepted:true,success,message:success?'Gniazdo '+(free+1)+': osadzono runę +'+level+' — +'+value+'% '+label+'.':'Gniazdo '+(free+1)+': runa pękła i nie daje żadnego bonusu.'};
 }
 if(reagent.type==='bonus_stone'){
  if(!['weapon','armor','helmet','shield','gloves','pants','boots','necklace','ring'].includes(target.slot))return {accepted:false,message:'Bonus można dodać tylko do wyposażenia.'};
  const special=reagent.bonusTier==='special',key=special?'specialBonuses':'normalBonuses',max=special?CONFIG.specialMax:CONFIG.normalMax;
  const list=Array.isArray(target[key])?target[key]:[];
  if(list.length>=max)return {accepted:false,message:'Brak miejsca na kolejny bonus tej kategorii.'};
  const pool=(special?CONFIG.specialPool:CONFIG.normalPool).filter(row=>!list.some(b=>b.key===row[0]));
  if(!pool.length)return {accepted:false,message:'Brak nowych bonusów w puli.'};
  const success=Math.random()<(special?CONFIG.specialChance:CONFIG.normalChance);
  if(!success)return {accepted:true,success:false,message:'Porażka: materiał zużyty, bonus nie został dodany.'};
  const bonus=bonusObj(pool[Math.floor(Math.random()*pool.length)]);
  target[key]=list;list.push(bonus);
  return {accepted:true,success:true,message:'Dodano: +'+bonus.value+(bonus.unit||'')+' '+bonus.label+'.'};
 }
 return {accepted:false,message:'Nieznany materiał.'};
}
function runes(item){
 const slots=Array.isArray(item?.runeSockets)?item.runeSockets:(item?.weaponRune?[item.weaponRune]:[]);
 return slots.filter(Boolean).filter(r=>!r.damaged).map(r=>({key:r.kind==='berserkera'?'monsterStrength':'critical',label:r.label|| (r.kind==='berserkera'?'Silny przeciwko potworom':'Szansa na trafienie krytyczne'),value:Number(r.value)||0,unit:'%'}));
}
function bonuses(item){return [...(item?.normalBonuses||[]),...(item?.specialBonuses||[]),...runes(item),...(!item?.runeSockets&&!item?.weaponRune&&item?.runeBonus?[item.runeBonus]:[])]}
function total(item,key){return bonuses(item).filter(b=>b.key===key).reduce((n,b)=>n+(Number(b.value)||0),0)}
window.DevilsRunes={CONFIG,isMaterial,apply,bonuses,total,runes};
})();
