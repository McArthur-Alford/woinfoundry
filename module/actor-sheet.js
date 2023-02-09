/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

import { DiceWOIN } from "./dice.js"

export class SimpleActorSheet extends ActorSheet {


// ---------------------------------------------------------------------------------
// Important Initialization Functions for Foundry:

  /** @override */
  static get defaultOptions() {
    const classes = ["woin", "sheet", "actor"];
    return mergeObject(super.defaultOptions, {
      classes: classes,
      template: "systems/woinfoundry/templates/actor-sheet.html",
      width: 831,
      height: 800,
      resizable: true,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      scrollY: [".sheet-body"]
    });
  }

    /** @override */
    getData() {
      const baseData = super.getData();
      // console.log("WOIN | actor-sheet.js getData baseData ", baseData);
      let sheetData = {
        owner: this.isOwner,
        editable: this.isEditable,
        actor: baseData,
        items: baseData.items,
        system: baseData.actor.system,
      };
      console.log("WOIN | actor-sheet.js getData sheetData ", sheetData);
      return sheetData;
    }
// ================================================================================


// ---------------------------------------------------------------------------------
// Resize code for responsive design:
  _onResize() {
    if(game.settings.get("woinfoundry", "verticalSheet")) {
      if(this.position.width<830) {
        $(this.form).addClass("vertical-sheet");
      }
      else {
        $(this.form).removeClass("vertical-sheet");
      }
    }
  }
// ================================================================================


// ---------------------------------------------------------------------------------
// The Code Below Handles listener creation for the character sheet: (Its messy)

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    this._onResize();

