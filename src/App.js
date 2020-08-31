import React, { useState } from 'react';
import JobsService from './services/JobsService';
import { Button, Card, Form, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    executationStartDate: '2019-11-10T09:00',
    executationEndDate: '2019-11-11T12:00',
    maxEstimatedTime: 8
  });

  const handleChange = (event) => {
    const auxForm = { ...form };
    auxForm[event.target.name] = event.target.value;
    setForm(auxForm);
  }

  const handleSubmit = () => {
    JobsService.scheduling(form.executationStartDate, form.executationEndDate, form.maxEstimatedTime)
      .then((jobs) => setJobs(jobs))
      .catch((err) => console.log(err));
  }

  return (
    <div className="App">
      <Card>
        <Card.Body>
          <Card.Title>Scheduling job</Card.Title>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="executationStartDate">
                <Form.Label>Execution start date</Form.Label>
                <Form.Control type="datetime-local" name="executationStartDate" value={form.executationStartDate} onChange={handleChange} />
              </Form.Group>

              <Form.Group as={Col} controlId="executationEndDate">
                <Form.Label>Execution end date</Form.Label>
                <Form.Control type="datetime-local" name="executationEndDate" value={form.executationEndDate} onChange={handleChange} />
              </Form.Group>

              <Form.Group as={Col} controlId="maxEstimatedTime">
                <Form.Label>Max estimated time (hours)</Form.Label>
                <Form.Control type="number" name="maxEstimatedTime" value={form.maxEstimatedTime} onChange={handleChange} />
              </Form.Group>
            </Form.Row>

            <Button variant="primary" onClick={handleSubmit}>Show output</Button>
          </Form>

          <div className="output">
            {JSON.stringify(jobs)}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default App;
