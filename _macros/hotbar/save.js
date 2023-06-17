const myDialogOptions = {
    width: 600,
    height: 490
  };
  
  function rollCheck(rollTable,rollString) {
      game.tables.getName(rollTable).draw({roll: new Roll(rollString)});
  }
  
  new Dialog({
    title: "Save",
    content: "<table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/macros/save.png\"/></td><td><h4>&nbsp&nbsp</h4></td><td><h3>Save</h3><p>You have three Saves which represent your ability to withstand different kinds of trauma. In order to avoid certain dangers, you sometimes need to roll a Save. <strong>If you roll less than your Save you succeed. Otherwise you fail, and gain 1 Stress.</strong> A roll of 90-99 is always a failure.</p></td><td><h4>&nbsp&nbsp</h4></td></tr></tbody></table><table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/sanity.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Sanity:</strong> Rationalize logical inconsistencies in the universe, make sense out of chaos, detect illusions and mimicry, cope with Stress.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/fear.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Fear:</strong> Maintain a level head while struggling with fear, loneliness, depression, and other emotional surges.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/attributes/body.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Body:</strong> Employ quick reflexes and resist hunger, disease, or organisms that might try and invade your insides.</p></td><td><p>&nbsp&nbsp</p></td></tr></tbody></table><h4>Select your wound type:</h4><select style='margin-bottom:10px;'name='stat' id='stat'>\<option value='Sanity Save'>Sanity</option>\<option value='Fear Save'>Fear</option>\<option value='Body Save'>Body</option>\</select><br><h4>Select your roll type:</h4>",
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