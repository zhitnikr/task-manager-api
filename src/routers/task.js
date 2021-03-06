const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (request, response) => {
  // const task = new Task(request.body)
  const task = new Task({
    ...request.body,
    owner: request.user._id
  })

  try {
    await task.save()
    response.status(201).send(task)
  } catch (e) {
    response.status(400).send(e)
  }
})

router.get('/tasks', auth, async (request, response) => {
  const match = {}
  const sort = {}

  if (request.query.completed) {
    match.completed = request.query.completed === 'true'
  }
  if (request.query.sortBy) {
    const parts = request.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    // const tasks = await Task.find({ owner: request.user._id })
    await request.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(request.query.limit),
        skip: parseInt(request.query.skip),
        sort
      }
    }).execPopulate()
    // response.send(tasks)
    response.send(request.user.tasks)
  } catch (e) {
    response.status(500).send()
  }
})

router.get('/tasks/:id', auth, async (request, response) => {
  const _id = request.params.id

  try {
    // const task = await Task.findById({ _id })
    const task = await Task.findOne({ _id, owner: request.user._id })

    if (!task) {
      return response.status(404).send()
    }

    response.send(task)
  } catch (e) {
    response.status(500).send()
  }
})

router.patch('/tasks/:id', auth, async (request, response) => {
  const _id = request.params.id
  const allowedUpdates = ['completed', 'description']
  const updates = Object.keys(request.body)
  const isValid = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValid) {
    response.status(400).send({ error: 'Bad operation' })
  }

  try {
    const task = await Task.findOne({ _id: request.params.id, owner: request.user._id })
    // const task = await Task.findById(_id)


    // const task = await Task.findByIdAndUpdate(_id, request.body, { new: true, runValidators: true })
    if (!task) {
      return response.status(400).send()
    }
    updates.forEach((update) => {
      task[update] = request.body[update]
    })
    await task.save()
    response.status(202).send(task)
  } catch (e) {
    response.status(500).send('You cannot do that')
  }
})

router.delete('/tasks/:id', auth, async (request, response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: request.params.id, owner: request.user._id })
    if (!task) {
      return response.status(404).send({ error: 'Task not found' })
    }
    response.status(200).send(task)
  } catch (e) {
    response.status(500).send(e)
  }
})

module.exports = router