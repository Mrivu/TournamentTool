import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useState } from 'react';
import {io, Socket} from 'socket.io-client';
import './App.css'
import Lobby from './components/Lobby';
import AverageGame from './components/AverageGame';
import GMPage from './components/GMPage';

function App() {
  // Global stuff
  const [player, isPlayer] = useState(true);

  const changeRole = (role:boolean) => {
      isPlayer(role);
  };


  return (
    <Router>
      <div className= "App">
        <Switch>
          <Route exact path="/">
            <Lobby player={player} changeRole={changeRole}>
            </Lobby>
          </Route>
          <Route exact path="/GMPage">
            <GMPage player={player}>
            </GMPage>
          </Route>
          <Route exact path="/averageGame">
            <AverageGame player={player}>
            </AverageGame>
          </Route>
        </Switch>
      </div>
    </Router>
  )

}

export default App
