import { useState, useEffect } from 'react';
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { useHistory } from 'react-router-dom';

interface LobbyProps {
  player: boolean;
  changeRole: (role: boolean) => void;
}

const Lobby = ({ player, changeRole }: LobbyProps) => {
    const [lobby, setLobby] = useState(true);
    const [gamemode, setGamemode] = useState('');
    const [gamemode_textfield, gamemode_setTextfield] = useState('');
    const [gmPass, setGmPass_textfield] = useState('');
    const [textAlert, setAlert] = useState('');
    const [gamemodeSet, setGamemodeSetNotification] = useState(0); // 0 = no notification, 1 = changed, 2 = failed

    const history = useHistory();

    useEffect(() => {
        console.log('Fetching data...');
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/getGamemode');
                const result = await response.json();
                setGamemode(result.gamemode);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the function once immediately
        fetchData();

        // Then set it to be called every 5 seconds (5000 milliseconds)
        const intervalId = setInterval(fetchData, 5000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
        {lobby == true && <div>
          <h1> Game login </h1>
          <button className="role-select-button" onClick={() => {
            if (gamemode != 'None') {
              changeRole(true);
              history.push('/averageGame');
            }
            else
            {
              alert("No game currently running");
            }
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
                changeRole(false);
                setLobby(false);
                setAlert("");
              } else {
                setAlert("Incorrect password");
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
          <h2> {textAlert} </h2>
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
          <div className="input-field">
            <input value={gamemode_textfield}
              placeholder="Enter Gamemode"
              type="text"
              onChange={(e) => {gamemode_setTextfield(e.target.value)}}
            />
          </div>
          {gamemodeSet == 1 &&
          <h2> Gamemode changed succesfully </h2>
          }
          {gamemodeSet == 2 &&
          <h2> Gamemode change failed </h2>
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