//get attribute to compare against
strValue = game.user.character.system.stats.strength.value;
spdValue = game.user.character.system.stats.speed.value;
intValue = game.user.character.system.stats.intellect.value;
comValue = game.user.character.system.stats.combat.value;
sanValue = game.user.character.system.stats.sanity.value;
ferValue = game.user.character.system.stats.fear.value;
bodValue = game.user.character.system.stats.body.value;
//set value to add
msgHeader = 'STRENGTH LOST';
msgImg = 'modules/fvtt_mosh_1e_psg/icons/attributes/body.png';
//create value flavor text
if (game.user.character.system.class.value === 'Android') {
    msgFlavor = `Central partition damage detected. Unrecoverable sectors found.<br><br>`;
} else {
    msgFlavor = `You feel a part of yourself drift away.<br><br>`;
}
//create chat variables
msgOutcome = `All stats and saves decreased by <strong>1</strong>.`;
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
game.user.character.update({'system.stats.strength.value': strValue-1});
game.user.character.update({'system.stats.speed.value': spdValue-1});
game.user.character.update({'system.stats.intellect.value': intValue-1});
game.user.character.update({'system.stats.combat.value': comValue-1});
game.user.character.update({'system.stats.sanity.value': sanValue-1});
game.user.character.update({'system.stats.fear.value': ferValue-1});
game.user.character.update({'system.stats.body.value': bodValue-1});