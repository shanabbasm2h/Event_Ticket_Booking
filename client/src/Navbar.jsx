import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "./state.js";
function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = Boolean(
    useSelector((state) => state.token)
  );
  function handleLogoutClick() {
    dispatch(setLogout());
  }

  return (
    <nav className='navbar w-100'>
      <div className='container'>
        <a
          className='navbar-brand'
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/home");
          }}
        >
          Event Ticket Booking
        </a>
        <div className='d-flex gap-3'>
          <button
            className='btn button-primary my-2 my-sm-0'
            onClick={() => {
              isAuth
                ? navigate("/reservations")
                : navigate("/");
            }}
          >
            {isAuth ? "Reservations" : "SignUp"}
          </button>
          <button
            className='btn button-primary my-2 my-sm-0'
            onClick={() => {
              isAuth ? handleLogoutClick() : navigate("/");
            }}
          >
            {isAuth ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
