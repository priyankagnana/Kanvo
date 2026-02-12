const Task = require('../models/task')
const Section = require('../models/section')
const Board = require('../models/board')

exports.create = async (req, res) => {
  const { sectionId } = req.body
  try {
    const section = await Section.findById(sectionId)
    const tasksCount = await Task.countDocuments({ section: sectionId })
    const task = await Task.create({
      section: sectionId,
      position: tasksCount > 0 ? tasksCount : 0
    })
    task._doc.section = section
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.update = async (req, res) => {
  const { taskId } = req.params
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $set: req.body }
    )
    res.status(200).json(task)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.delete = async (req, res) => {
  const { taskId } = req.params
  try {
    const currentTask = await Task.findById(taskId)
    await Task.deleteOne({ _id: taskId })
    const tasks = await Task.find({ section: currentTask.section }).sort('position').lean()
    if (tasks.length > 0) {
      const ops = tasks.map((task, index) => ({
        updateOne: {
          filter: { _id: task._id },
          update: { $set: { position: index } }
        }
      }))
      await Task.bulkWrite(ops)
    }
    res.status(200).json('deleted')
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.updatePosition = async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId
  } = req.body
  const resourceListReverse = resourceList.reverse()
  const destinationListReverse = destinationList.reverse()
  try {
    const ops = []

    if (resourceSectionId !== destinationSectionId) {
      resourceListReverse.forEach((item, index) => {
        ops.push({
          updateOne: {
            filter: { _id: item.id },
            update: { $set: { section: resourceSectionId, position: index } }
          }
        })
      })
    }

    destinationListReverse.forEach((item, index) => {
      ops.push({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { section: destinationSectionId, position: index } }
        }
      })
    })

    if (ops.length > 0) {
      await Task.bulkWrite(ops)
    }
    res.status(200).json('updated')
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.search = async (req, res) => {
  try {
    const { boardId } = req.params
    const { search, sort, filter, priority, status, page = 1, limit = 50 } = req.query

    // Verify board belongs to user
    const board = await Board.findOne({ _id: boardId, user: req.user._id }).lean()
    if (!board) {
      return res.status(404).json('Board not found')
    }

    // Get all sections for this board
    const sections = await Section.find({ board: boardId }).select('_id').lean()
    const sectionIds = sections.map(s => s._id)

    // Build query using $and for proper combination of conditions
    const conditions = [{ section: { $in: sectionIds } }]

    // Search by title or content
    if (search) {
      conditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      })
    }

    // Filter by priority
    if (priority) {
      conditions.push({ priority: priority })
    }

    // Filter by status
    if (status) {
      conditions.push({ status: status })
    }

    // Filter by tags (if provided as comma-separated string)
    if (filter && filter.includes('tag:')) {
      const tag = filter.replace('tag:', '')
      conditions.push({ tags: { $in: [tag] } })
    }

    // Combine conditions with $and
    const query = conditions.length > 1 ? { $and: conditions } : conditions[0]

    // Build sort object
    let sortObj = { position: 1 } // default sort
    if (sort) {
      if (sort === 'title') sortObj = { title: 1 }
      else if (sort === 'createdAt') sortObj = { createdAt: -1 }
      else if (sort === 'updatedAt') sortObj = { updatedAt: -1 }
      else if (sort === 'dueDate') sortObj = { dueDate: 1 }
      else if (sort === 'priority') sortObj = { priority: 1 }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const tasks = await Task.find(query)
      .populate('section')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Task.countDocuments(query)

    res.status(200).json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (err) {
    res.status(500).json(err)
  }
}