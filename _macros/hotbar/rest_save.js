async function rollCheck(rollString) {
	//translate rollString into foundry roll string format
	if (rollString.includes("[") === true) {
	  //extract dice needed
	  rollDice = rollString.substr(0,rollString.indexOf("[")).concat(',',rollString.substr(0,rollString.indexOf("[")));
	  //make adv/dis template
	  rollAdv = '{[diceSet]}kl';
	  rollDis = '{[diceSet]}kh';
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
	//get attributes to compare against
  curStress = game.user.character.system.other.stress.value;
  sanitySave = game.user.character.system.stats.sanity.value;
  fearSave = game.user.character.system.stats.fear.value;
  bodySave = game.user.character.system.stats.body.value;
  minSave = Math.min(sanitySave, fearSave, bodySave);
  //calculate rest result
  onesValue = Number(String(macroRoll.total).charAt(String(macroRoll.total).length-1));
  //prepare list of critical rolls
  doubles = new Set([0, 11, 22, 33, 44, 55, 66, 77, 88, 99]);
  //check for crit
  if (doubles.has(macroRoll.total) === true) {
    critical = "CRITICAL ";
  } else {
    critical = "";
  }
  //set result variables
  if (macroRoll.total >= 90) {
    outcome = "FAILURE";
    change = "increased";
    type = "Gained";
  } else if (macroRoll.total < minSave) {
    outcome = "SUCCESS";
    change = "decreased";
    type = "Relieved";
  } else {
    outcome = "FAILURE";
    change = "increased";
    type = "Gained";
  }
  //set stress mod
  if (critical === "CRITICAL " && outcome === "SUCCESS") {
    stressMod = -2*onesValue;
  } else if (critical === "" && outcome === "SUCCESS") {
    stressMod = -1*onesValue;
  } else {
    stressMod = 1;
  }
  //set new stress level
  if (curStress + stressMod > 20) {
    newStress = 20;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  } else if (curStress + stressMod < 2) {
    newStress = 2;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  } else {
    newStress = curStress + stressMod;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  }
  //set header
  if (stressMod === 0 || stressDiff === 0) {
    msgHeader = `Stress Unchanged`;
  } else {
    msgHeader = `Stress ${type}`;
  }
  //update characters stress level
  game.user.character.update({'system.other.stress.value': newStress});
  //create stress flavor text
  if (game.user.character.system.class.value === 'Android') {
    if (outcome === "FAILURE") {
      msgFlavor = `
      <div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
			  <strong>${critical}${outcome}!</strong>
		  </div>
		  Power surges through your chest and you start to overheat.<br>
      `;
    } else {
      msgFlavor = `
      <div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
        <strong>${critical}${outcome}!</strong>
      </div>
      You soft-reset, purging unnecessary background processes.<br>
      `;
    }
  } else {
    if (outcome === "FAILURE") {
      msgFlavor = `
      <div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
			  <strong>${critical}${outcome}!</strong>
		  </div>
      You feel tightness in your chest and start to sweat.<br>
      `;
    } else {
      msgFlavor = `
      <div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
			  <strong>${critical}${outcome}!</strong>
		  </div>
      You feel a sense of calm wash over you.<br>
      `;
    }
  }
  //create chat variables
  if (stressMod === 0) {
    msgOutcome = `Frustratingly, you can't seem to relax. You still have a stress of <strong>${newStress}</strong>.`;
  } else if (stressMod < 0 && newStress === 2 && stressDiff === 0) {
    msgOutcome = `You are already as calm as possible.`;
  } else if (stressMod > 0 && newStress === 20 && stressDiff < stressMod) {
    msgOutcome = `You hit rock bottom. Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>. You must also <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else if (stressMod > 0 && newStress === 20 && stressDiff === 0) {
    msgOutcome = `You feel a part of yourself drift away. <strong>Reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else {
    msgOutcome = `Stress ${change} from <strong>${curStress}</strong> to <strong>${newStress}</strong>.`;
  }
  //create message if crit fail
  if (critical === "CRITICAL " && outcome === "FAILURE") {
    results_critfail = `<br><br>@Macro[Panic Check]{Make a Panic Check}`;
  } else {
    results_critfail = ``;
  }
  //set roll info
  overUnder = `<i class="fas fa-angle-left"></i>`;
  target = minSave;
  //create message from template
  macroResult = `
  <div class="mosh">
    <div class="rollcontainer">
      <div class="flexrow" style="margin-bottom : 5px;">
        <div class="rollweaponh1">${msgHeader}</div>
        <div style="text-align: right"><img class="roll-image" src="modules/fvtt_mosh_1e_psg/icons/macros/rest_save.png" /></div>
      </div>
      <div class="description" style="margin-bottom: 10px;">
        <div class="body">${msgFlavor}</div>
      </div>
      <div class="dice-roll" style="margin-bottom: 10px;">
        <div class="dice-result">
          <div class="dice-formula">${rollString} ${overUnder} ${target}</div>
          <h4 class="dice-total">${macroRoll.total}</h4>
        </div>
      </div>
      <div class="description" style="margin-bottom: 20px;">${msgOutcome}${results_critfail}</div>
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
  
  new Dialog({
	title: `Rest Save`,
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
	  <div class="macro_img"><img src="modules/fvtt_mosh_1e_psg/icons/macros/rest_save.png" style="border:none"/></div>
	  <div class="macro_desc"><h3>Rest Save</h3>You can relieve Stress by resting in a relatively safe place. If you succeed, reduce your Stress; <strong>if you fail, you gain 1 Stress instead.</strong> Players can gain Advantage on their Rest Save by participating in consensual sex, recreational drug use, a night of heavy drinking, prayer, or any other suitable leisure activity. Unsafe locations may incur Disadvantage.</div>
	</div>
  </div>
  
  <h4>Select your roll type:</h4>
  `,
	buttons: {
	  button1: {
		label: `Advantage`,
		callback: () => rollCheck(`1d100[+]`),
		icon: `<i class="fas fa-angle-double-up"></i>`
	  },
	  button2: {
		label: `Normal`,
		callback: () => rollCheck(`1d100`),
		icon: `<i class="fas fa-minus"></i>`
	  },
	  button3: {
		label: `Disadvantage`,
		callback: () => rollCheck(`1d100[-]`),
		icon: `<i class="fas fa-angle-double-down"></i>`
	  }
	}
  },{width: 600,height: 265}).render(true);