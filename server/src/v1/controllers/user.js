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
   

        console.log(user)

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
        console.error('Error during login:', err);
        res.status(500).json(err);
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
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
        console.error('Error getting profile:', err);
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
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all boards for this user
        const boards = await Board.find({ user: userId });
        const boardIds = boards.map(b => b._id);

        // Get all sections for these boards
        const sections = await Section.find({ board: { $in: boardIds } });
        const sectionIds = sections.map(s => s._id);

        // Get all tasks for these sections
        const tasks = await Task.find({ section: { $in: sectionIds } });

        // Calculate analytics
        const totalBoards = boards.length;
        const totalSections = sections.length;
        const totalTasks = tasks.length;
        const favouriteBoards = boards.filter(b => b.favourite).length;

        // Task status breakdown
        const tasksByStatus = {
            todo: tasks.filter(t => t.status === 'todo').length,
            inProgress: tasks.filter(t => t.status === 'in-progress').length,
            completed: tasks.filter(t => t.status === 'completed').length
        };

        // Task priority breakdown
        const tasksByPriority = {
            low: tasks.filter(t => t.priority === 'low').length,
            medium: tasks.filter(t => t.priority === 'medium').length,
            high: tasks.filter(t => t.priority === 'high').length
        };

        // Overdue tasks (due date in the past and not completed)
        const now = new Date();
        const overdueTasks = tasks.filter(t =>
            t.dueDate &&
            new Date(t.dueDate) < now &&
            t.status !== 'completed'
        ).length;

        // Tasks due soon (within next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const dueSoonTasks = tasks.filter(t =>
            t.dueDate &&
            new Date(t.dueDate) >= now &&
            new Date(t.dueDate) <= nextWeek &&
            t.status !== 'completed'
        ).length;

        // Completion rate
        const completionRate = totalTasks > 0
            ? Math.round((tasksByStatus.completed / totalTasks) * 100)
            : 0;

        // Subtask stats
        const totalSubtasks = tasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0);
        const completedSubtasks = tasks.reduce((acc, t) =>
            acc + (t.subtasks?.filter(s => s.completed).length || 0), 0
        );

        // Recent activity - tasks created/updated in last 7 days
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const recentTasks = tasks.filter(t =>
            new Date(t.updatedAt) >= lastWeek
        ).length;

        // Board with most tasks
        const boardTaskCounts = {};
        for (const section of sections) {
            const boardId = section.board.toString();
            const sectionTasks = tasks.filter(t => t.section.toString() === section._id.toString()).length;
            boardTaskCounts[boardId] = (boardTaskCounts[boardId] || 0) + sectionTasks;
        }

        let mostActiveBoard = null;
        let maxTasks = 0;
        for (const board of boards) {
            const count = boardTaskCounts[board._id.toString()] || 0;
            if (count > maxTasks) {
                maxTasks = count;
                mostActiveBoard = { title: board.title, icon: board.icon, taskCount: count };
            }
        }

        res.status(200).json({
            overview: {
                totalBoards,
                totalSections,
                totalTasks,
                favouriteBoards,
                completionRate
            },
            tasks: {
                byStatus: tasksByStatus,
                byPriority: tasksByPriority,
                overdue: overdueTasks,
                dueSoon: dueSoonTasks,
                recentlyActive: recentTasks
            },
            subtasks: {
                total: totalSubtasks,
                completed: completedSubtasks
            },
            mostActiveBoard
        });
    } catch (err) {
        console.error('Error getting analytics:', err);
        res.status(500).json({ message: 'Error getting analytics' });
    }
};
