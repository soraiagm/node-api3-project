const express = require('express');

const User = require('./userDb.js');

const Post = require('../posts/postDb.js');

const router = express.Router();

router.post('/', (req, res) => {
    
    User.insert(req.body)
      .then(user => {
      res.status(200).json(user)
   })
      .catch(error => ({ errorMessage: "Could not add new user"}))
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    Post.insert({ user_id: req.params.id, text: req.body.text})
        .then(post => {
          res.status(200).json(post)
        })
        .catch(error => ({ errorMessage: "User could not post"}))
});

router.get('/', (req, res) => {
  User.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the users',
      });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  User.getById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the user',
      });
    });
});

router.get('/:id/posts', validateUserId, validatePost, (req, res) => {
  const id = req.params.id

  User.getUserPosts(id)
    .then(posts => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "Couldn't get user posts" });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "There are no posts" });
    });
});

router.delete('/:id', validateUserId,  (req, res) => {
  User.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The user has been nuked' });
      } else {
        res.status(404).json({ message: 'The user could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error removing the user',
      });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  const changes = req.body;
  const id = req.params.id;
    
  User.update(id, changes)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'The user could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error updating the user',
      });
    });
});

//custom middleware
// validates the user id
function validateUserId(req, res, next) {
  if(req.body.user_id){

    next();
  } else {
    res.status(400).json({ message: "Invalid user id"})
  }
}

// validates the body on a request to create a new user
function validateUser(req, res, next) {

  if (!req.body) {
    res.status(400).json({ message: "missing user data"})
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required text field" })
  }
  next();
}
  
    
function validatePost(req, res, next) {
  
  if(!req.body) {
    res.status(400).json({ message: "missing post data" })
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" })
  }
  next();
}

module.exports = router;
