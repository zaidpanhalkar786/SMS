import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './Adminskillcatalog.css'
import axios from 'axios'
import {
  Table,
  Button,
  Form,
  Icon,
  Modal,
  Tab,
  Segment,
  Image,
  Header,
  Divider
} from 'semantic-ui-react'

const SearchResource = () => {
  const [skillName, setSkillName] = useState('')
  const [primarySkill, setPrimarySkill] = useState(true) // eslint-disable-line no-unused-vars
  const [secondarySkill, setSecondarySkill] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const [skillOptions, setSkillOptions] = useState([])

  useEffect(() => {
    fetchSkills() // Fetch skills
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

  const handleSearch = async () => {
    let url = `http://localhost:3001/search?skillName=${skillName}`

    if (primarySkill && !secondarySkill) {
      url += '&primarySkill=true'
    } else if (!primarySkill && secondarySkill) {
      url += '&secondarySkill=true'
    } else if (primarySkill && secondarySkill) {
      url += '&primarySkill=true&secondarySkill=true'
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setSearchResults(response.data.employees)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Form>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <Form.Dropdown
              search
              selection
              fluid
              clearable
              value={skillName}
              onChange={(e, { value }) => setSkillName(value)}
              placeholder="Enter skill name"
              options={skillOptions.map((skill) => ({
                key: skill.id,
                text: skill.name,
                value: skill.name,
                style: { fontSize: '23px' }
              }))}
              style={{ width: '550px', height: '55px', fontSize: '23px' }}
            />
            <Button
              color="purple"
              onClick={handleSearch}
              style={{ marginLeft: '10px', height: '61px', width: '100px' }}
            >
              Search
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <label
              style={{ fontSize: '25px', marginRight: '10px', color: 'purple' }}
            >
              Skill Category:
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '18px'
              }}
            >
              <input
                type="checkbox"
                id="primarySkill"
                checked={primarySkill}
                // onChange={(e) => setPrimarySkill(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              <label
                htmlFor="primarySkill"
                style={{
                  fontSize: '23px',
                  color: primarySkill ? 'purple' : 'black'
                }}
              >
                Primary Skill
              </label>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '120px'
              }}
            >
              <input
                type="checkbox"
                id="secondarySkill"
                checked={secondarySkill}
                onChange={(e) => setSecondarySkill(e.target.checked)}
                style={{ marginRight: '5px', color: 'purple' }}
              />
              <label
                htmlFor="secondarySkill"
                style={{
                  fontSize: '23px',
                  color: primarySkill ? 'purple' : 'black'
                }}
              >
                Secondary Skill
              </label>
            </div>
          </div>
        </div>
      </Form>
      <Divider style={{ margin: '40px', backgroundColor: 'black' }} />
      {searchResults.length > 0 && (
        <div>
          <h2 style={{ color: 'purple' }}>Search Results</h2>
          <Table celled border="5" className="skilltable">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
                  Employee Name
                </Table.HeaderCell>
                <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
                  Email
                </Table.HeaderCell>
                <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
                  Mobile Number
                </Table.HeaderCell>
                <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
                  Designation Level
                </Table.HeaderCell>
                <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
                  Skill Category
                </Table.HeaderCell>
                <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
                  Skill Description
                </Table.HeaderCell>
                <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
                  Years of Experience
                </Table.HeaderCell>
                <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
                  Certification
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body style={{ fontSize: '22px' }}>
              {searchResults.map((employee) => {
                if (!employee.primarySkill) {
                  return null
                }

                return (
                  <Table.Row key={employee._id}>
                    <Table.Cell>{employee.Name}</Table.Cell>
                    <Table.Cell>{employee.email}</Table.Cell>
                    <Table.Cell>{employee.mobileno}</Table.Cell>
                    <Table.Cell>{employee.employeelevel}</Table.Cell>
                    <Table.Cell>Primary Skill</Table.Cell>
                    <Table.Cell>
                      {employee.primarySkill.skillId
                        ? employee.primarySkill.skillId.description
                        : ''}
                    </Table.Cell>
                    <Table.Cell>
                      {employee.primarySkill.yearsOfExperience
                        ? employee.primarySkill.yearsOfExperience
                        : ''}
                    </Table.Cell>
                    <Table.Cell>
                      {employee.primarySkill.certification
                        ? employee.primarySkill.certification
                        : ''}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
              {searchResults.map((employee) =>
                employee.secondarySkills.map((secondarySkill) => (
                  <Table.Row key={secondarySkill._id}>
                    <Table.Cell>{employee.Name}</Table.Cell>
                    <Table.Cell>{employee.email}</Table.Cell>
                    <Table.Cell>{employee.mobileno}</Table.Cell>
                    <Table.Cell>{employee.employeelevel}</Table.Cell>

                    <Table.Cell>Secondary Skill</Table.Cell>
                    <Table.Cell>
                      {secondarySkill.skillId
                        ? secondarySkill.skillId.description
                        : ''}
                    </Table.Cell>
                    <Table.Cell>
                      {secondarySkill.yearsOfExperience
                        ? secondarySkill.yearsOfExperience
                        : ''}
                    </Table.Cell>
                    <Table.Cell>
                      {secondarySkill.certification
                        ? secondarySkill.certification
                        : ''}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  )
}

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
        style={{ width: '450px', fontSize: '20px' }}
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

const ProjectManager = () => {
  const [primarySkillsTable, setPrimarySkillsTable] = useState([])
  const [secondarySkillsTable, setSecondarySkillsTable] = useState([])
  // const [searchResults, setSearchResults] = useState([]);
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
    },
    {
      menuItem: {
        content: (
          <span style={{ fontSize: '2.2rem', color: 'purple' }}>
            Search Resource
          </span>
        )
      },
      render: () => (
        <Tab.Pane>
          <Divider hidden style={{ margin: '7px' }} />
          <SearchResource />
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
        <Header as="h1" size="huge">
          Hello {localStorage.getItem('firstname')} !
        </Header>
      </Segment>

      <Tab panes={panes} />
    </div>
  )
}

export default ProjectManager
