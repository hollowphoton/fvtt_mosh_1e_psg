newStress = 0;
curStress = 0;
curStress = game.user.character.system.other.stress.value;
flavorText = ``;
outcome = ``;
change = ``;
type = ``;
critical = ``;
stressMod = 0;

const myDialogOptions = {
  width: 600,
  height: 270
};

async function addStress(rollString) {
  stressMod = await new Roll(rollString).roll({async: true});
  newStress = curStress + stressMod.total;

  if (newStress >= 20) {
    newStress = 20;
    stressDiff = newStress - curStress;
    saveImpact = stressMod.total - stressDiff;
  } else {
    stressDiff = newStress - curStress;
    saveImpact = stressMod.total - stressDiff;
  }

  game.user.character.update({'system.other.stress.value': newStress});

  if (stressMod.total === 0 || stressDiff === 0) {
    results_header = `<h3>Stress Unchanged</h3>`;
  } else {
    results_header = `<h3>Stress Gained</h3>`;
  }

  results_flavor = `<p>You feel tightness in your chest and start to sweat. `;

  if (rollString === "1d5") {
  results_dice = `<div class="dice-roll">
    <div class="dice-result">
        <div class="dice-formula">${rollString}</div>
        <h4 class="dice-total">${stressMod.total}</h4>
    </div>
</div><br>`;
  } else {
  results_dice = ``;
  }
  
  if (stressMod.total > 0 && newStress === 20 && stressDiff === 0) {
    results_body = `<p>You are already at the maximum stress level of <strong>20</strong>! You must <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else if (stressMod.total > 0 && newStress === 20 && stressDiff < stressMod) {
    results_body = `<p>Stress increased by <strong>${stressDiff}</strong> to the maximum stress level of <strong>20</strong>! You must also <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else {
    results_body = `Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>.`;
  }
  results_html = results_header + results_flavor + results_dice + results_body;

  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({token: actor}),
    content: results_html
  });

}

new Dialog({
  title: "Gain Stress",
  content: "<table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/macro/gain_stress.png\"/></td><td><h4>&nbsp&nbsp</h4></td><td><h3>Gain Stress</h3><p><strong>You gain 1 Stress every time you fail a Stat Check or Save.</strong> Occasionally, certain locations or entities can automatically give you Stress from interacting with or witnessing them. Your <strong>Minimum Stress starts at 2</strong>, and the <strong>Maximum Stress you can have is 20.</strong> Any Stress you take over 20 instead reduces the most relevant Stat or Save by that amount.</p></td><td><h4>&nbsp&nbsp</h4></td></tr></tbody></table><h4>Select your modification:</h4>",
  buttons: {
    button1: {
      label: "Gain 1 Stress",
      callback: () => addStress("1"),
      icon: `<i class="fas fa-angle-up"></i>`
    },
    button2: {
      label: "Gain 2 Stress",
      callback: () => addStress("2"),
      icon: `<i class="fas fa-angle-double-up"></i>`
    },
    button3: {
      label: "Gain 1d5 Stress",
      callback: () => addStress("1d5"),
      icon: `<i class="fas fa-arrow-circle-up"></i>`
    }
  }
}, myDialogOptions).render(true);