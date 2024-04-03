import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

interface LobbyProps {
  changeRole: (role: boolean) => void;
}

const Lobby = ({ changeRole }: LobbyProps) => {
    const [gamemode, setGamemode] = useState('');
    const [gmPass, setGmPass_textfield] = useState('');
    const [textAlert, setAlert] = useState('');

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
        <div>
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
                history.push('/GMPage');
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
    </>
    );
};

export default Lobby;