    // Setting up custom colours:

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget);
      const item = this.actor.items.get(li[0].dataset.itemId);
      item.sheet.render(item);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(async ev => {
      let html = await renderTemplate("systems/woinfoundry/templates/chat/delete.html");

      function del() {
        const li = $(ev.currentTarget).parents(".item");
        this.actor.deleteOwnedItem(li.data("itemId"));
        li.slideUp(200, () => this.render(false));
      }

      return new Promise(resolve => {
        new Dialog({
        title: "Please Confirm",
        content: html,
        buttons: {
            delete: {
                label: "delete",
                callback: html => {del();}
            },
            back: {
                label: "back",
                callback: html => {}
            }
        },
        default: "back",
        close: html => {
            
        }
        }, null).render(true);
      });
    });

    // Setting up progress bar overflow:
    let carryBar = (html.find(".carry-bar")[0]);
    const max = carryBar.max;
    if(carryBar.value===carryBar.max){
      // let newBar = duplicate(carryBar);
      // carryBar.parent().add(newBar);
    }

    // Handling Effects:
    html.find(".manage-effect").click(ev => {
      this.manageEffect(ev);
    });

    // Handling Auto-Calculate Buttons:
    html.find(".auto-calculate.movement").click(ev => {
      this.calculateMovement();      
    });

    // Handling Updates to Attributes:
    html.find(".attribute input").change(ev => { this.updateAttributes(ev); });

    // Handling Updates to Skills:
    html.find(".skills-value").change(ev => { this.updateSkill(ev);});
    html.find(".skill-create").click(ev => { this.onClickSkillControl(ev, "create"); });
    html.find(".skill-delete").click(ev => { this.onClickSkillControl(ev, "delete"); });

    html.find(".exploit-delete").click(ev => { this.onClickExploitControl(ev, "delete"); });

    // Handling Modifiers:
    html.find(".add_modifier").click(ev => { this.addModifier(ev); });
    html.find(".remove_modifier").click(ev => { this.removeModifier(ev); });
    html.find(".modifier_value").change(ev => { this.updateModifier(ev); });

    // Adding new Items:
    html.find(".item-add").click(ev=>{
      
      const item = {name : "new item", type : "item", data : game.system.model.Item.item};
      this.actor.createEmbeddedDocuments("Item", [item], {renderSheet: false});
    });

    // Flipping Item Equipped State:
    html.find(".item-equip").click(ev=>{
      ev.preventDefault();

      const dataset = ev.currentTarget.dataset;
      const item = this.actor.items.get(dataset.itemId);

      let newItem = duplicate(item);
      //console.log("WOIN | actor-sheet.js activateListeners dataset ", dataset);
      newItem.system.equipped = !newItem.system.equipped;
      const data = newItem.system;
      item.update({ data });
      //console.log("WOIN | actor-sheet.js activateListeners newItem ", newItem);
    });

    // Flipping Item Carried State:
    html.find(".item-carry").click(ev=>{
      ev.preventDefault();

      const dataset = ev.currentTarget.dataset;
      const item = this.actor.items.get(dataset.itemId);

      let newItem = duplicate(item);
      newItem.system.carried = !newItem.system.carried;
      newItem.system.equipped = false;
      const data = newItem.system;
      item.update({ data });
    });

    // Adding new Exploits:
    html.find(".exploit-add").click(ev=>{
      const item = {name : "new item", type : "exploit", data : game.system.model.Item.exploit};
      this.actor.createEmbeddedDocuments("Item", [item], {renderSheet: false});
    });

    //Handling Equipment/Exploit Expansion:
    html.find(".description-show").hover((ev) => {
      let target = $(ev.target);
      target.closest(".description-show").css("border", "1px solid var(--invertcyan)");
      target.closest(".description-show").css("background-color", "var(--invertcyan)");
      target.closest(".description-show").css("color", "var(--cyan)");
    }, (ev) => {
      let target = $(ev.target);
      target.closest(".description-show").css("border", "")
      target.closest(".description-show").css("background-color", "");
      target.closest(".description-show").css("color", "");
    });

    html.find(".description-show").click((ev) => {
      let stop = false;
      $(ev.target).attr("class").split(' ').forEach(element => {
        if (["item-open", "exploit-open", "item-button", "exploit-delete", "delete", "edit", "ignoreclick"].includes(element)) {stop=true;}
      });
      if(stop)return;
      try {
        let target;
        if ($(ev.target).attr("class").includes("description-show")) {
          target = $(ev.target).next().filter(".item-description");
        } else {
          target = $(ev.target).parent().next().filter(".item-description");
        }
        target.toggle();
        let item = duplicate(this.actor.items.get(target.data().itemId));
        if (item.system.open == null) item.open = true;
        item.system.open = !item.system.open;
        this.actor.items.get(target.data().itemId).update(item);
      } catch (error) {
        
      }

    });

    html.find(".item-open").click((ev) => {
    });

    // Handling updates to Combat Tab:
    html.find(".combat-skill input").change(ev => {
      ev.preventDefault();

      const dataset = ev.currentTarget.dataset;
      const item = this.actor.items.get(dataset.itemid);
      const input = (ev.currentTarget.value);

      let newItem = duplicate(item);
      newItem.system.skill = input;
      const data = newItem.system;
      item.update({ data });
    });

    //Handling Item Drag&Drop
    const draggables = document.querySelectorAll('.woin .draggable');
    const containers = document.querySelectorAll('.woin .container');

    html.find('.display-to-chat').click(ev => { 
      let chatData = {
        user: game.user.id,
        content: `${$(ev.currentTarget).data("description")}`,
        flavor: `${$(ev.currentTarget).data("title")}`
      };
      chatData.speaker = ChatMessage.getSpeaker({ user: game.user });
      ChatMessage.create(chatData);
    });

    html.find(".item").each((_i, sortable) => {
      sortable.addEventListener("dragstart", (e) => this._onDragStart.call(this, e), false);
    });


    //Handling Updates to Exploits:

    //Handling Updates to Advancement:
    html.find(".advancement-input").change(ev => {
      this.updateAdvancement(ev);
    });
    html.find(".advancement-add-gain").click(ev => {
      let actor = duplicate(this.actor);
      actor.system.advancement.xp_gain.push({ name: "default", value: 0 });
      this.actor.update(actor);
    });
    html.find(".advancement-add-spend").click(ev => {
      let actor = duplicate(this.actor);
      actor.system.advancement.xp_spent.push({ name: "default", value: 0 });
      this.actor.update(actor);
    });
    html.find(".advancement-remove-gain").click(ev => {
      let actor = duplicate(this.actor);
      actor.system.advancement.xp_gain.splice(ev.currentTarget.dataset.index, 1);
      this.actor.update(actor);
    });
    html.find(".advancement-remove-spend").click(ev => {
      let actor = duplicate(this.actor);
      actor.system.advancement.xp_spent.splice(ev.currentTarget.dataset.index, 1);
      this.actor.update(actor);
    });

    // Inputs highlight on click:
    html.find(".sheet-global input, .tab.advancement input, .tab.combat input, .tab.skills input").click(ev => {
      ev.currentTarget.select();
    });

    //Handling Rollables:
    html.find('.rollable-general, .rollable-attack').hover(ev => {
      const li = $(ev.target);
      li.css({ "color": "var(--invertcyan)" });
    }, (ev) => {
      const li = $(ev.target);
      li.css({ "color": "" });
    });
    html.find('.rollable').click(ev => {
      const li = (ev.target);
      const description = li.attributes['data-description'].value;
      let gradecapped = li.attributes['data-gradecapped-formula'].value.split('+');
      gradecapped = gradecapped.reduce((a,b)=>{
        return +a + +b;
      },0);

      const formula = li.attributes['data-formula'].value;
      if(gradecapped>this.actor.system.advancement.dice_cap){
        gradecapped=this.actor.system.advancement.dice_cap;
      }
      gradecapped+="d6";

      DiceWOIN.roll({ parts: ["0", formula.replace("+0+","").replace("+0","").replace("0+",""), gradecapped].filter((n)=>{return n!=0&&n!="0d6"&&n!="0"&&n!="+0"&&n!="0+"&&n!="+0+"}), sender: this.actor, flavor: description });
    });
    html.find('.rollable-attack').click(ev => { 
      const li = (ev.target);
      const description = li.attributes['data-description'].value;
      const item = li.attributes['data-itemid'].value;
      const actor = li.attributes['data-actorid'].value;
      DiceWOIN.rollAttack({
        description: description,
        itemId: item,
        actorId: actor
      });
    });
    html.find('.rollable-general').click(ev => { 
      const li = (ev.target);
      const description = li.attributes['data-description'].value;
      const attribute_dice = (li.attributes['data-attribute-dice']) ? li.attributes['data-attribute-dice'].value : 0;
      const skill_dice = (li.attributes['data-skill-dice']) ? li.attributes['data-skill-dice'].value : 0;
      const actor = li.attributes['data-actorid'].value;
      const constant1 = li.attributes['data-constant1'] ? li.attributes['data-constant1'].value : 0;
      const constant2 = li.attributes['data-constant2'] ? li.attributes['data-constant2'].value : 0;
      DiceWOIN.rollGeneral({
        description: description,
        attribute_dice: attribute_dice,
        constant: Number(constant1)+Number(constant2),
        skill_dice: skill_dice,
        actorId: actor
      });
    });


    // Updating Items:
    this.actor.items.forEach(item => {
      if(item.type === "item") {
        //console.log("WOIN | actor-sheet.js activateListeners item ", item);
        if(typeof item.system.carried === 'undefined') {
          let newItem = duplicate(item);
          //console.log("WOIN | actor-sheet.js activateListeners newItem ", newItem);
          newItem.system.carried = true;
          const data = newItem.system;
          item.update({ data });
        }
      }
    });
  }

