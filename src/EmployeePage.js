import React, { useState } from 'react';
import { Form, Button, Tab } from 'semantic-ui-react';

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
<Form>
<Form.Group widths="equal">
<Form.Input
label="Skill Name"
placeholder="Skill Name"
name="skillName"
value={primarySkill.skillName}
onChange={handlePrimarySkillChange}
required
/>
<Form.Input
label="Years of Experience"
placeholder="Years of Experience"
name="yearsOfExperience"
value={primarySkill.yearsOfExperience}
onChange={handlePrimarySkillChange}
required
/>
<Form.Input
label="Certification"
placeholder="Certification"
name="certification"
value={primarySkill.certification}
onChange={handlePrimarySkillChange}
/>
</Form.Group>
<Button primary onClick={handleSave}>
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
label="Skill Name"
placeholder="Skill Name"
name="skillName"
value={skill.skillName}
onChange={(e, { value }) => handleSecondarySkillChange(index, 'skillName', value)}
required
/>
<Form.Input
label="Years of Experience"
placeholder="Years of Experience"
name="yearsOfExperience"
value={skill.yearsOfExperience}
onChange={(e, { value }) => handleSecondarySkillChange(index, 'yearsOfExperience', value)}
required
/>
<Form.Input
label="Certification"
placeholder="Certification"
name="certification"
value={skill.certification}
onChange={(e, { value }) => handleSecondarySkillChange(index, 'certification', value)}
/>
<Button negative icon="trash" onClick={() => handleDeleteSecondarySkill(index)} disabled={index === 0}/>

</Form.Group>
</Form>
));

return (
<Tab.Pane>
{secondarySkillsForm}
<Button primary onClick={handleAddSecondarySkill} disabled={secondarySkills.length >= 10}>
Add
</Button>
<Button primary onClick={handleSave}>
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
menuItem: { content: <span style={{fontSize:'2.5rem',color: 'purple'}}>Primary Skill</span>},
render: () => <PrimarySkillForm onSave={handleSavePrimarySkill} />,
},
{
menuItem: { content: <span style={{fontSize:'2.5rem',color: 'purple'}}>Secondary Skill</span>},
render: () => <SecondarySkillForm onSave={handleSaveSecondarySkills} />,
},
];

return <Tab panes={panes} />;
};

export default EmployeePage;
