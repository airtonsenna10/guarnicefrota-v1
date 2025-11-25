import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isSidebarToggled, setSidebarToggled] = useState(false);

  const toggleSidebar = () => {
    setSidebarToggled(!isSidebarToggled);
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar isToggled={isSidebarToggled} />
      <div id="page-content-wrapper">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="container-fluid">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default App;