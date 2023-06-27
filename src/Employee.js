import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './Adminskillcatalog.css'
import {
  Button,
  Form,
  Icon,
  Modal,
  Table,
  Tab,
  Segment,
  Image,
  Header,
  Divider
} from 'semantic-ui-react'
import axios from 'axios'

const PrimarySkillForm = ({ primarySkillsTable, setPrimarySkillsTable }) => {
  PrimarySkillForm.propTypes = {
    primarySkillsTable: PropTypes.array.isRequired,
    setPrimarySkillsTable: PropTypes.func.isRequired
  }

  const [primarySkill, setPrimarySkill] = useState({
    skillId: '',
    yearsOfExperience: '',
    certification: ''
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  // const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  // const [selectedPrimarySkillIndex, setSelectedPrimarySkillIndex] =
  useState(null)
  const [skillOptions, setSkillOptions] = useState([])
  // const [fetchedPrimarySkill, setFetchedPrimarySkill] = useState(null);

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:3001/skills', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          email: localStorage.getItem('email')
        }
      }) // Fetch skills from the backend
      setSkillOptions(response.data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  const handleInputChange = (event, { name, value }) => {
    if (name === 'yearsOfExperience') {
      const regex =
        /^[1-9][0-9]?$|^100$|^[1-9][0-9]?(\.[0-9])?$|^100(\.[0-9])?$/

      if (!regex.test(value)) {
        // Display error message for invalid years of experience input
        setPrimarySkill((prevState) => ({
          ...prevState,
          [name]: value,
          error: 'Please enter a valid years of experience.'
        }))
      } else {
        setPrimarySkill((prevState) => ({
          ...prevState,
          [name]: value,
          error: '' // Clear the error message if the input is valid
        }))
      }
    } else {
      setPrimarySkill((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const handleSavePrimarySkill = async () => {
    if (!primarySkill.skillId || !primarySkill.yearsOfExperience) {
      alert('Please fill all the details.')
      return
    }

    if (primarySkillsTable.length > 0) {
      alert('Only one primary skill is allowed.')
      return
    }

    if (primarySkill.error) {
      alert('Please enter a valid years of experience.')
      return
    }
    try {
      const selectedSkill = skillOptions.find(
        (skill) => skill._id === primarySkill.skillId
      )

      //   const skillname = selectedSkill.name

      //   console.log(skillname)
      const response = await axios.post(
        'http://localhost:3001/primaryskill',
        {
          email: localStorage.getItem('email'),
          mobileno: localStorage.getItem('mobileno'),
          employeelevel: localStorage.getItem('employeelevel'),
          Name: localStorage.getItem('Name'),
          primarySkill: {
            skillId: selectedSkill._id, // Save the skillId
            skillName: selectedSkill.name, // Save the skill name
            yearsOfExperience: primarySkill.yearsOfExperience,
            certification: primarySkill.certification
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.status === 200) {
        setPrimarySkillsTable((prevState) => [...prevState, primarySkill])
        setPrimarySkill({
          skillId: '',
          yearsOfExperience: '',
          certification: ''
        })
      }
    } catch (error) {
      console.error('Error saving primary skill:', error)
    }
  }

  const handleEditPrimarySkill = (index) => {
    const selectedPrimarySkill = primarySkillsTable[index]
    setPrimarySkill(selectedPrimarySkill)
    setIsEditMode(true)
    setEditIndex(index)
  }

  const handleUpdatePrimarySkill = async () => {
    if (!primarySkill.skillId || !primarySkill.yearsOfExperience) {
      alert('Please fill all the details.')
      return
    }

    if (primarySkill.error) {
      alert('Please enter a valid years of experience.')
      return
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/primaryskill/${primarySkill.skillId}`,
        {
          email: localStorage.getItem('email'),
          primarySkill: primarySkill
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.status === 200) {
        setPrimarySkillsTable((prevState) => {
          const updatedSkills = [...prevState]
          updatedSkills[editIndex] = primarySkill
          return updatedSkills
        })
        setPrimarySkill({
          skillId: '',
          yearsOfExperience: '',
          certification: ''
        })
        setIsEditMode(false)
        setEditIndex(null)
      }
    } catch (error) {
      console.error('Error updating primary skill:', error)
      alert('Skill exist as Secondary skill')
      // return
    }
  }

  // const handleDeletePrimarySkill = (index) => {
  //   setSelectedPrimarySkillIndex(index);
  //   setDeleteConfirmationOpen(true);
  // };

  // const handleConfirmDeletePrimarySkill = async () => {
  //    setPrimarySkillsTable((prevState) =>
  //     prevState.filter((_, i) => i !== selectedPrimarySkillIndex)
  //   );
  //   setDeleteConfirmationOpen(false);
  // };

  // const handleCancelDeletePrimarySkill = () => {
  //   setSelectedPrimarySkillIndex(null);
  //   setDeleteConfirmationOpen(false);
  // };

  return (
    <div>
      <div className="form-container">
        <Form>
          <Form.Group widths="equal">
            <Form.Dropdown
              fluid
              search
              selection
              clearable
              label={
                <label style={{ fontSize: '20px', marginBottom: '18px' }}>
                  Skill Name
                </label>
              }
              name="skillId"
              placeholder="Select a skill"
              options={skillOptions.map((skill) => ({
                key: skill._id,
                value: skill._id,
                text: skill.name
              }))}
              value={primarySkill.skillId}
              onChange={handleInputChange}
              style={{ fontSize: '20px' }}
              required
            />
            <Form.Input
              label={
                <label style={{ fontSize: '20px', marginBottom: '18px' }}>
                  Years of Experience
                </label>
              }
              name="yearsOfExperience"
              value={primarySkill.yearsOfExperience}
              onChange={handleInputChange}
              error={primarySkill.error ? primarySkill.error : false}
              style={{ fontSize: '20px' }}
              required
            />
            <Form.Input
              label={
                <label style={{ fontSize: '20px', marginBottom: '18px' }}>
                  Certification
                </label>
              }
              name="certification"
              value={primarySkill.certification}
              onChange={handleInputChange}
              style={{ fontSize: '20px' }}
            />
          </Form.Group>
          <Divider hidden />
          <Form.Group>
            {!isEditMode ? (
              <Button
                style={{ marginLeft: '10px' }}
                color="purple"
                size="huge"
                onClick={handleSavePrimarySkill}
              >
                Save
              </Button>
            ) : (
              <Button
                style={{ marginLeft: '10px' }}
                color="purple"
                size="huge"
                onClick={handleUpdatePrimarySkill}
              >
                Update
              </Button>
            )}
          </Form.Group>
        </Form>
      </div>
      <Divider style={{ margin: '40px', backgroundColor: 'black' }} />
      <div className="table-container">
        <h2 style={{ color: 'purple' }}>Primary Skill Details</h2>

        {primarySkillsTable.length > 0 && (
          <Table celled border="5" className="skilltable">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={5} style={{ fontSize: '20px' }}>
                  Skill ID
                </Table.HeaderCell>
                <Table.HeaderCell width={5} style={{ fontSize: '20px' }}>
                  Years of Experience
                </Table.HeaderCell>
                <Table.HeaderCell width={5} style={{ fontSize: '20px' }}>
                  Certification
                </Table.HeaderCell>
                <Table.HeaderCell width={5} style={{ fontSize: '20px' }}>
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {primarySkillsTable.map((skill, index) => (
                <Table.Row key={index}>
                  <Table.Cell style={{ fontSize: '20px' }}>
                    {
                      skillOptions.find(
                        (option) => option._id === skill.skillId
                      )?.name
                    }
                  </Table.Cell>
                  <Table.Cell style={{ fontSize: '20px' }}>
                    {skill.yearsOfExperience}
                  </Table.Cell>
                  <Table.Cell style={{ fontSize: '20px' }}>
                    {skill.certification}
                  </Table.Cell>
                  <Table.Cell>
                    <Icon
                      style={{ fontSize: '20px' }}
                      name="edit"
                      onClick={() => handleEditPrimarySkill(index)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* <Modal open={deleteConfirmationOpen}>
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
      </Modal> */}
    </div>
  )
}

const SecondarySkillForm = ({
  secondarySkillsTable,
  setSecondarySkillsTable
}) => {
  SecondarySkillForm.propTypes = {
    secondarySkillsTable: PropTypes.array.isRequired,
    setSecondarySkillsTable: PropTypes.func.isRequired
  }

  const [secondarySkill, setSecondarySkill] = useState({
    skillId: '',
    yearsOfExperience: '',
    certification: ''
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [selectedSecondarySkillIndex, setSelectedSecondarySkillIndex] =
    useState(null)

  const [skillOptions, setSkillOptions] = useState([])

  useEffect(() => {
    fetchSkills() // Fetch skills on component mount
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:3001/skills', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          email: localStorage.getItem('email')
        }
      }) // Fetch skills from the backend
      setSkillOptions(response.data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  const handleInputChange = (event, { name, value }) => {
    if (name === 'yearsOfExperience') {
      const regex =
        /^[1-9][0-9]?$|^100$|^[1-9][0-9]?(\.[0-9])?$|^100(\.[0-9])?$/

      if (!regex.test(value)) {
        // Display error message for invalid years of experience input
        setSecondarySkill((prevState) => ({
          ...prevState,
          [name]: value,
          error: 'Please enter a valid years of experience.'
        }))
      } else {
        setSecondarySkill((prevState) => ({
          ...prevState,
          [name]: value,
          error: '' // Clear the error message if the input is valid
        }))
      }
    } else {
      setSecondarySkill((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const handleSaveSecondarySkill = async () => {
    if (!secondarySkill.skillId) {
      alert('Please fill skill name.')
      return
    }

    if (secondarySkillsTable.length >= 10) {
      alert('Up to 10 secondary skills are allowed.')
      return
    }

    if (secondarySkill.error) {
      alert('Please enter a valid years of experience.')
      return
    }

    if (
      secondarySkillsTable.some(
        (skill) => skill.skillId === secondarySkill.skillId
      )
    ) {
      alert(
        'Secondary skill already added. Please enter a new secondary skill.'
      )
      return
    }

    try {
      const selectedSkill = skillOptions.find(
        (skill) => skill._id === secondarySkill.skillId
      )
      const token = localStorage.getItem('token')
      const email = localStorage.getItem('email')
      const response = await axios.post(
        'http://localhost:3001/secondaryskill',
        {
          email: email,
          secondarySkills: [
            {
              skillId: selectedSkill._id, // Save the skillId
              skillName: selectedSkill.name, // Save the skill name
              yearsOfExperience: secondarySkill.yearsOfExperience,
              certification: secondarySkill.certification
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.status === 200) {
        setSecondarySkillsTable((prevState) => [...prevState, secondarySkill])
        setSecondarySkill({
          skillId: '',
          yearsOfExperience: '',
          certification: ''
        })
      }
    } catch (error) {
      console.error('Error saving secondary skills:', error)
      alert('Skill exists as Primary Skill')
    }
  }

  const handleEditSecondarySkill = (index) => {
    const selectedSecondarySkill = secondarySkillsTable[index]
    const skillId = selectedSecondarySkill._id
      ? selectedSecondarySkill._id
      : selectedSecondarySkill.skillId

    setSecondarySkill({
      _id: skillId,
      skillId: selectedSecondarySkill.skillId,
      yearsOfExperience: selectedSecondarySkill.yearsOfExperience,
      certification: selectedSecondarySkill.certification
    })
    console.log(secondarySkill)
    setIsEditMode(true)
    setEditIndex(index)
  }

  const handleUpdateSecondarySkill = async () => {
    if (
      secondarySkillsTable.some(
        (skill, index) =>
          index !== editIndex && skill.skillId === secondarySkill.skillId
      )
    ) {
      alert(
        'Secondary skill already exists. Please enter a different skill ID.'
      )
      return
    }

    try {
      const token = localStorage.getItem('token')
      const email = localStorage.getItem('email')
      const response = await axios.put(
        `http://localhost:3001/secondaryskill/${secondarySkill._id}`,
        {
          email: email,
          updatedSecondarySkill: {
            skillId: secondarySkill.skillId,
            yearsOfExperience: secondarySkill.yearsOfExperience,
            certification: secondarySkill.certification
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log(response.data)

      setSecondarySkillsTable((prevState) => {
        const updatedSkills = [...prevState]
        updatedSkills[editIndex] = secondarySkill
        return updatedSkills
      })

      setSecondarySkill({
        skillId: '',
        yearsOfExperience: '',
        certification: ''
      })
      setIsEditMode(false)
      setEditIndex(null)
    } catch (error) {
      console.error('Error updating secondary skill:', error)
      alert('Skill exists as Primary Skill')
    }
  }

  const handleDeleteSecondarySkill = (index) => {
    setSelectedSecondarySkillIndex(index)
    setDeleteConfirmationOpen(true)
  }

  const handleConfirmDeleteSecondarySkill = () => {
    const updatedTable = secondarySkillsTable.filter(
      (_, i) => i !== selectedSecondarySkillIndex
    )

    setSecondarySkillsTable(updatedTable)
    setDeleteConfirmationOpen(false)
    setSelectedSecondarySkillIndex(null)

    // Send the updated table to the backend
    saveUpdatedTable(updatedTable)
  }

  const saveUpdatedTable = async (updatedTable) => {
    try {
      const token = localStorage.getItem('token')
      const email = localStorage.getItem('email')

      await axios.put(
        'http://localhost:3001/secondaryskillupdatetable',
        {
          email: email,
          secondarySkills: updatedTable
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log('Updated table saved successfully')
    } catch (error) {
      console.error('Error saving updated table:', error)
    }
  }

  const handleCancelDeleteSecondarySkill = () => {
    setSelectedSecondarySkillIndex(null)
    setDeleteConfirmationOpen(false)
  }

  return (
    <div>
      <div className="form-container">
        <Form>
          <Form.Group widths="equal">
            <Form.Dropdown
              label={
                <label style={{ fontSize: '20px', marginBottom: '18px' }}>
                  Skill Name
                </label>
              }
              name="skillId"
              value={secondarySkill.skillId}
              options={skillOptions.map((skill) => ({
                key: skill._id,
                value: skill._id,
                text: skill.name
              }))}
              placeholder="Select a skill"
              fluid
              search
              selection
              clearable
              onChange={handleInputChange}
              style={{ fontSize: '20px' }}
              required
            />
            <Form.Input
              label={
                <label style={{ fontSize: '20px', marginBottom: '18px' }}>
                  Years of Experience
                </label>
              }
              name="yearsOfExperience"
              value={secondarySkill.yearsOfExperience}
              onChange={handleInputChange}
              error={secondarySkill.error ? secondarySkill.error : false}
              style={{ fontSize: '20px' }}
            />
            <Form.Input
              label={
                <label style={{ fontSize: '20px', marginBottom: '18px' }}>
                  Certification
                </label>
              }
              name="certification"
              value={secondarySkill.certification}
              onChange={handleInputChange}
              style={{ fontSize: '20px' }}
            />
          </Form.Group>
          <Divider hidden />
          <Form.Group>
            {!isEditMode ? (
              <Button
                style={{ marginLeft: '10px' }}
                color="purple"
                size="huge"
                onClick={handleSaveSecondarySkill}
              >
                Save
              </Button>
            ) : (
              <Button
                style={{ marginLeft: '10px' }}
                color="purple"
                size="huge"
                onClick={handleUpdateSecondarySkill}
              >
                Update
              </Button>
            )}
          </Form.Group>
        </Form>
      </div>
      <Divider style={{ margin: '40px', backgroundColor: 'black' }} />
      <div className="table-container">
        <h2 style={{ color: 'purple' }}>Secondary Skills Details</h2>
        {secondarySkillsTable.length > 0 && (
          <Table celled border="5" className="skilltable">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={5} style={{ fontSize: '20px' }}>
                  Skill ID
                </Table.HeaderCell>
                <Table.HeaderCell width={5} style={{ fontSize: '20px' }}>
                  Years of Experience
                </Table.HeaderCell>
                <Table.HeaderCell width={5} style={{ fontSize: '20px' }}>
                  Certification
                </Table.HeaderCell>
                <Table.HeaderCell width={5} style={{ fontSize: '20px' }}>
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {secondarySkillsTable.map((skill, index) => (
                <Table.Row key={index}>
                  <Table.Cell style={{ fontSize: '20px' }}>
                    {
                      skillOptions.find(
                        (option) => option._id === skill.skillId
                      )?.name
                    }
                  </Table.Cell>
                  <Table.Cell style={{ fontSize: '20px' }}>
                    {skill.yearsOfExperience}
                  </Table.Cell>
                  <Table.Cell style={{ fontSize: '20px' }}>
                    {skill.certification}
                  </Table.Cell>
                  <Table.Cell>
                    <Icon
                      style={{ fontSize: '20px' }}
                      name="edit"
                      onClick={() => handleEditSecondarySkill(index)}
                    />
                    <Icon
                      style={{ fontSize: '20px' }}
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

      <Modal
        style={{ width: '510px', fontSize: '20px' }}
        open={deleteConfirmationOpen}
      >
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this secondary skill?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="purple"
            size="large"
            onClick={handleConfirmDeleteSecondarySkill}
          >
            Yes
          </Button>
          <Button size="large" onClick={handleCancelDeleteSecondarySkill}>
            No
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

const Employee = () => {
  const [primarySkillsTable, setPrimarySkillsTable] = useState([])
  const [secondarySkillsTable, setSecondarySkillsTable] = useState([])
  const fetchPrimarySkill = async () => {
    try {
      const response = await axios.get('http://localhost:3001/primaryskill', {
        params: {
          email: localStorage.getItem('email')
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }) // Fetch primary skill from the backend

      const { skillId, yearsOfExperience, certification } = response.data
      const fetchedPrimarySkill = {
        skillId: skillId._id,
        yearsOfExperience,
        certification
      }

      // Update the primarySkillsTable state with the fetched data
      setPrimarySkillsTable([fetchedPrimarySkill])
    } catch (error) {
      console.error('Error fetching primary skill:', error)
    }
  }

  // fetching secondary skills

  const fetchSecondarySkills = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/secondaryskills',
        {
          params: {
            email: localStorage.getItem('email')
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const fetchedSecondarySkills = response.data.map((skill) => ({
        skillId: skill.skillId._id,
        yearsOfExperience: skill.yearsOfExperience,
        certification: skill.certification
      }))

      // Update the secondarySkillsTable state with the fetched data
      setSecondarySkillsTable(fetchedSecondarySkills)
    } catch (error) {
      console.error('Error fetching secondary skills:', error)
    }
  }

  useEffect(() => {
    // Fetch primary skill data when the component mounts
    fetchPrimarySkill()
    fetchSecondarySkills()
  }, [])
  const panes = [
    {
      menuItem: {
        content: (
          <span style={{ fontSize: '2.2rem', color: 'purple' }}>
            Primary Skill
          </span>
        )
      },
      render: () => (
        <Tab.Pane>
          <Divider hidden style={{ margin: '7px' }} />
          <PrimarySkillForm
            primarySkillsTable={primarySkillsTable}
            setPrimarySkillsTable={setPrimarySkillsTable}
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: {
        content: (
          <span style={{ fontSize: '2.2rem', color: 'purple' }}>
            Secondary Skills
          </span>
        )
      },
      render: () => (
        <Tab.Pane>
          <Divider hidden style={{ margin: '7px' }} />
          <SecondarySkillForm
            secondarySkillsTable={secondarySkillsTable}
            setSecondarySkillsTable={setSecondarySkillsTable}
          />
        </Tab.Pane>
      )
    }
  ]

  return (
    <div>
      <Segment size="huge" attached="top">
        <Image src="Accenture icon.png" size="small" />
      </Segment>
      <Segment size="large" attached>
        <Header as="h1" size="large">
          Hello {localStorage.getItem('firstname')} !
        </Header>
      </Segment>

      <Tab panes={panes} />
    </div>
  )
}

export default Employee
