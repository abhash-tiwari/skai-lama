const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

router.post('/', auth, ProjectController.createProject);
router.get('/', auth, ProjectController.getProjects);
router.get('/:id', auth, ProjectController.getProjectById);
router.patch('/:id', auth, ProjectController.updateProject);

module.exports = router;