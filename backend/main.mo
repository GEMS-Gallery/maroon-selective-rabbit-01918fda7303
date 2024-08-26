import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

actor {
  // Types
  type Player = {
    var lifeTotal: Int;
    commanderDamage: [Int];
    var poisonCounter: Nat;
  };

  // Constants
  let INITIAL_LIFE_TOTAL = 40;
  let PLAYER_COUNT = 4;

  // Stable variable to store game state
  stable var players : [var Player] = Array.tabulateVar<Player>(PLAYER_COUNT, func (i) {
    {
      var lifeTotal = INITIAL_LIFE_TOTAL;
      commanderDamage = Array.tabulate<Int>(PLAYER_COUNT, func (j) { 0 });
      var poisonCounter = 0;
    }
  });

  // Update a player's life total
  public func updateLifeTotal(playerId: Nat, change: Int) : async () {
    if (playerId < PLAYER_COUNT) {
      players[playerId].lifeTotal += change;
    } else {
      Debug.print("Invalid player ID");
    };
  };

  // Update commander damage for a player
  public func updateCommanderDamage(playerId: Nat, opponentId: Nat, change: Int) : async () {
    if (playerId < PLAYER_COUNT and opponentId < PLAYER_COUNT and playerId != opponentId) {
      let updatedDamage = Array.tabulate<Int>(
        PLAYER_COUNT,
        func (i) {
          if (i == opponentId) {
            players[playerId].commanderDamage[i] + change
          } else {
            players[playerId].commanderDamage[i]
          }
        }
      );
      players[playerId] := {
        var lifeTotal = players[playerId].lifeTotal;
        commanderDamage = updatedDamage;
        var poisonCounter = players[playerId].poisonCounter;
      };
    } else {
      Debug.print("Invalid player IDs or same player");
    };
  };

  // Update a player's poison counter
  public func updatePoisonCounter(playerId: Nat, change: Int) : async () {
    if (playerId < PLAYER_COUNT) {
      let newPoisonCounter = Int.max(0, Int.min(10, players[playerId].poisonCounter + change));
      players[playerId].poisonCounter := Nat.fromInt(newPoisonCounter);
    } else {
      Debug.print("Invalid player ID");
    };
  };

  // Reset the game
  public func resetGame() : async () {
    for (i in players.keys()) {
      players[i] := {
        var lifeTotal = INITIAL_LIFE_TOTAL;
        commanderDamage = Array.tabulate<Int>(PLAYER_COUNT, func (j) { 0 });
        var poisonCounter = 0;
      };
    };
  };

  // Get the current game state
  public query func getGameState() : async [{ lifeTotal: Int; commanderDamage: [Int]; poisonCounter: Nat }] {
    Array.map<Player, { lifeTotal: Int; commanderDamage: [Int]; poisonCounter: Nat }>(
      Array.freeze(players),
      func (player) {
        { lifeTotal = player.lifeTotal; commanderDamage = player.commanderDamage; poisonCounter = player.poisonCounter }
      }
    )
  };
}
