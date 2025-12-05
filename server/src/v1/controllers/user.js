const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');

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
