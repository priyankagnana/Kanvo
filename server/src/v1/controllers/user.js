const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const Board = require('../models/board');
const Section = require('../models/section');
const Task = require('../models/task');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(201).json({ user: { username: user.username, email: user.email }, token });
  } catch (err) {
    res.status(500).json(err);
  }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('password username email');
   

        if (!user) {
            return res.status(401).json({
                errors: [{ param: 'email', msg: 'Looks like you have not signed up' }],
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                errors: [{ param: 'password', msg: 'Invalid password' }],
            });
        }

        user.password = undefined;

        const token = jsonwebtoken.sign(
            { id: user._id },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(200).json({ user: { username: user.username, email: user.email }, token });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        });
    } catch (err) {
        res.status(500).json({ message: 'Error getting profile' });
    }
};

exports.updateProfile = async (req, res) => {
    const { username } = req.body;

    try {
        // Check if username is already taken by another user
        const existingUser = await User.findOne({
            username,
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            return res.status(400).json({
                errors: [{ param: 'username', msg: 'Username already taken' }]
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { username },
            { new: true }
        );

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        // Get board-level stats in a single query
        const boards = await Board.find({ user: userId }).lean();
        const boardIds = boards.map(b => b._id);
        const totalBoards = boards.length;
        const favouriteBoards = boards.filter(b => b.favourite).length;

        // Get section IDs in one query
        const sections = await Section.find({ board: { $in: boardIds } }).select('_id board').lean();
        const sectionIds = sections.map(s => s._id);
        const totalSections = sections.length;

        // Use aggregation pipeline for all task stats in a single DB round-trip
        const [taskStats] = await Task.aggregate([
            { $match: { section: { $in: sectionIds } } },
            {
                $group: {
                    _id: null,
                    totalTasks: { $sum: 1 },
                    todo: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
                    completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                    low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
                    medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
                    high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
                    overdue: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $ne: ['$dueDate', null] },
                                    { $lt: ['$dueDate', now] },
                                    { $ne: ['$status', 'completed'] }
                                ]},
                                1, 0
                            ]
                        }
                    },
                    dueSoon: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $ne: ['$dueDate', null] },
                                    { $gte: ['$dueDate', now] },
                                    { $lte: ['$dueDate', nextWeek] },
                                    { $ne: ['$status', 'completed'] }
                                ]},
                                1, 0
                            ]
                        }
                    },
                    recentlyActive: {
                        $sum: { $cond: [{ $gte: ['$updatedAt', lastWeek] }, 1, 0] }
                    },
                    totalSubtasks: { $sum: { $size: { $ifNull: ['$subtasks', []] } } },
                    completedSubtasks: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: { $ifNull: ['$subtasks', []] },
                                    as: 'st',
                                    cond: { $eq: ['$$st.completed', true] }
                                }
                            }
                        }
                    }
                }
            }
        ]);

        const stats = taskStats || {
            totalTasks: 0, todo: 0, inProgress: 0, completed: 0,
            low: 0, medium: 0, high: 0, overdue: 0, dueSoon: 0,
            recentlyActive: 0, totalSubtasks: 0, completedSubtasks: 0
        };

        // Most active board via aggregation
        const boardTaskCounts = await Task.aggregate([
            { $match: { section: { $in: sectionIds } } },
            {
                $lookup: {
                    from: 'sections',
                    localField: 'section',
                    foreignField: '_id',
                    as: 'sec'
                }
            },
            { $unwind: '$sec' },
            { $group: { _id: '$sec.board', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        let mostActiveBoard = null;
        if (boardTaskCounts.length > 0) {
            const topBoard = boards.find(b => b._id.toString() === boardTaskCounts[0]._id.toString());
            if (topBoard) {
                mostActiveBoard = { title: topBoard.title, icon: topBoard.icon, taskCount: boardTaskCounts[0].count };
            }
        }

        const completionRate = stats.totalTasks > 0
            ? Math.round((stats.completed / stats.totalTasks) * 100)
            : 0;

        res.status(200).json({
            overview: {
                totalBoards,
                totalSections,
                totalTasks: stats.totalTasks,
                favouriteBoards,
                completionRate
            },
            tasks: {
                byStatus: { todo: stats.todo, inProgress: stats.inProgress, completed: stats.completed },
                byPriority: { low: stats.low, medium: stats.medium, high: stats.high },
                overdue: stats.overdue,
                dueSoon: stats.dueSoon,
                recentlyActive: stats.recentlyActive
            },
            subtasks: {
                total: stats.totalSubtasks,
                completed: stats.completedSubtasks
            },
            mostActiveBoard
        });
    } catch (err) {
        res.status(500).json({ message: 'Error getting analytics' });
    }
};
