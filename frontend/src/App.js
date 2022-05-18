import React, {useState} from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import AuthPage from './pages/auth';
import EventsPage from './pages/events';
import BookingsPage from './pages/bookings';
import MainNavigation from './components/navigation/MainNavigation';
import AuthContext from './context/auth-context';

function App() {
  const [token,setToken] = useState('');
  const [userId,setUserId] = useState(null);
  const login = (token,userId,tokenExpiration)=> {
    setToken(token);
    setUserId(userId);
  }
  const logout = ()=> {
    setToken(null);
    setUserId(null);
  }
  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider value={{token: token, userId: userId, login: login, logout: logout}}>
        <MainNavigation />
        <main className='main-content'>
          <Switch>            
          <Route path="/events" component={EventsPage} />
          
            {!token && <Redirect from='/' to="/auth" exact />}
            {!token && <Redirect from='/events' to="/auth" exact />}
            {!token && <Redirect from='/bookings' to="/auth" exact />}
            {token && <Redirect from='/auth' to="/events" exact />}
            <Route path="/auth" component={AuthPage} />
            
            <Route path="/bookings" component={BookingsPage} />
          </Switch>
        </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  )
}

export default App;
