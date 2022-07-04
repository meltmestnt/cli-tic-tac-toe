import { Box, Text } from 'ink';
import React from 'react'
import { useMessages } from '../ctx/messages'
import Message from './Message';

const Messages = () => {
  const { messages } = useMessages();
  return (
    <Box marginY={1} flexDirection='column'>
      <Text bold inverse color="blue">
        Current status:
      </Text>
      {
        messages.map(message => (
          <Message message={message} />
        ))
      }
    </Box>
  )
}

export default Messages