import React, {useContext} from  'react';
import {NavLink} from 'react-router-dom';
import  './MainNavigation.css';
import AuthContext from '../../context/auth-context';

const MainNavigation =(props)=> {
  const authContext = useContext(AuthContext);
  return(
    <header className='main-navigation'>
      <div className='main-navigation_logo'>
          <h1>Easy Event</h1>
      </div>
      <nav className='main-navigation_items'>
          <ul>
            {!authContext.token && 
           <li>
            <NavLink to="/auth">Authenticate</NavLink>
            </li>
            }
           <li>
             <NavLink to="/events">Events</NavLink>
            </li>
            {authContext.token && (
              <React.Fragment>
                <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <button onClick={authContext.logout}>Logout</button>
              </React.Fragment>
            )
            }
          </ul>
      </nav>
    </header>
  )
}

export default MainNavigation;