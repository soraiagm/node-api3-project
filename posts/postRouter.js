const express = require('express');

const Post = require('./postDb.js');

const router = express.Router();

router.get('/', (req, res) => {
  Post.get(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the posts',
      });
    });
});

router.get('/:id', validatePostId, (req, res) => {
  Post.getById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the post',
      });
    });
});

router.delete('/:id', validatePostId, (req, res) => {
  Post.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The post has been nuked' });
      } else {
        res.status(404).json({ message: 'The post could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error removing the post',
      });
    });
});

router.put('/:id', validatePostId, (req, res) => {
  const changes = req.body;
  const id = req.params.id;
    
  Post.update(id, changes)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'The post could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error updating the post',
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  if(!req.body){
    res.status(400).json({ message: "missing post data"})
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field"})
  }
  next();
}

module.exports = router;
