function retreatingArmysTest() {
  germanyUnits[0].location = territories.Ruh
  germanyUnits[2].location = territories.Bel

  franceUnits[0].location = territories.Bur

  let ordersArray = [new Order(1, "move", germanyUnits[0], territories.Ruh, territories.Bur ),
                     new Order(1, "support", germanyUnits[1], territories.Ruh, territories.Bur ),
                     new Order(1, "move", germanyUnits[2], territories.Bel, territories.Pic ),
                     new Order(1, "hold", franceUnits[0], territories.Bur, territories.Bur ),
                     new Order(1, "move", franceUnits[1], territories.Mar, territories.Spa ),
                     new Order(1, "move", franceUnits[2], territories.Bre, territories.Gas )];

  let attempt = orderResolution(ordersArray)

  let answer = [franceUnits[0]]

  if (answer === attempt) {
    return true;
  } else {
    return false;
  }
}
