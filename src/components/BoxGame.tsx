import React from "react";
import './BoxGame.css';
import { io } from 'socket.io-client';

interface BoxGameProps {
  player: boolean;
}

const BoxGame = ({ player}: BoxGameProps) => {
    const [number_textfield, number_setTextfield] = React.useState('');
    const [decided, setDecision] = React.useState(false);
    const [showExplanation, setShow] = React.useState(true);
    const [playerName, setName] = React.useState('');
    const [nameLocked, setLock] = React.useState(false);
    const [tokenCount, setTokens] = React.useState(100);
    const [eliminated, setElimination] = React.useState(false);
    
    const socket = io('http://ivugames.fi');
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('test', "Hello");
      // End the connection
      //socket.emit("endConnection");
    });
    socket.on("StartNewRound", () => {
      setDecision(false);
      console.log("New round started");
    });
    socket.on("remove", () => {
      setElimination(true)
      socket.emit("endConnection");
    });

    return (
        <>
        { !eliminated && <div>
        <div>
            {decided == false && <div>
                <h1> The Box </h1>
                <div className="box-game-body">
                    <div className="explanation">
                      <h2> Expend tokens in secret. You start with 100 tokens </h2>
                    </div>
                    <button className="explanation-button" onClick={() => setShow(!showExplanation)}>
                      {showExplanation ? "Hide explanation" : "Show explanation"}
                    </button>
                  {showExplanation && <div className="explanation-dropdown">
                    <div className="explanation">
                      <h4> Clear condition:</h4>
                      <h4> Be the last participant in the game </h4>
                    </div>
                    <div className="explanation">
                      <h4> Lose condition:</h4>
                      <h4> Place the smallest amount of tokens during a round </h4>
                    </div>
                    <div className="explanation">
                      <h4> Elimination condition:</h4>
                      <h4> None </h4>
                    </div>
                  </div>}  
                  <div className="resultSubmit">
                    <div className="input-field">
                          <input value={number_textfield}
                            placeholder="Insert number of tokens"
                            type="number"
                            onChange={(e) => {number_setTextfield(e.target.value)}}
                          />
                    </div>
                    <button className="submit-button" onClick={() => {
                      if (parseInt(number_textfield) < 0 || parseInt(number_textfield) > tokenCount) {
                        alert("Invalid number of tokens");
                        return;
                      }
                      if (!nameLocked) {
                        alert("Please lock your name first");
                        return;
                      }
                      setDecision(true);
                      console.log({ name: playerName, number: parseInt(number_textfield)});
                      fetch('http://ivugames.fi/sendBoxGameTokens', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: playerName, number: number_textfield})
                      })
                      .then(response => response.json())
                      setTokens(tokenCount - parseInt(number_textfield));
                      }}>
                      Expend tokens
                    </button>
                    <div className="token-count">
                      <h4> Tokens remaining: {tokenCount} </h4>
                    </div>
                  </div>
                </div>
            </div>
            }
            {decided == true &&
                <div>
                    <h2> Tokens submitted</h2>
                    <h3> Please wait for the results </h3>
                    <div className="token-count">
                      <h4> Tokens remaining: {tokenCount} </h4>
                    </div>
                </div>
            }
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
              fetch('http://ivugames.fi/participate', {
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

export default BoxGame;