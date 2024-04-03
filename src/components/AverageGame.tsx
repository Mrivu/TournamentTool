import React from "react";
import './AverageGame.css';
import { io } from 'socket.io-client';

interface AverageGameProps {
  player: boolean;
}

const AverageGame = ({ player}: AverageGameProps) => {
    const [number_textfield, number_setTextfield] = React.useState('');
    const [decided, setDecision] = React.useState(false);
    const [showExplanation, setShow] = React.useState(true);
    const [playerName, setName] = React.useState('');
    const [nameLocked, setLock] = React.useState(false);
    const [eliminated, setElimination] = React.useState(false);
    const [score, setScore] = React.useState(0);
    
    const socket = io('http://localhost:3000');

    function EliminateSelf()
    {
      setElimination(true)
      socket.emit("endConnection");
    }

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('test', "Hello");
      // End the connection
      //socket.emit("endConnection");
    });
    socket.on("StartNewRound", () =>{
      setDecision(false);
      setScore(score-1)
      console.log("New round started");
      if (score <= -9)
      {
        EliminateSelf()
      }
    });
    socket.on("remove", e => {
      setElimination(true)
      socket.emit("endConnection");
    });
    socket.on("roundWinner", e => {
      console.log("player hear")
      setScore(score+1)
    });
    socket.on("penalty", e => {
      console.log("player hear")
      setScore(score-1)
    });
    
    return (
        <>
        { !eliminated && <div>
        <div>
            {decided == false && <div>
                <h1> The Average Game </h1>
                <div className="average-game-body">
                    <div className="explanation">
                      <h2> Enter a number from 0-100</h2>
                    </div>
                    <button className="explanation-button" onClick={() => setShow(!showExplanation)}>
                      {showExplanation ? "Hide explanation" : "Show explanation"}
                    </button>
                  {showExplanation && <div className="explanation-dropdown">
                    <div className="explanation">
                      <h4> Win condition:</h4>
                      <h4> Choose a number closest to the average of all chosen numbers multiplied by 0.8</h4>
                      <h4> All but the winner lose 1 point </h4>
                    </div>
                    <div className="explanation">
                      <h4> Clear condition:</h4>
                      <h4> Be the last participant in the game </h4>
                    </div>
                    <div className="explanation">
                      <h4> Lose condition:</h4>
                      <h4> Reach -10 points </h4>
                    </div>
                    <div className="explanation">
                      <h4> Elimination condition:</h4>
                      <h4> None </h4>
                    </div>
                  </div>}  
                  <div className="resultSubmit">
                    <div className="input-field">
                          <input value={number_textfield}
                            placeholder="Number from 0-100"
                            type="number"
                            onChange={(e) => {number_setTextfield(e.target.value)}}
                          />
                    </div>
                    <button className="submit-button" onClick={() => {
                      if (parseInt(number_textfield) < 0 || parseInt(number_textfield) > 100) {
                        alert("Number must be between 0 and 100");
                        return;
                      }
                      if (!nameLocked) {
                        alert("Please lock your name first");
                        return;
                      }
                      setDecision(true);
                      console.log({ name: playerName, number: parseInt(number_textfield)});
                      fetch('http://localhost:4000/sendAverageGameNumber', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: playerName, number: number_textfield})
                      })
                      .then(response => response.json())
                      }}>
                      Submit chosen number
                    </button>
                  </div>
                </div>
            </div>
            }
            {decided == true &&
                <div>
                    <h2> Number submitted</h2>
                    <h3> Please wait for the results </h3>
                </div>
            }
            <div>
              <h3> Your score is: {score}</h3>
            </div>
        </div>
        <div className="nameEdit">
          <div className="input-field">
            <input value={playerName}
              placeholder="Insert name"
              type="text"
              onChange={(e) => {
                if (!nameLocked) {
                  setName(e.target.value);
                }
              }}
            />
          </div>
          {!nameLocked && <button className="lock-name" onClick={() => {
              if (playerName == '') {
                alert("Please enter a name");
                return;
              }
              setLock(true)
              fetch('http://localhost:4000/participate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: playerName, socketID: socket.id})
              })
            }}>
            Lock name
          </button>}
        </div>
        <div className="role-text">
            {player == true && <h3> Player </h3>}
            {player == false && <h3> Game master </h3>}
        </div>
        </div>}
        { eliminated && <div>
          <h1> You have been removed from the game </h1>
          </div>}
        </>
    );
};

export default AverageGame;