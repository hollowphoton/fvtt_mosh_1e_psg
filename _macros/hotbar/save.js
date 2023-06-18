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
  height: 510
};

async function rollCheck(saveType,rollString) {

  if (saveType === "Sanity Save") {
    curSave = sanitySave
  } else if (saveType === "Fear Save") {
    curSave = fearSave
  } else if (saveType === "Body Save") {
    curSave = bodySave
  }

  rollValue = await new Roll(rollString).roll({async: true});
  
  if(doubles.has(rollValue.total) === true) {
    critical = "Critical ";
  } else {
    critical = "";
  }

  if (rollValue.total >= 90) {
    outcome = "Failure";
  } else if (rollValue.total < statValue) {
    outcome = "Success";
  } else {
    outcome = "Failure";
  }

  if (outcome === "Success") {
    stressMod = 0;
  } else {
    stressMod = 1;
  }

  if (curStress + stressMod > 20) {
    newStress = 20;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  } else {
    newStress = curStress + stressMod;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  }

  game.user.character.update({'system.other.stress.value': newStress});

  if (outcome === "Success") {
    results_header = `<h3>${saveType}</h3>`;
  } else {
    results_header = `<h3>${saveType}</h3>`;
  }

  if (outcome === "Failure") {
    results_flavor = `<p><strong>${critical}${outcome}!</strong><br>You feel tightness in your chest and start to sweat. `;
  } else {
    results_flavor = `<p><strong>${critical}${outcome}!</strong><br>You feel a sense of calm wash over you. `;
  }

  results_dice = `<div class="dice-roll">
    <div class="dice-result">
        <div class="dice-formula">${rollString} < ${curSave}</div>
        <h4 class="dice-total">${rollValue.total}</h4>
    </div>
</div>`;

  if (stressMod === 0 && outcome === "Success") {
    results_body = `<p>You avoid certain danger and come out unscathed.</p>`;
  } else if (stressMod > 0 && newStress === 20 && stressDiff === 0) {
    results_body = `<p>The voice of doubt in your head grows louder. You are already at the maximum stress level of <strong>20</strong>! You must <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.</p>`;
  } else if (stressMod > 0 && newStress === 20 && stressDiff < stressMod) {
    results_body = `<p>The voice of doubt in your head grows louder. Stress increased by <strong>${stressDiff}</strong> to the maximum stress level of <strong>20</strong>! You must also <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.</p>`;
  } else {
    results_body = `The voice of doubt in your head grows louder. Stress ${change} from <strong>${curStress}</strong> to <strong>${newStress}</strong>.</p>`;
  }

  if (critical === "Critical " && outcome === "Failure") {
    results_critfail = `<br><strong>@Macro[Triggered Panic Check]{Make a Panic Check}</strong>`;
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
  title: "Save",
  content: "<table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/macros/save.png\" width=\"550\" /></td><td><h4>&nbsp&nbsp</h4></td><td><h3>Save</h3><p>You have three Saves which represent your ability to withstand different kinds of trauma. In order to avoid certain dangers, you sometimes need to roll a Save. <strong>If you roll less than your Save you succeed. Otherwise you fail, and gain 1 Stress.</strong> A roll of 90-99 is always a failure.</p></td><td><h4>&nbsp&nbsp</h4></td></tr></tbody></table><table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/sanity.png\" width=\"80\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Sanity:</strong> Rationalize logical inconsistencies in the universe, make sense out of chaos, detect illusions and mimicry, cope with Stress.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/fear.png\" width=\"80\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Fear:</strong> Maintain a level head while struggling with fear, loneliness, depression, and other emotional surges.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/body.png\" width=\"80\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Body:</strong> Employ quick reflexes and resist hunger, disease, or organisms that might try and invade your insides.</p></td><td><p>&nbsp&nbsp</p></td></tr></tbody></table><h4>Select your wound type:</h4><select style='margin-bottom:10px;'name='stat' id='stat'>\<option value='Sanity Save'>Sanity</option>\<option value='Fear Save'>Fear</option>\<option value='Body Save'>Body</option>\</select><br><h4>Select your roll type:</h4>",
  buttons: {
    button1: {
      label: "Advantage",
      callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d100kl"),
      icon: `<i class="fas fa-level-up"></i>`
    },
    button2: {
      label: "Normal",
      callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d100"),
      icon: `<i class="fas fa-minus"></i>`
    },
    button3: {
      label: "Disadvantage",
      callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d100kh"),
      icon: `<i class="fas fa-level-down"></i>`
    }
  }
}, myDialogOptions).render(true);