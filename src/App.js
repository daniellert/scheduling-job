import React, { useState, useEffect } from 'react';
import JobsService from './services/JobsService';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    JobsService.scheduling()
      .then((jobs) => setJobs(jobs));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
