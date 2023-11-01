import EventForm from "./EventForm.jsx";
const initialValuesEvent = {
  name: "",
  price: "",
  location: "",
};
function EventCreate() {
  return (
    <EventForm
      initialValuesEvent={initialValuesEvent}
      type={"create"}
      selectedEvent='0'
    />
  );
}

export default EventCreate;
