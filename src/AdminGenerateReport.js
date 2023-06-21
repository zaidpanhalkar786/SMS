import React, { useState, useEffect } from 'react'
import './Adminskillcatalog.css'
import axios from 'axios'
import {
  Table,
  Checkbox,
  Button,
  Form,
  Icon,
  Segment,
  Header,
  Divider
} from 'semantic-ui-react'
import { useNavigate } from 'react-router'

const AdminGenerateReport = () => {
  const [skillName, setSkillName] = useState('')
  const [primarySkill, setPrimarySkill] = useState(true)
  const [secondarySkill, setSecondarySkill] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState('')
  const [skillOptions, setSkillOptions] = useState([])

  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate('/admin-homepage')
  }

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

    if (!primarySkill && !secondarySkill) {
      setError('Please select at least one skill')
      return
    }
    setError('') // Clear any previous error

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
      setError('') // Clear any previous error
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Segment attached style={{ borderColor: 'black' }}>
        <Header
          as="h1"
          textAlign="center"
          color="purple"
          style={{ fontSize: '40px' }}
        >
          Generate Report
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
          <div style={{ display: 'flex' }}>
            <Checkbox
              label="Primary Skill"
              checked={primarySkill}
              style={{ fontSize: '20px' }}
              // onChange={(e, data) => setPrimarySkill(data.checked)}
            />
            <Checkbox
              label="Secondary Skill"
              checked={secondarySkill}
              style={{ fontSize: '20px' }}
              onChange={(e, data) => setSecondarySkill(data.checked)}
            />
          </div>
          {error && <div>{error}</div>}
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
                  Employee Level
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

export default AdminGenerateReport
