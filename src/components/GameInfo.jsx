import React from 'react'

const GameInfo = ({ currentPlayer, gameStatus, winner, onReset, gameMode }) => {
    return (
        <div className="game-info">
            {gameStatus === 'playing' ? (
                <div>
                    <h2>Ход: <span className={`player ${currentPlayer}`}>{currentPlayer}</span></h2>
                    <p>Режим игры: {gameMode === 'ai' ? 'Человек vs ИИ' : 'Человек vs Человек'}</p>
                </div>
            ) : (
                <div>
                    <h2>Игра окончена!</h2>
                    <h3>Победитель: <span className={`player ${winner}`}>{winner}</span></h3>
                </div>
            )}
            <button onClick={onReset} className="reset-button">
                Новая игра
            </button>
        </div>
    )
}

export default GameInfo
