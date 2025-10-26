import React from 'react'
import Piece from './Piece'

const Board = ({ board, selectedPiece, validMoves, onSquareClick }) => {
    const isSquareSelected = (row, col) => {
        return selectedPiece && selectedPiece.row === row && selectedPiece.col === col
    }

    const isValidMove = (row, col) => {
        return validMoves.some(move => move.row === row && move.col === col)
    }

    const renderSquare = (row, col) => {
        const piece = board[row][col]
        const isSelected = isSquareSelected(row, col)
        const isValidMoveSquare = isValidMove(row, col)

        const squareClasses = [
            'square',
            row % 2 === col % 2 ? 'light' : 'dark',
            isSelected ? 'selected' : '',
            isValidMoveSquare ? 'valid-move' : ''
        ].join(' ')

        return (
            <div
                key={`${row}-${col}`}
                className={squareClasses}
                onClick={() => onSquareClick(row, col)}
            >
                {piece && <Piece piece={piece} />}
            </div>
        )
    }

    const renderBoard = () => {
        const rows = []
        for (let row = 0; row < 8; row++) {
            const squares = []
            for (let col = 0; col < 8; col++) {
                squares.push(renderSquare(row, col))
            }
            rows.push(
                <div key={row} className="board-row">
                    {squares}
                </div>
            )
        }
        return rows
    }

    return (
        <div className="board-container">
            <div className="board">
                {renderBoard()}
            </div>
        </div>
    )
}

export default Board
