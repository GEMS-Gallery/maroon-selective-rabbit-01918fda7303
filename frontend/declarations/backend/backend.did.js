export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getGameState' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'lifeTotal' : IDL.Int,
              'commanderDamage' : IDL.Vec(IDL.Int),
            })
          ),
        ],
        ['query'],
      ),
    'resetGame' : IDL.Func([], [], []),
    'updateCommanderDamage' : IDL.Func([IDL.Nat, IDL.Nat, IDL.Int], [], []),
    'updateLifeTotal' : IDL.Func([IDL.Nat, IDL.Int], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
