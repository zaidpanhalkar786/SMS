
import { useState } from "react"
import { Button, Divider, Form, Grid, Image, Message, Segment } from 'semantic-ui-react'
import Adminfrontpage from "./Adminfrontpage";
import axios from "axios";

function MyLoginPage() {
    
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [isloggedIn, setIsLoggedIn] =useState(false)
    const [errorMessage,setErrorMessage] =useState('')

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        };
        
        const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        };
    const handlelogin = async() => {

      try {
        const response = await axios.post('http://localhost:3001/signin', {
        email:username,
        password,
        });

        const token = response.data.token;
        
        if (token) {
        setIsLoggedIn(true)
        localStorage.setItem('token', token);
        console.log('Login successful!');
      
        } else {
        setErrorMessage('Invalid username or password');
        }
        } catch (error) {
        setErrorMessage('An error occurred. Please try again later.');
        }

    }
    if (isloggedIn) {
        return <Adminfrontpage />
    }
    return(
  <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 700 }}>
      
        <Image centered src='Accenture icon.png' size='medium' />
     <Divider hidden />
      <Form size='large'>
        <Segment stacked>
          <Form.Input fluid
          value ={username}
           icon='user' iconPosition='left' 
           placeholder='E-mail address' 
           type='email' 
           onChange={handleUsernameChange}
           style= {{fontSize:'25px'}} />
          <Form.Input
            fluid
            value={password}
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
            onChange={handlePasswordChange}
            style= {{fontSize:'25px'}}
          />

          <Button color='purple' fluid size='massive' onClick={handlelogin}>
            Login
          </Button>
        </Segment>
      </Form>
      <Message style={{fontSize: '20px'}}>
        New to us? <a href='/signup-page'>Sign Up</a>
      </Message>
    </Grid.Column>
  </Grid>
    )
    }
export default MyLoginPage;
