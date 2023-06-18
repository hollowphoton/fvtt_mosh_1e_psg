curStress = game.user.character.system.other.stress.value;
sanitySave = game.user.character.system.stats.sanity.value;
fearSave = game.user.character.system.stats.fear.value;
bodySave = game.user.character.system.stats.body.value;
doubles = new Set([0, 11, 22, 33, 44, 55, 66, 77, 88, 99]);
outcome = "";
change = "";
type = "";
critical = "";
stressMod = 0;


const myDialogOptions = {
  width: 600,
  height: 270
};

async function rollUnder(rollString) {

  statValue = Math.min(sanitySave, fearSave, bodySave);
  rollValue = await new Roll(rollString).roll({async: true});
  onesValue = Number(String(rollValue.total).charAt(String(rollValue.total).length-1));
  
  if(doubles.has(rollValue.total) === true) {
    critical = "Critical ";
  } else {
    critical = "";
  }

  if (rollValue.total >= 90) {
    outcome = "Failure";
    change = "increased";
    type = "Gained";
  } else if (rollValue.total < statValue) {
    outcome = "Success";
    change = "decreased";
    type = "Relieved";
  } else {
    outcome = "Failure";
    change = "increased";
    type = "Gained";
  }

  if (critical === "Critical " && outcome === "Success") {
    stressMod = -2*onesValue;
  } else if (critical === "" && outcome === "Success") {
    stressMod = -1*onesValue;
  } else {
    stressMod = 1;
  }

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

  game.user.character.update({'system.other.stress.value': newStress});

  if (stressMod === 0 || stressDiff === 0) {
    results_header = `<h3>Stress Unchanged</h3>`;
  } else {
    results_header = `<h3>Stress ${type}</h3>`;
  }

  if (outcome === "Failure") {
    results_flavor = `<p><strong>${critical}${outcome}!</strong><br>You feel tightness in your chest and start to sweat. `;
  } else {
    results_flavor = `<p><strong>${critical}${outcome}!</strong><br>You feel a sense of calm wash over you. `;
  }

  results_dice = `<div class="dice-roll">
    <div class="dice-result">
        <div class="dice-formula">${rollString} < ${statValue}</div>
        <h4 class="dice-total">${rollValue.total}</h4>
    </div>
</div><br>`;

  if (stressMod === 0) {
    results_body = `<p>Despite your efforts, nothing happens. You still have a stress of <strong>${newStress}</strong>.`;
  } else if (stressMod < 0 && newStress === 2 && stressDiff === 0) {
    results_body = `<p>You are already as calm as possible.`;
  } else if (stressMod > 0 && newStress === 20 && stressDiff === 0) {
    results_body = `<p>You are already at the maximum stress level of <strong>20</strong>! You must <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else if (stressMod > 0 && newStress === 20 && stressDiff < stressMod) {
    results_body = `<p>Stress increased by <strong>${stressDiff}</strong> to the maximum stress level of <strong>20</strong>! You must also <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else {
    results_body = `Stress ${change} from <strong>${curStress}</strong> to <strong>${newStress}</strong>.`;
  }

  if (critical === "Critical " && outcome === "Failure") {
    results_critfail = `<br><br><strong>@Macro[Triggered Panic Check]{Make a Panic Check}</strong>`;
  } else {
    results_critfail = ``;
  }

  results_html = results_header + results_flavor + results_dice + results_body + results_critfail;

  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({token: actor}),
    content: results_html
  });

}

new Dialog({
  title: "Gain Stress",
  content: "<table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/macros/relieve_stress.png\" width=\"700\" /></td><td><h4>&nbsp&nbsp</h4></td><td><h3>Relieve Stress</h3><p>You can relieve Stress by resting in a relatively safe place. If you succeed, reduce your Stress; <strong>if you fail, you gain 1 Stress instead.</strong> Players can gain Advantage on their Rest Save by participating in consensual sex, recreational drug use, a night of heavy drinking, prayer, or any other suitable leisure activity. Unsafe locations may incur Disadvantage.</p></td><td><h4>&nbsp&nbsp</h4></td></tr></tbody></table><h4>Select your roll type:</h4>",
  buttons: {
    button1: {
      label: "Advantage",
      callback: () => rollUnder("1d100kl"),
      icon: `<i class="fas fa-angle-double-up"></i>`
    },
    button2: {
      label: "Normal",
      callback: () => rollUnder("1d100"),
      icon: `<i class="fas fa-minus"></i>`
    },
    button3: {
      label: "Disadvantage",
      callback: () => rollUnder("1d100kh"),
      icon: `<i class="fas fa-angle-double-down"></i>`
    }
  }
}, myDialogOptions).render(true);