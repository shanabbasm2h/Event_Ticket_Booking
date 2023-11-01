function Login() {
  return (
    <div className='container-fluid containerHeight wrapper'>
      <div className='row'>
        <div className='col-md-4  containerHeight d-flex flex-column justify-content-center align-items-center'>
          <h4 className='mb-4'>Login</h4>
          <form className='form-font'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12 form-group mb-4'>
                  <label htmlFor='email'>
                    Email address:
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    placeholder='Enter email'
                    id='email'
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12 form-group mb-4'>
                  <label htmlFor='pwd'>Password:</label>
                  <input
                    type='password'
                    className='form-control'
                    placeholder='Enter password'
                    id='pwd'
                  />
                </div>
                <div className='col-md-12 form-group form-check mb-4 ms-2'>
                  <label className='form-check-label'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                    />
                    Remember me
                  </label>
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <button
                  type='submit'
                  className='btn button-secondary'
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className='col-md-8 form-img'></div>
      </div>
    </div>
  );
}

export default Login;
