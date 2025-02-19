const Project = require('../models/Project');
const path = require('path');
const fs = require('fs').promises;

class UploadController {
  static async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const project = await Project.findOne({
        _id: req.params.projectId,
        userId: req.user._id
      });

      if (!project) {
        await fs.unlink(req.file.path);
        return res.status(404).json({ message: 'Project not found' });
      }

      const fileContent = {
        type: 'file',
        fileUrl: req.file.path,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype
      };

      project.content.push(fileContent);
      await project.save();

      res.json(project);
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async addYoutubeUrl(req, res) {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ message: 'URL is required' });
      }

      const project = await Project.findOne({
        _id: req.params.projectId,
        userId: req.user._id
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const youtubeContent = {
        type: 'youtube',
        url,
        transcript: ''
      };

      project.content.push(youtubeContent);
      await project.save();

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async addRssFeed(req, res) {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ message: 'URL is required' });
      }

      const project = await Project.findOne({
        _id: req.params.projectId,
        userId: req.user._id
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const rssContent = {
        type: 'rss',
        url,
        transcript: ''
      };

      project.content.push(rssContent);
      await project.save();

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async updateTranscript(req, res) {
    try {
      const { contentId, transcript } = req.body;
      
      const project = await Project.findOne({
        _id: req.params.projectId,
        userId: req.user._id
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const contentIndex = project.content.findIndex(
        content => content._id.toString() === contentId
      );

      if (contentIndex === -1) {
        return res.status(404).json({ message: 'Content not found' });
      }

      project.content[contentIndex].transcript = transcript;
      await project.save();

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = UploadController;