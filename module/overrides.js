export function overrides() {
    //console.log("WOIN | overrides.js overrides Overrides Started")
    // TokenHUD.prototype._onToggleEffect = function (event, { overlay = false } = {}) {
    //     event.preventDefault();
    //     let img = event.currentTarget;
    //     const effect = (img.dataset.statusId && this.object.actor) ?
    //         CONFIG.statusEffects.find(e => e.id === img.dataset.statusId) :
    //         img.getAttribute("src");
    //     if (event.button == 0)
    //     {
    //         return this.object.incrementCondition(effect);
    //     }
    //     if (event.button == 2)
    //     {
    //         return this.object.decrementCondition(effect);
    //     }
    // }

    // Token.prototype.incrementCondition = async function (effect, { active, overlay = false } = {}) {
    //     const existing = this.actor.effects.find(e => e.getFlag("core", "statusId") === effect.id);
    //     this.actor.addCondition(effect.id);

    //     // Update the Token HUD
    //     if (this.hasActiveHUD) canvas.tokens.hud.refreshStatusIcons();
    //     return active;
    // }

    // Token.prototype.decrementCondition = async function (effect, { active, overlay = false } = {}) {
    //     this.actor.removeCondition(effect.id);

    //     // Update the Token HUD
    //     if (this.hasActiveHUD) canvas.tokens.hud.refreshStatusIcons();
    //     return active;
    // }

    // Token.prototype.drawEffects = async function drawEffects() {
    //     // this.effects.children().forEach(c => c.destroy());
    //     const tokenEffects = this.system.effects;
    //     const actorEffects = this.actor?.temporaryEffects || [];
    //     let overlay = {
    //         src: this.system.overlayEffect,
    //         tint: null
    //     };

    //     // Draw status effects
    //     if (tokenEffects.length || actorEffects.length) {
    //         const promises = [];
    //         let w = Math.round(canvas.dimensions.size / 2 / 5) * 2;
    //         let bg = this.effects.addChild(new PIXI.Graphics()).beginFill(0x000000, 0.40).lineStyle(1.0, 0x000000);
    //         let i = 0;

    //         // Draw actor effects first
    //         for (let f of actorEffects) {
    //             if (!f.system.icon) continue;
    //             const tint = f.system.tint ? colorStringToHex(f.system.tint) : null;
    //             if (f.getFlag("core", "overlay")) {
    //                 overlay = { src: f.system.icon, tint };
    //                 continue;
    //             }
    //             console.log("WOIN | overrides.js overrides f ", f);
    //             promises.push(this._drawEffect(f.system.icon, i, bg, w, tint, f.system.flags.woin.value));
    //             i++;
    //         }

    //         // Next draw token effects
    //         for (let f of tokenEffects) {
    //             promises.push(this._drawEffect(f, i, bg, w, null, 1));
    //             i++;
    //         }
    //         await Promise.all(promises);
    //     }

    //     // Draw overlay effect
    //     return this._drawOverlay(overlay)
    // }

    // Token.prototype._drawEffect = async function (src, i, bg, w, tint, value) {
    //     let tex = await loadTexture(src);
    //     let icon = this.effects.addChild(new PIXI.Sprite(tex));
    //     console.log("WOIN | overrides.js overrides icon ", icon);
    //     w = w * 2

    //     icon.width = icon.height = w;
    //     icon.x = Math.floor(i / 5) * w;
    //     icon.y = (i % 5) * w;

    //     if (tint) icon.tint = tint;
    //     if (value>1) {
    //         icon.tint = parseInt("00ffe3", 16);
    //     }
    //     bg.drawRoundedRect(icon.x + 1, icon.y + 1, w - 2, w - 2, 2);
    //     this.effects.addChild(icon);
    // }
}