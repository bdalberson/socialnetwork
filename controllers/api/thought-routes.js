const express = require('express');
const router = express.Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User')

// Get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    console.log(thoughts)
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Get a single thought by ID
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const userThought = await User.findOneAndUpdate(
        {_id: req.body.id}, 
        {$push:{thoughts: thought._id}},
        {new: true}
    )
        if(!userThought){
            res.status(400).json({ message: 'No User found' });
        }
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create thought' });
  }
});

// Update a thought
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    const userThought = User.findOneAndUpdate(
        {thoughts: req.params.id},
        {$pull:{thoughts:req.params.id}},
        {new: true}
    )
    res.json({ message: 'Thought deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete thought' });
  }
});

// Create a reaction for a thought
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await Thought.findOneAndUpdate(
        {_id: thoughtId},
        {$addToSet: {reactions:req.body}},
        {new: true}
    );
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create reaction' });
  }
});

// Delete a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;
    const thought = await Thought.findOneAndUpdate(
        {_id: thoughtId},
        {$pull: {reactions:{reactionId:reactionId}}},
        {new: true}
    );
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete reaction' });
  }
});

module.exports = router;