class User {
  constructor(username) {
    this.username = username
  }
}

class Game {
  constructor(id, name, currentTurn, active) {
    this.id = id
    this.name = name
    this.currentTurn = currentTurn
    this.active = active
  }
}

class Turn {
  constructor(season, year, phase) {
    this.season = season
    this.year = year
    this.phase = phase
  }
}

class Order {
  constructor(turn, type, piece, currentLoc, destination) {
    this.turn = turn
    this.type = type
    this.piece = piece
    this.currentLoc = currentLoc
    this.destination = destination
  }
}

class Country {
  constructor(game, user, homeSupplyCenters, territories, units, possessive) {
    this.game = game
    this.user = user
    this.homeSupplyCenters = homeSupplyCenters
    this.territories = territories
    this.units = units
    this.possessive = possessive
  }
}

class Territory {
  constructor(name, abbreviation, type, supplyCenter, landNeighbors, seaNeighbors, coordinates) {
    this.name = name
    this.abbreviation = abbreviation
    this.type = type
    this.supplyCenter = supplyCenter
    this.landNeighbors = landNeighbors
    this.seaNeighbors = seaNeighbors
    this.coordinates = coordinates
  }

  findOwner() {
    for (let countryKey of Object.keys(countries)) {
      const result = countries[countryKey].territories.find(function(territory) {
        return territory === this;
      }, this);
      if (result) {
        return countryKey;
      }
    }
  }

  findOccupied() {
    for (let countryKey of Object.keys(countries)) {
      const result = countries[countryKey].units.find(function (unit) {
        return unit.location === this;
      }, this);
      if (result) {
        return ` — ${countries[countryKey].possessive} ${result.type}`
      }
    }
    return "";
  }
}

class Unit {
  constructor(id, type, location, coast) {

    this.id = id
    this.type = type
    this.location = location
    this.coast = coast
  }
}

class Timer {
  constructor(minutes, seconds = 0) {
    this.minutes = minutes
    this.seconds = seconds + 1
    this.active = true;
    this.runTimer();
  }

  runTimer() {
    if (this.active) {
      if (!!this.minutes || !!this.seconds) {
        this.seconds -= 1;
        if (this.seconds >= 10) {
          timer.innerHTML = `${this.minutes}:${this.seconds}`
        } else if (this.seconds < 10 && this.seconds >= 0) {
          timer.innerHTML = `${this.minutes}:0${this.seconds}`
        } else if (this.seconds < 0) {
          this.minutes -= 1
          this.seconds = 59
          timer.innerHTML = `${this.minutes}:${this.seconds}`
        } else {
          this.timer.innerHTML = `${this.minutes}:00`
        }
        setTimeout(() => this.runTimer(), 1000);
      } else {
        alert(`${game.currentTurn.phase} complete!`)
        switchPhase();
      }
    }
  }

  stopTimer() {
    this.active = false;
  }

  timerToggle() {
    if (this.active) {
      this.active = false;
      timerToggleButton.innerHTML = "Start Timer";
    } else {
      this.active = true;
      timerToggleButton.innerHTML = "Pause Timer";
      setTimeout(() => this.runTimer(), 1000);
    }
  }

}

// 1100 1050
