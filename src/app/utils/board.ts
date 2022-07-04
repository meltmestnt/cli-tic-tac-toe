import { ActiveBoardType, BoardItem } from '../components/Board';
import { DEFAULT_CELLS } from '../constants/board';

export type ResultType = null | 'x' | 'o';

export const generateBoard = (depth = DEFAULT_CELLS): ActiveBoardType => {
    return [...Array(depth * depth)].map((_, index) => ({
        id: index,
        symbol: null,
    }));
};

export const getColBasedOnCellPosition = (board: ActiveBoardType, col: number): Array<BoardItem> => {
  const cells = Math.sqrt(board.length);
  const colInBaseRow = col % cells;

  return [...Array(cells)].map((_, index) => board[index * cells + colInBaseRow]);
}

export const generatePossibleWinMoves = (
    board: ActiveBoardType
): Array<Array<BoardItem>> => {
    const cells = Math.sqrt(board.length);
    let checkResult: Array<Array<BoardItem>> = [];
    for (let i = 0; i < cells; i++) {
        checkResult.push(board.slice(cells * i, cells * (i + 1)));
        checkResult.push(
          getColBasedOnCellPosition(board, i)
            // [...Array(cells)].map((_, index) => board[index * cells + i])
        );
    }

    checkResult.push(
        [...Array(cells)].map((_, index) =>
            index === 0 ? board[index] : board[index * cells + index]
        )
    );
    checkResult.push(
        [...Array(cells)].map(
            (_, index) => board[index * cells - (index - (cells - 1))]
        )
    );

    return checkResult;
};

export const performCheksForWin = (board: ActiveBoardType): ResultType => {
    let winner = null;
    let checkResult = generatePossibleWinMoves(board);

    winner =
        ['x', 'o'].find((symbol) =>
            checkResult.find((row) =>
                row.every((cell: BoardItem) => cell.symbol === symbol)
            )
        ) || null;

    return winner as ResultType;
};

export const generateRandomMove = (board: ActiveBoardType): number => {
    let nextPossibleMove = Math.round(Math.random() * board.length - 1);
    if (board[nextPossibleMove]?.symbol) {
        nextPossibleMove = generateRandomMove(board);
    }

    return nextPossibleMove;
};

export const calculatePossibleWin = (
    board: ActiveBoardType,
    checkResult: Array<Array<BoardItem>>,
    symbol: 'x' | 'o'
): Array<BoardItem> | undefined => {
    const possibleWinRow = checkResult.find((row, i, arr) => {
        const matches = row.filter((cell) => cell.symbol === symbol);
        if (matches.length === Math.sqrt(board.length) - 1 && row.filter(cell => !matches.includes(cell) && !cell.symbol).length) {
            return true;
        }
        return false;
    });

    return possibleWinRow;
};

export const lookupWinConditions = (
    board: ActiveBoardType,
    checkResult: Array<Array<BoardItem>>
): number | undefined => {
    // TODO: make dynamic (allow player to choose char) and change AI symboll accordingly (based on what player chose)
    const ENEMY_SYMBOL = 'x';
    const AI_SYMBOL = 'o';
    let aiMove;
    const possibleEnemyWinRow = calculatePossibleWin(
        board,
        checkResult,
        ENEMY_SYMBOL
    );
    const possibleAiWinRow = calculatePossibleWin(
        board,
        checkResult,
        AI_SYMBOL
    );
    if (possibleAiWinRow) {
        const nextMove = possibleAiWinRow.find(
            (cell, index) => !cell.symbol
        )?.id;
        if (nextMove) {
            aiMove = nextMove;
        }
    } else if (possibleEnemyWinRow) {
        const nextMove = possibleEnemyWinRow.find(
            (cell, index) => !cell.symbol
        )?.id;
        if (nextMove) {
            aiMove = nextMove;
        }
    }
    if (aiMove && board[aiMove]?.symbol === AI_SYMBOL) {
      aiMove = lookupWinConditions(board, checkResult.filter(row => row !== possibleEnemyWinRow))
    }

    return aiMove;
};

export const aiMakeMove = (board: ActiveBoardType): number => {
    let checkResult = generatePossibleWinMoves(board);
    let aiMove = generateRandomMove(board);
    const winCondition = lookupWinConditions(board, checkResult);
    if (winCondition) {
      aiMove = winCondition;
    }
    return aiMove;
};
