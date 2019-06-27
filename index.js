const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let requestsCount = 0;

/**
 * Middleware to log number of requests already made
 */
function logRequestsCount(req, res, next) {
  requestsCount++;

  console.log(`${requestsCount} request(s) made`);

  return next();
}

/**
 * Middleware to check if project exists
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ message: 'Project does not exists' });
  }

  return next();
}

server.use(logRequestsCount);

/**
 * Project requests
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: [],
  };

  projects.push(project);

  return res.json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Tasks requests
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
