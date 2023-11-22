import { useCallback, useEffect, useState } from "react";
import sound1 from "./assets/sounds/1.mp3";
import sound2 from "./assets/sounds/2.mp3";
import sound3 from "./assets/sounds/3.mp3";
import sound4 from "./assets/sounds/4.mp3";
import "./App.scss";

function App() {
  const [items] = useState([
    {
      color: "red",
      sound: sound1,
    },
    {
      color: "blue",
      sound: sound2,
    },
    {
      color: "yellow",
      sound: sound3,
    },
    {
      color: "green",
      sound: sound4,
    },
  ]);
  const [round, setRound] = useState(0);
  const [fail, setFail] = useState(false);
  const [subsequenceGame, setSubsequenceGame] = useState([]);
  const [subsequenceUser, setSubsequenceUser] = useState([]);
  const [statusGame, setStatusGame] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [statusPlaySubsequence, setStatusPlaySubsequence] = useState(false);
  const [acitveIndex, setActiveIndex] = useState(null);
  const [time, setTime] = useState(0);
  function startGame() {
    if (subsequenceGame.length > 0) {
      setSubsequenceGame([]);
    }
    setToggle(!toggle);
    setStatusGame(true);
    setFail(false);
    setRound(1);
    generateSubsequence();
  }
  console.log("userArr", subsequenceUser);
  console.log("gameArr", subsequenceGame);
  useEffect(() => {
    setTimeout(() => playSubsequence(), 1000);
  }, [round, statusGame, toggle]);

  const generateSubsequence = () => {
    let randomIndex = Math.floor(Math.random() * items.length);
    setSubsequenceGame((prev) => [...prev, randomIndex]);
  };

  async function playSubsequence() {
    setStatusPlaySubsequence(true);
    if (fail === true) {
      return;
    }
    for (let i = 0; i < subsequenceGame.length; i++) {
      const el = subsequenceGame[i];
      const audio = items[el].sound;
      autoPlay(audio, el);
      await delay(time);
    }
    setStatusPlaySubsequence(false);
  }
  function autoPlay(sound, i) {
    setActiveIndex(i);
    const audio = new Audio(sound);
    audio.play().then(() => setTimeout(() => setActiveIndex(null), 300));
  }

  const onMouseDown = (sound, i) => {
    if (statusPlaySubsequence && fail) {
      return;
    } else if (!statusPlaySubsequence && statusGame) {
      setSubsequenceUser([...subsequenceUser, i]);
    }

    setActiveIndex(i);
    const audio = new Audio(sound);
    audio.play();
  };

  const onMouseUp = () => {
    if (statusPlaySubsequence && fail) {
      return;
    }
    const isRoundComplete = subsequenceUser.every(
      (userItem, index) => userItem === subsequenceGame[index],
    );

    setActiveIndex(null);
    if (!isRoundComplete) {
      setFail(true);
      setSubsequenceGame([]);
      setSubsequenceUser([]);
    } else if (
      isRoundComplete &&
      statusGame &&
      subsequenceGame.length === subsequenceUser.length
    ) {
      setSubsequenceUser([]);
      generateSubsequence();
      setRound((prev) => prev + 1);
    }
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="wrapper">
      <h1>The Simon Game</h1>

      <div className="container">
        <div className="simonGame">
          <div className="simonGame__circle">
            <ul>
              {items.map((item, i) => (
                <li
                  key={i}
                  onMouseUp={() => onMouseUp(i)}
                  onMouseDown={() => onMouseDown(item.sound, i)}
                  className={
                    acitveIndex === i ? `active ${item.color}` : item.color
                  }
                ></li>
              ))}
            </ul>
          </div>
          <div className="simonGame__settings">
            <div className="simonGame__settings-top">
              <h2>Round: {round}</h2>
              <button disabled={time === 0 ? true : false} onClick={startGame}>
                Start
              </button>
              {fail && <p> Вы проиграли после {round} раунда</p>}
            </div>
            <div className="simonGame__settings-bottom">
              {time === 0 && <p>Выберите сложность</p>}

              <label htmlFor="easy">
                <p>Easy</p>
                <input
                  value={time}
                  onChange={() => setTime(1500)}
                  type="radio"
                  name="time"
                  id="easy"
                />
              </label>
              <label htmlFor="Normal">
                <p>Normal</p>
                <input
                  value={time}
                  onChange={() => setTime(1000)}
                  type="radio"
                  name="time"
                  id="Normal"
                />
              </label>
              <label htmlFor="Hard">
                <p>Hard</p>
                <input
                  value={time}
                  onChange={() => setTime(400)}
                  type="radio"
                  name="time"
                  id="Hard"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