// ================================================================================



// Auto Calculations:
async calculateMovement() {
  let html = await renderTemplate("systems/woinfoundry/templates/chat/confirmation.html");

  //console.log("WOIN | actor-sheet.js calculateMovement strength obj:",game.actors.get(this.actor.id).system.attributes.strength);

  return new Promise(resolve => {
    new Dialog({
    title: "Please Confirm",
    content: html,
    buttons: {
        yes: {
            label: "yes",
            callback: html => {calc(game.actors.get(this.actor.id))}
        },
        no: {
            label: "no",
            callback: html => {}
        }
    },
    default: "no",
    close: html => {
        
    }
    }, null).render(true);
  });

  function calc(originalActor) {
    let actor = duplicate(originalActor);
    //console.log("WOIN | actor-sheet.js calculateMovement calc actor.system.attributes ", actor.system.attributes);
    let data = actor.system;
    let movement = data.movement;
    let attributes = data.attributes;
    let running = 0;
    let climbing = 0;
    let swimming = 0;
    let zerog = 0;
    let highg = 0;
    let lowg = 0;

    actor.items.forEach(item => {
      if(item.type == "skill") {
        switch(item.name.toLowerCase()) {
          case "running":
            running = item.system.pool;
            //console.log("WOIN | actor-sheet.js calculateMovement calc running ", running);
            break;
          case "climbing": 
            climbing = item.system.pool;
            break;
          case "swimming":
            swimming = item.system.pool;
            break;
          case "zero-g":
            zerog = item.system.pool;
            break;
          case "high-g":
            highg = item.system.pool;
            break;
          case "low-g":
            lowg = item.system.pool
            break;
        }
      }
    });
    //console.log("WOIN | actor-sheet.js calculateMovement calc actor.items ", actor.items);

    let base_speed = attributes.agility.dice + attributes.strength.dice;
    //console.log("WOIN | actor-sheet.js calculateMovement calc base_speed ",base_speed);
    movement.speed = base_speed + running;

    if(data.details.size&&(data.details.size.includes("small")||data.details.size.includes("tiny"))) {
      movement.speed = Math.max(movement.speed-1,0);
    }
    movement.highG = Math.ceil((base_speed + highg)/2);
    movement.lowG = Math.ceil((base_speed + lowg)/2);
    movement.zeroG = Math.ceil((base_speed + zerog)/2);
    movement.swim = Math.ceil((base_speed + swimming)/2);
    movement.climb = Math.ceil((base_speed + climbing)/2);

    movement.jumpH = attributes.agility.value * 2;
    movement.jumpV = attributes.strength.value;
    if(movement.jumpV>movement.jumpH) {movement.jumpV = movement.jumpH;}

    actor.system.movement = movement;
    originalActor.update(actor);

    // (In Squares) Speed: Strength DP + AGI DP + Running DP

    // Climbing, Swimming, Zero-G and High-G Replace Running Skill and Halve FINAL total

    // Small or Smaller suffer -1 to SPEED

    // Round Up

    // (In Feet) Jump:
    // Horizontal = 2 * AGI ATTR
    // Vertical = STR ATTR, NOT EXCEED Horizontal 
  }
}



