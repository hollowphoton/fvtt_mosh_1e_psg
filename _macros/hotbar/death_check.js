const myDialogOptions = {
  width: 600,
  height: 270
};

function rollCheck(rollString) {
    game.tables.getName('Death Check').draw({roll: new Roll(rollString)});
}

new Dialog({
  title: "Death Check",
  content: "<table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/rolltables/death_check.png\" width=\"700\" /></td><td><h4>&nbsp&nbsp</h4></td><td><h3>Death Check</h3><p>Whenever you would die, the Warden makes a <strong>Death Check</strong> for you. As soon as someone spends a turn checking your vitals, the result is revealed. If your character’s death is imminent, make your last moments count: save someone’s life, solve an important mystery, or give the others time to escape. Enjoy the carnage, then jump back in for more!</p></td><td><h4>&nbsp&nbsp</h4></td></tr></tbody></table><h4>Select your roll type:</h4>",
  buttons: {
    button1: {
      label: "Advantage",
      callback: () => rollCheck("1d10kl"),
      icon: `<i class="fas fa-angle-double-up"></i>`
    },
    button2: {
      label: "Normal",
      callback: () => rollCheck("1d10"),
      icon: `<i class="fas fa-minus"></i>`
    },
    button3: {
      label: "Disadvantage",
      callback: () => rollCheck("1d10kh"),
      icon: `<i class="fas fa-angle-double-down"></i>`
    }
  }
}, myDialogOptions).render(true);