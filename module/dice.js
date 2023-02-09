export class DiceWOIN {

    static async rollGeneral({ attribute_dice = 0, skill_dice = 0, actorId = null, description = null, constant=0 }) {
        let actor = game.actors.find(item => item.id == actorId);
        console.log("WOIN | dice.js rollGeneral actorId", actorId);
        console.log("WOIN | dice.js rollGeneral game.actors", game.actors);
        let cap = actor.system.advancement.dice_cap;
        let dice = Math.max(0,Math.min(cap, Number(skill_dice) + Number(attribute_dice)));

        let rolled = false;

        function _roll(html, privacy) {
            const base = html.find('[name="base"')[0].value;
            const add  = html.find('[name="bonus"')[0].value;
            const constant = html.find('[name="constant"')[0].value;
            const luck = html.find('[name="luck"')[0].value || 0;
            const explode = html.find('[name="explode"')[0].checked ? "x6" : "";

            let formula = (`${1*base+1*add}d6${explode} + ${luck}d6x6 + ${constant}`);
            let roll = new Roll(formula, description);
            roll = roll.toMessage({ speaker: speaker, flavor: flavor }, { rollMode: privacy });
            actor.update({ 'system.luck.value': actor.system.luck.value - luck });
            rolled = true;
            return roll;
        }

        let template = "systems/woinfoundry/templates/chat/general-roll-dialog.html";
        let rollMode = game.settings.get("core", "rollMode");
        let speaker = ChatMessage.getSpeaker();
        let flavor = description || title;
        
        let dialogData = {
            base: dice,
            constant: constant,
            maxLuck: actor.system.luck.value,
            rollMode: rollMode
        };
        const html = await renderTemplate(template, dialogData);

        let roll;

        return new Promise(resolve => {
            new Dialog({
                title: "Roll",
                content: html,
                buttons: {
                    normal: {
                        label: "Public",
                        callback: html => { roll = _roll(html, "roll"); }
                    },
                    blind: {
                        label: "Private",
                        callback: html => { roll = _roll(html, "gmroll"); }
                    },
                    private: {
                        label: "Blind",
                        callback: html => { roll = _roll(html, "blindroll"); }
                    }
                },
                default: "normal",
                close: html => {
                    resolve(rolled ? roll : false)
                }
            }, null).render(true);
        });
    }

    static async rollDamage({ itemId = null, actorId = null, description = null }) {
        // TODO: Is this even needed?
    }

    static async rollAttack({ itemId = null, actorId = null, description = null }) {
        let actor = game.actors.find(item => item.id == actorId);
        let item = actor.items.find(item => item.id == itemId);
        let itemSkill = item.system.skill.toLowerCase();
        let skill = actor.items.find(skill => skill.name.toLowerCase() == itemSkill.toLowerCase());
        let bonus = item.system.weapon.bonus_attack;
        let cap = actor.system.advancement.dice_cap;
        let rolled = false;

        let skillPool;
        let attribute;
        if (!skill) {
            if (actor.system.attributes[itemSkill]) {
                skillPool = 0;
                attribute = actor.system.attributes[itemSkill].dice;
            }
            else {
                ui.notifications.error("Invalid Skill");
                return;
            }
        } else {
            skillPool = skill.system.pool;
            attribute = actor.system.attributes[skill.system.attribute].dice;
        }

        console.log("WOIN | dice.js rollAttack  ____________________");
        console.log("WOIN | dice.js rollAttack  SKILL | ", itemSkill);
        console.log("WOIN | dice.js rollAttack  CAP | ", cap);
        console.log("WOIN | dice.js rollAttack  SKILL | ", skillPool);
        console.log("WOIN | dice.js rollAttack  ATTRIBUTE | ", attribute);
        console.log("WOIN | dice.js rollAttack  BONUS | ", bonus);

        let capped = Math.max(0, Math.min(cap, skillPool + attribute));

        function _roll(html, privacy) {
            const base = html.find('[name="base"')[0].value;
            const add  = html.find('[name="bonus"')[0].value;
            const constant = html.find('[name="constant"')[0].value;
            const luck = html.find('[name="luck"')[0].value || 0;
            
            // NOTE 10" for ranged, 5" for melee
            const highground = html.find('[name="high-ground"')[0].checked === true ? 1 : 0;

            const flanking = html.find('[name="flanking"')[0].checked === true ? 1 : 0;

            const aim = html.find('[name="aim-fient"')[0].checked === true ? 1 : 0;

            const cover = html.find('[name="cover"')[0].checked === true ? -2 : 0;

            const rangeincrement = -(html.find('[name="range-increment"')[0].value - 1);

            // NOTE Sidearms do not suffer this penalty if the target is adjacent.
            const intomelee = html.find('[name="into-melee"')[0].checked ? -2 : 0;

            // NOTE Sidearms only
            const pointblank = html.find('[name="point-blank"')[0].checked ? 1 : 0;

            const improvised = html.find('[name="improvised"')[0].checked ? -2 : 0;

            const obscured = html.find('[name="obscured"')[0].checked ? -2 : 0;

            const pronem = html.find('[name="pronem')[0].checked ? 2 : 0;

            const proner = html.find('[name="proner')[0].checked ? -1 : 0;

            // NOTE roll against the targets vital defence. Knock the opponent prone, disarm them, push them, disable (giving slowed), as outlined in statblock.
            const called = -html.find('[name="called"')[0].checked ? -2 : 0;

            const sacrifice = -html.find('[name="sacrifice"')[0].value;

            const pinned = html.find('[name="pinned"')[0].value;

            const unaware = html.find('[name="unaware"')[0].checked ? 2 : 0;

            const crossfire = html.find('[name="crossfire"')[0].value;

            const supressive = html.find('[name="suppressive"')[0].checked ? -2 : 0;

            const explode = html.find('[name="explode"')[0].checked ? "x6" : "";

            let formula = (`${1*base+1*add+1*unaware+1*crossfire+1*supressive+1*flanking+1*highground+1*aim+1*cover+1*rangeincrement+1*intomelee+1*pointblank+1*improvised+1*obscured+1*pronem+1*proner+1*called+1*sacrifice+1*pinned}d6${explode} + ${luck}d6x6 + ${constant}`);
            let roll = new Roll(formula, description);
            roll = roll.toMessage({ speaker: speaker, flavor: flavor }, { rollMode: privacy });
            actor.update({ 'system.luck.value': actor.system.luck.value - luck });
            rolled = true;
            return roll;
        }

        let template = "systems/woinfoundry/templates/chat/combat-roll-dialog.html";
        let rollMode = game.settings.get("core", "rollMode");
        let speaker = ChatMessage.getSpeaker();
        let flavor = description || "";
        
        let dialogData = {
            base: capped,
            maxLuck: actor.system.luck.value,
            rollMode: rollMode
        }
        const html = await renderTemplate(template, dialogData);

        let roll;

        return new Promise(resolve => {
            new Dialog({
                title: "Roll",
                content: html,
                buttons: {
                    normal: {
                        label: "Public",
                        callback: html => { roll = _roll(html, "roll"); }
                    },
                    blind: {
                        label: "Private",
                        callback: html => { roll = _roll(html, "gmroll"); }
                    },
                    private: {
                        label: "Blind",
                        callback: html => { roll = _roll(html, "blindroll"); }
                    }
                },
                default: "normal",
                close: html => {
                    resolve(rolled ? roll : false);
                }
            }, null).render(true);
        });
    }

    static async roll({gradecapped=[], parts=[], sender=null, data=null, flavor=null, speaker=null, title=null, template=null, rollMode=null}) {
        flavor = flavor || title;
        speaker = speaker || ChatMessage.getSpeaker();
        rollMode = rollMode || game.settings.get("core", "rollMode");
        let rolled = false;
        // console.log("WOIN | dice.js roll ??", parseInt(parts[0].split("+").replace("d6","")));

        function _roll(parts, html, privacy) {
            let modifier = " + " + html.find('[name="bonus"')[0].value + "d6";
            let luck = " + 0";
            if ((html.find('[name="luck"')[0].value)) luck = " + " + html.find('[name="luck"')[0].value + "d6x6";
            let formula = html.find('[name="formula"')[0].value + modifier + luck;
            let roll = new Roll(formula, system);
            roll = roll.toMessage({ speaker: speaker, flavor: flavor }, { rollMode: privacy });
            rolled = true;
            sender.update({ 'system.luck.value': sender.system.luck.value - html.find('[name="luck"')[0].value })
            return roll;
        }

        // Render modal dialog
        template = template || "systems/woinfoundry/templates/chat/roll-dialog.html";
        let dialogData = {
            formula: parts.join(" + "),
            maxLuck: sender.system.luck.value,
            data: system,
            rollMode: rollMode,
            rollModes: CONFIG.rollModes,
            config: CONFIG.DND5E
        };
        const html = await renderTemplate(template, dialogData);

        // Create the Dialog window
        let roll;

        return new Promise(resolve => {
            new Dialog({
                title: title,
                content: html,
                buttons: {
                    normal: {
                        label: "Public",
                        callback: html => { roll = _roll(parts, html, "roll"); }
                    },
                    blind: {
                        label: "Private",
                        callback: html => { roll = _roll(parts, html, "gmroll"); }
                    },
                    private: {
                        label: "Blind",
                        callback: html => { roll = _roll(parts, html, "blindroll"); }
                    }
                },
                default: "normal",
                close: html => {
                    resolve(rolled ? roll : false);
                }
            }, null).render(true);
        });
    }
}
