import React from "react";
import './AverageGame.css';


const AverageGame = ({ player }: { player: boolean }) => {
    const [number_textfield, number_setTextfield] = React.useState('');
    const [chosen_Number, setChosenNumber] = React.useState('');
    const [decided, setDecision] = React.useState(false);

    return (
        <>
        <div>
            {decided == false && <div>
                <h1> The Average Game </h1>
                <div className="average-game-body">
                    <div className="explanation">
                      <h2> Enter a number from 0-100</h2>
                    </div>
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
            </div>
            }
            {decided == true &&
                <div>
                    <h2> Number submitted</h2>
                    <h3> Please wait for the results </h3>
                </div>
            }
        </div>
        <div className="role-text">
            
            {player == true && <h3> Player </h3>}
            {player == false && <h3> Game master </h3>}
        </div>
        </>
    );
};

export default AverageGame;