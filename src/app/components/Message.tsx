import { Box, Text } from 'ink';
import React from 'react';
import { Message as MessageType } from '../ctx/messages';
import figures from 'figures';

export type MessageProps = {
    message: MessageType;
};

export const supportedMessages = {
    error: (
        <Text color='redBright' bold>
            {figures.cross}
        </Text>
    ),
    success: (
        <Text color='greenBright' bold>
            {figures.tick}
        </Text>
    ),
    info: (
        <Text color='yellowBright' bold>
            {figures.arrowRight}
        </Text>
    ),
};

const Message = ({ message }: MessageProps) => {
    const { level, message: messageText } = message;
    const ico = supportedMessages[level];

    return (
        <Box paddingLeft={0.5} alignItems='center'>
            {ico ? ico : null}
            <Text>&nbsp;</Text>
            <Text color='whiteBright' bold>
                {messageText}
            </Text>
        </Box>
    );
};

export default Message;