// ---------------------------------------------------------------------------------
// The Code Below Handles Deletion and Addition of items to 
// exploit-rows(items/exploits) and skills:

  async deleteItem(event, actor) {
    let html = await renderTemplate("systems/woinfoundry/templates/chat/delete.html");

      function del(actor) {
        const li = $(event.target);
        const exploit = li.data().exploitcode || li.data().skillcode;
  
        actor.deleteEmbeddedDocuments("Item", [exploit]);
      }

      return new Promise(resolve => {
        new Dialog({
        title: "Please Confirm",
        content: html,
        buttons: {
            delete: {
                label: "delete",
                callback: html => {del(actor);}
            },
            back: {
                label: "back",
                callback: html => {}
            }
        },
        default: "back",
        close: html => {
            
        }
        }, null).render(true);
      });
  }

  async onClickExploitControl(event, task) {
    event.preventDefault();
    const a = event.currentTarget;

    if (task === "delete") {
      this.deleteItem(event, this.actor);
    }
  }

  async onClickSkillControl(event, task) {
    event.preventDefault();
    const a = event.currentTarget;

    // Add new attribute
    if (task === "create") {

      const item = {
        type: "skill",
        name: "newskill",
        attribute: "strength",
        score: 0,
        pool: 0
      }

      this.actor.createEmbeddedDocuments("Item", [item]);

    }

    // Remove existing attribute
    else if (task === "delete") {
      this.deleteItem(event, this.actor);
    }
  }

// ================================================================================


async manageEffect(event) {
  event.preventDefault();

  const action = event.currentTarget.dataset.action;

  const effectId = event.currentTarget.dataset.id;

  if(action!="add"&&effectId==null){
    //console.log("WOIN | actor-sheet.js manageEffect Effect was null.");
    return
  }
  
  let effect;
  if(effectId!=null) {
    effect = this.actor.effects.get(effectId);
  }

  switch (action) {
    case "add":
      //console.log("WOIN | actor-sheet.js manageEffect adding new effect");
      ActiveEffect.create({
        label: "New Effect",
        icon: "icons/svg/aura.svg",
        origin: "Temp",
        disabled: false,
        changes: [
            {
                "key": "name",
                "mode": 2,
                "value": "3"
            }
        ],
        description: "woo"
      }, game.actors.entries[0]).create();
      break;
    case "edit":
      //console.log("WOIN | actor-sheet.js manageEffect editing existing effect with ID ", effectId);
      effect.sheet.render(true);
      break;
    case "delete":
      //console.log("WOIN | actor-sheet.js manageEffect removing existing effect with ID ", effectId);
      effect.delete();
      break;
    case "toggle":
      //console.log("WOIN | actor-sheet.js manageEffect toggling existing effect with ID ", effectId);
      return effect.update({disabled: !effect.system.disabled});
      break;
    default:
      //console.log("WOIN | actor-sheet.js manageEffect the specified effect action is not supported. Please use add/edit/delete.");
      break;
  }
}


