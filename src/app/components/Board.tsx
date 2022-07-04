import { Box, Text, useInput } from 'ink';
import React, { useEffect, useState } from 'react';
import {
    aiMakeMove,
    generateBoard,
    getColBasedOnCellPosition,
    performCheksForWin,
    ResultType,
} from '../utils/board';
import figures from 'figures';
import BigText from 'ink-big-text';

export type BoardProps = {
    cells: number;
    handleEndGame: (winner: 'x' | 'o' | 'draw') => void;
    disabled?: boolean;
};

export type BoardItem = {
    id: number;
    symbol: 'x' | 'o' | null;
};

export type ActiveBoardType = Array<BoardItem>;

const symbolsMap = {
    x: figures.cross,
    o: figures.circle,
};

const Board = ({ cells, handleEndGame, disabled }: BoardProps) => {
    const [activeBoard, setActiveBoard] = useState<ActiveBoardType>(
        generateBoard(cells)
    );
    const [activeCell, setActiveCell] = useState(0);
    const [activeChar, setActiveChar] = useState<'x' | 'o'>('x');
    // useEffect(() => {
    //   setActiveBoard(generateBoard(cells));
    // }, [cells]);

    const handleMakeMove = () => {
        setActiveBoard((board) => {
            // player move
            if (board[activeCell].symbol) return board;
            let newBoard = board.map((cell, index) =>
                index === activeCell
                    ? { ...cell, symbol: cell.symbol ?? activeChar }
                    : cell
            );

            const aiMove = aiMakeMove(newBoard);

            newBoard = newBoard.map((cell, index) =>
                index === aiMove
                    ? {
                          ...cell,
                          symbol: cell.symbol ?? activeChar === 'x' ? 'o' : 'x',
                      }
                    : cell
            );

            return newBoard;
        });
        // setActiveChar((char) => (char === 'x' ? 'o' : 'x'));
    };

    useEffect(() => {
        const winner = performCheksForWin(activeBoard);
        if (winner) {
            handleEndGame(winner);
        } else if (activeBoard.every((cell) => !!cell.symbol)) {
            handleEndGame('draw');
        }
    }, [activeBoard]);

    const handlePrevNearestEmptyCell = (
        newCell: number,
        activeBoard: ActiveBoardType,
        trappedCol?: Array<BoardItem>
    ): number => {
        if (activeBoard[newCell]?.symbol || newCell < 0) {
            let nearestEmptyCell;
            if (Array.isArray(trappedCol)) {
                const prev = trappedCol.slice(0, trappedCol.findIndex(cell => cell.id === newCell));
                nearestEmptyCell = prev.find((cell) => !cell.symbol)?.id ?? trappedCol.slice().reverse().find(cell => !cell.symbol)?.id;
            } else {
                for (let i = newCell; i >= 0; i--) {
                    if (!activeBoard[i]?.symbol) {
                        nearestEmptyCell = i;
                        break;
                    }
                }
            }

            newCell =
                nearestEmptyCell ??
                handlePrevNearestEmptyCell(activeBoard.length - 1, activeBoard);
        }

        return newCell;
    };

    const handleNextNearestEmptyCell = (
        newCell: number,
        activeBoard: ActiveBoardType,
        trappedCol?: Array<BoardItem>
    ): number => {
        if (activeBoard[newCell]?.symbol || newCell > activeBoard.length - 1) {
            let nearestEmptyCell;
            if (Array.isArray(trappedCol)) {
                const next = trappedCol.slice(trappedCol.findIndex(cell => cell.id === newCell), trappedCol.length - 1);
                nearestEmptyCell = next.find((cell) => !cell.symbol)?.id ?? trappedCol.find(cell => !cell.symbol)?.id;
            } else {
                for (let i = newCell; i < activeBoard.length; i++) {
                    if (!activeBoard[i]?.symbol) {
                        nearestEmptyCell = i;
                        break;
                    }
                }
            }

            newCell =
                nearestEmptyCell ?? handleNextNearestEmptyCell(0, activeBoard);
        }
        return newCell;
    };

    const availableActions = {
        leftArrow: () => {
            setActiveCell((cell) => {
                let newCell = cell - 1;
                newCell = handlePrevNearestEmptyCell(newCell, activeBoard);
                if (newCell < 0) {
                    newCell = cells * cells - 1;
                }
                return newCell;
            });
        },
        rightArrow: () => {
            setActiveCell((cell) => {
                let newCell = cell + 1;
                newCell = handleNextNearestEmptyCell(newCell, activeBoard);
                if (newCell > cells * cells - 1) {
                    newCell = 0;
                }
                return newCell;
            });
        },
        upArrow: () => {
            setActiveCell((cell) => {
                let newCell = cell - cells;
                if (newCell > cells * cells - 1) {
                    newCell = newCell - cells * cells;
                } else if (newCell < 0) {
                    newCell = cells * cells + newCell;
                }
                const trappedCol = getColBasedOnCellPosition(
                    activeBoard,
                    newCell
                );
                newCell = handlePrevNearestEmptyCell(
                    newCell,
                    activeBoard,
                    trappedCol
                );
                return newCell;
            });
        },
        downArrow: () => {
            setActiveCell((cell) => {
                let newCell = cell + cells;
                if (newCell > cells * cells - 1) {
                    newCell = newCell - cells * cells;
                } else if (newCell < 0) {
                    newCell = cells * cells + newCell;
                }

                const trappedCol = getColBasedOnCellPosition(
                    activeBoard,
                    newCell
                );
                newCell = handleNextNearestEmptyCell(
                    newCell,
                    activeBoard,
                    trappedCol
                );

                return newCell;
            });
        },
        return: handleMakeMove,
    };

    // useEffect(() => {
    //   if (activeCell < 0) {
    //       setActiveCell(cells * cells - 1);
    //   }
    //   else if (activeCell > cells * cells - 1) {
    //     setActiveCell(0);
    //   }
    // }, [activeCell]);

    useInput((input, key) => {
        if (disabled) return;
        Object.keys(availableActions).forEach((action) => {
            if ((key as any)[action]) {
                availableActions[action as keyof typeof availableActions]();
            }
        });
    });

    return (
        <Box flexGrow={1} flexDirection='column' padding={2}>
            {activeBoard
                .reduce((acc, item, index, arr) => {
                    if (index !== 0 && (index + 1) % cells === 0) {
                        acc.push(arr.slice(index - (cells - 1), index + 1));
                    }
                    return acc;
                }, [] as Array<Array<BoardItem>>)
                .map((row, rowIndex) => {
                    return (
                        <Box>
                            {row.map(({ id, symbol }, index) => (
                                <Box
                                    key={id}
                                    flexGrow={1}
                                    flexShrink={0}
                                    flexBasis={0}
                                    padding={1}
                                    flexDirection='column'
                                    alignItems='center'
                                    justifyContent='flex-start'
                                    borderStyle='classic'
                                    height={6}
                                    borderColor={
                                        activeCell ===
                                        index + rowIndex * row.length
                                            ? 'yellowBright'
                                            : 'whiteBright'
                                    }
                                >
                                    <Box marginTop={-2}>
                                        <BigText
                                            font='tiny'
                                            text={symbol ?? ''}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    );
                })}
        </Box>
    );
};

export default Board;
