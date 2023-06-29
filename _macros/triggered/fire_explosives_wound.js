//init vars
rollTable = 'Fire & Explosives Wound';
rollString = '1d10';
//roll dice
let macroRoll = await new Roll(rollString).evaluate();
//set roll number
finalRoll = macroRoll.total;
//turn 10 to 0
if (finalRoll === 10) {finalRoll  = 0;}
//get table result
console.log(finalRoll);
tableResult = game.tables.getName(rollTable).getResultsForRoll(finalRoll);
//create chat message template
macroResult = `
<div class="mosh">
<div class="rollcontainer">
    <div class="flexrow" style="margin-bottom : 5px;">
    <div class="rollweaponh1">${tableResult[0].parent.name}</div>
    <div style="text-align: right"><img class="roll-image" src="${tableResult[0].img}" title="${tableResult[0].parent.name}" /></div>
    </div>
    <div class="description" style="margin-bottom : 20px;">${tableResult[0].text}</div>
</div>
</div>
`;
//make message ID
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