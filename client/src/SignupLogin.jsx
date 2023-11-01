import { useState } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import signupSchema from "./signupValidation";
import loginSchema from "./loginValidation";
import { setLogin } from "./state.js";
const initialValuesSignup = {
  name: "",
  email: "",
  password: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};
function SignupLoginForm() {
  const [pageType, setPageType] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isSignup = pageType === "signup";
  const [isError, setIsError] = useState(null);

  async function signup(values, onSubmitProps) {
    setIsError(null);
    const savedUserResponse = await axios({
      method: "POST",
      url: "http://127.0.0.1:3001/user/signup",
      data: values,
    });
    if (savedUserResponse.status === 201) {
      const savedUser = await savedUserResponse.data
        .newUser;
      onSubmitProps.resetForm();

      if (savedUser) {
        setPageType("login");
      }
    } else {
      setIsError(savedUserResponse.data.message);
    }
  }
  async function login(values, onSubmitProps) {
    // setIsError(null);
    try {
      const loggedInResponse = await axios({
        method: "POST",
        url: "http://localhost:3001/user/login",
        data: values,
      });

      onSubmitProps.resetForm();
      if (loggedInResponse.status === 200) {
        dispatch(
          setLogin({
            user: loggedInResponse.data.user,
            token: loggedInResponse.data.token,
          })
        );
        navigate("/home");
      }
    } catch (error) {
      setIsError(error.response.data.message);
    }
  }
  async function handleFormSubmit(values, onSubmitProps) {
    if (isLogin) await login(values, onSubmitProps);
    if (isSignup) await signup(values, onSubmitProps);
  }
  return (
    <div className='container-fluid containerHeight'>
      <div className='row'>
        <div className='col-md-4  containerHeight d-flex flex-column justify-content-center align-items-center'>
          <h4 className='mb-4'>
            {isLogin ? "Login" : "SignUp"}
          </h4>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={
              isLogin
                ? initialValuesLogin
                : initialValuesSignup
            }
            validationSchema={
              isLogin ? loginSchema : signupSchema
            }
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              resetForm,
            }) => (
              <form
                className='form-font'
                onSubmit={handleSubmit}
              >
                <div className='container'>
                  {isError && (
                    <div className='text-danger text-center'>
                      {isError}
                    </div>
                  )}
                  <div className='row'>
                    {isSignup && (
                      <div className='col-md-12 form-group mb-4'>
                        <label htmlFor='name'>Name:</label>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Enter Name'
                          id='name'
                          value={values.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.name && errors.name && (
                          <div className='text-danger'>
                            {errors.name}
                          </div>
                        )}
                      </div>
                    )}
                    <div className='col-md-12 form-group mb-4'>
                      <label htmlFor='email'>
                        Email address:
                      </label>
                      <input
                        type='email'
                        className='form-control'
                        placeholder='Enter email'
                        id='email'
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.email && errors.email && (
                        <div className='text-danger'>
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div className='col-md-12 form-group mb-4'>
                      <label htmlFor='password'>
                        Password:
                      </label>
                      <input
                        type='password'
                        className='form-control'
                        placeholder='Enter password'
                        id='password'
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.password &&
                        errors.password && (
                          <div className='text-danger'>
                            {errors.password}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className='d-flex justify-content-center'>
                    <button
                      type='submit'
                      className='btn button-secondary'
                    >
                      {isLogin ? "LOGIN" : "SIGNUP"}
                    </button>
                  </div>
                  <p
                    className='mt-4'
                    onClick={() => {
                      setPageType(
                        isLogin ? "signup" : "login"
                      );
                      resetForm();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {isLogin
                      ? "Don't have an account? Sign Up here."
                      : "Already have an account? Login here."}
                  </p>
                </div>
              </form>
            )}
          </Formik>
        </div>
        <div className='col-md-8 form-img'></div>
      </div>
    </div>
  );
}

export default SignupLoginForm;
