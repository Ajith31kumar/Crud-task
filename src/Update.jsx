import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './Constants/URL';
import { FaCheck } from 'react-icons/fa';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(15, 'Name must be at most 15 characters')
    .required('Please enter your first name'),
  lastName: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(15, 'Name must be at most 15 characters')
    .required('Please enter your last name'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter your email'),
  phonenumber: Yup.string().required('Please enter your phone number'),
});

function Update() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [id, setId] = useState('');
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setEmail(inputValue);

    try {
      await validationSchema.validateAt('email', { email: inputValue });
      setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, email: error.message }));
    }
  };

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value;

    if (/^\d+$/.test(inputValue) || inputValue === '') {
      setPhonenumber(inputValue);
      setErrors((prevErrors) => ({ ...prevErrors, phonenumber: '' }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phonenumber: 'Phone number must contain only numeric values',
      }));
    }
  };

  const updateUser = async () => {
    try {
      const updateUrl = `${API_URL}/${id}`;
      console.log('Updating user at:', updateUrl);

      await axios.put(updateUrl, {
        firstName,
        lastName,
        email,
        phonenumber,
        checked,
      });

      navigate('/read');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    // Retrieve data from localStorage
    setId(localStorage.getItem('id'));
    setFirstName(localStorage.getItem('firstName'));
    setLastName(localStorage.getItem('lastName'));
    setEmail(localStorage.getItem('email'));
    setPhonenumber(localStorage.getItem('phonenumber'));
    setChecked(localStorage.getItem('checked') === 'true');
  }, []);

  const postData = async () => {
    try {
      await validationSchema.validate(
        { firstName, lastName, email, phonenumber },
        { abortEarly: false }
      );

      // Validation passed, call updateUser function
      updateUser();
    } catch (error) {
      // Validation failed, update the errors state
      const newErrors = {};
      error.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Form className="form">
      <Form.Group controlId="formFirstName" className="first">
        <Form.Label className="lar">First Name:</Form.Label>
        <Form.Control
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Enter your firstname"
          style={{ fontSize: '30px' }}
          className='first1'
        />
        {errors.firstName && <div style={{ color: 'red' }}>{errors.firstName}</div>}
      </Form.Group>
      <br />

      <Form.Group controlId="formLastName" className="last">
        <Form.Label>Last Name:</Form.Label>
        <Form.Control
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Enter your lastname"
          style={{ fontSize: '30px' }}
          className='first1'
        />
        {errors.lastName && <div style={{ color: 'red' }}>{errors.lastName}</div>}
      </Form.Group>
      <br />

      <Form.Group controlId="formEmail" className="mail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          style={{ fontSize: '30px', borderColor: errors.email ? 'red' : '' }}
          className='first1'
        />
        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
      </Form.Group>
      <br />

      <Form.Group controlId="formPhoneNumber" className="num">
        <Form.Label>PhoneNumber:</Form.Label>
        <Form.Control
          type="tel"
          value={phonenumber}
          onChange={handlePhoneNumberChange}
          placeholder="Enter your phonenumber"
          style={{ fontSize: '30px', borderColor: errors.phonenumber ? 'red' : '' }}
          className='first1'
        />
        {errors.phonenumber && <div style={{ color: 'red' }}>{errors.phonenumber}</div>}
      </Form.Group>
      <br />

      <Form.Group controlId="formCheckbox" className="ag">
        <Form.Check
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          label={<label style={{ fontSize: '30px' }}>Agree to the terms & conditions</label>}
          className='first1'
          
        />
      </Form.Group>
      <br />

      <Button style={{ fontSize: '30px', borderRadius:'10px' }} onClick={postData} variant="primary" type="button">
        
        <FaCheck /> Update
      </Button>
    </Form>
  );
}

export default Update;
