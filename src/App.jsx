import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/home';
import Dashbord from './components/dashbord';
import SmartStore from './components/smartStore';
import AddPatient from './components/addPatient';
import PatienstList from './components/patientList';
import PatientData from './components/patientData';
import Appointments from './components/appointments';
import AddAppointment from './components/addAppointment';
import Finance from './components/finance';
import './App.css'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home/dashbord' element={<Dashbord />} />
        <Route path='/home/smartstore' element={<SmartStore />} />
        <Route path='/home/addpatient' element={<AddPatient />} />
        <Route path='/home/patientsList' element={<PatienstList />} />
        <Route path='/home/patientsList/patientData' element={<PatientData />} />
        <Route path='/home/appointments' element={<Appointments />} />
        <Route path='/home/addappointments' element={<AddAppointment />} />
        <Route path='/home/finance' element={<Finance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
