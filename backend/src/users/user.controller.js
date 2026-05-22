const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./user.model");
const Book = require("../books/book.model");

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'secretkey';
const ADMIN_REGISTRATION_CODE = process.env.ADMIN_REGISTRATION_CODE || 'admin1234';

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address, role, adminCode } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const normalizedRole = role === 'admin' ? 'admin' : 'user';

    if (normalizedRole === 'admin') {
      if (!adminCode || adminCode !== ADMIN_REGISTRATION_CODE) {
        return res.status(403).json({ message: 'Admin registration requires a valid admin code.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      role: normalizedRole,
    });

    const token = createToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "Not admin" });
    }

    const token = createToken(admin);

    res.json({
      message: "Admin login success",
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL USERS (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET recommendations for a user based on their category preferences
const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('purchasedBooks likedBooks');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Build ranked categories list
    const catMap = user.preferences?.categories || new Map();
    // Convert Map to array of [category, count]
    const catArray = Array.from(catMap.entries ? catMap.entries() : Object.entries(catMap));
    catArray.sort((a, b) => b[1] - a[1]);
    const topCategories = catArray.slice(0, 3).map(([c]) => c);

    // Exclude already purchased/liked books
    const excluded = new Set([
      ...(user.purchasedBooks || []).map(String),
      ...(user.likedBooks || []).map(String),
    ]);

    let query = { _id: { $nin: Array.from(excluded) } };
    if (topCategories.length > 0) query.category = { $in: topCategories };

    const recommendations = await Book.find(query).limit(12);

    res.json({ recommendations });
  } catch (error) {
    console.error('Failed to get recommendations', error);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getAllUsers,
  getRecommendations,
};