import EventCard from "./EventCard";
import crossIcon from "./assets/cross.svg";
import selectedSeatSVG from "./assets/SelectedSeat.svg";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setReservations } from "./state";
import axios from "axios";

function UserReservation() {
  const dispatch = useDispatch();
  const [reservation, setReservation] = useState(null);
  const reservations = useSelector(
    (state) => state.reservations
  );
  const [isError, setIsError] = useState(null);
  const token = useSelector((state) => state.token);
  const [selectedCardIndex, setSelectedCardIndex] =
    useState(null);
  async function getAllReservations() {
    try {
      const res = await axios({
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        url: `http://127.0.0.1:3001/reservation`,
      });

      if (res.status === 200) {
        dispatch(
          setReservations({
            reservations: res.data.reservation,
          })
        );
      }
    } catch (error) {
      setIsError(error.res.data.message);
    }
  }
  async function getReservation(reservationId, index) {
    try {
      setSelectedCardIndex(index);
      const SelectedReservation = reservations.filter(
        (reservation) => reservation._id === reservationId
      )[0];
      if (!SelectedReservation) {
        const res = await axios({
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          url: `http://127.0.0.1:3001/reservation/${reservationId}`,
        });

        if (res.status === 200) {
          setReservation(res.data.reservation);
        }
      } else {
        setReservation(SelectedReservation);
      }
    } catch (error) {
      setIsError(error.res.data.message);
    }
  }
  useEffect(() => {
    getAllReservations();
  }, []);
  return (
    <>
      <div className='container wrapper'>
        <div className='row'>
          <div className='col-md-6 border-right'>
            <h4 className='text-center'>Reservations</h4>
            {reservations.map((reservation, i) => (
              <>
                <EventCard
                  title={reservation.event.name}
                  image={reservation.event.image}
                  textTop={`Price :${reservation.price}`}
                  textBottom={`Total :${reservation.total}`}
                  key={i}
                  isSelected={i === selectedCardIndex}
                  onGetEvent={() => {
                    getReservation(reservation._id, i);
                  }}
                />
              </>
            ))}
          </div>
          <div className='col-md-6 '>
            {reservation ? (
              <ReservationSection
                reservation={reservation}
                setReservation={setReservation}
                token={token}
                setIsError={setIsError}
                key={0}
              />
            ) : (
              <h4>No Reservation Selected</h4>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ReservationSection({
  reservation,
  setReservation,
  token,
  setIsError,
}) {
  async function cancelSeatBooking(seat) {
    try {
      const res = await axios({
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        url: `http://127.0.0.1:3001/reservation/cancelBookedSeats/${reservation._id}`,
        data: { seat: seat },
      });

      if (res.status === 200) {
        if (res.data.reservation) {
          setReservation(res.data.reservation);
        } else {
          setReservation(null);
        }
      }
    } catch (error) {
      setIsError(error.res.data.message);
      //   console.log(error);
    }
  }
  async function handlePayBill() {
    try {
      const res = await axios({
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        url: `http://127.0.0.1:3001/reservation/checkout/${reservation._id}`,
      });

      if (res.status === 200) {
        window.location.href = res.data.session.url;
      }
    } catch (error) {
      setIsError(error.res.data.message);
      //   console.log(error);
    }
  }
  return (
    <>
      {" "}
      <div className=' container-fluid d-flex flex-column align-items-center pb-3  mb-3 border-bottom'>
        <h4 className='text-center'>
          {reservation.event.name}
        </h4>
        {/* <div className=''></div> */}
        <img
          src={`http://127.0.0.1:3001/assets/${reservation.event.image}`}
          className='img-fluid rounded reservation-img'
          alt='...'
        />
      </div>
      <div className='d-flex flex-column'>
        <h5>Reserved Seats:</h5>
        {reservation.seats.map((seat, i) => (
          <SeatCard
            name={reservation.event.name}
            seat={seat}
            price={reservation.price}
            key={i}
            onCancelSeat={cancelSeatBooking}
          />
        ))}
        <div className='row text-center'>
          <div className='col-md-12'>
            <h5>
              Total&nbsp;: &nbsp;Rs&nbsp;{reservation.total}
            </h5>
          </div>
          <div className='col-md-12'>
            {" "}
            {reservation.paid ? (
              <button
                onClick={handlePayBill}
                className='btn button-secondary'
                disabled
              >
                Paid
              </button>
            ) : (
              <button
                onClick={handlePayBill}
                className='btn button-secondary'
              >
                Pay Now
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SeatCard({ name, seat, price, onCancelSeat }) {
  return (
    <div
      className='card mb-3 border-0 form-font'
      style={{
        maxWidth: "540px",
      }}
    >
      <div className='row g-0'>
        <div className='d-flex justify-content-sm-between'>
          <div className='col-md-2'>
            <img
              src={selectedSeatSVG}
              className='img-fluid rounded-start h-100'
              alt='...'
              style={{
                maxWidth: "100px",
              }}
            />
          </div>
          <div className='col-md-8'>
            <div className='card-body'>
              <h5 className='card-title'>{name}</h5>
              <p className='card-text mb-0'>
                Seat No :
                <span>{`${String.fromCharCode(
                  65 + seat[0]
                )}${seat[1]}`}</span>
              </p>
              <p className='card-text mb-0'>
                Price :<span>{price}</span>
              </p>
            </div>
          </div>
          <div className='col-md-2 d-flex flex-column justify-content-center align-items-center'>
            <img
              src={crossIcon}
              className='img-fluid h-100'
              alt='...'
              onClick={() => {
                onCancelSeat(seat);
              }}
              style={{
                maxWidth: "20px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserReservation;
