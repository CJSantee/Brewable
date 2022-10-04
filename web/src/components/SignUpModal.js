import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import * as Yup from "yup";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function SignUpModal({ show, setShow, showSignIn }) {
  const [showPassword, setShowPassword] = useState(false);

  const { register, persist, setPersist } = useAuth();
  const navigate = useNavigate();

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <div className='p-3 bg-600'>
          <div className='d-flex justify-content-center m-2'>
            <h3>Sign Up for Brewable</h3>
          </div>
          <div className='m-3 border rounded'>
            <Formik
              validationSchema={schema}
              onSubmit={async (values, actions) => {
                const { redirect_url, errors } = await register(values);
                if (Object.keys(errors).length) {
                  actions.setErrors(errors);
                } else {
                  setShow(false);
                  navigate(redirect_url, { replace: false });
                }
                actions.setSubmitting(false);
              }}
              initialValues={{
                username: "",
                first_name: "",
                last_name: "",
                email: "",
                password: "",
              }}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className='m-3'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type='text'
                      name='username'
                      value={values.username}
                      onChange={handleChange}
                      isValid={touched.username && !errors.username}
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className='d-flex m-3'>
                    <Form.Group className='me-1'>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type='text'
                        name='first_name'
                        value={values.first_name}
                        onChange={handleChange}
                        isValid={touched.first_name && !errors.first_name}
                        isInvalid={!!errors.first_name}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.first_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='ms-1'>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type='text'
                        name='last_name'
                        value={values.last_name}
                        onChange={handleChange}
                        isValid={touched.last_name && !errors.last_name}
                        isInvalid={!!errors.last_name}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.last_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <Form.Group className='m-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type='email'
                      name='email'
                      value={values.email}
                      onChange={handleChange}
                      isValid={touched.email && !errors.email}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className='m-3'>
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                        isValid={touched.password && !errors.password}
                        isInvalid={!!errors.password}
                      />
                      <Button
                        variant='outline-secondary'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputGroup>
                    <Form.Control.Feedback type='invalid'>
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className='m-3'>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={persist}
                        onChange={togglePersist}
                        id='flexCheckDefault'
                      />
                      <label
                        className='form-check-label'
                        htmlFor='flexCheckDefault'
                      >
                        Remember me
                      </label>
                    </div>
                  </Form.Group>
                  <Form.Group className='m-3'>
                    <button
                      type='submit'
                      className='btn btn-primary w-100 rounded-lg'
                    >
                      Sign Up
                    </button>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          </div>
          <div className='m-3 border rounded p-3 d-flex justify-content-center align-items-center'>
            <div className='d-flex align-items-center'>
              <p className='m-0 p-0'>Already have an account?</p>
              <button
                className='btn btn-link p-0 ms-1'
                onClick={() => {
                  setShow(false);
                  showSignIn();
                }}
              >
                Sign In
              </button>
              <p className='m-0 p-0'>.</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
