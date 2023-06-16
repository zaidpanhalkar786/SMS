// Import the necessary dependencies
import React, { useState, useEffect } from 'react';
import { Tab, Form, Input, Button, Table, Icon, Modal,Dropdown} from 'semantic-ui-react';
import axios from 'axios';

const EmployeePage = () => {
  const [primarySkill, setPrimarySkill] = useState({
    skillId: '',
    yearsOfExperience: '', 
    certification: ''
  });
  const [primaryTableData, setPrimaryTableData] = useState([]);
  const [primarySelectedSkill, setPrimarySelectedSkill] = useState(null);

  const [secondarySkill, setSecondarySkill] = useState({
    skillId: '',
    yearsOfExperience: '', // Update the property name
    certification: ''
  });
  const [secondaryTableData, setSecondaryTableData] = useState([]);
  const [secondarySelectedSkill, setSecondarySelectedSkill] = useState(null);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteConfirmationIndex, setDeleteConfirmationIndex] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills(); // Fetch skills on component mount
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:3001/skills', {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        email: localStorage.getItem('email')
        },
        }); // Fetch skills from the backend
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handlePrimaryInputChange = (e, { name, value }) => {
    setPrimarySkill({ ...primarySkill, [name]: value });
  };

  const handleSecondaryInputChange = (e, { name, value }) => {
    setSecondarySkill({ ...secondarySkill, [name]: value });
  };

  const handlePrimarySave = () => {
    setPrimaryTableData([...primaryTableData, primarySkill]);
    setPrimarySkill({ skillId: '', yearsOfExperience: '', certification: '' });
  };

  const handleSecondarySave = () => {
    if (secondaryTableData.length >= 10) {
      setAlertMessage('Up to 10 secondary skills can be added.');
      return;
    }

    setSecondaryTableData([...secondaryTableData, secondarySkill]);
    setSecondarySkill({ skillId: '', yearsOfExperience: '', certification: '' });
  };

  const handlePrimaryEdit = (index) => {
    const skillToEdit = primaryTableData[index];
    setPrimarySelectedSkill(skillToEdit);
    setPrimarySkill(skillToEdit);
  };

  const handleSecondaryEdit = (index) => {
    const skillToEdit = secondaryTableData[index];
    setSecondarySelectedSkill(skillToEdit);
    setSecondarySkill(skillToEdit);
  };

  const handlePrimaryUpdate = () => {
    const updatedTableData = [...primaryTableData];
    const skillIndex = updatedTableData.findIndex((skill) => skill === primarySelectedSkill);
    updatedTableData[skillIndex] = primarySkill;
    setPrimaryTableData(updatedTableData);
    setPrimarySelectedSkill(null);
    setPrimarySkill({ skillId: '', yearsOfExperience: '', certification: '' });
  };

  const handleSecondaryUpdate = () => {
    const updatedTableData = [...secondaryTableData];
    const skillIndex = updatedTableData.findIndex((skill) => skill === secondarySelectedSkill);
    updatedTableData[skillIndex] = secondarySkill;
    setSecondaryTableData(updatedTableData);
    setSecondarySelectedSkill(null);
    setSecondarySkill({ skillId: '', yearsOfExperience: '', certification: '' });
  };

  const handlePrimaryDelete = (index) => {
    setDeleteConfirmationOpen(true);
    setDeleteConfirmationIndex(index);
  };

  const handleSecondaryDelete = (index) => {
    setDeleteConfirmationOpen(true);
    setDeleteConfirmationIndex(index);
  };

  const handleDeleteConfirmation = () => {
    if (deleteConfirmationIndex !== null) {
      if (deleteConfirmationIndex < primaryTableData.length) {
        const updatedTableData = [...primaryTableData];
        updatedTableData.splice(deleteConfirmationIndex, 1);
        setPrimaryTableData(updatedTableData);
      } else {
        const updatedTableData = [...secondaryTableData];
        updatedTableData.splice(deleteConfirmationIndex - primaryTableData.length, 1);
        setSecondaryTableData(updatedTableData);
      }
      setDeleteConfirmationOpen(false);
      setDeleteConfirmationIndex(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setDeleteConfirmationIndex(null);
  };

  const handleSaveSkills = async () => {
    try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        
        
        // Save primary skill
        const primarySkillResponse = await axios.post(
          'http://localhost:3001/primaryskill',
          {
            email,
            primarySkill: {
                skillId: primarySkill.skillId, // Update this line
                
                yearsOfExperience: primarySkill.yearsOfExperience, // Update this line
                certification: primarySkill.certification,
              },

          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        
        if (primarySkillResponse.status === 200) { 
            console.log('Saved primary skill:', primarySkillResponse.data);
      } else {
        console.error('Failed to save primary skill');
        return;
      }
      
        
        // Save secondary skills
        const secondarySkillsResponse = await axios.post(
          'http://localhost:3001/secondaryskills',
          {
            secondarySkills: secondaryTableData.map(skill => ({
                skillId: skill.skillId, // Update this line
                
                yearsOfExperience: skill.yearsOfExperience, // Update this line
              certification: skill.certification
            }))
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        console.log('Saved secondary skills:', secondarySkillsResponse.data);
        
        // Clear the skill tables after successful save
        setPrimaryTableData([]);
        setSecondaryTableData([]);
      } catch (error) {
        console.error('Error saving employee skills:', error);
      }
  };

  const renderSkillTab = (
    skill,
    handleInputChange,
    handleSaveSkills,
    handleEdit,
    handleUpdate,
    handleDelete,
    tableData,
    selectedSkill
  ) => (
    <Tab.Pane>
      <Form>
        <Form.Group widths="equal">
        <Form.Dropdown
              
              fluid
              search
              selection
              name="skillId"
              placeholder="Select a skill"
              options={skills.map((skill) => ({
                key: skill._id,
                value: skill._id,
                text: skill.name
              }))}
              value={skill.skillId}
              onChange={handleInputChange}
            />
          <Form.Input
            name="yearsOfExperience"
            placeholder="Years of Experience"
            value={skill.yearsOfExperience}
            onChange={handleInputChange}
          />
          <Form.Input
            name="certification"
            placeholder="Certification"
            value={skill.certification}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          {selectedSkill ? (
            <Form.Button primary onClick={handleUpdate}>
              Update
            </Form.Button>
          ) : (
            <Form.Button primary onClick={handleSaveSkills}>
              Save
            </Form.Button>
          )}
        </Form.Group>
      </Form>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Skill Name</Table.HeaderCell>
           
            <Table.HeaderCell>Years of Experience</Table.HeaderCell>
            <Table.HeaderCell>Certification</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableData.map((skill, index) => (
            <Table.Row key={index}>
              <Table.Cell>{skill.skillId}</Table.Cell>
            
              <Table.Cell>{skill.yearsOfExperience}</Table.Cell>
              <Table.Cell>{skill.certification}</Table.Cell>
              <Table.Cell>
                <Icon
                  name="edit"
                  onClick={() => handleEdit(index)}
                  style={{ cursor: 'pointer' }}
                />
                <Icon
                  name="delete"
                  onClick={() => handleDelete(index)}
                  style={{ cursor: 'pointer' }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Modal open={deleteConfirmationOpen} onClose={handleDeleteCancel} size="tiny">
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          Are you sure you want to delete this skill?
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleDeleteCancel}>
            No
          </Button>
          <Button positive onClick={handleDeleteConfirmation}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
      {alertMessage && (
        <div className="alert">{alertMessage}</div>
      )}
    </Tab.Pane>
  );

  return (
    <Tab
      menu={{ secondary: true, pointing: true }}
      panes={[
        {
          menuItem: 'Primary Skill',
          render: () =>
            renderSkillTab(
              primarySkill,
              handlePrimaryInputChange,
              handlePrimarySave,
              handlePrimaryEdit,
              handlePrimaryUpdate,
              handlePrimaryDelete,
              primaryTableData,
              primarySelectedSkill
            )
        },
        {
          menuItem: 'Secondary Skill',
          render: () =>
            renderSkillTab(
              secondarySkill,
              handleSecondaryInputChange,
              handleSecondarySave,
              handleSecondaryEdit,
              handleSecondaryUpdate,
              handleSecondaryDelete,
              secondaryTableData,
              secondarySelectedSkill
            )
        }
      ]}
    />
  );
};

export default EmployeePage;