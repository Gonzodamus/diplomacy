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
      updateDisplay();
      currentTimer = new Timer(5);
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
  const x = territories.Tun.coordinates.main.x
  const y = territories.Tun.coordinates.main.y
  gameMap.innerHTML += armySVG(x, y);
}

document.querySelectorAll("#map > path").forEach(path => {
  path.addEventListener("mouseover", e => {
    const terr = territories[e.target.id]
    let owner = "Water"
    if (terr.type === "coastal" || terr.type === "inland") {
      owner = terr.findOwner();
    }
    if (owner === "Water") {
      territoryDescription.innerHTML = `${terr.name} (${terr.abbreviation}) — Water${terr.findOccupied()}`
    } else {
      territoryDescription.innerHTML = `${terr.name} (${terr.abbreviation}) — ${countries[owner].possessive}${terr.findOccupied()}`
    }
  })
})
