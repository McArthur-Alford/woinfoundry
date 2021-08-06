export class WOINActor extends Actor {
    prepareData() {
        super.prepareData();
        const actorData = this.data;
        const data = actorData.data;
        const pool = [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8]
        if (actorData.type === "character") {

            // console.log("__=========New_Iteration===========__")
            // // Calculating Attribute DPs:
            // for (var key in data.attributes) {
            //     console.log("=NewLine=");
            //     console.log("Key:",key);
            //     if (pool[data.attributes[key].value] != null) {
            //         console.log("Value:",data.attributes[key].value);
            //         console.log("Initial:",data.attributes[key].dice);
            //         data.attributes[key].dice = pool[data.attributes[key].value];
            //         console.log("Final:",data.attributes[key].dice);
            //     } else {
            //         console.error(`${data.attributes[key].label} out of bounds.`);
            //         data.attributes[key].dice = 0;
            //     }
            // };

            // Calculating Advancement:
            let xp = 0;
            data.advancement.xp_spent.forEach(element => {
                xp -= parseInt(element.value);
            });
            data.advancement.xp_gain.forEach(element => {
                xp += parseInt(element.value);
            });
            data.advancement.xp_total = xp;

            // Calculating Skills:
            actorData.items.forEach(item => {
                if (item.type === "skill") {
                    // let data = duplicate(item.data);
                    // let compare = duplicate(item.data);
                    // let changed = false;
                    // if (data.gradepool != actorData.data.attributes[`${data.attribute}`]["dice"]) {
                    //     data.gradepool = actorData.data.attributes[`${data.attribute}`]["dice"];
                    //     changed = true;
                    //     // this.updateOwnedItem(item, { "data.pool": data.pool });
                    // }
                    // if (data.score >= pool.length) {
                    //     data.score = pool.length - 1;
                    //     data.pool = pool[data.score];
                    //     data.gradepool = actorData.data.attributes[`${data.attribute}`]["dice"];
                    //     changed = true;
                    //     // this.updateOwnedItem(item, { "data.pool": data.pool });
                    // }
                    // if (data.score < 0) {
                    //     data.score = 0;
                    //     data.pool = pool[data.score];
                    //     data.gradepool = actorData.data.attributes[`${data.attribute}`]["dice"];
                    //     changed = true;
                    //     // this.updateOwnedItem(item, { "data.pool": data.pool });
                    // }
                    // if (data.pool != pool[data.score]) {
                    //     data.pool = pool[data.score];
                    //     data.gradepool = actorData.data.attributes[`${data.attribute}`]["dice"];
                    //     changed = true;
                    //     // this.updateOwnedItem(item, { "data.pool": data.pool });
                    // }
                    // if(data.score != compare.score) {
                    //     changed = true;
                    // }
                    // if(data.name != compare.name) {
                    //     changed = true;
                    // }

                    // if(changed) {
                    //     // this.updateOwnedItem(item,data);
                    // }
                    // // console.log("---");
                    // // console.log(data.pool);
                    // // console.log(compare.pool);
                    // // console.log(data===compare);
                    // // if(compare!=data) {
                    // //     console.log(data);
                    // //     this.updateOwnedItem(item, { data });
                    // // }
                }
                if (item.type === "exploit") {
                    let data = item.data;
                    //console.log(data);
                    // Used to ensure old character sheets remain up to date:
                    if (data.style == null) {
                        data.style = "";
                    }
                    // Checking the modifiers for any specific styling choices:
                    data.style = "";
                    if (data.modifier.includes("uni_exploit")) {
                        data.style = "uni";
                    }
                    if (data.modifier.includes("psi_exploit")) {
                        data.style = "psi";
                    }
                }
            });

            // Calculating Carried/Items:
            if (!data.carry) {
                data.carry = {};
            }
            data.carry.carried = 0;
            actorData.items.forEach(item => {
                if (item.type === "item" && item.data.carried === true) {
                    data.carry.carried += item.data.weight * item.data.quantity;
                    if (item.type != "skill") {
                        //console.log(item)
                        let itemData = item.data;
                        //console.log(itemData);
                        itemData.weapon.skilldamage = 0;
                        if (itemData.skill) {
                            //console.log(itemData.skill);
                            let pool;
                            if (typeof itemData.skill === 'string') {
                                pool = (data.attributes[itemData.skill.toLowerCase()]);
                            }
                            else {
                                pool = (data.attributes[itemData.skill.toLowerCase()]);
                            }

                            if (pool) {
                                let update = pool.dice;
                                pool = update;
                                itemData.error = "";
                            }
                            else {
                                itemData.error = "error-red";
                                actorData.items.forEach(skill => {
                                    if (skill.type === "skill" && skill.name.toLowerCase() === itemData.skill.toLowerCase()) {
                                        pool = skill;
                                        let update = skill.data.gradepool + skill.data.pool;
                                        if (skill.data.pool != itemData.weapon.skilldamage) {
                                            itemData.weapon.skilldamage = skill.data.pool;
                                        }
                                        pool = update;
                                        itemData.error = "";
                                    }
                                });
                            }
                            pool += itemData.weapon.bonus_attack;

                            if (!item.data.weapon.attack || pool != item.data.weapon.attack) {
                                itemData.weapon.attack = pool;
                                // this.updateOwnedItem(item, {"data":itemData});
                            }
                        }
                    }
                }
            });

            // Calculating Initiative:
            data.initiative.error = "error-red";
            let attdice = (data.attributes[data.initiative.skill]);
            if (attdice) {
                data.initiative.value = attdice.dice;
                data.initiative.error = "";
            }
            else {
                actorData.items.forEach(skill => {
                    if (skill.type === "skill" && skill.name.toLowerCase() === data.initiative.skill.toLowerCase()) {
                        data.initiative.value = skill.data.pool + skill.data.gradepool;
                        data.initiative.error = "";
                    }
                });
            }
            if (data.initiative.value > data.advancement.dice_cap) {
                data.initiative.value = data.advancement.dice_cap;
            }
            if (data.initiative.value < 0) {
                data.initiative.value = 0;
            }
            data.initiative.value = parseInt(data.initiative.value) + parseInt(data.initiative.mod);

            // Calculating Credits:
            data.net_worth = data.credits || 0;
            actorData.items.forEach(item => {
                if (item.type === "item") {
                    if (Number.isFinite(item.data.cost) && Number.isFinite(item.data.quantity)) {
                        data.net_worth += item.data.cost * item.data.quantity;
                    }
                }
            });
        }
    }

    async addCondition(effect) {
        if (typeof (effect) === "string")
            effect = duplicate(CONFIG.statusEffects.find(e => e.id == effect))
        if (!effect)
            return "No Effect Found"

        if (!effect.id)
            return "Conditions require an id field"


        let existing = this.hasCondition(effect.id)

        if (existing) {
            existing = duplicate(existing)
            existing.flags.woin.value = Math.min(2,existing.flags.woin.value+1);
            return this.updateEmbeddedEntity("ActiveEffect", existing)
        }
        else if (!existing) {
            effect.flags.woin.value = 1;
            effect["flags.core.statusId"] = effect.id;
            delete effect.id
            return this.createEmbeddedEntity("ActiveEffect", effect)
        }
    }

    async removeCondition(effect) {
        if (typeof (effect) === "string")
            effect = duplicate(CONFIG.statusEffects.find(e => e.id == effect))
        if (!effect)
            return "No Effect Found"

        if (!effect.id)
            return "Conditions require an id field"

        let existing = this.hasCondition(effect.id)

        if (existing) {
            existing.flags.woin.value -= 1;
            if (existing.flags.woin.value <= 0)
                return this.deleteEmbeddedEntity("ActiveEffect", existing._id)
            else
                return this.updateEmbeddedEntity("ActiveEffect", existing)
        }
    }


    hasCondition(conditionKey) {
        let existing = this.data.effects.find(i => getProperty(i, "flags.core.statusId") == conditionKey)
        return existing
    }

}