// Components
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
// Libraries
import * as Yup from "yup";
import { Formik } from "formik";
// Hooks
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Full name is required"),
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
  persistt: Yup.boolean(),
});

export default function SignUpForm({ onSignUp, onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='p-3'>
      <div className='d-flex justify-content-center m-2'>
        <h3>Sign Up for Brewable</h3>
      </div>
      <div className='m-3 border rounded'>
        <Formik
          validationSchema={schema}
          onSubmit={async (values, actions) => {
            const { redirect_url, errors } = await register({
              ...values,
              rememberMe,
            });
            console.log(errors);
            if (errors.length) {
              actions.setErrors(
                errors.reduce((acc, err) => {
                  return { ...acc, ...err };
                }, {})
              );
            } else {
              navigate(redirect_url, { replace: false });
              onSignUp();
            }
            actions.setSubmitting(false);
          }}
          initialValues={{
            username: "",
            name: "",
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
              <Form.Group className='m-3'>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type='text'
                  name='name'
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !errors.name}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.name}
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
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
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
          <button className='btn btn-link p-0 ms-1' onClick={onSignIn}>
            Sign In
          </button>
          <p className='m-0 p-0'>.</p>
        </div>
      </div>
    </div>
  );
}
