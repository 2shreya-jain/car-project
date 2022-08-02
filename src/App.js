import './App.css';
import Login from './components/login/index';
import Home from './components/home/index';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import 'antd/dist/antd.css';
import Booking from './components/booking';
import Addition from './components/addition';
function App() {
  return (
    <div className="App">
     <Router>
      <div className="parent">
        <Switch>
          <Route
          path="/home"
          render={({ match: { url } }) => (
            <>
              <Route path={`${url}/`} component={Home} exact />
              <Route path={`${url}/book`} component={Booking} />
              <Route path={`${url}/add-location`} component={Addition} />
            </>
          )}></Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>

    </div>
  );
}

export default App;
