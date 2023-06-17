const myDialogOptions = {
    width: 600,
    height: 270
  };
  
  async function rollCheck(rollString) {
      curStress = game.user.character.system.other.stress.value;
      rollValue = await new Roll(rollString).evaluate();
      html_a = `<div class="table-draw" data-table-id="[PARENT_ID]">
          <div class="table-description">[PARENT_DESCRIPTION]</div>
      <div class="dice-roll">
          <div class="dice-result">
              <div class="dice-formula">1d20 > [TARGET]</div>
              <h4 class="dice-total">[ROLL]</h4>
          </div>
      </div>
          <ol class="table-results">
              `;
      html_b = ``;
      html_b_add = ``;
      html_b_template = `        <li class="table-result flexrow" data-result-id="[DATA_DOCUMENTID]}">
                  <img class="result-image" src="[DATA_IMG]"/>
                  <div class="result-text">[TEXT_TYPE]</div>
              </li>
              `;
      html_c = `    </ol>
      </div>`;
      itemCount = 0;
  
      panicresult = game.tables.getName("Panic Check").getResultsForRoll(rollValue.total);
      panicresult.forEach(appendHtmlB);
  
      html_a = html_a .replace("[PARENT_ID]",panicresult[0].parent.id);
      html_a = html_a .replace("[PARENT_DESCRIPTION]",panicresult[0].parent.description);
      html_a = html_a .replace("[ROLL]",rollValue.total);
      html_a = html_a .replace("[TARGET]",curStress);
  
      function appendHtmlB() {
        html_b_add = html_b_template;
        html_b_add = html_b_add.replace("[DATA_DOCUMENTID]",panicresult[itemCount].data.documentId);
        html_b_add = html_b_add.replace("[DATA_IMG]",panicresult[itemCount].data.img);
        if (panicresult[itemCount].data.type === 0) {
          html_b_add = html_b_add.replace("[TEXT_TYPE]",panicresult[itemCount].data.text);
        } else {
          html_b_add = html_b_add.replace("[TEXT_TYPE]",`@Item[[ITEMID]]`);
          html_b_add = html_b_add.replace("[ITEMID]",panicresult[itemCount].data.documentId);
        }
        html_b = html_b + html_b_add;
        itemCount = itemCount + 1;
      }
  
      panic_html = html_a + html_b + html_c;
  
      if (rollValue.total <= curStress) {
        results_html = `<h3>Panic Check</h3><p><strong>Failure!</strong> Your heartbeat races out of control and you start to feel dizzy.</p>` + panic_html;
        ChatMessage.create({
          user: game.user._id,
          speaker: ChatMessage.getSpeaker({token: actor}),
          content: results_html
        });
      } else {
        results_html = `<h3>Panic Check</h3><p><strong>Success!</strong> You take a deep breath and regain your composure.</p>`;
        ChatMessage.create({
          user: game.user._id,
          speaker: ChatMessage.getSpeaker({token: actor}),
          content: results_html
        });
      }
  
  }
  
  new Dialog({
    title: "Panic Check",
    content: "<table><tbody><tr><td><img src=\"modules/fvtt_mosh_1e_psg/icons/rolltables/panic_check.png\"/></td><td><h4>&nbsp&nbsp</h4></td><td><h3>Panic Check</h3><p>Stress, Damage, and emotional wear and tear will eventually bring you to your breaking point. When that happens, there’s a chance you’ll Panic. You determine this by making a Panic Check. Some results of the Panic Table are so severe that they leave a lasting impression on you. These are called <strong>Conditions</strong>, and they affect you until you are able to treat them.</p></td><td><h4>&nbsp&nbsp</h4></td></tr></tbody></table><h4>Select your roll type:</h4>",
    buttons: {
      button1: {
        label: "Advantage",
        callback: () => rollCheck("1d20kh"),
        icon: `<i class="fas fa-angle-double-up"></i>`
      },
      button2: {
        label: "Normal",
        callback: () => rollCheck("1d20"),
        icon: `<i class="fas fa-minus"></i>`
      },
      button3: {
        label: "Disadvantage",
        callback: () => rollCheck("1d20kl"),
        icon: `<i class="fas fa-angle-double-down"></i>`
      }
    }
  }, myDialogOptions).render(true);