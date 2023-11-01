import axios from "axios";
import { useState, useEffect } from "react";
import EventCard from "./EventCard.jsx";
import EventForm from "./EventForm.jsx";

function EventUpdate() {
  const [events, setEvents] = useState(null);
  const [event, setEvent] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] =
    useState(null);
  const [isError, setIsError] = useState(null);

  async function getAllEvents() {
    try {
      const res = await axios({
        method: "GET",
        url: `http://127.0.0.1:3001/event`,
      });
      if (res.status === 200) {
        setEvents(res.data.data);
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
            <h4>All Events</h4>
            {events &&
              events.map((event, i) => (
                <EventCard
                  title={event.name}
                  image={event.image}
                  textTop={`Location : ${event.location}`}
                  textBottom={``}
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
          {event && (
            <EventForm
              initialValuesEvent={event}
              type='update'
              setEvents={setEvents}
              selectedEvent={event._id}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EventUpdate;
