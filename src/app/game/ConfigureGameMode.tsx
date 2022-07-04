import React from 'react'
import { OnChangeType } from '../components/CellsInput';
import Select from '../components/Select';
import { Item } from '../components/SelectItem';

export type ConfigureGameModeProps = {
  handleChangeGameMode: OnChangeType;
  gameMode?: `${GAME_MODS}`;
};

export enum GAME_MODS {
  'SINGLE' = 'SINGLE',
  'MULTI' = 'MULTI'
}

export const selectableOptions: Array<Item> = [
  {
      id: 1,
      label: 'Single (vs AI)',
      value: GAME_MODS.SINGLE,
  },
  {
      id: 2,
      label: 'Multi (vs player)',
      value: GAME_MODS.MULTI,
  },
];

const ConfigureGameMode = ({
  handleChangeGameMode,
  gameMode,
}: ConfigureGameModeProps) => {
  return (
    <Select
        items={selectableOptions}
        handleSelectItem={(item) => {
            handleChangeGameMode(item.value);
        }}
        label='Choose game mode'
        defaultValue={gameMode}
    />
  )
}

export default ConfigureGameMode