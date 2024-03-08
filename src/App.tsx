import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css'
import Lobby from './Lobby';
import AverageGame from './AverageGame';

function App() {
  return (
    <Router>
      <div className= "App">
        <Switch>
          <Route exact path="/">
            <Lobby>
            </Lobby>
          </Route>
          <Route exact path="/AverageGame">
            <AverageGame>
            </AverageGame>
          </Route>
        </Switch>
      </div>
    </Router>
  )

}

export default App
