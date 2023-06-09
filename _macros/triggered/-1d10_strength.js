alterAttribute();

async function alterAttribute() {
    //init vars
    playerRoll = '-1d10';
    //get attribute to compare against
    curValue = game.user.character.system.stats.strength.value;
    //roll dice
    let macroRoll = await new Roll(playerRoll).evaluate();
    //set stressmod
    valueMod = macroRoll.total;
    //set value to add
    msgHeader = 'STRENGTH LOST';
    msgImg = 'modules/fvtt_mosh_1e_psg/icons/attributes/strength.png';
    //set new value level
    newValue = curValue + valueMod;
    //reset to zero if < 0
    if (newValue < 0) {newValue = 0};
    //update characters value level
    game.user.character.update({'system.stats.strength.value': newValue});
    //create value flavor text
    if (game.user.character.system.class.value === 'Android') {
        msgFlavor = `Central partition damage detected. Unrecoverable sectors found.<br><br>`;
    } else {
        msgFlavor = `You feel a part of yourself drift away.<br><br>`;
    }
    //create chat variables
    if (curValue === 0) {
        msgOutcome = `Your Strength cannot get any lower.`;
    } else {
        msgOutcome = `Strength decreased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
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
}