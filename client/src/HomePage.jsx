import { useState, useEffect } from "react";
import { setLocations, setEvents } from "./state";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  return (
    <div className='home'>
      <div className='content home-background containerHeight'>
        <div className='row m-0'>
          <div className='col-md-12 p-0 text-light containerHeight d-flex flex-column justify-content-center align-items-center'>
            <h1 className='heading-primary'>
              Welcome To The Treasure Of Events{" "}
            </h1>
          </div>
        </div>
      </div>

      <CountriesList />
    </div>
  );
}

function CountriesList() {
  const [isError, setIsError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locations = useSelector((state) => state.locations);
  async function getAllEventLocations() {
    try {
      const res = await axios({
        method: "GET",
        url: "http://127.0.0.1:3001/event/location",
      });

      if (res.status === 200) {
        dispatch(
          setLocations({ locations: res.data.data })
        );
      }
    } catch (error) {
      setIsError(error.res.data.message);
    }
  }
  async function handleCardClick(location) {
    navigate(`/events/location/${location}`);
  }

  useEffect(() => {
    getAllEventLocations();
  }, []);
  return (
    <div className='wrapper'>
      <div className='row container-fluid text-center mb-4'>
        <div className='col-md-12'>
          <h2 className=''>
            Countries That Have Events Right Now!
          </h2>
        </div>
      </div>
      <div className='row container-fluid row-cols-md-2 row-cols-sm-1 ml-5 d-flex justify-content-center'>
        {locations.map((location) => (
          <CountryCard
            image={location.image}
            location={location.location}
            onCardClick={() => {
              handleCardClick(location.location);
            }}
            key={location.location}
          />
        ))}
      </div>
    </div>
  );
}

function CountryCard({ image, location, onCardClick }) {
  return (
    <div className='col-md-4 mb-5 d-flex justify-content-center'>
      <div
        className='country-card'
        style={{ cursor: "pointer" }}
        onClick={onCardClick}
      >
        <div className='country-card-img'>
          <img src={`${image}`} />
        </div>
        <div className='country-card-content'>
          <h5>{location}</h5>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
