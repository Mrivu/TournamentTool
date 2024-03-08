import { useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

const Lobby = () => {
    const [lobby, setLobby] = useState(true);
    const [gamemode, setGamemode] = useState('');
    const [gamemode_textfield, gamemode_setTextfield] = useState('');
    const [number_textfield, number_setTextfield] = useState('');
    const [chosen_Number, setChosenNumber] = useState('');
    const [decided, setDecision] = useState(false);
    const [player, isPlayer] = useState(true);
    const [gmPass, setGmPass_textfield] = useState('');
    const [textAlert, setAlert] = useState(false);
    const [gamemodeSet, setGamemodeSetNotification] = useState(0); // 0 = no notification, 1 = changed, 2 = failed

    return (
        <>
        {lobby == true && <div>
          <h1> Game login </h1>
          <button className="role-select-button" onClick={() => {
            isPlayer(true);
            setLobby(false);
          }}>
            Join as player
          </button>
          <div></div>
          <button className="role-select-button" onClick={async () => {
            // Check if password is correct through backend
            const response = await fetch(`http://localhost:4000/login?password=${gmPass}`, {
            method: 'GET',
            });
            if (response.ok) {
              const isPasswordCorrect = await response.json();
              if (isPasswordCorrect) {
                isPlayer(false);
                setLobby(false);
                setAlert(false);
              } else {
                setAlert(true);
              }
            }
          }}>
            Join as Game master
          </button>
          <div className="input-field">
              <input value={gmPass}
                placeholder="Game master password"
                type="password"
                onChange={(e) => setGmPass_textfield(e.target.value)}
              />
          </div>
          {textAlert == true &&
          <h2> Incorrect password </h2>
          }
          <div className="input-field">
            <input value={gamemode_textfield}
              placeholder="Enter Gamemode"
              type="text"
              onChange={(e) => {gamemode_setTextfield(e.target.value)}}
            />
          </div>
          </div>
        }
        {lobby == false && 
          <div>
            <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h2> Current Game is {gamemode} </h2>
          <div className="Button">
            <button onClick={() => {
              const changeGamemode = async () => {
                const response = await fetch(`http://localhost:4000/changeGamemode?gamemode=${gamemode_textfield}`, {
                  method: 'GET',
                });
                if (response.ok) {
                  const changed = await response.json();
                  if (changed) {
                    setGamemodeSetNotification(1);
                  } else {
                    setGamemodeSetNotification(2);
                  }
                }
              };
              changeGamemode();
            }}>
              Change Gamemode
            </button>
          </div>
          {gamemodeSet == 1 &&
          <h2> Gamemode changed succesfully </h2>
          }
          {gamemodeSet == 2 &&
          <h2> Gamemode change failed </h2>
          }
          {gamemode === "Average game" && decided != true && <div>
          <h2> Enter a number from 0-100</h2>
          <h3> Win condition:</h3>
          <h3> Choose a number closest to the average of all chosen numbers multiplied by 0.8</h3>
          <div className="input-field">
            <input value={number_textfield}
              placeholder="Number from 0-100"
              type="text"
              onChange={(e) => {number_setTextfield(e.target.value)}}
            />
          </div>
          <button className="submit-button" onClick={() => {
            setChosenNumber(number_textfield);
            setDecision(true);
          }}>
            Submit chosen number
          </button>
          </div>
          }
          {gamemode === "Average game" && decided == true && <div>
          <h2> Number submitted</h2>
          <h3> Please wait for the results </h3>
          </div>
          }
          <div className="role-text">
            {player == true && <h3> Player </h3>}
            {player == false && <h3> Game master </h3>}
          </div>
          </div>
        }
    </>
    );
};

export default Lobby;