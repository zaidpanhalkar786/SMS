import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import Adminfrontpage from './Adminfrontpage'
import Adminskillcatalog from './Adminskillcatalog'
import AdminManageusers from './AdminManageusers'
import MyLoginPage from './LoginPage'
import SignUpPage from './Signuppage'
import Employee from './Employee'
import ProjectManager from './ProjectManager'
import AdminGenerateReport from './AdminGenerateReport'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={MyLoginPage} />
        <Route path="/signup-page" Component={SignUpPage} />
        <Route path="/admin-homepage" Component={Adminfrontpage} />
        <Route path="/admin-skillcatalog" Component={Adminskillcatalog} />
        <Route path="/admin-managerusers" Component={AdminManageusers} />
        <Route path="/employee" Component={Employee} />
        <Route path="/projectmanager" Component={ProjectManager} />
        <Route path="/admin-generatereport" Component={AdminGenerateReport} />
      </Routes>
    </Router>
  )
}

export default App
