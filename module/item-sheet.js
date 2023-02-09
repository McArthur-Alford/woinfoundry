/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SimpleItemSheet extends ItemSheet {

  /** @override */
	static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["woin", "sheet", "item"],
      template: "systems/woinfoundry/templates/item-sheet.html",
      width: 520,
      height: 680,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    console.log("WOIN | item-sheet.js getData data", data);
    if(data.item.system.weapon.damagetype[data.item.system.weapon.damagetype.length-1]){
      let item = duplicate(this.item);
      item.system.weapon.damagetype.push(null);
      this.item.update(item);
    }
    else if(data.item.system.weapon.damagetype.length>1&&!data.item.system.weapon.damagetype[data.item.system.weapon.damagetype.length-1]&&!data.item.system.weapon.damagetype[data.item.system.weapon.damagetype.length-2]){
      let item = duplicate(this.item);
      item.system.weapon.damagetype.pop();
      this.item.update(item);
    }
    if(data.item.system.armor.ineffective[data.item.system.armor.ineffective.length-1]){
      let item = duplicate(this.item);
      item.system.armor.ineffective.push(null);
      this.item.update(item);
    }
    else if(data.item.system.armor.ineffective.length>1&&!data.item.system.armor.ineffective[data.item.system.armor.ineffective.length-1]&&!data.item.system.armor.ineffective[data.item.system.armor.ineffective.length-2]){
      let item = duplicate(this.item);
      item.system.armor.ineffective.pop();
      this.item.update(item);
    }
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options={}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html.find(".damage-array").change((ev)=>{
      const li = ev.currentTarget;
      let item = duplicate(this.item);
      let damagetype = item.system.weapon.damagetype;

      damagetype[li.attributes["data-dindex"].value]=ev.currentTarget.value;
      item.system.weapon.damagetype=damagetype;
      this.item.update(item);

    });
    html.find(".ineffective-array").change((ev)=>{
      const li = ev.currentTarget;
      let item = duplicate(this.item);
      let damagetype = item.system.armor.ineffective;

      damagetype[li.attributes["data-dindex"].value]=ev.currentTarget.value;
      item.system.armor.ineffective=damagetype;
      this.item.update(item);
    });
  }

}
