minusAll();

async function minusAll() {
    //get attribute to compare against
    strValue = game.user.character.system.stats.strength.value - 1;
    spdValue = game.user.character.system.stats.speed.value - 1;
    intValue = game.user.character.system.stats.intellect.value - 1;
    comValue = game.user.character.system.stats.combat.value - 1;
    sanValue = game.user.character.system.stats.sanity.value - 1;
    ferValue = game.user.character.system.stats.fear.value - 1;
    bodValue = game.user.character.system.stats.body.value - 1;
    //reset to zero if < 0
    if (strValue < 0) {strValue = 0};
    if (spdValue < 0) {spdValue = 0};
    if (intValue < 0) {intValue = 0};
    if (comValue < 0) {comValue = 0};
    if (sanValue < 0) {sanValue = 0};
    if (ferValue < 0) {ferValue = 0};
    if (bodValue < 0) {bodValue = 0};
    //set message header
    msgHeader = 'DNA INTEGRITY LOST';
    msgImg = 'modules/fvtt_mosh_1e_psg/icons/attributes/health.png';
    //create value flavor text
    if (game.user.character.system.class.value === 'Android') {
        msgFlavor = `Catastro▒ic d⟑ta ▓loss de|/~ ⋥⋱<br><br>`;
    } else {
        msgFlavor = `You stare into blackness and feel completely unable to pull yourself out of it.<br><br>`;
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
    game.user.character.update({'system.stats.strength.value': strValue});
    game.user.character.update({'system.stats.speed.value': spdValue});
    game.user.character.update({'system.stats.intellect.value': intValue});
    game.user.character.update({'system.stats.combat.value': comValue});
    game.user.character.update({'system.stats.sanity.value': sanValue});
    game.user.character.update({'system.stats.fear.value': ferValue});
    game.user.character.update({'system.stats.body.value': bodValue});
}