//get attribute to compare against
curValue = game.user.character.system.hits.max;
minValue = game.user.character.system.hits.min;
maxValue = game.user.character.system.hits.max;
//set value to add
msgHeader = 'MAXIMUM HEALTH LOST';
msgImg = 'modules/fvtt_mosh_1e_psg/icons/macros/wound_check.png';
valueMod = -1;
//set new value level
if (curValue + valueMod > maxValue) {
    newValue = maxValue;
    valueDiff = newValue - curValue;
    actorImpact = valueMod - valueDiff;
    newWounds = curWounds;
} else if (curValue + valueMod < minValue) {
    newValue = minValue;
    valueDiff = newValue - curValue;
    actorImpact = valueMod - valueDiff;
} else {
    newValue = curValue + valueMod;
    valueDiff = newValue - curValue;
    actorImpact = valueMod - valueDiff;
    newWounds = curWounds;
}
//create value flavor text
if (game.user.character.system.class.value === 'Android') {
    msgFlavor = `Your pain receptors indicate permanent damage.<br><br>`;
} else {
    msgFlavor = `You scream out from immense pain.<br><br>`;
}
//create chat variables
if (valueMod > 0 && newValue === maxValue && valueDiff === 0) {
    msgOutcome = `You are already at Maximum Wounds.`;
} else if (valueMod > 0 && valueDiff > 0) {
    msgOutcome = `Maximum Wounds increased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
} else if (valueMod < 0 && valueDiff < 0) {
    msgOutcome = `Maximum Wounds decreased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
} else if (valueMod < 0 && valueDiff < 0 && newValue < game.user.character.system.hits.value) {
    msgOutcome = `You are at death's door.<br><br>@Macro[Death Check]{Make a Death Check}`;
}
//create chat message
macroResult = `
<div class="mosh">
<div class="rollcontainer">
    <div class="flexrow" style="margin-bottom: 5px;">
    <div class="rollweaponh1">${msgHeader}</div>
    <div style="text-align: right"><img class="roll-image" src="${msgImg}" /></div>
    </div>
    <div class="description"" style="margin-bottom: 20px;">
    <div class="body">
    ${msgFlavor} ${msgOutcome}
    </div>
    </div>
</div>
</div>
`;
//push chat message
ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({token: actor}),
    content: macroResult
});
//update characters value level
game.user.character.update({'system.hits.max': newValue});