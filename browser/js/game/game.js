app.config($stateProvider => {
  $stateProvider.state('game', {
    url: '/game/:id',
    templateUrl: 'js/game/game.html',
    controller: 'GameController',
  });
}).controller('GameController', ($scope, $state, $compile, Socket, Game) => {
  let players = Game($scope);
  $scope.player = players.player;
  $scope.player.portrait = "monkey.png";
  $scope.opponent = players.opponent;
  $scope.opponent.portrait = "tiger.png";
  $scope.hint = {
    status: 'Show'
  };
  $scope.toggleHint = () => {
    if ($scope.hint.message) {
      $scope.hint.message = null;
      $scope.hint.status = 'Show';
      return;
    }
    $scope.hint.status = 'Hide';
    if ($scope.player.selecting) {
      $scope.hint.message = `Please drag the selector <span><img src="/images/power.png"></span> to your intended target.`;
    } else if ($scope.player.turn) {
      $scope.hint.message = `It's your turn!`;
    } else {
      $scope.hint.message = `It's ${$scope.opponent.name}'s' turn! Please wait while  ${$scope.opponent.name} is dedicing.`;
    }
  };

  $scope.enlarge = undefined;
  $scope.enlargedDescription = undefined;
  Socket.emit('playerReady');

  let rejectedCards = [];
  $scope.reject = idx => {
    $scope.player.decide(idx, rejectedCards);
  };

  $scope.summon = (card, e) => {
    $scope.player.summon(card.id);
  };

  $scope.select = data => {
    if (data.selector) $scope.player.attack({attacker: data.selector, attackee: data.selectee});
    else $scope.player.selected(data.selectee);
  };

  $scope.endTurn = () => {
    $scope.player.emitEndTurn();
  };

  $scope.leave = () => {
    Socket.emit('leave');
  };

  $scope.enlargeCard = (card) => {
    $scope.enlarge = card;
  };

  Socket.on('win', () => $scope.win = true);

  const spells = {
    chargeInfo: "allows an employee to attack on the same turn it was summoned.",
    tauntInfo: "protects its allies by forcing ployers to kill employees with taunt before they can attack the other player or the other player's employees.",
    divineShieldInfo: "doesn't take damage for its first attack but expires afterwards.",
    deathRattleInfo: "casts a spell upon death.",
    battlecryInfo: "casts a spell when summoned.",
    windfuryInfo: "can attack twice per turn.",
    enrageInfo: "gains special abilities when this employee's health is below 100%."
  };
  $scope.describeAbilities = (card) => {
    // takes a card or minion, returns a description of the cards ability
    if (!card) return $scope.enlargedDescription = '';

    let description = [];
    if (card.description) description.push(card.description);
    for (let spell in card.logic) {
      let spellName;
      switch (spell) {
        case 'charge':
          spellName = 'Initiative';
          break;
        case 'taunt':
          spellName = 'Loyal';
          break;
        case 'divineShield':
          spellName = 'Steadfast';
          break;
        case 'windfury':
          spellName = 'Agile';
          break;
      }
      if (spell === 'charge' || spell === 'taunt' || spell === 'divineShield' || spell === 'windfury') {
        if (card.logic[spell]) description.push(`${spellName} - ${spells[`${spell}Info`]}`);
      }
    }
    $scope.enlargedDescription = description.join('  ');

  };


});
