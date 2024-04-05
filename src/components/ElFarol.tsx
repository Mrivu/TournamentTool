import React from "react";
import './ElFarol.css';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

interface ElFarolProps {
  player: boolean;
}

const ElFarol = ({ player}: ElFarolProps) => {
    const [decided, setDecision] = React.useState(false);
    const [showExplanation, setShow] = React.useState(true);
    const [playerName, setName] = React.useState('');
    const [nameLocked, setLock] = React.useState(false);
    const [eliminated, setElimination] = React.useState(false);
    const [prize, setPrize] = React.useState(0);

    let round = 1;

    useEffect(() => {
      console.log('Fetching data...');
      const fetchData = async () => {
          try {
              const response = await fetch(`http://localhost:4000/getPrize?round=${round}`);
              const result = await response.json();
              setPrize(result.prize);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
    
      // Call the function once immediately
      fetchData();
    
      // Then set it to be called every 5 seconds (5000 milliseconds)
      const intervalId = setInterval(fetchData, 3000);
    
      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }, []);
    
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('test', "Hello");
      // End the connection
      //socket.emit("endConnection");
    });
    socket.on("StartNewRound", () => {
      setDecision(false);
      round += 1;
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
                <h1> The El Farol bar </h1>
                <div className="box-game-body">
                    <div className="explanation">
                      <h2> Attend or pass the opportunity to gain points </h2>
                    </div>
                    <button className="explanation-button" onClick={() => setShow(!showExplanation)}>
                      {showExplanation ? "Hide explanation" : "Show explanation"}
                    </button>
                  {showExplanation && <div className="explanation-dropdown">
                    <div className="explanation">
                      <h4> The game consists of rounds. </h4>
                      <h4> Each round the players must privately choose if they attend. </h4>
                      <h4> The prize is split between all attendees, but only if the attendees are a MINORITY </h4>
                    </div>
                  </div>}  
                  <div className="resultSubmit">
                    <button className="submit-button" onClick={() => {
                      if (!nameLocked) {
                        alert("Please lock your name first");
                        return;
                      }
                      setDecision(true);
                      fetch('http://localhost:4000/sendElFarolChoice', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: playerName, choice: true})
                      })
                      .then(response => response.json())
                      }}>
                      Attend
                    </button>
                    <button className="submit-button" onClick={() => {
                      if (!nameLocked) {
                        alert("Please lock your name first");
                        return;
                      }
                      setDecision(true);
                      fetch('http://localhost:4000/sendElFarolChoice', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: playerName, choice: false})
                      })
                      .then(response => response.json())
                      }}>
                      Pass
                    </button>
                    <div className="token-count">
                      <h3> Round prize: {prize} </h3>
                    </div>
                  </div>
                </div>
            </div>
            }
            {decided == true &&
                <div>
                    <h2> Choice submitted</h2>
                    <h3> Please wait for the results </h3>
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

export default ElFarol;