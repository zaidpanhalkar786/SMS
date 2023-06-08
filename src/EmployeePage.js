import React, { useState } from 'react';
import { Form, Button, Tab,Segment,Image,Header,Divider } from 'semantic-ui-react';

const PrimarySkillForm = ({ onSave }) => {
const [primarySkill, setPrimarySkill] = useState({
skillName: '',
yearsOfExperience: '',
certification: '',
});

const handlePrimarySkillChange = (e, { name, value }) => {
setPrimarySkill({ ...primarySkill, [name]: value });
};

const handleSave = () => {
onSave(primarySkill);
};

return (

<Tab.Pane>
<Divider style={{margin: '1rem 0'}} hidden/>
<Form>
<Form.Group widths="equal">
<Form.Input
label={<label style={{ fontSize: '20px', marginBottom: '18px' }}>Skill Name</label>}
placeholder="Skill Name"
name="skillName"
value={primarySkill.skillName}
onChange={handlePrimarySkillChange}
style={{ fontSize: '20px' }}
required
/>
<Form.Input
label={<label style={{ fontSize: '20px',marginBottom: '18px'}}>Years of Experience</label>}
placeholder="Years of Experience"
name="yearsOfExperience"
value={primarySkill.yearsOfExperience}
onChange={handlePrimarySkillChange}
style={{ fontSize: '20px' }}
required
/>
<Form.Input
label={<label style={{ fontSize: '20px',marginBottom: '18px' }}>Certification</label>}
placeholder="Certification Name"
name="certification"
value={primarySkill.certification}
onChange={handlePrimarySkillChange}
style={{ fontSize: '20px' }}
/>
</Form.Group>
<Divider style={{margin: '1rem 0'}} hidden/>
<Button color='purple' onClick={handleSave} size='big'>
Save
</Button>
</Form>
</Tab.Pane>
);
};

const SecondarySkillForm = ({ onSave }) => {
const [secondarySkills, setSecondarySkills] = useState([
{ skillName: '', yearsOfExperience: '', certification: '' },
]);

const handleSecondarySkillChange = (index, name, value) => {
const updatedSkills = [...secondarySkills];
updatedSkills[index] = { ...updatedSkills[index], [name]: value };
setSecondarySkills(updatedSkills);
};

const handleAddSecondarySkill = () => {
if (secondarySkills.length < 10) {
setSecondarySkills([...secondarySkills, { skillName: '', yearsOfExperience: '', certification: '' }]);
}
};

const handleDeleteSecondarySkill = (index) => {
const updatedSkills = [...secondarySkills];
updatedSkills.splice(index, 1);
setSecondarySkills(updatedSkills);
};

const handleSave = () => {
const data = secondarySkills.filter(skill => skill.skillName !== '' || skill.yearsOfExperience !== '');
onSave(data);
};

const secondarySkillsForm = secondarySkills.map((skill, index) => (
<Form key={index}>
<Form.Group widths="equal">
<Form.Input
label={<label style={{ fontSize: '20px', marginBottom: '18px' }}>Skill Name</label>}
placeholder="Skill Name"
name="skillName"
value={skill.skillName}
onChange={(e, { value }) => handleSecondarySkillChange(index, 'skillName', value)}
required
style={{ fontSize: '20px' }}
/>
<Form.Input
label={<label style={{ fontSize: '20px',marginBottom: '18px' }}>Years of Experience</label>}
placeholder="Years of Experience"
name="yearsOfExperience"
value={skill.yearsOfExperience}
onChange={(e, { value }) => handleSecondarySkillChange(index, 'yearsOfExperience', value)}
required
style={{ fontSize: '20px' }}
/>
<Form.Input
label={<label style={{ fontSize: '20px',marginBottom: '18px' }}>Certification</label>}
placeholder="Certification"
name="certification"
value={skill.certification}
onChange={(e, { value }) => handleSecondarySkillChange(index, 'certification', value)}
style={{ fontSize: '20px' }}
/>
<Button negative icon="trash" onClick={() => handleDeleteSecondarySkill(index)} disabled={index === 0}/>

</Form.Group>
</Form>
));

return (

<Tab.Pane>
<Divider style={{margin: '1rem 0'}} hidden/>
{secondarySkillsForm}
<Divider style={{margin: '1rem 0'}} hidden/>
<Button size='big' color='purple' onClick={handleAddSecondarySkill} disabled={secondarySkills.length >= 10}>
Add
</Button>
<Button size='big' color='purple' onClick={handleSave}>
Save
</Button>
</Tab.Pane>
);
};

const EmployeePage = () => {
const handleSavePrimarySkill = (data) => {

console.log(data);
};

const handleSaveSecondarySkills = (data) => {

console.log(data);
};

const panes = [
{
menuItem: { content: <span style={{fontSize:'2.2rem',color: 'purple'}}>Primary Skill</span>},
render: () => <PrimarySkillForm onSave={handleSavePrimarySkill} />,
},
{
menuItem: { content: <span style={{fontSize:'2.2rem',color: 'purple'}}>Secondary Skill</span>},
render: () => <SecondarySkillForm onSave={handleSaveSecondarySkills} />,
},
];

return (
<div>
    <Segment size='huge' attached = 'top'> 
        <Image src='Accenture icon.png' size='small'/>
        </Segment> 
        <Segment size='large' attached> 
        <Header as='h1'size='large'>Hello Employee!</Header>
    </Segment> 
    {/* <Divider style={{margin: '0rem 0', display:'inline-block'}}/> */}

<Tab panes={panes} />

</div>)
};

export default EmployeePage;
