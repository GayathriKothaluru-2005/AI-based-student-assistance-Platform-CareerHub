const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Please sign in with Google' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await user.update({ lastLogin: new Date() });
    const token = generateToken(user);

    res.json({
      message: 'Signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ New: handles token-based Google auth from frontend
const googleAuth = async (req, res, next) => {
  try {
    const { profile } = req.body;
    // profile = { sub, email, name, picture } from Google

    if (!profile || !profile.email) {
      return res.status(400).json({ message: 'Invalid Google profile data' });
    }

    // Check if user exists by googleId first
    let user = await User.findOne({ where: { googleId: profile.sub } });

    if (!user) {
      // Check if email already registered (link accounts)
      user = await User.findOne({ where: { email: profile.email } });

      if (user) {
        // Link Google to existing email account
        await user.update({
          googleId: profile.sub,
          avatar: profile.picture || user.avatar,
          isVerified: true,
        });
      } else {
        // Create brand new user
        user = await User.create({
          name: profile.name,
          email: profile.email,
          googleId: profile.sub,
          avatar: profile.picture,
          password: null,
          isVerified: true,
        });
      }
    } else {
      // Update avatar if changed
      if (profile.picture && user.avatar !== profile.picture) {
        await user.update({ avatar: profile.picture });
      }
    }

    await user.update({ lastLogin: new Date() });
    const token = generateToken(user);

    res.json({
      message: 'Google sign in successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Legacy Passport.js callback (keep if used elsewhere)
const googleCallback = async (req, res, next) => {
  try {
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0].value;
    const avatar = photos[0].value;

    let user = await User.findOne({ where: { googleId: id } });

    if (!user) {
      user = await User.findOne({ where: { email } });
      if (user) {
        await user.update({ googleId: id, avatar });
      } else {
        user = await User.create({
          name: displayName,
          email,
          googleId: id,
          avatar,
          isVerified: true,
        });
      }
    } else {
      if (avatar && user.avatar !== avatar) {
        await user.update({ avatar });
      }
    }

    const token = generateToken(user);
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth-callback?token=${token}&userId=${user.id}`;
    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  verifyToken,
  googleAuth,
  googleCallback,
};