// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Create from './Create';
import Read from './Read';
import Update from './Update';

function App() {
  return (
    <div className="main">
      <h1>CRUD Operation</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/read" element={<Read />} />
          <Route path="/update" element={<Update />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
