/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { SimpleItemSheet } from "./item-sheet.js";
import { SimpleActorSheet } from "./actor-sheet.js";
import { SimpleExploitSheet } from "./exploit-sheet.js"
import { WOINActor } from "./actorclass.js";
import "./config.js";
import { overrides } from "./overrides.js"
overrides();

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Handlebars.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('ifnoteq', function (a, b, options) {
  if (a != b) { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('enrichHTML', (html) => {
  return TextEditor.enrichHTML(html, {async: false});
});


Hooks.once("init", async function () {
  console.log(`WOIN | simple.js Hooks.once Initialized`);



  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "(@initiative.value)d6",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = WOINActor;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("dnd5e", SimpleActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dnd5e", SimpleItemSheet, { types: ["item"], makeDefault: true });
  Items.registerSheet("dnd5e", SimpleExploitSheet, { types: ["skill"], makeDefault: true });
  Items.registerSheet("dnd5e", SimpleExploitSheet, { types: ["language"], makeDefault: true });
  Items.registerSheet("dnd5e", SimpleExploitSheet, { types: ["exploit"], makeDefault: true });


  // Register system settings
  game.settings.register("woinfoundry", "macroShorthand", {
    name: "Shortened Macro Syntax",
    hint: "Enable a shortened macro syntax which allows referencing attributes directly, for example @str instead of @attributes.str.value. Disable this setting if you need the ability to reference the full attribute model, for example @attributes.str.label.",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });
  game.settings.register("woinfoundry", "verticalSheet", {
    name: "Allow Vertical Sheet",
    hint: "When the character sheet is scaled below a certain point, use a responsive vertical layout?",
    scope: "client",
    type: Boolean,
    default: true,
    config: true
  });
  game.settings.register("woinfoundry", "PrimaryColour", {
    name: "Primary Colour",
    hint: "The primary colour to be used on the sheet. Try to keep it bright and readable.",
    scope: "client",
    type: String,
    default: "#00ffff",
    config: true
  });
  game.settings.register("woinfoundry", "InvertedPrimaryColour", {
    name: "Inverted Colour",
    hint: "The colour used when inverting the primary (e.g. hovering over tabs). Try to use colours that contrast well.",
    scope: "client",
    type: String,
    default: "#ff0000",
    config: true
  });

  // Dynamic Sheet Colour Stuff:
  let root = document.querySelector(':root');
  root.style.setProperty('--cyan', game.settings.get("woinfoundry", "PrimaryColour"));
  root.style.setProperty('--invertcyan', game.settings.get("woinfoundry", "InvertedPrimaryColour"));

  Hooks.on("closeSettingsConfig", ()=>{
    root.style.setProperty('--cyan', game.settings.get("woinfoundry", "PrimaryColour"));
    root.style.setProperty('--invertcyan', game.settings.get("woinfoundry", "InvertedPrimaryColour"));
  });
});
