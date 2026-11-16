
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
      "ekwipunku ani drzewek atrybutów.";

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

  function start() {
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
