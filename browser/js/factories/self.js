app.factory('Self', (Player, Minion, Socket, $rootScope, $state, $timeout) => {
  let player = new Player();

  Socket.on('gameStart', players => {
    console.log('game started');
    player.name = players.player;
    $rootScope.$digest();
    Socket.emit('initialDraw');
  });

  player.setMessage = message => {
    player.message = message;
    $rootScope.$digest();
    $timeout(() => player.message = null, 3000);
  };

  //initial draw
  player.decide = (idx, rejectedCards) => {
    if (idx + 1) {
      player.decidingCards[idx].selected = !player.decidingCards[idx].selected;
      let i = rejectedCards.indexOf(idx);
      if (i > -1) rejectedCards.splice(i, 1);
      else rejectedCards.push(idx);
    } else Socket.emit('rejectCards', rejectedCards);
  };
  Socket.on('initialCards', cards => {
    player.decidingCards = cards;
    $rootScope.$digest();
  });
  Socket.on('setInitialHand', (hand, turn) => {
    $('#initial').remove();
    player.hand = hand;
    player.turn = turn;
    $rootScope.$digest();
    Socket.emit('initialHandSet');
  });

  //turns
  Socket.on('startTurn', card => {
    console.log('start turn');
    player.startTurn(card);
    player.setMessage("Your turn!");
  });

  Socket.on('wait', () => {
    player.opponentTurn();
    player.setMessage("Opponent's turn!");
  });
  player.emitEndTurn = () => {
    player.endTurn();
    Socket.emit('endTurn');
  };

  //summoning
  player.summon = id => {
    let card = _.remove(player.hand, card => card.id === id)[0];
    player.mana -= card.cost;
    Socket.emit('summon', id);
  };
  Socket.on('summoned', name => {
    console.log(`summoned ${name}`);
    player.summoned(name);
  });

  //attacking
  player.attack = data => {
    let attackee = data.attackee ? data.attackee.id : null;
    Socket.emit('attack', data.attacker.id, attackee);
  };
  Socket.on('attacked', attacker => {
    console.log('Attacked!');
    player.attacked(attacker);
  });
  Socket.on('wasAttacked', (attacker, attackee) => {
    console.log('Was attacked!');
    player.wasAttacked(attackee);
  });

  //spells
  Socket.on('selectTarget', () => {
    player.selecting = true;
    player.setMessage("Select a target!");
  });
  player.selected = selectee => {
    if (!selectee) selectee = 'opponent';
    else if (selectee.id) selectee = selectee.id;
    Socket.emit('cast', selectee);
    player.selecting = false;
  };
  Socket.on('healed', patient => {
    console.log('Healed!');
    player.healed(patient);
  });
  //different animations for spell dmg vs minion attacking?
  Socket.on('damaged', attackee => {
    console.log('Was damaged!');
    console.log(attackee);
    player.wasAttacked(attackee);
  });
  Socket.on('drew', cards => {
    console.log(`Drew ${cards.length} cards`);
    player.drew(cards);
  });
  Socket.on('propertyChanged', property => {
    console.log(`${property} changed`);
    player.propertyChanged(property);
    $rootScope.$digest();
  });

  //ending
  Socket.on('win', () => {
    player.setMessage("You win!");
    // the line below is still untested. Could potentially cause problems
    Socket.removeAllListeners();
    setTimeout(() => $state.go('home'), 3000);
  });
  Socket.on('lose', () => {
    player.setMessage("You lose!");
    // the line below is still untested. Could potentially cause problems
    Socket.removeAllListeners();
    setTimeout(() => $state.go('home'), 3000);
  });

  return player;
});