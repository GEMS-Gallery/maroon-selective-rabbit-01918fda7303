import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getGameState' : ActorMethod<
    [],
    Array<
      {
        'lifeTotal' : bigint,
        'poisonCounter' : bigint,
        'name' : string,
        'commanderDamage' : Array<bigint>,
      }
    >
  >,
  'resetGame' : ActorMethod<[], undefined>,
  'updateCommanderDamage' : ActorMethod<[bigint, bigint, bigint], undefined>,
  'updateLifeTotal' : ActorMethod<[bigint, bigint], undefined>,
  'updatePlayerName' : ActorMethod<[bigint, string], undefined>,
  'updatePoisonCounter' : ActorMethod<[bigint, bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
