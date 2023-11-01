import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import SignupLogin from "./SignupLogin.jsx";
import EventPage from "./EventPage.jsx";
import Navbar from "./NavBar.jsx";
import HomePage from "./HomePage.jsx";
import EventForm from "./EventForm.jsx";
import UserReservation from "./UserReservation.jsx";
import EventUpdate from "./EventUpdate.jsx";
import EventCreate from "./EventCreate.jsx";

function App() {
  const isAuth = Boolean(
    useSelector((state) => state.token)
  );
  return (
    <div className='app'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<SignupLogin />} />
          <Route path='/home' element={<HomePage />} />
          <Route
            path='/reservations'
            element={
              isAuth ? (
                <UserReservation />
              ) : (
                <Navigate to='/' />
              )
            }
          />
          <Route
            path='/event/admin'
            element={
              isAuth ? <EventCreate /> : <Navigate to='/' />
            }
          />
          <Route
            path='/updateEvent/admin'
            element={
              isAuth ? <EventUpdate /> : <Navigate to='/' />
            }
          />
          <Route
            path='/events/location/:location'
            element={
              isAuth ? <EventPage /> : <Navigate to='/' />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
