import React, { useState, useEffect } from 'react'
import './Adminskillcatalog.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Table,
  Button,
  Form,
  Segment,
  Header,
  Input,
  Divider,
  Icon,
  Modal
} from 'semantic-ui-react'

// eslint-disable-next-line space-before-function-paren
function Adminskillcatalog() {
  const [skills, setSkills] = useState([])
  const [currentSkill, setCurrentSkill] = useState('')
  const [currentDescription, setCurrentDescription] = useState('')
  const [showUpdateButton, setShowUpdateButton] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [selectedSkillToDelete, setSelectedSkillToDelete] = useState(null)
  const [selectedSkillToUpdate, setSelectedSkillToUpdate] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  //  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/admin-homepage')
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:3001/skills', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setSkills(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = async () => {
    const trimmedSkill = currentSkill.toLowerCase().trim()

    if (trimmedSkill === '' || currentDescription.trim() === '') {
      alert('Please enter all the details')
      return
    }

    const existingSkill = skills.find(
      (skill) => skill.name.toLowerCase().trim() === trimmedSkill
    )

    if (existingSkill) {
      alert('Skill already exists')
      return
    }

    const words = currentDescription.trim().split(/\s+/)
    if (words.length > 50) {
      alert('Skill description should be limited to 50 words')
      return
    }

    const newSkill = {
      name: currentSkill,
      description: currentDescription
    }

    try {
      await axios.post('http://localhost:3001/skills', newSkill, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setCurrentSkill('')
      setCurrentDescription('')
      fetchSkills()
    } catch (error) {
      console.error('Error saving skill:', error)
    }
  }

  const handleUpdate = (skill) => {
    setCurrentSkill(skill.name)
    setCurrentDescription(skill.description)
    setShowUpdateButton(true)
    setSelectedSkillToUpdate({ ...skill })
    console.log(selectedSkillToUpdate)
  }

  const handleUpdateSave = async () => {
    const trimmedSkill = currentSkill.toLowerCase().trim()

    if (trimmedSkill === '' || currentDescription.trim() === '') {
      alert('Please enter all the details')
      return
    }

    const existingSkill = skills.find(
      (skill) =>
        skill.name.toLowerCase().trim() === trimmedSkill &&
        skill.name !== selectedSkillToUpdate.name
    )

    if (existingSkill) {
      alert('Skill already exists')
      return
    }
    const words = currentDescription.trim().split(/\s+/)

    if (words.length > 50) {
      alert('Skill description should be limited to 50 words')
      return
    }

    const updatedSkill = {
      name: currentSkill,
      description: currentDescription
    }

    try {
      await axios.put(
        `http://localhost:3001/skills/${selectedSkillToUpdate._id}`,
        updatedSkill,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setCurrentSkill('')
      setCurrentDescription('')
      setShowUpdateButton(false)
      setSelectedSkillToUpdate(null)
      fetchSkills()
    } catch (error) {
      console.error('Error updating skill:', error)
    }
  }

  const handleDeleteConfirmation = (skill) => {
    setSelectedSkillToDelete(skill)
    setShowDeleteConfirmation(true)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/skills/${selectedSkillToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setShowDeleteConfirmation(false)
      fetchSkills()
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredSkills = skills.filter((skill) => {
    const { name, description } = skill
    const normalizedQuery = searchQuery.toLowerCase().trim()
    return (
      name.toLowerCase().includes(normalizedQuery) ||
      description.toLowerCase().includes(normalizedQuery)
    )
  })
  return (
    <div className="skillcatalog">
      <Segment attached style={{ borderColor: 'black' }}>
        <Header
          as="h1"
          textAlign="center"
          color="purple"
          style={{ fontSize: '40px' }}
        >
          Skill Catalog
        </Header>
        <Icon
          name="home"
          color="purple"
          size="big"
          onClick={handleGoBack}
          style={{ position: 'absolute', top: '20px', left: '10px' }}
        />
      </Segment>
      <Divider hidden />
      <Form className="skillform">
        <Form.Input
          label={
            <label style={{ fontSize: '23px', color: 'purple' }}>
              Skill Name
            </label>
          }
          placeholder="Enter skill name"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          style={{ width: '800px', fontSize: '23px' }}
        />
        <Divider hidden />
        <Form.TextArea
          className="textarea"
          label={
            <label style={{ fontSize: '23px', color: 'purple' }}>
              Skill Description
            </label>
          }
          placeholder="Enter skill description"
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          style={{ width: '800px', fontSize: '23px', height: '150px' }}
        />

        <Divider hidden />
        {showUpdateButton ? (
          <Button color="purple" size="huge" onClick={handleUpdateSave}>
            Update
          </Button>
        ) : (
          <Button color="purple" size="huge" onClick={handleSave}>
            Save
          </Button>
        )}
      </Form>
      <Divider />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Input
          icon="search"
          iconPosition="right"
          type="text"
          placeholder="Search by skill name"
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '800px', height: '65px', fontSize: '23px' }}
        />
      </div>
      <Divider hidden />
      <Table celled border="5" className="skilltable">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
              Skill Name
            </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
              Skill Description
            </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '23px', color: 'purple' }}>
              Actions
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body style={{ fontSize: '23px' }}>
          {filteredSkills.map((skill) => (
            <Table.Row key={skill.name}>
              <Table.Cell style={{ width: '250px', fontSize: '23px' }}>
                {skill.name}
              </Table.Cell>
              <Table.Cell style={{ width: '700px', fontSize: '23px' }}>
                {skill.description}
              </Table.Cell>
              <Table.Cell style={{ width: '110px', fontSize: '17px' }}>
                <Icon
                  size="large"
                  name="edit"
                  onClick={() => handleUpdate(skill)}
                />
                <Icon
                  size="large"
                  name="trash"
                  onClick={() => handleDeleteConfirmation(skill)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal
        open={showDeleteConfirmation}
        style={{ width: '450px', fontSize: '20px' }}
        onClose={() => setShowDeleteConfirmation(false)}
      >
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this skill?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="purple" size="large" onClick={handleDelete}>
            Yes
          </Button>
          <Button size="large" onClick={() => setShowDeleteConfirmation(false)}>
            No
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

export default Adminskillcatalog
