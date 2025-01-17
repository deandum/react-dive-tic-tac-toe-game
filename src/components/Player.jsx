import { useState } from "react";

export default function Player({
  initialName,
  symbol,
  isActive,
  onChangeName,
}) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    setIsEditing((editing) => !editing);

    if (isEditing) {
      onChangeName(symbol, playerName);
    }
  }

  function handleNameChange(event) {
    setPlayerName(event.target.value);
  }

  let playerNameTpl = <span className="player-name">{playerName}</span>;
  let buttonLabel = "Edit";
  if (isEditing) {
    playerNameTpl = (
      <input
        type="text"
        required
        value={playerName}
        onChange={handleNameChange}
      />
    );
    buttonLabel = "Save";
  }

  return (
    <li className={isActive ? "active" : undefined}>
      <span className="player">
        {playerNameTpl}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{buttonLabel}</button>
    </li>
  );
}
