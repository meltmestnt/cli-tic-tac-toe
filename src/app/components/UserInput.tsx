import { Box, Text, TextProps } from 'ink';
import React from 'react';

export type UserInputProps = TextProps;

const UserInput = ({ children, ...rest }: UserInputProps) => {
    return (
        <Box marginX={0.2}>
            <Text color='blueBright'>{children}</Text>
        </Box>
    );
};

export default UserInput;
