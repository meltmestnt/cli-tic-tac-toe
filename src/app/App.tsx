import React, { useEffect, useState } from 'react';
import { Box, Newline, Static, Text, useInput, useStdin } from 'ink';
import CellsInput, { OnChangeType } from './components/CellsInput';
import { DEFAULT_CELLS } from './constants/board';
import Board from './components/Board';
import { ResultType } from './utils/board';
import GameFlow from './game/GameFlow';
import { MessagesProvider } from './ctx/messages';
import Messages from './components/Messages';

const App = () => {

    return (
      <MessagesProvider>
        <Messages />
        <GameFlow />
      </MessagesProvider>
    );
};

export default App;
