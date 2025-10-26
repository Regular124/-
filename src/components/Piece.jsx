import React from 'react'

const Piece = ({ piece }) => {
    const getPieceClass = () => {
        return `piece ${piece.color} ${piece.isKing ? 'king' : ''}`
    }

    return (
        <div className={getPieceClass()}>
            {piece.isKing && <span className="crown">♔</span>}
        </div>
    )
}

export default Piece
