async function rollCheck(rollString) {
  //translate rollString into foundry roll string format
  if (rollString.includes("[") === true) {
    //extract dice needed
    rollDice = rollString.substr(0,rollString.indexOf("[")).concat(',',rollString.substr(0,rollString.indexOf("[")));
    //make adv/dis template
    rollAdv = '{[diceSet]}kh';
    rollDis = '{[diceSet]}kl';
    //make foundry roll string
    if (rollString.includes("[+]") === true) {
      rollStringParsed = rollAdv.replace("[diceSet]",rollDice);
    } else if (rollString.includes("[-]") === true) {
      rollStringParsed = rollDis.replace("[diceSet]",rollDice);
    }
  } else {
    rollStringParsed = rollString;
  }
  //roll dice
  let macroRoll = await new Roll(rollStringParsed).evaluate();
  //get table result
  tableResult = game.tables.getName("Death Check").getResultsForRoll(macroRoll.total);
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
}

new Dialog({
  title: `Death Check`,
  content: `
<style>
  .macro_window{
    background: rgb(230,230,230);
    border-radius: 9px;
  }
  .macro_img{
    display: flex;
    justify-content: center;
  }
  .macro_desc{
    font-family: "Roboto", sans-serif;
    font-size: 10.5pt;
    font-weight: 400;
    padding-top: 8px;
    padding-right: 8px;
    padding-bottom: 8px;
  }
  .grid-2col {
    display: grid;
    grid-column: span 2 / span 2;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2px;
    padding: 0;
  }
</style>

<div class ="macro_window" style="margin-bottom : 7px;">
  <div class="grid grid-2col" style="grid-template-columns: 150px auto">
    <div class="macro_img"><img src="modules/fvtt_mosh_1e_psg/icons/rolltables/death_check.png" style="border:none"/></div>
    <div class="macro_desc"><h3>Death Check</h3>Whenever you would die, the Warden makes a <strong>Death Check</strong> for you. As soon as someone spends a turn checking your vitals, the result is revealed. If your character’s death is imminent, make your last moments count: save someone’s life, solve an important mystery, or give the others time to escape. Enjoy the carnage, then jump back in for more!</div>    
  </div>
</div>

<h4>Select your roll type:</h4>
`,
  buttons: {
    button1: {
      label: `Advantage`,
      callback: () => rollCheck(`1d10[+]`),
      icon: `<i class="fas fa-angle-double-up"></i>`
    },
    button2: {
      label: `Normal`,
      callback: () => rollCheck(`1d10`),
      icon: `<i class="fas fa-minus"></i>`
    },
    button3: {
      label: `Disadvantage`,
      callback: () => rollCheck(`1d10[-]`),
      icon: `<i class="fas fa-angle-double-down"></i>`
    }
  }
},{width: 600,height: 265}).render(true);