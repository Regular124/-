// Простой ИИ для игры в шашки
import { getPossibleMoves } from './gameLogic'

export const getAIMove = (board, currentPlayer) => {
    // Получаем все возможные ходы для текущего игрока
    const allMoves = getAllPossibleMoves(board, currentPlayer);

    if (allMoves.length === 0) {
        return null;
    }

    // Простая стратегия: выбираем ход с наибольшим количеством захватов
    let bestMove = allMoves[0];
    let maxCaptures = countCaptures(bestMove);

    for (let i = 1; i < allMoves.length; i++) {
        const captures = countCaptures(allMoves[i]);
        if (captures > maxCaptures) {
            maxCaptures = captures;
            bestMove = allMoves[i];
        }
    }

    return bestMove;
};

// Получение всех возможных ходов
const getAllPossibleMoves = (board, playerColor) => {
    const moves = [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];

            if (piece && piece.color === playerColor) {
                const pieceMoves = getPossibleMoves(board, row, col);
                pieceMoves.forEach(move => {
                    moves.push({
                        from: { row, col },
                        to: move,
                        isCapture: !!move.capture
                    });
                });
            }
        }
    }

    return moves;
};

// Подсчет захватов в ходе
const countCaptures = (move) => {
    if (!move.isCapture) return 0;

    // Простая оценка - считаем захваты
    return move.to.capture ? 1 : 0;
};
