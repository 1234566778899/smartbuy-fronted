import { Route, Routes } from 'react-router-dom';
import './App.css';
import { LoginApp } from './components/LoginApp';
import { RegisterApp } from './components/RegisterApp';
import { DashboardApp } from './components/DashboardApp';
import { CustomerApp } from './components/CustomerApp';
import { QuotationApp } from './components/QuotationApp';
import { AddQuotationApp } from './components/AddQuotationApp';
import { ScheduleApp } from './components/ScheduleApp';
import { DetailsQuotation } from './components/DetailsQuotation';
import { InfoApp } from './components/InfoApp';



function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<LoginApp />} />
        <Route exact path='/login' element={<LoginApp />} />
        <Route exact path='/register' element={<RegisterApp />} />
        <Route exact path='/dashboard' element={<DashboardApp />} />
        <Route exact path='/customer' element={<CustomerApp />} />
        <Route exact path='/quotation' element={<QuotationApp />} />
        <Route exact path='/add/quotation' element={<AddQuotationApp />} />
        <Route exact path='/add/quotation/:id' element={<AddQuotationApp />} />
        <Route exact path='/schedule' element={<ScheduleApp />} />
        <Route exact path='/quotation/:id' element={<DetailsQuotation />} />
        <Route exact path='/info' element={<InfoApp />} />
      </Routes>
    </>
  );
}

export default App;
