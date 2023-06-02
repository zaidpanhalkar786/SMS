import React from 'react'
import './Adminskillcatalog.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Form,Segment,Header,Input, Divider,Icon,Modal } from 'semantic-ui-react';
function Adminskillcatalog() {
const [skills, setSkills] = useState([]);
const [currentSkill, setCurrentSkill] = useState("");
const [currentDescription, setCurrentDescription] = useState("");
const [showUpdateButton, setShowUpdateButton] = useState(false);
const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
const [selectedSkillToDelete, setSelectedSkillToDelete] = useState(null);
const [selectedSkillToUpdate, setSelectedSkillToUpdate] = useState(null);
const [searchQuery,setSearchQuery] = useState("");
const navigate = useNavigate();

const handleGoBack=() => {
  navigate('/admin-homepage')
}
const handleSave = () => {
  const trimmedSkill = currentSkill.toLowerCase().trim();
  
  if (trimmedSkill === "" || currentDescription.trim() === "") {
  alert ("Please enter all the details")
  return;
  }
  const existingSkill = skills.find(
  (skill) => skill.name.toLowerCase().trim() === trimmedSkill
  );
  
  if (existingSkill) {
  alert ("Skill exists")
  return;
  }
  
  const newSkill = {
  name: currentSkill,
  description: currentDescription,
  };
  
  setSkills([...skills, newSkill]);
  setCurrentSkill("");
  setCurrentDescription("");
  };

  const handleUpdate = (skill) => {
    setCurrentSkill(skill.name);
    setCurrentDescription(skill.description);
    setShowUpdateButton(true);
    setSelectedSkillToUpdate({ ...skill });
    };
    
    const handleUpdateSave = () => {
      const trimmedSkill = currentSkill.toLowerCase().trim();
      
      if (trimmedSkill === "" || currentDescription.trim() === "") {
      alert("Please enter all the details");
      return;
      }
      
      const existingSkill = skills.find(
      (skill) =>
      skill.name.toLowerCase().trim() === trimmedSkill &&
      skill.name !== selectedSkillToUpdate.name
      );
      
      if (existingSkill) {
      alert("Skill already exists");
      return;
      }
      
      const updatedSkills = skills.map((skill) => {
      if (skill.name === selectedSkillToUpdate.name) {
      return {
      name: currentSkill,
      description: currentDescription,
      };
      }
      return skill;
      });
      
      setSkills(updatedSkills);
      setCurrentSkill("");
      setCurrentDescription("");
      setShowUpdateButton(false);
      setSelectedSkillToUpdate(null); // Reset the selected skill
      };
    const handleDeleteConfirmation = (skill) => {
    setSelectedSkillToDelete(skill);
    setShowDeleteConfirmation(true);
    };
    
    const handleDelete = () => {
    const updatedSkills = skills.filter(
    (skill) => skill.name !== selectedSkillToDelete.name
    );
    
    setSkills(updatedSkills);
    setShowDeleteConfirmation(false);
    };
    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
      };
      
    const filteredSkills = skills.filter((skill) => {
    const { name, description } = skill;
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return (
    name.toLowerCase().includes(normalizedQuery) ||
    description.toLowerCase().includes(normalizedQuery)     
     );
      });
  return (
  <div className='skillcatalog'>
      <Segment attached style={{borderColor: 'black'}}> 
         <Header as='h1' textAlign='center' color ='purple' style={{fontSize:'40px'}}>Skill Catalog</Header>
         <Icon name='home' color='purple' size='big' onClick={handleGoBack} 
         style={{position:'absolute', top:'20px',left:'10px'}} />
         
      </Segment> 
      <Divider hidden />
      <Form className='skillform'>
      
      <Form.Input
       label={<label style={{fontSize: '20px'}}>Skill Name</label>}
       placeholder="Enter skill name"
       value={currentSkill}
       onChange={(e) => setCurrentSkill(e.target.value)}
       style={{width: '800px', fontSize: '20px'}}
  />
  <Divider hidden />
  <Form.TextArea
  className='textarea'
  label={<label style={{fontSize: '20px'}}>Skill Description</label>}
  placeholder="Enter skill description"
  value={currentDescription}
  onChange={(e) => setCurrentDescription(e.target.value)}
  style={{width: '800px', fontSize: '20px', height: '150px'}}
  
  />
  
  <Divider hidden />
  {
    showUpdateButton ? (
      <Button color='purple' size='huge' onClick={handleUpdateSave}>Update</Button>
    ):(
      <Button color='purple' size='huge' onClick={handleSave}>Save</Button>
    )
  }
  </Form>
  <Divider />

  <div style={{display:'flex',justifyContent:"center",alignItems:"center"}}>
 <Input 
   icon= 'search'
   iconPosition='right'
   type="text"
   placeholder="Search by skill name"
   value={searchQuery}
   onChange={handleSearch}
   style ={{width:"1000px", height:"50px"}}
  />
  </div>
  <Table celled border='5' className='skilltable'>
  <Table.Header>
      <Table.Row >
          <Table.HeaderCell style={{fontSize:'20px'}}>Skill Name</Table.HeaderCell>
          <Table.HeaderCell style={{fontSize:'20px'}}>Skill Description</Table.HeaderCell>
          <Table.HeaderCell style={{fontSize:'20px'}}>Actions</Table.HeaderCell>
      </Table.Row>
      </Table.Header>
      <Table.Body>
       {filteredSkills.map((skill) => (
           <Table.Row key={skill.name}>
             <Table.Cell style={{fontSize:'20px'}}>{skill.name}</Table.Cell>
             <Table.Cell style={{fontSize:'20px'}}>{skill.description}</Table.Cell>
             <Table.Cell>
              <Icon name= 'edit' onClick={() => handleUpdate(skill)} />
              <Icon name= 'trash' onClick={() => handleDeleteConfirmation(skill)} />
             </Table.Cell>
           </Table.Row>
       ))}
       </Table.Body>
       </Table>


<Modal
open={showDeleteConfirmation}
size="mini"
dimmer="blurring"
onClose={() => setShowDeleteConfirmation(false)}
>
<Modal.Header>Confirm Deletion</Modal.Header>
<Modal.Content>
<p>Are you sure you want to delete this skill?</p>
</Modal.Content>
<Modal.Actions>
<Button negative onClick={() => setShowDeleteConfirmation(false)}>
No
</Button>
<Button positive onClick={handleDelete}>
Yes
</Button>
</Modal.Actions>
</Modal>
       </div>
  );
  };
  
  export default Adminskillcatalog;