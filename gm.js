
/* =========================================
   DEVILS — GAME MASTER
   Lokalny panel developerski
========================================= */

(() => {
  "use strict";

  /*
   WPISZ TUTAJ SWÓJ LOGIN Z GRY.
   Przykład: ["matroex"]
   To tylko blokada interfejsu, nie
   prawdziwe zabezpieczenie serwerowe.
  */
  const GM_ACCOUNTS = ["matroex"];

  const isFullPage =
    document.body.classList.contains("gm-page");

  const user = sessionStorage.getItem("idleLoggedUser");

  function isGM() {
    return !!user &&
      GM_ACCOUNTS.includes(user.toLowerCase());
  }

  if (!isGM()) {
    if (isFullPage) {
      document.body.textContent =
        "Brak dostępu do panelu GM.";
    }
    return;
  }

  const slotRaw = sessionStorage.getItem("idleActiveSlot");
  const activeSlot =
    slotRaw === null ? NaN : Number(slotRaw);

  const saveKey = "idleSlots_" + user;
  const backupKey =
    "devilsGMBackup_" + user + "_" + activeSlot;

  let root = null;
  let messageBox = null;

  function getSlots() {
    try {
      const value = JSON.parse(
        localStorage.getItem(saveKey) || "[]"
      );
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function getHeroData() {
    if (
      !Number.isInteger(activeSlot) ||
      activeSlot < 0 ||
      activeSlot > 4
    ) {
      return null;
    }

    const slots = getSlots();
    return slots[activeSlot]?.hero
      ? { slots, hero: slots[activeSlot].hero }
      : null;
  }

  function notify(text, error = false) {
    if (!messageBox) return;

    messageBox.textContent = text;
    messageBox.classList.toggle("error", error);
  }

  function backup() {
    const data = getHeroData();

    if (!data) {
      notify("Nie znaleziono aktywnej postaci.", true);
      return false;
    }

    const previous = localStorage.getItem(backupKey);

    if (previous) {
      const overwrite = confirm(
        "Masz już kopię zapasową. Nadpisać ją?"
      );
      if (!overwrite) return false;
    }

    localStorage.setItem(
      backupKey,
      JSON.stringify(data.slots[activeSlot])
    );

    notify("Zapisano kopię zapasową postaci.");
    return true;
  }

  function restore() {
    const raw = localStorage.getItem(backupKey);

    if (!raw) {
      notify("Brak kopii zapasowej.", true);
      return;
    }

    if (!confirm(
      "Przywrócić kopię? Aktualny stan postaci zostanie zastąpiony."
    )) return;

    try {
      const restored = JSON.parse(raw);

      if (
        !restored ||
        !restored.hero ||
        typeof restored.hero !== "object" ||
        Array.isArray(restored.hero)
      ) {
        throw new Error("Nieprawidłowa kopia.");
      }

      const slots = getSlots();
      slots[activeSlot] = restored;

      localStorage.setItem(
        saveKey,
        JSON.stringify(slots)
      );

      notify("Przywrócono zapis. Odśwież stronę.");
      loadFields();
    } catch (error) {
      notify("Nie udało się przywrócić kopii.", true);
    }
  }

  function makeButton(text, action, className = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.className = className;
    button.addEventListener("click", action);
    return button;
  }

  function makeSection(title) {
    const section = document.createElement("section");
    section.className = "gm-section";

    const heading = document.createElement("h3");
    heading.textContent = title;

    section.appendChild(heading);
    root.appendChild(section);

    return section;
  }

  function makeGrid(section) {
    const grid = document.createElement("div");
    grid.className = "gm-grid";
    section.appendChild(grid);
    return grid;
  }

  function makeField(parent, id, label, min = 0) {
    const wrapper = document.createElement("div");
    wrapper.className = "gm-field";

    const caption = document.createElement("label");
    caption.htmlFor = "gm-" + id;
    caption.textContent = label;

    const input = document.createElement("input");
    input.type = "number";
    input.id = "gm-" + id;
    input.min = String(min);
    input.step = "1";

    wrapper.append(caption, input);
    parent.appendChild(wrapper);

    return input;
  }

  const inputs = {};

  function readField(id) {
    const value = inputs[id].value.trim();

    if (value === "") return null;

    const number = Number(value);

    if (
      !Number.isSafeInteger(number) ||
      number < Number(inputs[id].min)
    ) {
      throw new Error(
        "Nieprawidłowa wartość pola: " + id
      );
    }

    return number;
  }

  function findKey(object, keys) {
    return keys.find(key =>
      Object.prototype.hasOwnProperty.call(
        object, key
      )
    ) || keys[0];
  }

  /*
   Nie tworzymy kilku pól o różnych
   nazwach dla tej samej statystyki.
   Aktualizujemy istniejące pole,
   jeżeli już występuje w zapisie.
  */
  const fields = [
    {
      id: "level",
      label: "Poziom",
      keys: ["level", "lvl"],
      min: 1
    },
    {
      id: "exp",
      label: "EXP",
      keys: ["exp", "xp", "experience"]
    },
    {
      id: "gold",
      label: "Złoto",
      keys: ["gold", "zloto", "złoto"]
    },
    {
      id: "hon",
      label: "Hon",
      keys: ["hon", "honor"]
    },
    {
      id: "shen",
      label: "Shen",
      keys: ["shen"]
    }
  ];

  const stats = [
    "Siła",
    "Inteligencja",
    "Szybkość",
    "Wytrzymałość",
    "Energia"
  ];

  function loadFields() {
    const data = getHeroData();

    if (!data) {
      notify(
        "Najpierw zaloguj się i wybierz postać.",
        true
      );
      return;
    }

    const hero = data.hero;

    for (const field of fields) {
      const key = findKey(hero, field.keys);
      const value = hero[key];

      inputs[field.id].value =
        Number.isFinite(Number(value)) &&
        value !== undefined &&
        value !== null
          ? value
          : "";
    }

    for (const stat of stats) {
      inputs["stat-" + stat].value =
        hero.stats?.[stat] ?? 0;
    }

    const title = root.querySelector(
      "[data-gm-character]"
    );

    if (title) {
      title.textContent =
        "Postać: " +
        (hero.name || hero.characterClass || "Bohater") +
        " | Slot " + (activeSlot + 1);
    }
  }

  function saveChanges() {
    const data = getHeroData();

    if (!data) {
      notify("Brak aktywnej postaci.", true);
      return;
    }

    try {
      const changes = {};

      for (const field of fields) {
        changes[field.id] = readField(field.id);
      }

      for (const stat of stats) {
        changes["stat-" + stat] =
          readField("stat-" + stat);
      }

      const slots = data.slots;
      const hero = data.hero;

      for (const field of fields) {
        const value = changes[field.id];

        if (value === null) continue;

        const key = findKey(hero, field.keys);
        hero[key] = value;
      }

      if (!hero.stats ||
          typeof hero.stats !== "object") {
        hero.stats = {};
      }

      for (const stat of stats) {
        const value = changes["stat-" + stat];

        if (value !== null) {
          hero.stats[stat] = value;
        }
      }

      localStorage.setItem(
        saveKey,
        JSON.stringify(slots)
      );

      notify(
        "Zapisano zmiany! Odśwież ekran gry, " +
        "aby wszystkie statystyki się zaktualizowały."
      );

    } catch (error) {
      notify(error.message, true);
    }
  }

  function addCurrency(amount) {
    const input = inputs.gold;
    const current = Number(input.value) || 0;
    input.value = current + amount;
    saveChanges();
  }

  function addExp(amount) {
    const input = inputs.exp;
    const current = Number(input.value) || 0;
    input.value = current + amount;
    saveChanges();
  }

  function addLevel(amount) {
    const input = inputs.level;
    const current = Number(input.value) || 1;
    input.value = Math.max(1, current + amount);
    saveChanges();
  }

  // Katalog zgodny z przedmioty.js V15. Nie wymaga ładowania katalogu na stronie GM.
  const gmItems = [
    ['runa_berserkera_0', 'Runa Berserkera +0', 'Runa Berserkera +0', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_berserkera.png'],
    ['runa_berserkera_1', 'Runa Berserkera +1', 'Runa Berserkera +1', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_berserkera.png'],
    ['runa_berserkera_2', 'Runa Berserkera +2', 'Runa Berserkera +2', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_berserkera.png'],
    ['runa_berserkera_3', 'Runa Berserkera +3', 'Runa Berserkera +3', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_berserkera.png'],
    ['runa_berserkera_4', 'Runa Berserkera +4', 'Runa Berserkera +4', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_berserkera.png'],
    ['runa_berserkera_5', 'Runa Berserkera +5', 'Runa Berserkera +5', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_berserkera.png'],
    ['runa_nieskonczonosci_0', 'Runa Nieskończoności +0', 'Runa Nieskończoności +0', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_nieskonczonosci.png'],
    ['runa_nieskonczonosci_1', 'Runa Nieskończoności +1', 'Runa Nieskończoności +1', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_nieskonczonosci.png'],
    ['runa_nieskonczonosci_2', 'Runa Nieskończoności +2', 'Runa Nieskończoności +2', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_nieskonczonosci.png'],
    ['runa_nieskonczonosci_3', 'Runa Nieskończoności +3', 'Runa Nieskończoności +3', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_nieskonczonosci.png'],
    ['runa_nieskonczonosci_4', 'Runa Nieskończoności +4', 'Runa Nieskończoności +4', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_nieskonczonosci.png'],
    ['runa_nieskonczonosci_5', 'Runa Nieskończoności +5', 'Runa Nieskończoności +5', '🔮', 'weapon_rune', 'material', 'Rzadki', 'itemy/runa_nieskonczonosci.png'],
    ['dodanie_bonusu_1_4', 'Dodanie 1–4 bonusu', 'Dodanie 1–4 bonusu', '🔹', 'bonus_stone', 'material', 'Rzadki', 'itemy/dodanie_1_4.png'],
    ['dodanie_bonusu_6_7', 'Dodanie 6–7 bonusu', 'Dodanie 6–7 bonusu', '🔸', 'bonus_stone', 'material', 'Epicki', 'itemy/dodanie_6_7.png'],
    ['prezent_startowy', '🎁 Prezent startowy', 'Prezent startowy', '🎁', 'quality_gift', 'chest', 'Pospolity', 'itemy/prezent.png'],
    ['ulepszacz_magiczny', '✨ Magiczny ulepszacz', 'Magiczny ulepszacz', '✨', 'magic_upgrader', 'material', 'Epicki', 'itemy/magiczny.png'],
    ['ulepszacz_jakosci_zwykly', '🧪 Jakość — Zwykły', 'Ulepszacz jakości — Zwykły', '🧪', 'quality_upgrader', 'material', 'Zwykły', 'itemy/zwykly.png', 'Zwykły'],
    ['ulepszacz_jakosci_rzadki', '🧪 Jakość — Rzadki', 'Ulepszacz jakości — Rzadki', '🧪', 'quality_upgrader', 'material', 'Rzadki', 'itemy/rzadki.png', 'Rzadki'],
    ['ulepszacz_jakosci_epicki', '🧪 Jakość — Epicki', 'Ulepszacz jakości — Epicki', '🧪', 'quality_upgrader', 'material', 'Epicki', 'itemy/epicki.png', 'Epicki'],
    ['ulepszacz_jakosci_legendarny', '🧪 Jakość — Legendarny', 'Ulepszacz jakości — Legendarny', '🧪', 'quality_upgrader', 'material', 'Legendarny', 'itemy/legendarny.png', 'Legendarny'],
    ['skrzynka_startowa', '📦 Skrzynka startowa', 'Skrzynka startowa', '🎁', 'starter_chest', 'chest', 'Pospolity'],
    ['zbroja_lowcy', '🧥 Zbroja Łowcy', 'Zbroja Łowcy', '🧥', '', 'armor', 'Pospolity', '', '', 'armor'],
    ['ostry_miecz', '⚔️ Ostry Miecz', 'Ostry Miecz', '⚔️', '', 'weapon', 'Pospolity', '', '', 'weapon'],
    ['buty_lowcy', '🥾 Buty Łowcy', 'Buty Łowcy', '🥾', '', 'boots', 'Pospolity', '', '', 'boots'],
    ['kaptur_lowcy', '🪖 Kaptur Łowcy', 'Kaptur Łowcy', '🪖', '', 'helmet', 'Pospolity', '', '', 'helmet'],
    ['tarcza_ze_skory', '🛡️ Tarcza ze Skóry', 'Tarcza ze Skóry', '🛡️', '', 'shield', 'Pospolity', '', '', 'shield']
  ];

  // Lista GM: katalog przedmiotów + starsze pozycje zachowane dla kompatybilności.
  function getGMItems() {
    const merged = new Map(gmItems.map(entry => [entry[0], entry]));
    const catalog = window.DevilsItems?.catalog || {};
    for (const item of Object.values(catalog)) {
      if (!item || !item.id) continue;
      const entry = [item.id, (item.icon ? item.icon + ' ' : '') + item.name,
        item.name, item.icon || '📦', item.type || '', item.category || 'misc',
        item.rarity || 'Pospolity', item.image || '', item.targetRarity || '', item.slot || ''];
      merged.set(item.id, entry);
    }
    return [...merged.values()];
  }

  function gmMakeItem(entry) {
    const [id, , name, icon, type, category, rarity, image, targetRarity, slot] = entry;
    const fromCatalog = window.DevilsItems?.create?.(id);
    if (fromCatalog) return fromCatalog;
    const item = { id, name, icon, category, rarity, upgradeable: !!slot };
    if (type) item.type = type;
    if (image) item.image = image;
    if (targetRarity) item.targetRarity = targetRarity;
    if (slot) { item.slot = slot; item.requiredLevel = 1; item.maxUpgrade = 9; item.upgrade = 0; }
    if (type === 'weapon_rune') { item.runeKind = id.includes('berserkera') ? 'berserkera' : 'nieskonczonosci'; item.runeLevel = Number(id.split('_').pop()); }
    if (type === 'bonus_stone') item.bonusTier = id.endsWith('6_7') ? 'special' : 'normal';
    if (id === 'zbroja_lowcy') item.requiredClass = 'Łowca';
    return item;
  }

  // Inwentarz: 6 zakładek x 60 miejsc, po 5 kolumn na rząd.
  // Wielopolowe przedmioty zapisane są tylko w polu początkowym.
  function gmItemHeight(item) {
    const name = String(item.name || '').toLowerCase();
    const type = String(item.type || '').toLowerCase();
    if (/wielki miecz|miecz dwuręcz|miecz dwurecz|greatsword|two.hand|2h sword/.test(name + ' ' + type)) return 3;
    if (/sztylet|dagger/.test(name + ' ' + type)) return 1;
    if (/zbroj|pancerz|miecz|łuk|luk|kusz|kostur|staff|staf/.test(name + ' ' + type)) return 2;
    if (item.slot === 'armor') return 2;
    if (item.slot === 'weapon' && !/sztylet/.test(name)) return 2;
    return 1;
  }

  function gmFindFree(inventory, item) {
    const occupied = new Set();
    for (let i = 0; i < 360; i++) {
      const existing = inventory[i];
      if (!existing || typeof existing !== 'object') continue;
      for (let r = 0; r < gmItemHeight(existing); r++) {
        const cell = i + r * 5;
        if (cell < 360 && Math.floor(cell / 60) === Math.floor(i / 60)) occupied.add(cell);
      }
    }
    for (let i = 0; i < 360; i++) {
      const height = gmItemHeight(item);
      let fits = true;
      for (let r = 0; r < height; r++) {
        const cell = i + r * 5;
        if (cell >= 360 || Math.floor(cell / 60) !== Math.floor(i / 60) || occupied.has(cell)) { fits = false; break; }
      }
      if (fits) return i;
    }
    return -1;
  }

  const GM_STACK_LIMIT = 4000;
  function gmStackKey(item) {
    if (!item || typeof item !== 'object') return null;
    const resolved = window.DevilsItems?.resolve?.(item) || item;
    if (resolved.slot || resolved.upgradeLevel || resolved.upgrade || resolved.plus ||
        resolved.runes || resolved.rune || resolved.bonuses || resolved.extraBonuses || resolved.stats) return null;
    const category = String(resolved.category || '');
    const type = String(resolved.type || '');
    if (category !== 'material' && category !== 'chest' &&
        !['magic_upgrader','quality_upgrader','weapon_rune','bonus_stone','quality_gift','starter_chest'].includes(type)) return null;
    return JSON.stringify({id:resolved.id || resolved.catalogId || resolved.itemId || '',
      name:resolved.name || '',type,rarity:resolved.rarity || '',
      targetRarity:resolved.targetRarity || '',runeKind:resolved.runeKind || '',
      runeLevel:resolved.runeLevel ?? '',bonusTier:resolved.bonusTier || ''});
  }
  function gmStackCount(item) {
    return Math.max(1, Math.floor(Number(item?.quantity ?? item?.count ?? 1) || 1));
  }
  function gmGiveItems(itemId, count) {
    const entry = getGMItems().find(e => e[0] === itemId);
    if (!entry) { notify('Wybierz przedmiot.', true); return; }
    if (!Number.isSafeInteger(count) || count < 1 || count > GM_STACK_LIMIT) {
      notify('Liczba przedmiotów musi wynosić od 1 do 4000.', true); return;
    }
    const data = getHeroData();
    if (!data) { notify('Nie wybrano aktywnej postaci.', true); return; }
    const slot = data.slots[activeSlot];
    const draft = Array.isArray(slot.inventory) ? slot.inventory.slice(0, 360) : [];
    const prototype = gmMakeItem(entry);
    const key = gmStackKey(prototype);
    let remaining = count;
    if (key) {
      // Zapełnij istniejące stosy, bez modyfikowania zapisu przed końcem operacji.
      for (let i = 0; i < draft.length && remaining > 0; i++) {
        if (gmStackKey(draft[i]) !== key) continue;
        const before = gmStackCount(draft[i]);
        const added = Math.min(remaining, Math.max(0, GM_STACK_LIMIT - before));
        if (!added) continue;
        draft[i] = {...draft[i], quantity: before + added};
        delete draft[i].count;
        remaining -= added;
      }
      while (remaining > 0) {
        const part = {...prototype, quantity: Math.min(GM_STACK_LIMIT, remaining)};
        const position = gmFindFree(draft, part);
        if (position < 0) break;
        draft[position] = part;
        remaining -= part.quantity;
      }
    } else {
      // Przedmioty z indywidualnymi statystykami nadal zajmują osobne miejsca.
      while (remaining > 0) {
        const position = gmFindFree(draft, prototype);
        if (position < 0) break;
        draft[position] = gmMakeItem(entry);
        remaining--;
      }
    }
    const added = count - remaining;
    if (!added) { notify('Brak wolnego miejsca w inwentarzu.', true); return; }
    slot.inventory = draft;
    try {
      localStorage.setItem(saveKey, JSON.stringify(data.slots));
      notify('Dodano: ' + entry[2] + ' × ' + added +
        (remaining ? ' (brak miejsca na pozostałe)' : '') + '. Otwórz ekwipunek lub odśwież stronę.');
    } catch (error) {
      notify('Nie udało się zapisać inwentarza: ' + error.message, true);
    }
  }

  function buildItemSection() {
    const section = makeSection('🎁 Przedmioty i ulepszacze');
    const grid = makeGrid(section);
    const selectWrap = document.createElement('div');
    selectWrap.className = 'gm-field';
    const label = document.createElement('label');
    label.textContent = 'Przedmiot';
    const select = document.createElement('select');
    select.style.cssText = 'width:100%;min-width:180px;padding:9px;background:#211d19;color:#efd39a;border:1px solid #8c723a';
    for (const entry of getGMItems()) {
      const option = document.createElement('option');
      option.value = entry[0]; option.textContent = entry[1]; select.appendChild(option);
    }
    selectWrap.append(label, select);
    grid.appendChild(selectWrap);
    const amount = makeField(grid, 'item-count', 'Liczba sztuk (1–4000)', 1);
    amount.max = '4000'; amount.value = '1';
    const actions = document.createElement('div');
    actions.className = 'gm-actions';
    actions.appendChild(makeButton('➕ Dodaj do inwentarza', () => gmGiveItems(select.value, Number(amount.value)), 'gm-primary'));
    section.appendChild(actions);
    const hint = document.createElement('p');
    hint.className = 'gm-note';
    hint.textContent = 'Lista pobierana automatycznie z przedmioty.js. Materiały łączą się w stosy do 4000 sztuk, a wyposażenie zajmuje osobne miejsca. Zapis następuje od razu.';
    section.appendChild(hint);
  }

  function buildPanel(container) {
    root = container;
    root.innerHTML = "";

    const heading = document.createElement("div");
    heading.className = "gm-heading";

    const headingText = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = "⚔️ DEVILS — GAME MASTER";

    const subtitle = document.createElement("p");
    subtitle.dataset.gmCharacter = "true";

    headingText.append(title, subtitle);

    const close = makeButton(
      isFullPage ? "← Gra" : "✕",
      () => {
        if (isFullPage) {
          location.href = "pulpit.html";
        } else {
          document.querySelector(
            ".gm-overlay"
          ).hidden = true;
        }
      }
    );

    heading.append(headingText, close);
    root.appendChild(heading);

    const character = makeSection(
      "🧙 Zarządzanie postacią"
    );
    const characterGrid = makeGrid(character);

    for (const field of fields) {
      inputs[field.id] = makeField(
        characterGrid,
        field.id,
        field.label,
        field.min ?? 0
      );
    }

    const actions = document.createElement("div");
    actions.className = "gm-actions";

    actions.append(
      makeButton("+1 poziom", () => addLevel(1)),
      makeButton("+1 000 EXP", () => addExp(1000)),
      makeButton("+10 000 złota", () =>
        addCurrency(10000)
      )
    );

    character.appendChild(actions);

    const statsSection = makeSection(
      "💪 Statystyki podstawowe"
    );
    const statsGrid = makeGrid(statsSection);

    for (const stat of stats) {
      inputs["stat-" + stat] = makeField(
        statsGrid,
        "stat-" + stat,
        stat
      );
    }

    buildItemSection();

    const tools = makeSection(
      "🛠️ Narzędzia testowe"
    );

    const toolsActions = document.createElement("div");
    toolsActions.className = "gm-actions";

    toolsActions.append(
      makeButton(
        "💾 Kopia zapasowa",
        backup
      ),
      makeButton(
        "↩️ Przywróć kopię",
        restore
      ),
      makeButton(
        "🔄 Wczytaj dane ponownie",
        () => {
          loadFields();
          notify("Wczytano aktualne dane.");
        }
      )
    );

    tools.appendChild(toolsActions);

    const note = document.createElement("p");
    note.className = "gm-note";
    note.textContent =
      "Panel edytuje zapis wybranej postaci. " +
      "Przed eksperymentami zrób kopię zapasową. " +
      "Nie modyfikuje bezpośrednio przebiegu walki, " +
      "drzewek atrybutów ani przebiegu walki.";

    root.appendChild(note);

    const footer = document.createElement("div");
    footer.className = "gm-actions";

    footer.appendChild(
      makeButton(
        "💾 ZAPISZ WSZYSTKIE ZMIANY",
        saveChanges,
        "gm-primary"
      )
    );

    if (!isFullPage) {
      footer.appendChild(
        makeButton(
          "🖥️ Pełny panel GM",
          () => location.href = "gm.html"
        )
      );
    }

    root.appendChild(footer);

    messageBox = document.createElement("p");
    messageBox.className = "gm-message";
    messageBox.setAttribute("role", "status");
    root.appendChild(messageBox);

    loadFields();
  }

  function createOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "gm-overlay";
    overlay.hidden = true;

    const panel = document.createElement("div");
    panel.className = "gm-panel";

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    buildPanel(panel);

    overlay.addEventListener("click", event => {
      if (event.target === overlay) {
        overlay.hidden = true;
      }
    });

    document.addEventListener("keydown", event => {
      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "g"
      ) {
        event.preventDefault();
        overlay.hidden = !overlay.hidden;

        if (!overlay.hidden) {
          loadFields();
        }
      }

      if (
        event.key === "Escape" &&
        !overlay.hidden
      ) {
        overlay.hidden = true;
      }
    });
  }

  function loadCatalog() {
    if (window.DevilsItems?.catalog) return Promise.resolve();
    return new Promise(resolve => {
      const existing = document.querySelector('script[data-gm-items-catalog]');
      if (existing) {
        existing.addEventListener('load', resolve, {once:true});
        existing.addEventListener('error', resolve, {once:true});
        return;
      }
      const script = document.createElement('script');
      script.src = 'przedmioty.js';
      script.dataset.gmItemsCatalog = '1';
      script.onload = resolve;
      script.onerror = resolve; // Stare pozycje pozostają dostępne nawet bez katalogu.
      document.head.appendChild(script);
    });
  }
  async function start() {
    await loadCatalog();
    if (isFullPage) {
      const panel = document.getElementById(
        "gm-full-panel"
      );

      if (panel) buildPanel(panel);
    } else {
      createOverlay();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      start
    );
  } else {
    start();
  }
})();
