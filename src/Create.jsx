import { v4 as generateUniqueId } from 'uuid';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import axios from 'axios';
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

function Create() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const postData = async () => {
    try {
      await validationSchema.validate(
        { firstName, lastName, email, phonenumber },
        { abortEarly: false }
      );

      await axios.post(API_URL, {
        firstName,
        lastName,
        email,
        phonenumber,
        checked,
      });

      navigate('/read');
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Form className='form'>
      <Form.Field className='first'>
    <label className='lar' style={{ fontWeight: 'bold', marginBottom: '8px' }}>
      First Name:
    </label>
    <input
      className='first1'
      value={firstName}
      onChange={(event) => setFirstName(event.target.value)}
      placeholder='Enter your firstname'
      style={{ fontSize: '30px', marginBottom: '8px' }}
    />
    {errors.firstName && <div style={{ color: 'red', marginTop: '4px' }}>{errors.firstName}</div>}
  </Form.Field>
      <br />

      <Form.Field className='last'>
        <label style={{ fontWeight: 'bold' }}>Last Name:</label>
        <input className='first1'
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder='Enter your lastname'
          style={{ fontSize: '30px' }}
        />
        {errors.lastName && <div style={{ color: 'red' }}>{errors.lastName}</div>}
      </Form.Field>
      <br />

      <Form.Field className='mail'>
        <label style={{ fontWeight: 'bold' }}>Email:</label>
        <input className='first1'
          value={email}
          onChange={handleInputChange}
          placeholder='Enter your email'
          style={{ fontSize: '30px', borderColor: errors.email ? 'red' : '' }}
        />
        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
      </Form.Field>
      <br />

      <Form.Field className='num'>
        <label  style={{ fontWeight: 'bold' }}>PhoneNumber:</label>
        <input className='first1'
          value={phonenumber}
          onChange={handlePhoneNumberChange}
          placeholder='Enter your phonenumber'
          style={{ fontSize: '30px' , borderColor: errors.phonenumber ? 'red' : '' }}
        />
        {errors.phonenumber && <div style={{ color: 'red' }}>{errors.phonenumber}</div>}
      </Form.Field>
      <br />

      <Form.Field className='ag'>
        <Form.Checkbox
          checked={checked}
          onChange={() => setChecked(!checked)}
          className='custom-checkbox'
          label={<label style={{ fontSize: '30px',borderRadius:'4', fontWeight: 'bold'}}>Agree to the terms & conditions</label>}
        />
      </Form.Field>

      <br />
      <Button style={{ fontSize: '25px', borderRadius: '5px' }} onClick={postData} icon labelPosition='Right' primary>
  <FaCheck /> Create
</Button>

    </Form>
  );
}

export default Create;
