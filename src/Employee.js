import React, { useState,useEffect } from 'react';
import { Button, Form, Icon, Modal, Table, Tab} from 'semantic-ui-react';
import axios from 'axios';

const PrimarySkillForm = ({ primarySkillsTable, setPrimarySkillsTable }) => {
  const [primarySkill, setPrimarySkill] = useState({
    skillId: '',
    yearsOfExperience: '',
    certification: '',
  });


  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedPrimarySkillIndex, setSelectedPrimarySkillIndex] = useState(null);
  const [skillOptions, setSkillOptions] = useState([]);

  useEffect(() => {
    fetchSkills(); // Fetch skills on component mount
    fetchEmployeeSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:3001/skills', {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        email: localStorage.getItem('email')
        },
        }); // Fetch skills from the backend
    setSkillOptions(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };


  const fetchEmployeeSkills = async () => {
    try {
      const response = await axios.get('http://localhost:3001/primaryskill',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        },{
      
            email: localStorage.getItem('email')
          }
      ); // Fetch skills from the backend
       const employeeSkills = response.data;
       const primarySkills = employeeSkills.map(skill => ({
        skillId: skill.skillId._id,
        yearsOfExperience: skill.yearsOfExperience,
        certification: skill.certification
      }));
      setPrimarySkillsTable(primarySkills)
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };
















  const handleInputChange = (event, { name, value }) => {
    if (name === 'yearsOfExperience') {
      const regex = /^[1-9][0-9]?$|^100$|^[1-9][0-9]?(\.[0-9])?$|^100(\.[0-9])?$/;
  
      if (!regex.test(value)) {
        // Display error message for invalid years of experience input
        setPrimarySkill((prevState) => ({
          ...prevState,
          [name]: value,
          error: 'Please enter a valid years of experience.',
        }));
      } else {
        setPrimarySkill((prevState) => ({
          ...prevState,
          [name]: value,
          error: '', // Clear the error message if the input is valid
        }));
      }
    }else {
      setPrimarySkill((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSavePrimarySkill = async () => {

    if (!primarySkill.skillId || !primarySkill.yearsOfExperience) {
      alert('Please fill all the details.');
      return;
    }

    if (primarySkillsTable.length > 0) {
      alert('Only one primary skill is allowed.');
      return;
    }

    if (primarySkill.error) {
      alert('Please enter a valid years of experience.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/primaryskill', {
        email: localStorage.getItem('email'),
        primarySkill: primarySkill,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
    setPrimarySkillsTable((prevState) => [...prevState, primarySkill]);
    setPrimarySkill({ skillId: '', yearsOfExperience: '', certification: ''});
  };
} catch (error) {
  console.error('Error saving primary skill:', error);
}
  }

  const handleEditPrimarySkill = (index) => {
    const selectedPrimarySkill = primarySkillsTable[index];
    setPrimarySkill(selectedPrimarySkill);
    setIsEditMode(true);
    setEditIndex(index);
  };

  const handleUpdatePrimarySkill = async () => {
    if (!primarySkill.skillId || !primarySkill.yearsOfExperience) {
      alert('Please fill all the details.');
      return;
    }
  
    if (primarySkill.error) {
      alert('Please enter a valid years of experience.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/primaryskill/${primarySkill.skillId}`,
        {
          email: localStorage.getItem('email'),
          primarySkill: primarySkill,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );


      if (response.status === 200) {
        setPrimarySkillsTable((prevState) => {
          const updatedSkills = [...prevState];
          updatedSkills[editIndex] = primarySkill;
          return updatedSkills;
        });
        setPrimarySkill({ skillId: '', yearsOfExperience: '', certification: '' });
        setIsEditMode(false);
        setEditIndex(null);
      }
    } catch (error) {
      console.error('Error updating primary skill:', error);
    }
  };

  const handleDeletePrimarySkill = (index) => {
    setSelectedPrimarySkillIndex(index);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDeletePrimarySkill = async () => {
     setPrimarySkillsTable((prevState) =>
      prevState.filter((_, i) => i !== selectedPrimarySkillIndex)
    );
    setDeleteConfirmationOpen(false);
  };

  const handleCancelDeletePrimarySkill = () => {
    setSelectedPrimarySkillIndex(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <div>
      <div className="form-container">
        <Form>
        <Form.Group widths="equal">
          <Form.Dropdown
            fluid
            search
            selection
            name="skillId"
            placeholder="Select a skill"
           
            options={skillOptions.map((skill) => ({
                key: skill._id,
                value: skill._id,
                text: skill.name,
              }))}
              value={primarySkill.skillId}
            onChange={handleInputChange}
          />
          <Form.Input
            label="Years of Experience"
            name="yearsOfExperience"
            value={primarySkill.yearsOfExperience}
            onChange={handleInputChange}
            error={primarySkill.error ? primarySkill.error : false}
          />
          <Form.Input
            label="Certification"
            name="certification"
            value={primarySkill.certification}
            onChange={handleInputChange}
          />
          </Form.Group>
          <Form.Group>
          {!isEditMode ? (
            <Button primary onClick={handleSavePrimarySkill}>
              Save
            </Button>
          ) : (
            <Button primary onClick={handleUpdatePrimarySkill}>
              Update
            </Button>
          )}
          </Form.Group>
        </Form>
      </div>

      <div className="table-container">
        {primarySkillsTable.length > 0 && (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Skill ID</Table.HeaderCell>
                <Table.HeaderCell>Years of Experience</Table.HeaderCell>
                <Table.HeaderCell>Certification</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {primarySkillsTable.map((skill, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{skill.skillId}</Table.Cell>
                  <Table.Cell>{skill.yearsOfExperience}</Table.Cell>
                  <Table.Cell>{skill.certification}</Table.Cell>
                  <Table.Cell>
                    <Icon
                      name="edit"
                      onClick={() => handleEditPrimarySkill(index)}
                    />
                    <Icon
                      name="trash"
                      onClick={() => handleDeletePrimarySkill(index)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      <Modal open={deleteConfirmationOpen}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this primary skill?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleCancelDeletePrimarySkill}>
            No
          </Button>
          <Button positive onClick={handleConfirmDeletePrimarySkill}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

const SecondarySkillForm = ({ secondarySkillsTable, setSecondarySkillsTable }) => {
  const [secondarySkill, setSecondarySkill] = useState({
    skillId: '',
    yearsOfExperience: '',
    certification: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedSecondarySkillIndex, setSelectedSecondarySkillIndex] = useState(null);

  const [skillOptions, setSkillOptions] = useState([]);

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
    setSkillOptions(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };
    








  const handleInputChange = (event, { name, value }) => {

  if (name === 'yearsOfExperience') {
    const regex = /^[1-9][0-9]?$|^100$|^[1-9][0-9]?(\.[0-9])?$|^100(\.[0-9])?$/;

    if (!regex.test(value)) {
      // Display error message for invalid years of experience input
      setSecondarySkill((prevState) => ({
        ...prevState,
        [name]: value,
        error: 'Please enter a valid years of experience.',
      }));
    } else {
      setSecondarySkill((prevState) => ({
        ...prevState,
        [name]: value,
        error: '', // Clear the error message if the input is valid
      }));
    }
  }else {
    setSecondarySkill((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
};


  const handleSaveSecondarySkill = async () => {
    if (!secondarySkill.skillId) {
      alert('Please fill skill name.');
      return;
    }

    if (secondarySkillsTable.length >= 10) {
      alert('Up to 10 secondary skills are allowed.');
      return;
    }

    if (secondarySkill.error) {
      alert('Please enter a valid years of experience.');
      return;
    }

    if (secondarySkillsTable.some((skill) => skill.skillId === secondarySkill.skillId)) {
      alert('Secondary skill already added. Please enter a new secondary skill.');
      return;
    }  

    //setSecondarySkillsTable((prevState) => [...prevState, secondarySkill]);
    //setSecondarySkill({ skillId: '', yearsOfExperience: '', certification: ''});
        try{

          const token = localStorage.getItem('token');
          const email = localStorage.getItem('email');
        const response = await axios.post(
          'http://localhost:3001/secondaryskill',
          {
                email : email,
                secondarySkills: [secondarySkill],
          },{
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
        if (response.status === 200){
        setSecondarySkillsTable((prevState) => [...prevState, secondarySkill]);
          setSecondarySkill({ skillId: '', yearsOfExperience: '', certification: ''});
         }
        }catch(error){
          console.error('Error saving secondary skills:', error);
        }
  }


  const handleEditSecondarySkill = (index) => {
    const selectedSecondarySkill = secondarySkillsTable[index];
    setSecondarySkill(selectedSecondarySkill);
    setIsEditMode(true);
    setEditIndex(index);
  };
  const handleUpdateSecondarySkill = () => {
    if (secondarySkillsTable.some((skill, index) => index !== editIndex && skill.skillId === secondarySkill.skillId)) {
      alert('Secondary skill already exists. Please enter a different skill ID.');
      return;
    }
  
    setSecondarySkillsTable((prevState) => {
      const updatedSkills = [...prevState];
      updatedSkills[editIndex] = secondarySkill;
      return updatedSkills;
    });
    setSecondarySkill({ skillId: '', yearsOfExperience: '', certification: '' });
    setIsEditMode(false);
    setEditIndex(null);
  };

  const handleDeleteSecondarySkill = (index) => {
    setSelectedSecondarySkillIndex(index);
    setDeleteConfirmationOpen(true);
  
  };

  const handleConfirmDeleteSecondarySkill = () => {
    setSecondarySkillsTable((prevState) =>
      prevState.filter((_, i) => i !== selectedSecondarySkillIndex)
    );
    setDeleteConfirmationOpen(false);
  };

  const handleCancelDeleteSecondarySkill = () => {
    setSelectedSecondarySkillIndex(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <div>
      <div className="form-container">
        <Form>
            <Form.Group widths='equal'>
        <Form.Dropdown
        
            label="Skill ID"
            name="skillId"
            value={secondarySkill.skillId}
            options={skillOptions.map((skill) => ({
              key: skill._id,
              value: skill._id,
              text: skill.name,
            }))}
            placeholder="Select a skill"
            fluid
            search
            selection
            clearable
            onChange={handleInputChange}
          />
          <Form.Input
            label="Years of Experience"
            name="yearsOfExperience"
            value={secondarySkill.yearsOfExperience}
            onChange={handleInputChange}
            error={secondarySkill.error ? secondarySkill.error : false}
          />
          <Form.Input
            label="Certification"
            name="certification"
            value={secondarySkill.certification}
            onChange={handleInputChange}
          />
         </Form.Group>
         <Form.Group>
          {!isEditMode ? (
            <Button primary onClick={handleSaveSecondarySkill}>
              Save
            </Button>
          ) : (
            <Button primary onClick={handleUpdateSecondarySkill}>
              Update
            </Button>
          )}
          </Form.Group>
        </Form>
      </div>

      <div className="table-container">
        {secondarySkillsTable.length > 0 && (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Skill ID</Table.HeaderCell>
                <Table.HeaderCell>Years of Experience</Table.HeaderCell>
                <Table.HeaderCell>Certification</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {secondarySkillsTable.map((skill, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{skill.skillId}</Table.Cell>
                  <Table.Cell>{skill.yearsOfExperience}</Table.Cell>
                  <Table.Cell>{skill.certification}</Table.Cell>
                  <Table.Cell>
                    <Icon
                      name="edit"
                      onClick={() => handleEditSecondarySkill(index)}
                    />
                    <Icon
                      name="trash"
                      onClick={() => handleDeleteSecondarySkill(index)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      <Modal open={deleteConfirmationOpen}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this secondary skill?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleCancelDeleteSecondarySkill}>
            No
          </Button>
          <Button positive onClick={handleConfirmDeleteSecondarySkill}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};



  const Employee = () => {
    const [primarySkillsTable, setPrimarySkillsTable] = useState([]);
    const [secondarySkillsTable, setSecondarySkillsTable] = useState([]);

    const panes = [
        {
          menuItem: 'Primary Skills',
          render: () => (
            <Tab.Pane>
              <PrimarySkillForm
                primarySkillsTable={primarySkillsTable}
                setPrimarySkillsTable={setPrimarySkillsTable}
              />
            </Tab.Pane>
          ),
        },
        {
          menuItem: 'Secondary Skills',
          render: () => (
            <Tab.Pane>
              <SecondarySkillForm
              secondarySkillsTable={secondarySkillsTable}
              setSecondarySkillsTable={setSecondarySkillsTable}
            />
          </Tab.Pane>
        ),
      },
    ];
  
    return (
      <div>
        <Tab panes={panes} />
        </div>
  );
};

export default Employee;