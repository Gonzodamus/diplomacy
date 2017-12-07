function updateDisplay() {
  timerToggleButton.innerHTML = "Pause Timer";
  phase.innerHTML = game.currentTurn.phase;
  turn.innerHTML = `${game.currentTurn.season} ${game.currentTurn.year}`
}

function play() {
  switch (game.currentTurn.phase) {
    case "Diplomatic Phase":
      game.currentTurn.season === "Spring" ? colorTerritories() : null
      addUnits();
      updateDisplay();
      currentTimer = new Timer(15);
      break;
    case "Order Writing Phase":
      updateDisplay();
      currentTimer = new Timer(5);
      break;
    case "Order Resolution Phase":
      retreatingUnits = orderResolution(orderStore);
      updateDisplay();
      currentTimer = new Timer(5);
      orderStore = []
      break;
    case "Retreat and Disbanding Phase":
      updateDisplay();
      currentTimer = new Timer(5);
      break;
    case "Gaining and Losing Units Phase":
      updateDisplay();
      currentTimer = new Timer(5);
      break;
    default:
      debugger;  
      alert("Something went wrong");
      break;
  }
}

function switchPhase() {
  currentTimer.stopTimer();
  switch (game.currentTurn.phase) {
    case "Diplomatic Phase":
      game.currentTurn.phase = "Order Writing Phase";
      break;
    case "Order Writing Phase":
      game.currentTurn.phase = "Order Resolution Phase";
      break;
    case "Order Resolution Phase":
      game.currentTurn.phase = "Retreat and Disbanding Phase"
      break;
    case "Retreat and Disbanding Phase":
      switch (game.currentTurn.season) {
        case ("Spring"):
          game.currentTurn.phase = "Diplomatic Phase";
          game.currentTurn.season = "Fall"
          game.currentTurn.year += 1;
          break;
        case ("Fall"):
          game.currentTurn.phase = "Gaining and Losing Units Phase"
          break;
        default:
          alert("Something went wrong");
          break;
      }
      break;
    case "Gaining and Losing Units Phase":
      game.currentTurn.phase = "Diplomatic Phase";
      game.currentTurn.season = "Spring"
      game.currentTurn.year += 1;
      break;
    default:
      alert("Something went wrong");
      break;
  }
  play();
}

play();

function colorTerritories() {
  Object.keys(countries).forEach(countryKey => {
    for (let territory of countries[countryKey].territories) {
      document.getElementById(territory.abbreviation).classList.add(countryKey);
    }
  })
}

function addUnits() {
  Object.keys(countries).forEach(countryKey => {
    for (let unit of countries[countryKey].units) {
      if (unit.type === "fleet") {
        if (!unit.coast) {
          const x = unit.location.coordinates.main.x
          const y = unit.location.coordinates.main.y
          gameMap.innerHTML += fleetSVG(x, y, countryKey);
        } else {
          const x = unit.location.coordinates[unit.coast].x
          const y = unit.location.coordinates[unit.coast].y
          gameMap.innerHTML += fleetSVG(x, y, countryKey);
        }
      } else if (unit.type === "army") {
        const x = unit.location.coordinates.main.x
        const y = unit.location.coordinates.main.y
        gameMap.innerHTML += armySVG(x, y, countryKey);
      }
    }
  })
}

document.addEventListener("DOMContentLoaded", e => {
  document.querySelectorAll("#map > path").forEach(path => {
    path.addEventListener("mouseover", e => {
      const terr = territories[e.target.id]
      let owner = "Water"
      if (terr.type === "coastal" || terr.type === "inland") {
        owner = terr.findOwner();
      }
      if (owner === "Water") {
        debugger;
        document.getElementById("territory_description").textContent = `${terr.name} (${terr.abbreviation}) — Water`
      } else {
        document.getElementById("territory_description").textContent = `${terr.name} (${terr.abbreviation}) — ${countries[owner].possessive}`
      }
    })
    path.addEventListener("mouseleave", e => {
      document.getElementById("territory_description").textContent = ""
    })
    path.addEventListener("click", e => {
      const terr = territories[e.target.id]
      const target = e.target
      if (inputMode === "normal") {
        if (target === document.querySelector(".targeted")) {
          const info = territories[document.querySelector(".targeted").id]
          createOrReplaceOrder(game.currentTurn, "Hold", terr.findUnit(), terr, terr)
          clearTargets();
        } else if (target.classList.contains("potentialMove")) {
          const fromTerr = territories[document.querySelector(".targeted").id]
          const toTerr = territories[target.id]
          createOrReplaceOrder(game.currentTurn, "Move",fromTerr.findUnit(), fromTerr, toTerr)
          clearTargets();
        } else {
          if (terr.findOccupied()) {
            checkForOtherTargets();
            addTargets(terr, target);
          } else {
            clearTargets();
          }
        }
      } else if (inputMode === "support") {
        if (!document.querySelector(".targeted")) {
          addTargetsSupport(terr, target);
        } else if (target.classList.contains("potentialMove") && !document.querySelector(".targeted2")) {
          supportStep2(terr, target);
        } else if (target.classList.contains("potentialMove") && document.querySelector(".targeted2")) {
          const fromInfo = territories[document.querySelector(".targeted").id]
          const fromInfo2 = territories[document.querySelector(".targeted2").id]
          const toInfo = territories[target.id]
          createOrReplaceOrder(game.currentTurn, "Support", fromInfo.findUnit(), fromInfo2, toInfo)
          clearTargets();
        } else if (target.classList.contains("targeted2")) {
          if (territories[document.querySelector(".targeted").id].findRelevantNeighbors().includes(target.id)) {
            const fromInfo = territories[document.querySelector(".targeted").id]
            const toInfo = territories[target.id]
            createOrReplaceOrder(game.currentTurn, "Support", fromInfo.findUnit(), toInfo, toInfo)
            clearTargets();
          }
        }
      }
    })
  })
  document.addEventListener("keydown", e => {
    e.key === "Escape" ? clearTargets() : null;
  })
})

function triggerSupportMode() {

  // If no unit is selected, prompt the user to select a unit
  if (!document.querySelector(".targeted")) {
    document.querySelector("#info_text").innerHTML = "Please select which unit should do the supporting";
  } else if (document.querySelector(".targeted")) {
    document.querySelector("#info_text").innerHTML = "Please select which unit you'd like the selected unit to support";
    Object.keys(document.getElementsByClassName("potentialMove")).forEach(abbr => {
      if (document.getElementById(abbr)) {
        document.getElementById(abbr).classList.remove("potentialMove");
      }
    })
    Object.keys(document.getElementsByClassName("targeted2")).forEach(abbr => {
      if (document.getElementById(abbr)) {
        document.getElementById(abbr).classList.remove("targeted2");
      }
    })
    const target = document.querySelector(".targeted")
    const terr = territories[target.id]
    addTargetsSupport(terr, target)
  }
  inputMode = "support";
}
