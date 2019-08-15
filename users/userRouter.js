const express = require('express');

const Users = require('./userDb.js')
const Posts = require('../posts/postDb.js')

const router = express.Router();

router.post('/', validateUser,(req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error adding user.' })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postBody = { ...req.body, user_id: req.user.id }

  Posts.insert(postBody)
    .then(post => {
      res.status(200).json(post)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Error adding the Post to the User.' })
    })
});

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error getting Users' })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.user.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error getting User posts' })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params

  Users.remove(id)
    .then(user => {
      if (user === 0) {
        res.status(404).json({ message: 'User ID is invalid.' })
      }else {
        res.status(200).json(user)
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error removing the User.' })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  Users.update(req.user.id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error updating User.' })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id

  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user
        next()
      }else {
        res.status(400).json({ message: 'invalid user id' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ errorMessage: 'Error finding user' })
    })
};

function validateUser(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing user data' })
  }
  else if (!req.body.name || req.body.name.split('').length === 0) {
    res.status(400).json({ message: 'missing required name field' })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing user data' })
  }
  else if (!req.body.text || req.body.text.split('').length === 0) {
    res.status(400).json({ message: 'missing required text field' })
  } else {
    next()
  }
};

module.exports = router;