// ---------------------------------------------------------------------------------
// The following is used to keep data values for attributes up to date:

async updateAttributes(event) {
  event.preventDefault();

  const target = event.currentTarget.dataset.attribute;
  // console.log("WOIN | actor-sheet.js updateAttributes Updating attributes for",this.actor.id,"| modified attribute is",target);
  const input = ($(event.currentTarget)[0].value);
  console.log("WOIN | actor-sheet.js updateAttributes target ", target);

  const pool = [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8]
  const actor = duplicate(this.actor);
  console.log("WOIN | actor-sheet.js updateAttributes actor ", actor);

  let data = actor.system;
  console.log("WOIN | actor-sheet.js updateAttributes data ", data);

  // Calculating Attribute DPs:
  for (var key in data.attributes) {
      if (key === target && !isNaN(input)) {
        data.attributes[key].value = parseInt(input);
      }
      console.log("WOIN | actor-sheet.js updateAttributes  data.attributes[key].value ", data.attributes[key].value);
      if (pool[data.attributes[key].value] != null) {
          data.attributes[key].dice = pool[data.attributes[key].value];
      } else {
          data.attributes[key].dice = 0;
      }
  };

  // Calculating Luck:
  data.luck.max = data.attributes.luck.dice
  if (data.luck.value > data.luck.max) {
      data.luck.value = data.luck.max;
  }
  if (data.luck.value < 0) {
      data.luck.value = 0;
  }
  if (!data.luck.value) {
      data.luck.value = 0;
  }
  if (data.power.value > data.power.max) {
      data.power.value = data.power.max;
  }
  if (data.power.value < 0) {
      data.power.value = 0;
  }
  if (!data.power.value) {
      data.power.value = 0;
  }

  this.actor.update({data});
}

// ================================================================================



// ---------------------------------------------------------------------------------
// The following Is used to keep data values for skills and advancement up to date:

  async updateSkill(ev) {
    ev.preventDefault();

    //console.log("WOIN | actor-sheet.js updateSkill woo");

    const dataset = ev.currentTarget.dataset;
    const item = this.actor.items.get(dataset.itemId);
    const input = ($(ev.currentTarget)[0].value);

    if(!item){
      return;
    }
    if (item.system[dataset.binding] && item.system[dataset.binding] === input) {
      return;
    }
    else if (item.system[dataset.binding] && item.system[dataset.binding] === input) {
      return;
    };

    await item.update({
      [dataset.binding]: input
    });

    let data = item.system;
    const pool = [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8]
    //console.log("WOIN | actor-sheet.js updateSkill data ", data);
    let actorData = this.actor.system;
    if (data.gradepool != actorData.attributes[`${data.attribute}`]["dice"]) {
        data.gradepool = actorData.attributes[`${data.attribute}`]["dice"];
    }

    if (data.score >= pool.length) {
        data.score = pool.length - 1;
        data.pool = pool[data.score];
        data.gradepool = actorData.attributes[`${data.attribute}`]["dice"];
    }

    if (data.score < 0) {
        data.score = 0;
        data.pool = pool[data.score];
        data.gradepool = actorData.attributes[`${data.attribute}`]["dice"];
    }

    if (data.pool != pool[data.score]) {
        data.pool = pool[data.score];
        data.gradepool = actorData.attributes[`${data.attribute}`]["dice"];
    }

    item.update({data});
  }


  updateAdvancement(ev) {
    const target = ev.currentTarget;
    const data = target.dataset;
    const index = data.index;
    const key = data.key;
    console.log("WOIN | actor-sheet.js updateAdvancement data ", data);

    let actor = duplicate(this.actor); //For manipulating actor.system.advancement
    switch (key) {
      case "spent_name":
        actor.system.advancement.xp_spent[index].name = target.value;
        break;
      case "spent_xp":
        actor.system.advancement.xp_spent[index].value = target.value;
        break;
      case "gain_name":
        actor.system.advancement.xp_gain[index].name = target.value;
        break;
      case "gain_xp":
        actor.system.advancement.xp_gain[index].value = target.value;
        break;
      default:
        break;
    }
    this.actor.update(actor);
  }

// ================================================================================

}
