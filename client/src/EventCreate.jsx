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
    />
  );
}

export default EventCreate;
