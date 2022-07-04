import { Box, Newline, Text, useInput, useStdin } from 'ink';
import React, { useEffect } from 'react';
import { isNumber } from '../utils';
import Question from './Question';
import UserInput from './UserInput';

export type OnChangeType = (val: string | ((val: string) => string)) => void;

export type CellsInputProps = {
    onChange: OnChangeType;
    cellsSize: string;
};

const CellsInput = ({
    onChange,
    cellsSize,
}: CellsInputProps) => {
    useInput((input, key) => {
        if (isNumber(input)) {
            onChange((val) => val + input);
        } else if (key.backspace) {
          onChange((val) => val.slice(0, val.length - 1));
        }
    });

    return (
        <Box justifyContent='center' flexDirection='column'>
            <Question>How many cells do you want in grid?</Question>
            <UserInput>{cellsSize}</UserInput>
        </Box>
    );
};

export default CellsInput;
