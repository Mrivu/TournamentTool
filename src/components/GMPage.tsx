import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import diceImage from '../assets/d6.svg'

interface GMPageProps {
  player: boolean;
}

const GMPage = ({player}: GMPageProps) => {
  
    const [gamemode_textfield, gamemode_setTextfield] = useState('');
    const [gamemodeSet, setGamemodeSetNotification] = useState(0); // 0 = no notification, 1 = changed, 2 = failed
    const [gamemode, setGamemode] = useState('');

    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('test', "Hello");
      // End the connection
      //socket.emit("endConnection");
    });

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
          <div>
          <a href="https://docs.google.com/document/d/1-c47Q7ZQRVJLlqLl4X110R9MfM0zixqp5la3nl2jEyY/edit?usp=sharing" target="_blank">
            <img src={diceImage} className="logo" />
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
        <button onClick={() => {
          socket.emit('newRound');
          }}>
            New round
        </button>
        <button onClick={() => {
          fetch('http://localhost:4000/getAverageGameResults', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.blob())
          .then(blob => {
            // Convert the blob to text
            return blob.text();
          })
          .then(text => {
            // Create a new blob from the text
            const newBlob = new Blob([text], { type: 'text/csv' });
          
            // Create a temporary URL for the blob
            const url = URL.createObjectURL(newBlob);
          
            // Create a link element
            const link = document.createElement('a');
          
            // Set the link's href to the temporary URL
            link.href = url;
          
            // Set the link's download attribute to specify the filename
            link.download = 'Average_game_results.csv';
          
            // Programmatically click the link to trigger the download
            link.click();
          
            // Clean up by revoking the temporary URL
            URL.revokeObjectURL(url);
          });
          }}>
            Download results
        </button>
        <div className="role-text">
          {player == true && <h3> Player </h3>}
          {player == false && <h3> Game master </h3>}
        </div>
        </div>
        </>
    );
};

export default GMPage;