import { useInput, useStdin } from 'ink';
import React, { useState } from 'react';
import CellsInput, {
    CellsInputProps,
    OnChangeType,
} from '../components/CellsInput';
import Select from '../components/Select';
import { Item } from '../components/SelectItem';
import { useMessages } from '../ctx/messages';
import { isNumber } from '../utils';

export type ConfigureStepProps = {
    onChange: OnChangeType;
    handleStartGame: () => void;
    cellsSize: string;
    isGameStarted: boolean;
};

export const selectableOptions: Array<Item> = [
    {
        id: 1,
        label: '3x3',
        value: '3',
    },
    {
        id: 2,
        label: '4x4',
        value: '4',
    },
    {
        id: 3,
        label: '5x5',
        value: '5',
    },
];

const ConfigureStep = ({
    onChange,
    handleStartGame,
    cellsSize,
    isGameStarted,
}: ConfigureStepProps) => {
    const [selectingCustom, setSelectingCustom] = useState(false);
    const { handleChangeMessages } = useMessages();
    const { isRawModeSupported } = useStdin();
    useInput((input, key) => {
        if (!selectingCustom) return;
        if (key.return) {
            if (!cellsSize) {
                return handleChangeMessages([
                    { level: 'error', message: 'Grid size should be defined.' },
                ]);
            } else if (+cellsSize > 10) {
                return handleChangeMessages([
                    { level: 'error', message: 'Maximum grid size is 10.' },
                ]);
            } else if (+cellsSize < 3) {
                return handleChangeMessages([
                    { level: 'error', message: 'Minimum grid size is 3.' },
                ]);
            }
            if (cellsSize && isNumber(cellsSize)) {
                handleStartGame();
            }
        }
    });

    const handleChange: OnChangeType = (setter) => onChange(setter);

    const availableOptions = [...selectableOptions];

    if (isRawModeSupported) {
        availableOptions.push({
            id: 4,
            value: '',
            label: 'Custom grid size',
            onSelect: () => {
                setSelectingCustom(true);
            },
        });
    }

    return (
        <>
            <Select
                items={availableOptions}
                handleSelectItem={(item) => {
                    handleChange(item.value);
                    handleStartGame();
                }}
                label='Available grid sizes'
                disabled={selectingCustom || isGameStarted}
            />
            {selectingCustom && isRawModeSupported && (
                <CellsInput cellsSize={cellsSize} onChange={handleChange} />
            )}
        </>
    );
};

export default ConfigureStep;
