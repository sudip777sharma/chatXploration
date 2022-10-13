import './style.scss';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

import { BrowserRouter, Route, Switch, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import NoChat from './components/NoChat';
import About from './components/About';

function App() {

  const { currentUser } = useContext(AuthContext);
  console.log("currentUser App.js: ", currentUser);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return (
        <Login />
      )
    }
    return (children);
  }

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" >
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </Route>

          <Route exact path='/about'>
            <About />
          </Route>

          <Route exact path='/login'>
            <Login />
          </Route>

          <Route exact path='/register'>
            <Register />
          </Route>

        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
