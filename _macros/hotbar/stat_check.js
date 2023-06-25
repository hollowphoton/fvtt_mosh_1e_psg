async function rollCheck(rollTable,rollString) {
  console.log(rollTable);
  console.log(rollString);
  
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
    tableResult = game.tables.getName(rollTable).getResultsForRoll(macroRoll.total);
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
    title: `Stat Check`,
    content: `
  <style>
    .macro_window{
      background: rgb(230,230,230);
      border-radius: 9px;
    }
    .macro_img{
      display: flex;
      justify-content: center; //do I need this
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
      <div class="macro_img"><img src="modules/fvtt_mosh_1e_psg/icons/macros/stat_check.png" style="border:none"/></div>
      <div class="macro_desc"><h3>Stat Check</h3>You have four main Stats which represent your abilities when acting under extreme pressure. Whenever you want to do something and the price for failure is high, roll a stat check. <strong>If you roll less than your Stat you succeed. Otherwise, you fail and gain 1 Stress.</strong> A roll of 90-99 is always a failure. A Critical Failure means something bad happens, and furthermore you must make a Panic Check.</div>    
    </div>
  </div>
  <label for="str">
    <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
      <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="str" name="stat" value="strength" checked="checked">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/attributes/strength.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Strength:</strong> Forcing open jammed airlocks, carrying fallen comrades, holding on for dear life.
          </span>
        </div>    
      </div>
    </div>
  </label>
  <label for="spd">
    <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
      <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="spd" name="stat" value="speed">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/attributes/speed.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Speed:</strong> Getting out of the cargo bay before the blast doors close, acting and reacting in a race against the clock.
          </span>
        </div>    
      </div>
    </div>
  </label>
  <label for="int">
    <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
      <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="int" name="stat" value="intellect">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/attributes/intellect.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Intellect:</strong> Recalling your training and experience under duress.
          </span>
        </div>
      </div>
    </div>
  </label>
  <label for="com">
    <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
      <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="com" name="stat" value="combat">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/attributes/combat.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Combat:</strong> Fighting for your life.
          </span>
        </div>    
      </div>
    </div>
  </label>
  
  <h4>Select your roll type:</h4>
  `,
    buttons: {
      button1: {
        label: `Advantage`,
        callback: (html) => rollCheck(html.find("input[name='wound_table']:checked").val(),`1d10[+]`),
        icon: `<i class="fas fa-angle-double-up"></i>`
      },
      button2: {
        label: `Normal`,
        callback: (html) => rollCheck(html.find("input[name='wound_table']:checked").val(),`1d10`),
        icon: `<i class="fas fa-minus"></i>`
      },
      button3: {
        label: `Disadvantage`,
        callback: (html) => rollCheck(html.find("input[name='wound_table']:checked").val(),`1d10[-]`),
        icon: `<i class="fas fa-angle-double-down"></i>`
      }
    }
  },{width: 600,height: 570}).render(true);