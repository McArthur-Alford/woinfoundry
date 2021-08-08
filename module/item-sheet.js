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
    console.log("woo");
    console.log(data);
    if(data.data.data.weapon.damagetype[data.data.data.weapon.damagetype.length-1]){
      let item = duplicate(this.item);
      item.data.weapon.damagetype.push(null);
      this.item.update(item);
    }
    else if(data.data.data.weapon.damagetype.length>1&&!data.data.data.weapon.damagetype[data.data.data.weapon.damagetype.length-1]&&!data.data.data.weapon.damagetype[data.data.data.weapon.damagetype.length-2]){
      let item = duplicate(this.item);
      item.data.weapon.damagetype.pop();
      this.item.update(item);
    }
    if(data.data.data.armor.ineffective[data.data.data.armor.ineffective.length-1]){
      let item = duplicate(this.item);
      item.data.armor.ineffective.push(null);
      this.item.update(item);
    }
    else if(data.data.data.armor.ineffective.length>1&&!data.data.data.armor.ineffective[data.data.data.armor.ineffective.length-1]&&!data.data.data.armor.ineffective[data.data.data.armor.ineffective.length-2]){
      let item = duplicate(this.item);
      item.data.armor.ineffective.pop();
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
      let damagetype = item.data.weapon.damagetype;

      damagetype[li.attributes["data-dindex"].value]=ev.currentTarget.value;
      item.data.weapon.damagetype=damagetype;
      this.item.update(item);

    });
    html.find(".ineffective-array").change((ev)=>{
      const li = ev.currentTarget;
      let item = duplicate(this.item);
      let damagetype = item.data.armor.ineffective;

      damagetype[li.attributes["data-dindex"].value]=ev.currentTarget.value;
      item.data.armor.ineffective=damagetype;
      this.item.update(item);
    });
  }

}
