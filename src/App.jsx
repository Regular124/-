import React, { useState, useEffect, useCallback } from 'react'
import Board from './components/Board'
import GameInfo from './components/GameInfo'
import { initializeGame, makeMove, isGameOver, getPossibleMoves } from './utils/gameLogic'
import { getAIMove } from './utils/ai'
import './styles/App.css'

function App() {
  const [board, setBoard] = useState(initializeGame())
  const [currentPlayer, setCurrentPlayer] = useState('white')
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [validMoves, setValidMoves] = useState([])
  const [gameStatus, setGameStatus] = useState('playing')
  const [winner, setWinner] = useState(null)
  const [gameMode, setGameMode] = useState('human') // 'human' или 'ai'
  const [isAIThinking, setIsAIThinking] = useState(false)

  // Проверка на конец игры
  useEffect(() => {
    if (isGameOver(board)) {
      setGameStatus('gameOver')
      setWinner(currentPlayer === 'white' ? 'black' : 'white')
      return
    }

    // Если ИИ ходит и игра не окончена
    if (gameMode === 'ai' && currentPlayer === 'black' && gameStatus === 'playing') {
      setIsAIThinking(true)
      // Даем немного времени для визуального эффекта
      setTimeout(() => {
        makeAIMove()
        setIsAIThinking(false)
      }, 500)
    }
  }, [board, currentPlayer, gameMode, gameStatus])

  const handleSquareClick = (row, col) => {
    // Если игра окончена или ИИ думает, не обрабатываем клики
    if (gameStatus === 'gameOver' || isAIThinking) return

    // Если игра в режиме ИИ и ход черных, не позволяем делать ходы
    if (gameMode === 'ai' && currentPlayer === 'black') return

    const piece = board[row][col]

    // Если есть выбранная фигура и клик по валидному ходу
    if (selectedPiece && validMoves.some(move => move.row === row && move.col === col)) {
      const newBoard = makeMove(board, selectedPiece.row, selectedPiece.col, row, col)
      setBoard(newBoard)

      // Проверяем, нужно ли превращение в дамку
      if ((currentPlayer === 'white' && row === 0) || (currentPlayer === 'black' && row === 7)) {
        newBoard[row][col].isKing = true
      }

      // Переключаем игрока
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white')
      setSelectedPiece(null)
      setValidMoves([])
      return
    }

    // Если клик по фигуре текущего игрока
    if (piece && piece.color === currentPlayer) {
      setSelectedPiece({ row, col })
      const moves = getPossibleMoves(board, row, col)
      setValidMoves(moves)
      return
    }

    // Сброс выбора, если клик не по фигуре
    setSelectedPiece(null)
    setValidMoves([])
  }

  const makeAIMove = useCallback(() => {
    if (gameStatus === 'gameOver' || gameMode !== 'ai') return

    const aiMove = getAIMove(board, 'black')

    if (aiMove) {
      const newBoard = makeMove(
        board,
        aiMove.from.row,
        aiMove.from.col,
        aiMove.to.row,
        aiMove.to.col
      )

      setBoard(newBoard)

      // Проверяем, нужно ли превращение в дамку
      if (aiMove.to.row === 7) {
        newBoard[aiMove.to.row][aiMove.to.col].isKing = true
      }

      setCurrentPlayer('white')
    }
  }, [board, gameMode, gameStatus])

  const resetGame = () => {
    setBoard(initializeGame())
    setCurrentPlayer('white')
    setSelectedPiece(null)
    setValidMoves([])
    setGameStatus('playing')
    setWinner(null)
    setIsAIThinking(false)
  }

  const handleModeChange = (mode) => {
    setGameMode(mode)
    resetGame()
  }

  return (
    <div className="app">
      <h1>Шашки</h1>
      <div className="game-controls">
        <button
          onClick={() => handleModeChange('human')}
          className={gameMode === 'human' ? 'active-mode' : ''}
        >
          Человек vs Человек
        </button>
        <button
          onClick={() => handleModeChange('ai')}
          className={gameMode === 'ai' ? 'active-mode' : ''}
        >
          Человек vs ИИ
        </button>
      </div>

      {isAIThinking && gameMode === 'ai' && currentPlayer === 'black' && (
        <div className="ai-thinking">ИИ думает...</div>
      )}

      <GameInfo
        currentPlayer={currentPlayer}
        gameStatus={gameStatus}
        winner={winner}
        onReset={resetGame}
        gameMode={gameMode}
      />
      <Board
        board={board}
        selectedPiece={selectedPiece}
        validMoves={validMoves}
        onSquareClick={handleSquareClick}
      />
    </div>
  )
}

export default App
