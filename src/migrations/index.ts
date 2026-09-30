import * as migration_20260930_152357_initial from './20260930_152357_initial';

export const migrations = [
  {
    up: migration_20260930_152357_initial.up,
    down: migration_20260930_152357_initial.down,
    name: '20260930_152357_initial'
  },
];
