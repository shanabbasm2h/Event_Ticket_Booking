import { useState, useEffect } from "react";
import bookedSeatSVG from "./assets/bookedSeat.svg";
import emptySeatSVG from "./assets/emptySeat.svg";
import selectedSeatSVG from "./assets/selectedSeat.svg";
import { setEvents } from "./state";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import EventCard from "./EventCard.jsx";

function EventPage() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);
  const [event, setEvent] = useState(null);
  const [isError, setIsError] = useState(null);
  const token = useSelector((state) => state.token);
  const [selectedCardIndex, setSelectedCardIndex] =
    useState(null);
  const { location } = useParams();
  async function getAllEvents() {
    try {
      const res = await axios({
        method: "GET",
        url: `http://127.0.0.1:3001/event/location/${location}`,
      });

      if (res.status === 200) {
        dispatch(setEvents({ events: res.data.data }));
      }
    } catch (error) {
      setIsError(error.res.data.message);
    }
  }
  async function getEvent(eventId, index) {
    try {
      setSelectedCardIndex(index);
      const res = await axios({
        method: "GET",
        url: `http://127.0.0.1:3001/event/${eventId}`,
      });

      if (res.status === 200) {
        setEvent(res.data.data);
      }
    } catch (error) {
      setIsError(error.res.data.message);
    }
  }
  useEffect(() => {
    getAllEvents();
  }, []);
  return (
    <div className='container-fluid wrapper'>
      <div className='row  containerHeight'>
        <div className='col-md-4 col-sm-12 border-right '>
          <div className='container'>
            <h4>Events in {location}</h4>
            {events.map((event, i) => (
              <EventCard
                title={event.name}
                image={event.image}
                textTop={`Available Seats : ${event.availableSeats}`}
                textBottom={`Booked Seats : ${event.bookedSeats}`}
                key={i}
                isSelected={i === selectedCardIndex}
                onGetEvent={() => {
                  getEvent(event._id, i);
                }}
              />
            ))}
          </div>
        </div>
        <div className='col-md-8 col-sm-12'>
          <SeatSection event={event} setEvent={setEvent} />
        </div>
      </div>
    </div>
  );
}

function SeatSection({ event, setEvent }) {
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [isError, setIsError] = useState(null);
  const [seatBookedMessage, setSeatBookedMessage] =
    useState("");
  const token = useSelector((state) => state.token);

  async function handleBookSeats() {
    try {
      const res = await axios({
        method: "PATCH",
        url: `http://127.0.0.1:3001/reservation/${event._id}`,
        headers: { Authorization: `Bearer ${token}` },
        data: { seats: selectedSeat },
      });

      if (res.status === 200) {
        setEvent(res.data.updatedEvent);
        setSelectedSeat([]);
        setSeatBookedMessage(
          "The Seats Booked Successfully"
        );
      }
    } catch (error) {
      setIsError(error.res.data.message);
    }
  }

  return (
    <>
      <div className='d-flex flex-column align-items-center'>
        {!event ? (
          <h2>No Event Selected</h2>
        ) : (
          <>
            {seatBookedMessage && (
              <p className='text-success mb-3'>
                {seatBookedMessage}
              </p>
            )}
            <h2>{event.name}</h2>

            <h5>Seat Map</h5>

            <SeatMap
              seats={event.seats}
              selectedSeat={selectedSeat}
              setSelectedSeat={setSelectedSeat}
            />

            <div className='mt-4'>
              <button
                onClick={handleBookSeats}
                className='btn button-secondary'
              >
                Book Seats
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function SeatMap({ seats, selectedSeat, setSelectedSeat }) {
  // const [selectedSeat, setSelectedSeat] = useState([]);

  function handleSelectedSeat(indexRow, indexCol) {
    const isSeatSelected = isSelected(indexRow, indexCol);

    if (isSeatSelected) {
      // If the seat is already selected, remove it
      const updatedSeats = selectedSeat.filter(
        (seat) =>
          !(seat[0] === indexRow && seat[1] === indexCol)
      );
      setSelectedSeat(updatedSeats);
    } else {
      if (seats[indexRow][indexCol] === 0)
        setSelectedSeat([
          ...selectedSeat,
          [indexRow, indexCol],
        ]);
    }
  }
  function isSelected(indexRow, indexCol) {
    return selectedSeat.some(
      (seat) => seat[0] === indexRow && seat[1] === indexCol
    );
  }
  return (
    <div className='seat-map'>
      <div className='row'>
        <div className='col-md-4 d-flex justify-content-center align-items-center'>
          <img
            className='seat-icon-img'
            src={emptySeatSVG}
            alt='Booked Seat'
          />
          <p className='mt-3'>: Empty Seat</p>
        </div>
        <div className='col-md-4 d-flex justify-content-center align-items-center'>
          <img
            className='seat-icon-img'
            src={bookedSeatSVG}
            alt='Booked Seat'
          />
          <p className='mt-3'>: Booked Seat</p>
        </div>
        <div className='col-md-4 d-flex justify-content-center align-items-center'>
          <img
            className='seat-icon-img '
            src={selectedSeatSVG}
            alt='Booked Seat'
          />
          <p className='mt-3'>: Selected Seat</p>
        </div>
      </div>
      {seats.map((seatRow, indexRow) => (
        <div
          className='d-md-flex  justify-content-center pb-2 gap-1 flex-wrap'
          key={indexRow}
        >
          {seatRow.map((seat, indexCol) => (
            <div
              className='seat-icon mr-2  text-center'
              key={indexCol}
            >
              <p className='mb-1'>{`${String.fromCharCode(
                65 + indexRow
              )}${indexCol}`}</p>
              <img
                className='seat-icon-img'
                src={
                  isSelected(indexRow, indexCol)
                    ? selectedSeatSVG
                    : seat === 0
                    ? emptySeatSVG
                    : bookedSeatSVG
                }
                alt='Booked Seat'
                onClick={() =>
                  handleSelectedSeat(indexRow, indexCol)
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
export default EventPage;
