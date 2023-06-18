curStress = game.user.character.system.other.stress.value;
str = game.user.character.system.stats.strength.value + game.user.character.system.stats.strength.mod;
spd = game.user.character.system.stats.speed.value + game.user.character.system.stats.speed.mod;
int = game.user.character.system.stats.intellect.value + game.user.character.system.stats.intellect.mod;
com = game.user.character.system.stats.combat.value + game.user.character.system.stats.combat.mod;
doubles = new Set([0, 11, 22, 33, 44, 55, 66, 77, 88, 99]);
outcome = "";
change = "";
type = "";
critical = "";
stressMod = 0;

const myDialogOptions = {
  width: 600,
  height: 580
};

async function rollCheck(statType,rollString) {

  if (statType=== "Strength Check") {
    curStat = str
  } else if (statType=== "Speed Check") {
    curStat = spd
  } else if (statType=== "Intellect Check") {
    curStat = int
  } else if (statType=== "Combat Check") {
    curStat = com
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
    results_header = `<h3>${statType}</h3>`;
  } else {
    results_header = `<h3>${statType}</h3>`;
  }

  if (outcome === "Failure") {
    results_flavor = `<p><strong>${critical}${outcome}!</strong><br>You feel tightness in your chest and start to sweat. `;
  } else {
    results_flavor = `<p><strong>${critical}${outcome}!</strong><br>You feel a sense of calm wash over you. `;
  }

  results_dice = `<div class="dice-roll">
    <div class="dice-result">
        <div class="dice-formula">${rollString} < ${curStat}</div>
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
  title: "Stat Check",
  content: "<table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/macros/stat_check.png\" width=\"600\" /></td><td><h4>&nbsp&nbsp</h4></td><td><h3>Stat Check</h3><p>You have four main Stats which represent your abilities when acting under extreme pressure. Whenever you want to do something and the price for failure is high, roll a stat check. <strong>If you roll less than your Stat you succeed. Otherwise, you fail and gain 1 Stress.</strong> A roll of 90-99 is always a failure.</p></td><td><h4>&nbsp&nbsp</h4></td></tr></tbody></table><table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/strength.png\" width=\"70\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Strength:</strong> Forcing open jammed airlocks, carrying fallen comrades, holding on for dear life.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/speed.png\" width=\"70\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Speed:</strong> Getting out of the cargo bay before the blast doors close, acting and reacting in a race against the clock.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/intellect.png\" width=\"70\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Intellect:</strong> Recalling your training and experience under duress.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/combat.png\" width=\"70\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Combat:</strong> Fighting for your life.</p></td><td><p>&nbsp&nbsp</p></td></tr></tbody></table><h4>Select your wound type:</h4><select style='margin-bottom:10px;'name='stat' id='stat'>\<option value='Strength Check'>Strength</option>\<option value='Speed Check'>Speed</option>\<option value='Intellect Check'>Intellect</option>\<option value='Combat Check'>Combat</option>\</select><br><h4>Select your roll type:</h4>",
  buttons: {
    button1: {
      label: "Advantage",
      callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d100kl"),
      icon: `<i class="fas fa-angle-double-up"></i>`
    },
    button2: {
      label: "Normal",
      callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d100"),
      icon: `<i class="fas fa-minus"></i>`
    },
    button3: {
      label: "Disadvantage",
      callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d100kh"),
      icon: `<i class="fas fa-angle-double-down"></i>`
    }
  }
}, myDialogOptions).render(true);