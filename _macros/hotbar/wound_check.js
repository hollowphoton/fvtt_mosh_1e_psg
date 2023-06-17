const myDialogOptions = {
    width: 600,
    height: 610
  };
  
  function rollCheck(rollTable,rollString) {
      game.tables.getName(rollTable).draw({roll: new Roll(rollString)});
  }
  
  new Dialog({
    title: "Wound Check",
    content: "<table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/macros/wound_check.png\"/></td><td><h4>&nbsp&nbsp</h4></td><td><h3>Wound Check</h3><p><strong>Flesh Wounds</strong> are small inconveniences. <strong>Minor/Major Injuries</strong> cause lasting Damage that requires treatment. <strong>Lethal Injuries</strong> can kill you if not dealt with immediately. And <strong>Fatal Injuries</strong> can potentially kill you outright. Additionally, some Wounds cause Bleeding, which if not stopped can quickly overwhelm you.</p></td><td><h4>&nbsp&nbsp</h4></td></tr></tbody></table><table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_blunt_force.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Blunt Force:</strong> Getting punched, hit with a crowbar or a thrown object, falling, etc.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_bleeding.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Bleeding:</strong> Getting stabbed or cut.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_gunshot.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Gunshot:</strong> Getting shot by a firearm.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_fire_&_explosives.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Fire & Explosives:</strong> Grenades, flamethrowers, doused in fuel and lit on fire, etc.</p></td><td><p>&nbsp&nbsp</p></td></tr><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_gore_&_massive.png\" width=\"50\" height=\"50\" /></td><td><p>&nbsp&nbsp</p></td><td><p><strong>Gore & Massive:</strong> Damage from giant creatures or particularly gruesome foes.</p></td><td><p>&nbsp&nbsp</p></td></tr></tbody></table><h4>Select your wound type:</h4><select style='margin-bottom:10px;'name='stat' id='stat'>\<option value='Blunt Force Wound'>Blunt Force</option>\<option value='Bleeding Wound'>Bleeding</option>\<option value='Gunshot Wound'>Gunshot</option>\<option value='Fire & Explosives Wound'>Fire & Explosives</option>\<option value='Gore & Massive Wound'>Gore & Massive</option>\</select><br><h4>Select your roll type:</h4>",
    buttons: {
      button1: {
        label: "Advantage",
        callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d10kl"),
        icon: `<i class="fas fa-angle-double-up"></i>`
      },
      button2: {
        label: "Normal",
        callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d10"),
        icon: `<i class="fas fa-minus"></i>`
      },
      button3: {
        label: "Disadvantage",
        callback: (html) => rollCheck(html.find('[id=\"stat\"]')[0].value,"1d10kh"),
        icon: `<i class="fas fa-angle-double-down"></i>`
      }
    }
  }, myDialogOptions).render(true);