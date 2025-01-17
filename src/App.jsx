import { useState } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";

import { WINNING_COMBINATIONS } from "./winning-combinations";

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

function getActivePlayer(gameTurns) {
  let activePlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    activePlayer = "O";
  }

  return activePlayer;
}

function getGameWinner(players, gameBoard) {
  let winner;

  // a classic 3x3 tic tac toe board only has 8 possible winning combinations - so this works just fine
  for (const combination of WINNING_COMBINATIONS) {
    const firstSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSymbol = gameBoard[combination[2].row][combination[2].column];

    if (
      firstSymbol &&
      firstSymbol === secondSymbol &&
      firstSymbol === thirdSymbol
    ) {
      winner = players[firstSymbol];
    }
  }

  return winner;
}

function getUpdatedGameBoard(gameTurns) {
  // Always use Immutability
  let gameBoard = [...INITIAL_GAME_BOARD.map((innerArray) => [...innerArray])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function App() {
  // goal is to not manage any not needed states - so compute as many values as possible in this state - in this case, the whole game
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(PLAYERS);

  const activePlayer = getActivePlayer(gameTurns);
  const gameBoard = getUpdatedGameBoard(gameTurns);
  const winner = getGameWinner(players, gameBoard);
  const gameIsDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    // setGameTurns - a state update function that is not merging other state & that is updating values in an immutable way
    setGameTurns((previousTurns) => {
      const currentPlayer = getActivePlayer(previousTurns);

      const updatedTurns = [
        {
          square: {
            row: rowIndex,
            col: colIndex,
          },
          player: currentPlayer,
        },
        ...previousTurns,
      ];

      return updatedTurns;
    });
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((previousPlayers) => {
      return {
        ...previousPlayers,
        [symbol]: newName,
      };
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || gameIsDraw) && (
          <GameOver
            players={players}
            winner={winner}
            onRematchClicked={handleRestart}
          />
        )}
        <GameBoard gameBoard={gameBoard} onSelectSquare={handleSelectSquare} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
