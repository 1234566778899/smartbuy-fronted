import { Route, Routes } from 'react-router-dom';
import './App.css';
import { LoginApp } from './components/LoginApp';
import { RegisterApp } from './components/RegisterApp';
import { DashboardApp } from './components/DashboardApp';



function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<LoginApp />} />
        <Route exact path='/login' element={<LoginApp />} />
        <Route exact path='/register' element={<RegisterApp />} />
        <Route exact path='/dashboard' element={<DashboardApp />} />
      </Routes>
    </>
  );
}

export default App;
