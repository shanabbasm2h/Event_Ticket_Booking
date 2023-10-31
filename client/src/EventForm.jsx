import { useEffect, useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import eventSchema from "./eventValidation";
// const initialValuesEvent = {
//   name: "",
//   price: "",
//   location: "",
// };
function EventForm({
  initialValuesEvent,
  type,
  setEvents,
}) {
  const [seatLayout, setSeatLayout] = useState([]);
  const [deleted, setDeleted] = useState(false);
  // let seatLayout = [];
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isSuccess, SetIsSuccess] = useState(null);

  useEffect(() => {
    if (type === "update") {
      setSeatLayout([]);
      setSelectedSeats(null);
      setSelectedRow(null);
      setSeatLayout(
        initialValuesEvent.seats.map((seat) => seat.length)
      );
      setSelectedRow(seatLayout.length);
      console.log(seatLayout);
    } else {
      setSelectedRow(1);
      setSelectedSeats(0);
    }
  }, [initialValuesEvent]);

  const handleSeatSelection = (event, i) => {
    setSelectedSeats(event.target.value);
    // if (type === "update") {
    const updatedValue = [...seatLayout];

    if (isNaN(event.target.value)) {
      updatedValue.pop();
    } else {
      updatedValue[i] = Number(event.target.value);
    }
    setSeatLayout(updatedValue);
    // }
    setSelectedSeats(event.target.value);
    console.log(seatLayout);
  };

  const handleAddRow = () => {
    setSelectedRow(() => selectedRow + 1);

    // if (selectedRow && selectedSeats && type='create') {
    //   const newRow = parseInt(selectedSeats);
    //   setSeatLayout([...seatLayout, newRow]);
    //   setSelectedSeats(0);
    //   setSelectedRow(() => selectedRow + 1);
    // }
  };
  async function handleCancelRow() {
    if (selectedRow > 0)
      setSelectedRow(() => selectedRow - 1);
    const updatedValue = [...seatLayout];
    console.log(selectedRow, updatedValue.length);
    if (selectedRow === updatedValue.length)
      updatedValue.pop();
    setSeatLayout(updatedValue);
  }

  async function handleFormSubmit(values, onSubmitProps) {
    try {
      setIsError(null);
      SetIsSuccess(null);
      delete values._id;
      delete values.seats;
      delete values.bookedSeats;
      delete values.availableSeats;
      delete values.image;

      const updateSeatLayout = seatLayout.filter(
        (seat) => !isNaN(seat) && seat !== 0
      );
      let url, method;
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      if (values.picture && values.picture.name) {
        formData.append("image", values.picture.name);
      }

      formData.append("seatLayout", updateSeatLayout);
      if (type === "update") {
        url = `http://127.0.0.1:3001/event/admin/${initialValuesEvent._id}`;
        method = "PATCH";
      } else {
        url = "http://127.0.0.1:3001/event/admin";
        method = "POST";
      }

      const res = await axios({
        method: method,
        url: url,
        data: formData,
      });
      if (res.status === 201) {
        onSubmitProps.resetForm();
        setSeatLayout([]);
        setSelectedRow(1);
        setSelectedSeats(0);
        SetIsSuccess("Event Created Successfully");
      } else if (res.status === 200) {
        // onSubmitProps.resetForm();
        initialValuesEvent = res.data.data;
        SetIsSuccess("Event Updated Successfully");
      } else {
        setIsError(res.data.message);
      }
    } catch (error) {
      setIsError(error.data.message);
    }
  }

  async function handleDeleteEvent() {
    try {
      const res = await axios({
        method: "DELETE",
        url: `http://127.0.0.1:3001/event/admin/${initialValuesEvent._id}`,
      });
      if (res.status === 200) {
        SetIsSuccess("Event Deleted Successfully");
        setDeleted(true);
        initialValuesEvent = null;
        setEvents(res.data.data);
      }
    } catch (error) {
      setIsError(error.data.message);
    }
  }
  return (
    <div className='container wrapper'>
      {!deleted ? (
        initialValuesEvent && (
          <>
            <div className=' row'>
              <div className=' col-md-12 container  d-flex flex-column justify-content-center'>
                <h4 className='mb-4 text-center'>
                  {type === "update"
                    ? "Update Event"
                    : "Create Event"}
                </h4>
                <Formik
                  onSubmit={handleFormSubmit}
                  initialValues={initialValuesEvent}
                  validationSchema={eventSchema}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                  }) => (
                    <form
                      className='form-font'
                      onSubmit={handleSubmit}
                    >
                      <div className='container col-md-6'>
                        {(isError || isSuccess) && (
                          <div
                            className={
                              isSuccess
                                ? "text-success "
                                : "text-danger "
                            }
                          >
                            {isSuccess
                              ? isSuccess
                              : isError}
                          </div>
                        )}
                        <div className='row'>
                          <div className='col-md-6 form-group mb-4'>
                            <label htmlFor='name'>
                              Event Name:
                            </label>
                            <input
                              type='text'
                              className='form-control'
                              placeholder='Enter Event Name'
                              id='name'
                              value={values.name}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched.name &&
                              errors.name && (
                                <div className='text-danger'>
                                  {errors.name}
                                </div>
                              )}
                          </div>
                          <div className='col-md-6 form-group mb-4'>
                            <label htmlFor='price'>
                              Price:
                            </label>
                            <input
                              type='number'
                              className='form-control'
                              placeholder='Enter Price'
                              id='price'
                              value={values.price}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched.price &&
                              errors.price && (
                                <div className='text-danger'>
                                  {errors.price}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-md-12 form-group mb-4'>
                            <label htmlFor='location'>
                              Location:
                            </label>
                            <input
                              type='text'
                              className='form-control'
                              placeholder='Enter Location'
                              id='location'
                              value={values.location}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched.location &&
                              errors.location && (
                                <div className='text-danger'>
                                  {errors.location}
                                </div>
                              )}
                          </div>
                        </div>

                        {Array.from(
                          { length: selectedRow },
                          (_, i) => (
                            <div className='row' key={i}>
                              <div
                                className='col-md-6 form-group mb-4 '
                                key={i}
                              >
                                <label htmlFor='s-row'>
                                  Row:
                                </label>
                                <input
                                  type='text'
                                  className='form-control'
                                  placeholder='Enter Row'
                                  value={String.fromCharCode(
                                    65 + i
                                  )}
                                  id='s-row'
                                  disabled
                                />
                              </div>
                              <div className='col-md-6 form-group mb-4'>
                                <label htmlFor='seats'>
                                  Number of Seats in Row:
                                </label>
                                <input
                                  type='Number'
                                  className='form-control'
                                  placeholder='Enter Seats'
                                  id='seats'
                                  value={
                                    selectedRow.length >
                                    seatLayout.length
                                      ? 0
                                      : seatLayout[i]
                                  }
                                  onChange={(event) => {
                                    handleSeatSelection(
                                      event,
                                      i
                                    );
                                  }}
                                  // disabled={
                                  //   seatLayout[i] !==
                                  //     undefined &&
                                  //   i > -1 &&
                                  //   type !== "update"
                                  // }
                                />
                              </div>
                            </div>
                          )
                        )}

                        <button
                          type='button me-3'
                          className='btn button-secondary'
                          onClick={handleAddRow}
                        >
                          Add Row
                        </button>
                        <button
                          type='button'
                          className='btn button-secondary'
                          onClick={handleCancelRow}
                        >
                          Remove Row
                        </button>
                        <div className='mb-3 mt-4'>
                          <label
                            htmlFor='formFile'
                            className='form-label'
                          >
                            Image:
                          </label>
                          <p>{values.image}</p>
                          <input
                            className='form-control'
                            type='file'
                            id='formFile'
                            name='picture'
                            accept='.jpg, .jpeg, .png'
                            multiple={false}
                            // value={values.image}
                            onChange={(event) => {
                              setFieldValue(
                                "picture",
                                event.currentTarget.files[0]
                              );
                            }}
                          />
                        </div>
                        <div className='d-flex justify-content-center'>
                          <button
                            type='submit'
                            className='btn button-secondary'
                          >
                            {type === "update"
                              ? "Update Event"
                              : "Create Event"}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </Formik>
                <div className='d-flex justify-content-center'>
                  {type === "update" && (
                    <button
                      className='btn button-secondary mt-3'
                      onClick={handleDeleteEvent}
                    >
                      Delete Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <h3>No Event Selected</h3>
      )}
    </div>
  );
}

export default EventForm;
