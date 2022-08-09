import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import * as Yup from "yup";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const schema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function SignUpModal({ show, setShow, showSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { register, persist, setPersist } = useAuth();

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <>
      <Alert show={showAlert} variant='danger'>
        <Alert.Heading>That email is taken.</Alert.Heading>
      </Alert>
      <Modal show={show} onHide={() => setShow(false)}>
        <div className='p-3 bg-600'>
          <div className='d-flex justify-content-center m-2'>
            <h3>Sign Up for Brewable</h3>
          </div>
          <div className='m-3 border rounded'>
            <Formik
              validationSchema={schema}
              onSubmit={async (values, actions) => {
                const { alerts, errors } = await register(values);
                if (Object.keys(errors).length) {
                  actions.setErrors(errors);
                } else {
                  setShow(false);
                }
                actions.setSubmitting(false);
              }}
              initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                password: "",
              }}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className='m-3'>
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
                  <Form.Group className='m-3'>
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
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type='tel'
                      name='phone'
                      value={values.phone}
                      onChange={handleChange}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.phone}
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
                      className='btn btn-success w-100 rounded-lg'
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
