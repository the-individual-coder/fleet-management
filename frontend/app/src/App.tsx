import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {Route, Routes} from 'react-router-dom';
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { Homepage } from './pages/Homepage';
import { LoginPage } from './pages/Login';
import { ViewItems } from './pages/Users';
import { ViewSales } from './pages/Devices';
import { MainLayout } from './layouts/MainLayout';
import { RegisterPage } from './pages/Register';
import { EditUsers } from './pages/EditUser';
import { EditDevices } from './pages/EditDevices';
import { Maintenance } from './pages/Maintenance';
import { Asset } from './pages/Asset';
import Procurement from './pages/Procurement';
import { Project } from './pages/Project';
import {ProjectTasksPage} from './pages/ProjectTask';
import Supplier from './pages/Supplier';
import { WarehousingPage } from './pages/Warehousing';
import { SpareParts } from './pages/SpareParts';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}


function App() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          entry.target.classList.add('show_2');
        } else {
          entry.target.classList.remove('show');
          entry.target.classList.remove('show_2');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.hide');
    const hiddenElements2 = document.querySelectorAll('.hide_2');
    const hiddenElements3 = document.querySelectorAll('.hide_3');
    hiddenElements.forEach((el) => observer.observe(el));
    hiddenElements2.forEach((el) => observer.observe(el));
    hiddenElements3.forEach((el) => observer.observe(el));
    // Cleanup function to disconnect the observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); 
  return (
    <>

    <Routes>
    <Route element={<LoginPage/>} path='/login' />
    <Route element={<RegisterPage/>} path='/register' />
      <Route element={<MainLayout/>}>

      <Route element={<Maintenance/>} path='/maintenance_requests'/>
      <Route element={<Homepage/>} path='/' />
      {/* Items */}
      <Route element={<ViewItems/>} path='/users/view' />
      <Route element={<EditUsers/>} path='/users/edit' />
      {/* Sales */}
      <Route element={<ViewSales/>} path='/devices/view' />
      <Route element={<EditDevices/>} path='/devices/edit' />
      <Route element={<Asset/>} path='/assets' />
      <Route element={<Procurement/>} path='/procurement' />
      <Route element={<SpareParts/>} path='/spare_parts' />
      <Route element={<Project/>} path='/project' />
      <Route element={<ProjectTasksPage/>} path='/projecttask' />
      <Route element={<Supplier/>} path='/supplier' />
      <Route element={<WarehousingPage/>} path='/warehouse' />
      </Route>
    </Routes>
    </>
  );
}

export default App;