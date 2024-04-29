import React from 'react';
import LeftNavPane from './components/LeftNavPane';
import ViewMyListings from './components/Pages/ViewMyListings';
import { useState } from 'react';
import { AccountContext } from './contexts/AccountContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ViewAllListings from './components/Pages/ViewAllListings';
import './App.css';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import AddNewListing from './components/Pages/AddNewListing';
import ViewAListing from './components/Pages/ViewAListing';
import NotFound from './components/Pages/NotFound';
import RedirectFromRoot from './components/Functionals/RedirectFromRoot';


const App = () => {
  // *** Global States *** //
  const [accountDetails, setAccountDetails] = useState({username:'',loggedIn: false, account_id:-1})

  return (
    <BrowserRouter>
      <AccountContext.Provider value={{ accountDetails, setAccountDetails }}>
        <div className="totalContainer">
          <div className="leftNavPane">
            <LeftNavPane />
          </div>
          <div className="contentWindow">
            <Routes>
              <Route exact path="/" element={<RedirectFromRoot />} />
              <Route exact path="/view_all_listings" element={<ViewAllListings />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/add_new_listing" element={<AddNewListing />} />
              <Route exact path="/view_my_listings" element={<ViewMyListings />} />
              <Route exact path="/view_listing/:listing_id" element={<ViewAListing />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </AccountContext.Provider>
    </BrowserRouter>
    
  );
}

export default App;