import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Login from './Login.jsx';
import Edit from './Edit.jsx';
import Adminview from './Adminview.jsx';
import Reg from './Reg.jsx';
import Details from './Details.jsx';
import View from './View.jsx';
import Password from './Password.jsx';
import Adminedit from './Adminedit.jsx';
import Admin from './Admin.jsx';
import Admin_register from './Admin_register.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Reg />} />
        <Route path='/details/:id' element={<Details />} />
        <Route path='/login' element={<Login />} />
        <Route path='/view/:id' element={<View />} />
        <Route path='/edit/:id' element={<Edit />} />
        <Route path='/password/:id' element={<Password/>}></Route>
        <Route path='/admin' element={<Admin/>}></Route>
        <Route path='/adminview/:id' element={<Adminview/>}></Route>
        <Route path='/adminedit/:id' element={<Adminedit/>}></Route>
        <Route path='/admin_register' element={<Admin_register/>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
