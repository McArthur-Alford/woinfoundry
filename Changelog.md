# Version 0.4.4
-> Supports foundry v10.
-> Standardization of lazy logging.
-> Autocalculation of max pool (dice_cap).
-> Prior bugs still exist.

# Version 0.4.3
-> Supports foundry v9, might be some bugs but it seems to work. Had to regress some of the status effect systems to get it to work.

# Version 0.4
-> Works for foundry 0.8.X with a few bugs still. We did it!
# Version 0.3.1
-> Added color settings to config. 
-> Fixed flavour message on skill rolls.
-> Fixed sizing on text fields.
-> Improved chat message styling.

# Version 0.3
NOTE: The old language field was not deleted, only hidden. Exporting a characters data can be used to read the old language data. Please write down languages before upgrading.
## Carry/Equipped Items:
-> Added carried/equipped button to the character sheet. Uncarried items cannot be equipped, and are moved to a seperate list for organisation. Equipping items currently has no effect other than organisation.

-> Uncarried items do not contribute to carry capacity.

## Roll Rework V1:
-> Added new Rolling Menu with distinct features for Attacks/Skills/Damage.

-> Added checkboxes for attack roll conditions (e.g. flanking)

-> Fixed negative dice when applying negative conditional modifiers.

-> Removed formula box in favour of checkboxes, added constant field and exploding checkbox to compensate.

-> Transitioned luck from actorclass to actor-sheet to be more stable.

-> Unified and simplified roll button inputs to allow for chat card casting/easy addition of buttons.

## Styling Changes:
-> Completely rewrote most of sheet styling (Expect to find some small bugs until next update).

-> Made the global bar more compact and scalable.

-> Implemented responsive design, toggling a vertical sheet layout in the case of low width. This keeps data readable at smaller sizes.

-> Fixed outdated scrollY variables, sheet does not reset scroll when editing data.

-> Re-organised and broke apart several classes that had become used beyond their purpose.

## Languages:
-> Added a basic NEW compendium for languages.

-> Abstracted languages into being a new item type as a start of the 'upgrades' system.

-> Languages can be drag/dropped and deleted from the sheet. Custom languages/compendiums can be created. This should allow for polyglot support soon.

## Status Effects:
-> Added custom status effect icons. (NEW only at the moment, can mostly be transferred to other systems) 

-> Status icons can be added twice for critical (coloured) icon.

-> Status icons add active-effects to the character sheet, though none currently have effects.

## Advancement:
-> Added deletion confirmation to the advancement tab.

# Version 0.2 - Active Effects
-> Added new tab to character sheet for effects. Effects can be added/removed, and used to modify stats. Some functions are still unrefined, such as dicepools calculating based off an effect.

-> Restyled all items to have a unified and cleaner structure. 

-> Rounded the edges of items.

-> Themed layer controls.

-> Attributes/skills/movement-calculator now use game.actors.get() rather than this.actor in order to improve stability and support active effects. 

-> Attributes are now calculated in actor-sheet.js for stability, and are more easily accessed/correct. Expect this to happen to other stats soon.

-> Calculators now correctly access attributes (making them work).

# Version 0.1.9 - Bug Fixing and Styling Overhaul
-> Repaired structure of left hand bar on character sheet. It is quicker, and more stable. Plus less collapsing.

-> Tweaked styling of items/exploits to be more readable and uniform.

-> Added an interpreter for exploit/item abilities. Mostly backend (for now) but allows for purple psi exploits and white universal exploits in the sheet.

-> Fixed weird colour at top of character sheet.

-> Added Delete Confirmation Dialogue for Skills, Equipment and Exploits. Made scalable for future deletions.

-> Reworked biography tab styles to be more compact and scalable. 

-> Increased player portrait size and added a border.

-> Utilized Font Awesome Where suitable, trash can to delete, pencil to edit, etc.

-> Applied a more stable fix to the error spam bug from 0.1.83.

-> Added an auto-calculate button to the movement statistics, this auto calculates the stat block (not accounting for exploits yet).

-> Added Confirmation Dialogue for General Purpsoes (Currently Auto-Calculate Only)

# Version 0.1.83
-> Patched bug that caused error spam for other clients when changing skills.

# Version 0.1.8
-- Known Bug: Exploits not using correct styling, fixed soon

-> Support for 0.7.5 of foundry

-> Added net worth value to inventory

-> Added blind button in chat rolls

-> Improved dice rolling class for expandability

-> Removed unnecessary debug console outputs

-> A hefty amount of code comments

# Version 0.1.72 - Initiative
-> Initiative stat in combat page.

-> Fixed colour on whispers.

# Version 0.1.6 - Various Editable Fields Added
-> Roll descriptions of items to chat.

-> Highlight number fields when clicked.

-> Art for Health/Luck/Power.

-> Special Fields Not Saving Fixed.

-> Art for combat stats.

-> Roll descriptions of exploits to chat.

-> Health field much bigger.

-> Grade field made editable.

-> Art for Max Pool.

-> Ability to Rearrange Skill Order.

-> Readable Dropdowns.

-> Score changed to rating in skills tab.

-> Tracking Credits is a thing.

-> Skill Dice on Damage.

-> Formula for damage shown on sheet updates live.

-> Descriptions rolled to chat use speaker of selected token if available. 

# Version 0.1.5
-> Fixed compacting loop with skills/weapons.

-> Removed unnecessary 0's.

-> Removed modifiers from dice roll UI. Still underlying functionality.


# Version 0.1.4
-> Skills should work for weapon attacks now.


# Version 0.1.3 - Combat Rolling
-> Added combat rolling.

-> Fancier red links.

-> Fixed skills updating incorrectly.


# Version 0.1
-> Starting point for system is here.

-> Added cool styling to UI/Character sheet.

-> Added in movement stats + basis for combat stats.

-> Added in Skills/Advancement Tracker.
