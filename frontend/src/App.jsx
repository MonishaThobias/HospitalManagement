import {createBrowserRouter} from 'react-router'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Doctors from './pages/Doctors'
import Appointments from './pages/Appointments'
import Patients from './pages/Patients'
import Signup from './pages/Signup'
import MainLayout from './pages/MainLayout'
import MyProfile from './pages/MyProfile'
import PatientHistory from './pages/PatientHistory'
import Billing from './pages/Billing'


export const router = createBrowserRouter([
  {path:'/', Component:Login},
  {path:'/signup', Component:Signup },

  {Component:MainLayout, children:[
    {path:'/dashboard', Component:Dashboard},
    {path:'/doctors', Component:Doctors },
    {path:'/appointments', Component:Appointments },
    {path:'/patients', Component:Patients },
    {path:'/profile' , Component:MyProfile},
    {path:'/patients/:id', Component:PatientHistory },
    {path:'/billing', Component:Billing},
  ]
  },
])