alterAttribute();

async function alterAttribute() {
    //get attribute to compare against
    curValue = game.user.character.system.other.stress.min;
    minValue = game.user.character.system.other.stress.min;
    maxValue = game.user.character.system.other.stress.max;
    //set value to add
    msgHeader = 'MINIMUM STRESS GAINED';
    msgImg = 'modules/fvtt_mosh_1e_psg/icons/macros/gain_stress.png';
    valueMod = 1;
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
        msgFlavor = `Power surges through your chest and you start to overheat.<br><br>`;
    } else {
        msgFlavor = `You feel tightness in your chest and start to sweat.<br><br>`;
    }
    //create chat variables
    if (valueMod > 0 && newValue === maxValue && valueDiff === 0) {
        msgOutcome = `You are already at Maximum stress.`;
    } else if (valueMod > 0 && valueDiff > 0) {
        msgOutcome = `Minimum Stress increased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
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
    game.user.character.update({'system.other.stress.min': newValue});
    //change current value if max is lower
    if (newValue > game.user.character.system.other.stress.value) {
        game.user.character.update({'system.other.stress.value': newValue});
    }
}