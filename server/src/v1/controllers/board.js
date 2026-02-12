const Board = require('../models/board')
const Section = require('../models/section')
const Task = require('../models/task')

exports.create = async (req, res) => {
  try {
    const boardsCount = await Board.countDocuments({ user: req.user._id })
    const board = await Board.create({
      user: req.user._id,
      position: boardsCount > 0 ? boardsCount : 0
    })
    res.status(201).json(board)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.getAll = async (req, res) => {
  try {
    const { search, sort, filter, page, limit } = req.query
    
    // Build query
    let query = { user: req.user._id }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Filter by favourite
    if (filter === 'favourite') {
      query.favourite = true
    }
    
    // Build sort object
    let sortObj = { position: -1 } // default sort
    if (sort) {
      if (sort === 'title') sortObj = { title: 1 }
      else if (sort === 'createdAt') sortObj = { createdAt: -1 }
      else if (sort === 'updatedAt') sortObj = { updatedAt: -1 }
    }
    
    // If no pagination params, return all boards (backward compatibility)
    if (!page && !limit && !search && !sort && !filter) {
      const boards = await Board.find(query).sort(sortObj)
      return res.status(200).json(boards)
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 10
    const skip = (pageNum - 1) * limitNum
    
    const boards = await Board.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
    
    const total = await Board.countDocuments(query)
    
    res.status(200).json({
      boards,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.updatePosition = async (req, res) => {
  const { boards } = req.body
  try {
    const reversed = boards.reverse()
    const ops = reversed.map((board, index) => ({
      updateOne: {
        filter: { _id: board.id },
        update: { $set: { position: index } }
      }
    }))
    await Board.bulkWrite(ops)
    res.status(200).json('updated')
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.getOne = async (req, res) => {
  const { boardId } = req.params
  try {
    const board = await Board.findOne({ user: req.user._id, _id: boardId })
    if (!board) return res.status(404).json('Board not found')
    const sections = await Section.find({ board: boardId })
    const sectionIds = sections.map(s => s._id)

    // Single query for all tasks across all sections instead of N+1
    const allTasks = await Task.find({ section: { $in: sectionIds } })
      .populate('section')
      .sort('-position')

    // Group tasks by section
    const tasksBySection = {}
    for (const task of allTasks) {
      const sid = task.section._id.toString()
      if (!tasksBySection[sid]) tasksBySection[sid] = []
      tasksBySection[sid].push(task)
    }

    for (const section of sections) {
      section._doc.tasks = tasksBySection[section._id.toString()] || []
    }
    board._doc.sections = sections
    res.status(200).json(board)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.update = async (req, res) => {
  const { boardId } = req.params
  const { title, description, favourite } = req.body

  try {
    if (title === '') req.body.title = 'Untitled'
    if (description === '') req.body.description = 'Add description here'
    const currentBoard = await Board.findById(boardId)
    if (!currentBoard) return res.status(404).json('Board not found')

    if (favourite !== undefined && currentBoard.favourite !== favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId }
      }).sort('favouritePosition').lean()
      if (favourite) {
        req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0
      } else if (favourites.length > 0) {
        const ops = favourites.map((el, index) => ({
          updateOne: {
            filter: { _id: el._id },
            update: { $set: { favouritePosition: index } }
          }
        }))
        await Board.bulkWrite(ops)
      }
    }

    const board = await Board.findByIdAndUpdate(
      boardId,
      { $set: req.body }
    )
    res.status(200).json(board)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.getFavourites = async(req,res) => {
  try {
    const favourites = await Board.find({ user: req.user._id, favourite: true }).sort('-favouritePosition')
    res.status(200).json(favourites)

  } catch (err) {
    res.status(500).json(err)
    
  }
}

exports.updateFavouritePosition = async (req, res) => {
  const { boards } = req.body
  try {
    const reversed = boards.reverse()
    const ops = reversed.map((board, index) => ({
      updateOne: {
        filter: { _id: board.id },
        update: { $set: { favouritePosition: index } }
      }
    }))
    await Board.bulkWrite(ops)
    res.status(200).json('updated')
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.delete = async (req, res) => {
  const { boardId } = req.params
  try {
    const currentBoard = await Board.findById(boardId)
    if (!currentBoard) return res.status(404).json('Board not found')

    // Delete all tasks for all sections of this board in one query
    const sectionIds = (await Section.find({ board: boardId }).select('_id').lean()).map(s => s._id)
    await Task.deleteMany({ section: { $in: sectionIds } })
    await Section.deleteMany({ board: boardId })

    // Reposition favourites if needed
    if (currentBoard.favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId }
      }).sort('favouritePosition').lean()

      if (favourites.length > 0) {
        const favOps = favourites.map((el, index) => ({
          updateOne: {
            filter: { _id: el._id },
            update: { $set: { favouritePosition: index } }
          }
        }))
        await Board.bulkWrite(favOps)
      }
    }

    await Board.deleteOne({ _id: boardId })

    // Reposition remaining boards for this user
    const boards = await Board.find({ user: currentBoard.user }).sort('position').lean()
    if (boards.length > 0) {
      const posOps = boards.map((board, index) => ({
        updateOne: {
          filter: { _id: board._id },
          update: { $set: { position: index } }
        }
      }))
      await Board.bulkWrite(posOps)
    }

    res.status(200).json('deleted')
  } catch (err) {
    res.status(500).json(err)
  }
}