// Инициализация доски
export const initializeGame = () => {
    const board = Array(8).fill(null).map(() => Array(8).fill(null))

    // Расставляем черные шашки
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = { color: 'black', isKing: false }
            }
        }
    }

    // Расставляем белые шашки
    for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = { color: 'white', isKing: false }
            }
        }
    }

    return board
}

// Выполнение хода
export const makeMove = (board, fromRow, fromCol, toRow, toCol) => {
    const newBoard = board.map(row => [...row])
    const piece = newBoard[fromRow][fromCol]

    // Перемещаем фигуру
    newBoard[toRow][toCol] = piece
    newBoard[fromRow][fromCol] = null

    // Проверяем захват
    if (Math.abs(toRow - fromRow) === 2) {
        const captureRow = (fromRow + toRow) / 2
        const captureCol = (fromCol + toCol) / 2
        newBoard[captureRow][captureCol] = null
    }

    return newBoard
}

// Проверка на окончание игры
export const isGameOver = (board) => {
    let whitePieces = 0
    let blackPieces = 0

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col]
            if (piece) {
                if (piece.color === 'white') whitePieces++
                else blackPieces++
            }
        }
    }

    return whitePieces === 0 || blackPieces === 0
}

// Получение возможных ходов для фигуры
export const getPossibleMoves = (board, row, col) => {
    const piece = board[row][col]
    if (!piece) return []

    const moves = []
    const directions = piece.isKing
        ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] // Дамки ходят по диагонали в обе стороны
        : piece.color === 'white'
            ? [[-1, -1], [-1, 1]] // Белые шашки ходят вверх по диагонали
            : [[1, -1], [1, 1]]   // Черные шашки ходят вниз по диагонали

    // Проверяем обычные ходы
    for (const [dRow, dCol] of directions) {
        let newRow = row + dRow
        let newCol = col + dCol

        // Проверяем, что мы не вышли за пределы доски
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            // Если клетка пустая, это обычный ход
            if (!board[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol })
            }
        }
    }

    // Проверяем ходы с захватом
    for (const [dRow, dCol] of directions) {
        let jumpRow = row + 2 * dRow
        let jumpCol = col + 2 * dCol
        let captureRow = row + dRow
        let captureCol = col + dCol

        // Проверяем, что мы не вышли за пределы доски
        if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
            // Проверяем, что можно захватить фигуру
            if (!board[jumpRow][jumpCol] &&
                board[captureRow][captureCol] &&
                board[captureRow][captureCol].color !== piece.color) {
                moves.push({ row: jumpRow, col: jumpCol, capture: { row: captureRow, col: captureCol } })
            }
        }
    }

    return moves
}
