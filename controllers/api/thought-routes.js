const express = require('express');
const router = express.Router();
const Thought = require('../../models/Thought');

// Get all thoughts
router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve thoughts' });
  }
});

// Get a single thought by ID
router.get('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve thought' });
  }
});

// Create a new thought
router.post('/thoughts', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create thought' });
  }
});

// Update a thought
router.put('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update thought' });
  }
});

// Delete a thought
router.delete('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json({ message: 'Thought deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete thought' });
  }
});

// Create a reaction for a thought
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    thought.reactions.push(req.body);
    await thought.save();
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create reaction' });
  }
});

// Delete a reaction from a thought
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    const reactionIndex = thought.reactions.findIndex(
      (reaction) => reaction.id === reactionId
    );
    if (reactionIndex === -1) {
      return res.status(404).json({ error: 'Reaction not found' });
    }
    thought.reactions.splice(reactionIndex, 1);
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete reaction' });
  }
});

module.exports = router;