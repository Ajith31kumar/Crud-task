import React, { useEffect, useState } from 'react';
import { Table, Button } from 'semantic-ui-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { API_URL } from './Constants/URL';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';

function Read() {
  const [apiData, setApiData] = useState([]);
  const navigate = useNavigate(); // Get the navigate function

  const updateUser = ({ id, firstName, lastName, email, phonenumber, checked }) => {
    localStorage.setItem('id', id);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('email', email);
    localStorage.setItem('phonenumber', phonenumber);
    localStorage.setItem('checked', checked);
    navigate('/update');
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Update the state to reflect the deleted user
      setApiData(apiData.filter((user) => user.id !== id));
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      console.log('Request configuration:', error.config);
    }
  };

  const callGetAPI = async () => {
    try {
      const resp = await axios.get(API_URL);
      // Update the state with the fetched data
      setApiData(resp.data);
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message);
      console.log('Request configuration:', error.config);
    }
  };

  useEffect(() => {
    callGetAPI();
  }, []);

  return (
    <Table striped style={{ fontSize: '30px', textAlign: 'center', marginBottom: '20px', border: '1px solid #333' }}>
      <Table.Header style={{ background: '#8b7474', color: '#fff' }}>
        <Table.Row style={{ background: '#8b7474', color: '#fff' }}>
          <Table.HeaderCell>First Name</Table.HeaderCell>
          <Table.HeaderCell>Last Name</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Phonenumber</Table.HeaderCell>
          <Table.HeaderCell>Checked</Table.HeaderCell>
          <Table.HeaderCell>Delete</Table.HeaderCell>
          <Table.HeaderCell>Update</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body style={{ background: '#8b7474', color: '#fff' }}>
        {apiData.map((data) => (
          <Table.Row key={data.id}>
            <Table.Cell>{data.firstName}</Table.Cell>
            <Table.Cell>{data.lastName}</Table.Cell>
            <Table.Cell>{data.email}</Table.Cell>
            <Table.Cell>{data.phonenumber}</Table.Cell>
            <Table.Cell>{data.checked ? 'checked' : 'not checked'}</Table.Cell>
            <Table.Cell>
              <Button color="red" onClick={() => deleteUser(data.id)} icon>
                <FaTrash />
              </Button>
            </Table.Cell>
            <Table.Cell>
              <Button color="teal" onClick={() => updateUser(data)} icon>
                <FaPencilAlt />
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default Read;
