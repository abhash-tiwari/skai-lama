const Project = require('../models/Project');

class ProjectController {
  static async createProject(req, res) {
    try {
      const { name } = req.body;
      const project = new Project({
        name,
        userId: req.user._id
      });

      await project.save();
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getProjects(req, res) {
    try {
      const projects = await Project.find({ userId: req.user._id })
        .sort({ createdAt: -1 });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getProjectById(req, res) {
    try {
      const project = await Project.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async updateProject(req, res) {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['name'];
      const isValidOperation = updates.every(update => 
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
      }

      const project = await Project.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      updates.forEach(update => project[update] = req.body[update]);
      await project.save();

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = ProjectController;