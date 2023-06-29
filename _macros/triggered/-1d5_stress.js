//get attribute to compare against
curValue = game.user.character.system.other.stress.value;
minValue = game.user.character.system.other.stress.min;
maxValue = game.user.character.system.other.stress.max;
//roll dice
let macroRoll = await new Roll("-1d5").evaluate();
//turn 10 to 0
if (macroRoll.total === -10) {macroRoll.total = 0}
//set stressmod
valueMod = macroRoll.total;
//set value to add
msgHeader = 'STRESS RELIEVED';
msgImg = 'modules/fvtt_mosh_1e_psg/icons/macros/rest_save.png';
//set new value level
if (curValue + valueMod > maxValue) {
    newValue = maxValue;
    valueDiff = newValue - curValue;
    actorImpact = valueMod - valueDiff;
} else if (curValue + valueMod < minValue) {
    newValue = minValue;
    valueDiff = newValue - curValue;
    actorImpact = valueMod - valueDiff;
} else {
    newValue = curValue + valueMod;
    valueDiff = newValue - curValue;
    actorImpact = valueMod - valueDiff;
}
//create value flavor text
if (game.user.character.system.class.value === 'Android') {
    msgFlavor = `You soft-reset, purging unnecessary background processes.<br><br>`;
} else {
    msgFlavor = `You feel a sense of calm wash over you.<br><br>`;
}
//create chat variables
if (valueMod === 0) {
    msgOutcome = `Frustratingly, you can't seem to relax. You still have a stress of <strong>${newStress}</strong>.`;
} else if (valueMod < 0 && newValue === minValue && valueDiff === 0) {
    msgOutcome = `You are already as calm as possible.`;
} else if (valueDiff > 0 && actorImpact === 0) {
    msgOutcome = `Stress increased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
} else if (valueDiff < 0 && actorImpact === 0) {
    msgOutcome = `Stress decreased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
} else if (valueDiff > 0 && actorImpact > 0) {
    msgOutcome = `You hit rock bottom. Stress increased from <strong>${curValue}</strong> to <strong>${newValue}</strong>. You must also <strong>reduce the most relevant Stat or Save by ${actorImpact}</strong>.`;
} else if (valueDiff === 0 && actorImpact > 0) {
    msgOutcome = `You feel a part of yourself drift away. <strong>Reduce the most relevant Stat or Save by ${actorImpact}</strong>.`;
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
chatId = randomID();
//make message
macroMsg = await macroRoll.toMessage({
  id: chatId,
  user: game.user._id,
  speaker: ChatMessage.getSpeaker({token: actor}),
  content: macroResult
},{keepId:true});
//make dice
await game.dice3d.waitFor3DAnimationByMessageID(chatId);
//update characters value level
game.user.character.update({'system.other.stress.value': newValue});