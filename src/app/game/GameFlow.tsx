import { Box, Newline, Text, useInput, useStdin } from 'ink';
import React, { useEffect, useRef, useState } from 'react';
import Board from '../components/Board';
import { OnChangeType } from '../components/CellsInput';
import { DEFAULT_CELLS } from '../constants/board';
import { useMessages } from '../ctx/messages';
import ConfigureStep from './ConfigureStep';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Message from '../components/Message';
import ConfigureGameMode from './ConfigureGameMode';

const SELECT_CELLS = 'SELECT_CELLS';
const SELECT_GAME_MODE = 'SELECT_GAME_MODE';

// export enum ConfigureFlow {
//   'SELECT_MODE' = 'SELECT_MODE',
//   'SELECT_CELLS' = 'SELECT_CELLS',
//   'SELECT_SYMBOL' = 'SELECT_SYMBOL',
// }

// const configureSteps = {
//   [ConfigureFlow.SELECT_MODE]: ({ gameMode, handleChangeGameMode }) => <ConfigureGameMode gameMode={gameMode} handleChangeGameMode={handleChangeGameMode} />
// }

const GameFlow = () => {
    const [currentCellsSize, setCurrentCellsSize] = useState<string>('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [winner, setWinner] = useState<'x' | 'o' | null | 'draw'>(null);
    const { handleChangeMessages } = useMessages();
    const [gameMode, setGameMode] = useState();
    const gameCount = useRef(0);

    useEffect(() => {
      if (!currentCellsSize) {
        handleChangeMessages(messages => [...messages, { id: SELECT_CELLS, message: 'Please select grid size', level: 'info' }])
      }
      else {
        handleChangeMessages(messages => messages.filter(msg => msg.id !== SELECT_CELLS));
      }
    }, [currentCellsSize]);
    
    useEffect(() => {
      if (!gameMode) {
        handleChangeMessages(messages => [...messages, { id: SELECT_GAME_MODE, message: 'Please select game mode', level: 'info' }])
      }
      else {
        handleChangeMessages(messages => messages.filter(msg => msg.id !== SELECT_GAME_MODE));
      }
    }, [gameMode]);

    const handleStartGame = () => {
        setWinner(null);
        setIsGameStarted(true);
        handleChangeMessages([]);
    };
    const handleEndGame = (winner: 'x' | 'o' | 'draw') => {
        handleChangeMessages([
            {
                level: 'success',
                message: ['x', 'o'].includes(winner)
                    ? `Winner is ${winner}`
                    : 'Friendship won',
            },
        ]);
        if (winner) {
            setWinner(winner);
        }
    };

    const handleCellsSize: OnChangeType = (setter) => {
        setCurrentCellsSize(setter as any);
    };

    const handleChangeGameMode: OnChangeType = (setter) => {
      setGameMode(setter as any);
    }

    useInput((input, key) => {
        if (!winner || !isGameStarted) return;
        if (key.return) {
            setIsGameStarted(true);
            gameCount.current = gameCount.current + 1;
            setWinner(null);
        } else if (key.escape) {
            setIsGameStarted(false);
            setWinner(null);
        }
    });

    // useEffect(() => {
    //     if (!isRawModeSupported) {
    //         setCurrentCellsSize(String(DEFAULT_CELLS));
    //         handleStartGame();
    //     }
    // }, [isRawModeSupported]);
    // if (!isRawModeSupported) return null;

    const queue = [];

    if (!gameMode) {
      queue.push(
        <ConfigureGameMode
          gameMode={gameMode}
          handleChangeGameMode={handleChangeGameMode}
        />
      )
    }

    if (gameMode && !currentCellsSize) {
        queue.push(
            <ConfigureStep
                key={1}
                isGameStarted={isGameStarted}
                onChange={handleCellsSize}
                handleStartGame={handleStartGame}
                cellsSize={currentCellsSize}
            />
        );
    }

    if (isGameStarted && currentCellsSize) {
        queue.push(
            <Box key={2} position='relative'>
                <Board
                    cells={+currentCellsSize}
                    handleEndGame={handleEndGame}
                    disabled={!!winner}
                    key={gameCount.current}
                />
                {winner && (
                    <Box
                        width='100%'
                        height='100%'
                        justifyContent='center'
                        alignItems='center'
                        position='absolute'
                    >
                        {winner === 'draw' ? (
                            <BigText colors={['red']} text='Draw' />
                        ) : (
                            <Gradient name='rainbow'>
                                <BigText text={`Winner is ${winner}!`} />
                            </Gradient>
                        )}
                    </Box>
                )}
            </Box>
        );
    }

    if (isGameStarted && winner) {
        queue.push(
            <Box key={3} flexDirection='column'>
                {(
                    [
                        {
                            level: 'info',
                            message: 'Press "Enter" to continue',
                        },
                        {
                            level: 'info',
                            message: 'Press "Esc" to continue',
                        },
                    ] as const
                ).map((item) => (
                    <Message message={item} />
                ))}
            </Box>
        );
    }

    return <>{queue}</>;
};

export default GameFlow;
