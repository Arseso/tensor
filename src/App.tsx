import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Main } from './components/Main';
import { Search } from './components/Search';


function App() {
  return (
    <div className="App">
      <Header />
        <Routes>
            <Route path='/' element={<Main/>}>
            
            </Route>
            <Route path='/search' element={<Search/>}>
            
            </Route>
        </Routes>
      <Footer />
    </div>
  );
}

export default App;
