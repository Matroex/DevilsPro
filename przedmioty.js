/* DevilsPro — katalog przedmiotów. Dane instancji w zapisach mają pierwszeństwo. */
(function(){
'use strict';
const katalog={
 'zbroja_lowcy':{id:'zbroja_lowcy',name:'Zbroja Łowcy',icon:'🧥',image:'itemy/zbroja_lowcy.png',slot:'armor',category:'armor',rarity:'Pospolity',requiredLevel:1,requiredClass:'Łowca',upgradeable:true,maxUpgrade:9,evolutionTarget:null,evolutionLevel:75,description:'Początkowa zbroja Łowcy.'},
 'ostry_miecz':{id:'ostry_miecz',name:'Ostry Miecz',icon:'⚔️',image:'itemy/ostry_miecz.png',slot:'weapon',category:'weapon',rarity:'Pospolity',requiredLevel:1,upgradeable:true,maxUpgrade:9,evolutionTarget:null,evolutionLevel:75},
 'buty_lowcy':{id:'buty_lowcy',name:'Buty Łowcy',icon:'🥾',image:'itemy/buty_lowcy.png',slot:'boots',category:'boots',rarity:'Pospolity',requiredLevel:1,upgradeable:true,maxUpgrade:9,evolutionTarget:null,evolutionLevel:75},
 'kaptur_lowcy':{id:'kaptur_lowcy',name:'Kaptur Łowcy',icon:'🪖',image:'itemy/kaptur_lowcy.png',slot:'helmet',category:'helmet',rarity:'Pospolity',requiredLevel:1,upgradeable:true,maxUpgrade:9,evolutionTarget:null,evolutionLevel:75},
 'tarcza_ze_skory':{id:'tarcza_ze_skory',name:'Tarcza ze Skóry',icon:'🛡️',image:'itemy/tarcza_ze_skory.png',slot:'shield',category:'shield',rarity:'Pospolity',requiredLevel:1,upgradeable:true,maxUpgrade:9,evolutionTarget:null,evolutionLevel:75},

 'rekawice_lowcy':{id:'rekawice_lowcy',name:'Rękawice Łowcy',image:'itemy/rekawice_lowcy.png',slot:'gloves',category:'gloves',rarity:'Pospolity',requiredLevel:1,upgradeable:true,maxUpgrade:9},
 'spodnie_lowcy':{id:'spodnie_lowcy',name:'Spodnie Łowcy',image:'itemy/spodnie_lowcy.png',slot:'pants',category:'pants',rarity:'Pospolity',requiredLevel:1,upgradeable:true,maxUpgrade:9},
 'naszyjnik_lowcy':{id:'naszyjnik_lowcy',name:'Naszyjnik Łowcy',image:'itemy/naszyjnik_lowcy.png',slot:'necklace',category:'necklace',rarity:'Pospolity',requiredLevel:1,upgradeable:true,maxUpgrade:9},
 'pierscien_lowcy':{id:'pierscien_lowcy',name:'Pierścień Łowcy',image:'itemy/pierscien_lowcy.png',slot:'ring',category:'ring',rarity:'Pospolity',requiredLevel:1,upgradeable:true,maxUpgrade:9},
 'rdzen_blyskawicy':{id:'rdzen_blyskawicy',name:'Rdzeń Błyskawicy',image:'itemy/rdzen_blyskawicy.png',slot:'core',type:'energy_core',category:'core',rarity:'Pospolity',upgradeable:false},
 'rdzen_ognia':{id:'rdzen_ognia',name:'Rdzeń Ognia',image:'itemy/rdzen_ognia.png',slot:'core',type:'energy_core',category:'core',rarity:'Pospolity',upgradeable:false},
 'rdzen_wody':{id:'rdzen_wody',name:'Rdzeń Wody',image:'itemy/rdzen_wody.png',slot:'core',type:'energy_core',category:'core',rarity:'Pospolity',upgradeable:false},
 'rdzen_ziemi':{id:'rdzen_ziemi',name:'Rdzeń Ziemi',image:'itemy/rdzen_ziemi.png',slot:'core',type:'energy_core',category:'core',rarity:'Pospolity',upgradeable:false},
 'rdzen_wiatru':{id:'rdzen_wiatru',name:'Rdzeń Wiatru',image:'itemy/rdzen_wiatru.png',slot:'core',type:'energy_core',category:'core',rarity:'Pospolity',upgradeable:false},
 'rdzen_ciemnosci':{id:'rdzen_ciemnosci',name:'Rdzeń Ciemności',image:'itemy/rdzen_ciemnosci.png',slot:'core',type:'energy_core',category:'core',rarity:'Pospolity',upgradeable:false},
 'rdzen_swiatla':{id:'rdzen_swiatla',name:'Rdzeń Światła',image:'itemy/rdzen_swiatla.png',slot:'core',type:'energy_core',category:'core',rarity:'Pospolity',upgradeable:false},
 'runa_berserkera':{id:'runa_berserkera',name:'Runa Berserkera',image:'itemy/runa_berserkera.png',type:'weapon_rune',category:'material',runeKind:'berserker',rarity:'Rzadki',upgradeable:false},
 'runa_nieskonczonosci':{id:'runa_nieskonczonosci',name:'Runa Nieskończoności',image:'itemy/runa_nieskonczonosci.png',type:'weapon_rune',category:'material',runeKind:'infinity',rarity:'Rzadki',upgradeable:false},
 'dodanie_1_4':{id:'dodanie_1_4',name:'Dodanie 1–4 bonusu',image:'itemy/dodanie_1_4.png',type:'bonus_stone',category:'material',bonusTier:'1-4',rarity:'Rzadki',upgradeable:false},
 'dodanie_6_7':{id:'dodanie_6_7',name:'Dodanie 6–7 bonusu',image:'itemy/dodanie_6_7.png',type:'bonus_stone',category:'material',bonusTier:'6-7',rarity:'Rzadki',upgradeable:false},

 'blogoslawienstwo':{id:'blogoslawienstwo',name:'Błogosławieństwo',icon:'✦',image:'itemy/blogoslawienstwo.png',type:'core_blessing',category:'material',rarity:'Rzadki',upgradeable:false},
 'odlamek_energii_rdzenia':{id:'odlamek_energii_rdzenia',name:'Odłamek energii rdzenia',icon:'◆',image:'itemy/odlamek_energii_rdzenia.png',type:'core_shard',category:'material',rarity:'Pospolity',upgradeable:false},
 'prezent_startowy':{id:'prezent_startowy',name:'Prezent startowy',icon:'🎁',image:'itemy/prezent.png',type:'quality_gift',category:'chest',rarity:'Pospolity',upgradeable:false},
 'ulepszacz_magiczny':{id:'ulepszacz_magiczny',name:'Magiczny ulepszacz',icon:'✨',image:'itemy/magiczny.png',type:'magic_upgrader',category:'material',rarity:'Epicki',upgradeable:false},
 'ulepszacz_jakosci_zwykly':{id:'ulepszacz_jakosci_zwykly',name:'Ulepszacz jakości — Zwykły',icon:'🧪',image:'itemy/zwykly.png',type:'quality_upgrader',targetRarity:'Zwykły',category:'material',rarity:'Zwykły',upgradeable:false},
 'ulepszacz_jakosci_rzadki':{id:'ulepszacz_jakosci_rzadki',name:'Ulepszacz jakości — Rzadki',icon:'🧪',image:'itemy/rzadki.png',type:'quality_upgrader',targetRarity:'Rzadki',category:'material',rarity:'Rzadki',upgradeable:false},
 'ulepszacz_jakosci_epicki':{id:'ulepszacz_jakosci_epicki',name:'Ulepszacz jakości — Epicki',icon:'🧪',image:'itemy/epicki.png',type:'quality_upgrader',targetRarity:'Epicki',category:'material',rarity:'Epicki',upgradeable:false},
 'ulepszacz_jakosci_legendarny':{id:'ulepszacz_jakosci_legendarny',name:'Ulepszacz jakości — Legendarny',icon:'🧪',image:'itemy/legendarny.png',type:'quality_upgrader',targetRarity:'Legendarny',category:'material',rarity:'Legendarny',upgradeable:false},
 'blogoslawienstwo_rdzenia':{id:'blogoslawienstwo_rdzenia',name:'Błogosławieństwo',icon:'✨',image:'itemy/blogoslawienstwo.png',type:'core_blessing',category:'material',rarity:'Epicki',upgradeable:false,description:'Zmienia jeden losowy dodatkowy bonus rdzenia. Zużywa 1 sztukę.'},
 'odlamek_energii_rdzenia':{id:'odlamek_energii_rdzenia',name:'Odłamek energii rdzenia',icon:'💎',image:'itemy/odlamek_energii_rdzenia.png',type:'core_fragment',category:'material',rarity:'Rzadki',upgradeable:false,description:'Zużyj 1 sztukę, aby wylosować zmiany bonusów rdzenia i zdobyć 2 EXP.'},
 'skrzynka_startowa':{id:'skrzynka_startowa',name:'Skrzynka startowa',icon:'🎁',category:'chest',rarity:'Pospolity',upgradeable:false},
};
const normalize=s=>String(s||'').toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const byName=new Map(Object.values(katalog).map(v=>[normalize(v.name),v]));
const wearable=new Set(['weapon','armor','helmet','shield','gloves','pants','boots','necklace','ring']);
function resolve(item){if(!item||typeof item!=='object')return null;const base=katalog[item.catalogId||item.itemId||item.id]||byName.get(normalize(item.name))||{};const result={...base,...item};if(result.rarity==='Zwykły' && !item.rarity)result.rarity='Pospolity';if(!result.category)result.category=result.slot||result.type||'misc';if(result.slot==='core'||result.type==='energy_core'){result.upgradeable=false;result.upgradeSystem='core'}else if(typeof result.upgradeable!=='boolean')result.upgradeable=wearable.has(result.slot);if(result.upgradeable&&result.maxUpgrade==null)result.maxUpgrade=9;return result}
function create(id,overrides={}){if(!katalog[id])return null;return JSON.parse(JSON.stringify({...katalog[id],...overrides}))}
window.DevilsItems={catalog:katalog,resolve,create,register(entry){if(entry&&typeof entry.id==='string'&&entry.id&&!katalog[entry.id]){katalog[entry.id]={...entry};byName.set(normalize(entry.name),katalog[entry.id]);return true}return false}};
})();
