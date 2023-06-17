const myDialogOptions = {
    width: 600,
    height: 550
  };
  
  function rollCheck(rollTable,rollString) {
      game.tables.getName(rollTable).draw({roll: new Roll(rollString)});
  }
  
  new Dialog({
    title: "Stat Check",
    content: "<table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/macros/stat_check.png\"/></td><td><h4>&nbsp&nbsp</h4></td><td><h3>Stat Check</h3><p>You have four main Stats which represent your abilities when acting under extreme pressure. Whenever you want to do something and the price for failure is high, roll a stat check. <strong>If you roll less than your Stat you succeed. Otherwise, you fail and gain 1 Stress.</strong> A roll of 90-99 is always a failure.</p></td><td><h4>&nbsp&nbsp</h4></td></tr></tbody></table><table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/strength.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Strength:</strong> Forcing open jammed airlocks, carrying fallen comrades, holding on for dear life.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/speed.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Speed:</strong> Getting out of the cargo bay before the blast doors close, acting and reacting in a race against the clock.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/intellect.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Intellect:</strong> Recalling your training and experience under duress.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/combat.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Combat:</strong> Fighting for your life.</p></td><td><p>&nbsp&nbsp</p></td></tr></tbody></table><h4>Select your wound type:</h4><select style='margin-bottom:10px;'name='stat' id='stat'>\<option value='Strength Check'>Strength</option>\<option value='Speed Check'>Speed</option>\<option value='Intellect Check'>Intellect</option>\<option value='Combat Check'>Combat</option>\</select><br><h4>Select your roll type:</h4>",
    buttons: {
      button1: {
        label: "Advantage",
        callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d10kh"),
        icon: `<i class="fas fa-level-up"></i>`
      },
      button2: {
        label: "Normal",
        callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d10"),
        icon: `<i class="fas fa-minus"></i>`
      },
      button3: {
        label: "Disadvantage",
        callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d10kl"),
        icon: `<i class="fas fa-level-down"></i>`
      }
    }
  }, myDialogOptions).render(true);