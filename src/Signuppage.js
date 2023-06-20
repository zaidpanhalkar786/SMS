import React, { useState } from 'react';
import { Button, Form, Grid, Header, Message, Modal, Segment } from 'semantic-ui-react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function SignUpPage () {
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [employeelevel,setEmployeelevel] = useState('');
const [mobileno,setMobileno] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [showModal, setShowModal] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();

const handleSignUp = async() => {
if (!firstName || !lastName || !email || !mobileno || !employeelevel || !password || !confirmPassword ) {
setErrorMessage('Please fill in all fields.');
return;
}



if (!email.includes('@')) {
setErrorMessage('Invalid email address.');
return;
}

//isNaN() function to check if the mobileno value is not a number.
if (isNaN(mobileno) || mobileno.length !== 10) {   
    setErrorMessage('Invalid mobile number. Please enter a 10-digit number.');
    return;
  }

if (password !== confirmPassword) {
setErrorMessage('Passwords do not match.');
return;
}

try {
    // Send a POST request to the backend API
    await axios.post('http://localhost:3001/signup', {
    firstname: firstName,
    lastname : lastName,
    email,
    password,
    mobileno,
    employeelevel,
    });
    setShowModal(true);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMobileno('');
    setEmployeelevel('');
    setErrorMessage('');
    
    } catch (error) {
    if (error.response) {
    setErrorMessage(error.response.data.message);
    alert("This email address is already registered")
    } else {
    setErrorMessage('An error occurred. Please try again later.');
    alert("An error occurred. Please try again later.")
    }
    }
};

const handleModalClose = () => {
navigate('/')
setShowModal(false);

};

return (
<Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
<Grid.Column style={{ maxWidth: 650}}>
<Header as="h2" textAlign="center">
Sign Up
</Header>
<Form size='large'>
<Segment stacked>
<Form.Input
fluid
icon="user"
iconPosition="left"
placeholder="First Name"
value={firstName}
onChange={(e) => setFirstName(e.target.value)}
style= {{fontSize:'23px'}}
/>
<Form.Input
fluid
icon="user"
iconPosition="left"
placeholder="Last Name"
value={lastName}
onChange={(e) => setLastName(e.target.value)}
style= {{fontSize:'23px'}}
/>
<Form.Input
fluid
icon="mail"
iconPosition="left"
placeholder="Email"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
style= {{fontSize:'23px'}}
/>
<Form.Input
fluid
icon="phone"
iconPosition="left"
placeholder="Mobile No."
type="tel"
value={mobileno}
onChange={(e) => setMobileno(e.target.value)}
style= {{fontSize:'23px'}}
/>
<Form.Input
fluid
icon="briefcase"
iconPosition="left"
placeholder="Designation Level"
type="text"
value={employeelevel}
onChange={(e) => setEmployeelevel(e.target.value)}
style= {{fontSize:'23px'}}
/>
<Form.Input
fluid
icon="lock"
iconPosition="left"
placeholder="Password"
type={showPassword ? "text" : "password"}
value={password}
onChange={(e) => setPassword(e.target.value)}
action={{
icon: showPassword ? "eye slash" : "eye",
onClick: () => setShowPassword(!showPassword),
}}
style= {{fontSize:'23px'}}
/>
<Form.Input
fluid
icon="lock"
iconPosition="left"
placeholder="Confirm Password"
type={showPassword ? "text" : "password"}
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
action={{
icon: showPassword ? "eye slash" : "eye",
onClick: () => setShowPassword(!showPassword),
}}
style= {{fontSize:'23px'}}
/>

{errorMessage && <Message size='big' negative>{errorMessage}</Message>}

<Button color="purple" fluid size='massive' onClick={handleSignUp}>
Save
</Button>
</Segment>
</Form>
</Grid.Column>

<Modal size='small'  open={showModal} onClose={handleModalClose}>
<Modal.Header style={{fontSize:'20px'}}>Registration Successful</Modal.Header>
<Modal.Content style={{fontSize:'19px'}}>
<p>Your registration has been successfully completed.</p>
</Modal.Content>
<Modal.Actions>
<Button color="purple" onClick={handleModalClose}>
OK
</Button>
</Modal.Actions>
</Modal>
</Grid>
);
};

export default SignUpPage;