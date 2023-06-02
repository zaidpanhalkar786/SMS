import React, { useState } from 'react';
import './Adminskillcatalog.css'
import { Table, Modal, Form, Radio, Checkbox, Button,Segment,Header,Divider,Icon, Input, Label } from 'semantic-ui-react';
import { useNavigate } from 'react-router';
const rolesOptions = [
{ label: 'Admin', value: 'Admin' },
{ label: 'Employee', value: 'Employee' },
{ label: 'Project Manager', value: 'Project Manager' },
];

function AdminManageusers () {

const navigate = useNavigate();
 const handleGoBack=() => {
    navigate('/admin-homepage')
  }
const [users, setUsers] = useState([
{
id: 1,
firstname: 'John',
lastname: 'Smith',
email: 'john.doe@gmail.com',
role: '',
status: '',
},
{
id: 2,
firstname: 'Jane',
lastname: 'Smith',
email: 'jane.smith@gmail.com',
role: '',
status: '',
},

]);

const [selectedUser, setSelectedUser] = useState(null);
const [selectedRole, setSelectedRole] = useState('');
const [selectedStatus, setSelectedStatus] = useState('');
const [modalOpen, setModalOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

const handleEditUser = (user) => {
setSelectedUser(user);
setSelectedRole(user.role);
setSelectedStatus(user.status);
setModalOpen(true);
};

const handleSaveChanges = () => {
if (selectedUser) {
const updatedUsers = users.map((user) =>
user.id === selectedUser.id
? {
...user,
role: selectedRole,
status: selectedStatus,
}
: user
);
setUsers(updatedUsers);
setModalOpen(false);
setSelectedUser(null);
setSelectedRole('');
setSelectedStatus('');
}
};

const handleCloseModal = () => {
setModalOpen(false);
setSelectedUser(null);
setSelectedRole('');
setSelectedStatus('');
};

const handleSearch = (e) => {
setSearchQuery(e.target.value);
};

const filteredUsers = users.filter((user) => {
const { email } = user;
const normalizedQuery = searchQuery.toLowerCase().trim();
return email.toLowerCase().includes(normalizedQuery);
});

return (
  <div>
   <Segment attached style={{borderColor: 'black'}}> 
         <Header as='h1' textAlign='center' color ='purple' style={{fontSize:'40px'}}>Manage Users</Header>
         <Icon name='home' color='purple' size='big' onClick={handleGoBack} 
         style={{position:'absolute', top:'20px',left:'10px'}} />
         
      </Segment> 
  <Divider hidden /> 
<div className='usermanagement'>
<div style={{display:'flex',justifyContent:"center",alignItems:"center"}}>
 <Input 
   icon= 'search'
   iconPosition='right'
   type="text"
   placeholder="Search by email ID"
   value={searchQuery}
   onChange={handleSearch}
   style ={{width:"1000px", height:"50px"}}
  />
  </div>
<Divider hidden />  
<Divider hidden />  
  <Table celled className='usertable'>
   <Table.Header>
     <Table.Row style={{fontSize:'21px'}}>
       <Table.HeaderCell>First Name</Table.HeaderCell>
       <Table.HeaderCell>Last Name</Table.HeaderCell>
       <Table.HeaderCell>Email ID</Table.HeaderCell>
       <Table.HeaderCell>Role</Table.HeaderCell>
       <Table.HeaderCell>Status</Table.HeaderCell>
       <Table.HeaderCell>Action</Table.HeaderCell>
       </Table.Row>
       </Table.Header>

       <Table.Body style={{fontSize:'20px'}}>
       {filteredUsers.map((user) => (
        <Table.Row key={user.id}>
        <Table.Cell>{user.firstname}</Table.Cell>
        <Table.Cell>{user.lastname}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{user.role}</Table.Cell>
        <Table.Cell>{user.status}</Table.Cell>
        <Table.Cell>
          <Button color='purple' size='large' onClick={()=>handleEditUser(user)}>Edit</Button>
        </Table.Cell>
      </Table.Row>
       ))}
       </Table.Body>
       </Table>
   {selectedUser && (
   <Modal size= 'small'  open={modalOpen} onClose={handleCloseModal} style={{ padding:'20px'}}>
    <Modal.Header>Edit User</Modal.Header>
    <Modal.Content>
    <div>
    <Form>
      <Form.Field>
        <label>First Name</label>
        <input value={selectedUser.firstname} disabled />
      </Form.Field>
      <Form.Field>
        <label>Last Name</label>
        <input value={selectedUser.lastname} disabled />
      </Form.Field>
      <Form.Field>
        <label>Email ID</label>
        <input value={selectedUser.email} disabled />
      </Form.Field>
      <Form.Field>
        <Label>Role</Label>
        <Form.Group>
          {rolesOptions.map((option) => (
           <Form.Field
              key={option.value}
              control={Radio}
              label={option.label}
              value={option.value}
              checked={selectedRole === option.value}
              onChange={() => setSelectedRole(option.value)}
            />
        ))}
        </Form.Group>
      </Form.Field>
      <Form.Field>
        <label>Status</label>
        <Form.Group>
          <Form.Field
            control={Checkbox}
            label="Active"
            checked={selectedStatus === 'Active'}
            onChange={() => setSelectedStatus('Active')}
         />
          <Form.Field
            control={Checkbox}
            label="Inactive"
            checked={selectedStatus === 'Inactive'}
            onChange={() => setSelectedStatus('Inactive')}
          />
        </Form.Group>
      </Form.Field>
    </Form>
    </div>
    </Modal.Content>
    <Modal.Actions>
       <Button color='purple' onClick={handleSaveChanges}>Save</Button>
       <Button onClick={handleCloseModal}>Cancel</Button>
    </Modal.Actions>
   </Modal>
   )}
  </div> 
  </div>
)}

export default AdminManageusers;