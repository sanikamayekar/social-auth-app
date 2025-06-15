// // 14/06/25

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// // ✅ Create 'uploads' folder if it doesn't exist
// const uploadPath = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath);
// }

// // ✅ Multer Config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadPath),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname))
// });
// const upload = multer({ storage });

// // ✅ Auth Middleware (admin-check optional)
// function auth(requireAdmin = false) {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ error: 'No token' });

//     const token = authHeader.split(' ')[1];
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET);
//       if (requireAdmin && decoded.role !== 'admin') {
//         return res.status(403).json({ error: 'Admin access required' });
//       }
//       req.user = decoded;
//       next();
//     } catch {
//       return res.status(401).json({ error: 'Invalid token' });
//     }
//   };
// }

// // ✅ Get all users without passwords
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// // ✅ Get user by ID (without password)
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Update user (admin only)
// router.put('/:id', auth(true), async (req, res) => {
//   const { name, bio, role } = req.body;
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { name, bio, role },
//       { new: true }
//     ).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: 'Update failed' });
//   }
// });

// // ✅ Delete user (admin only)
// router.delete('/:id', auth(true), async (req, res) => {
//   try {
//     const deleted = await User.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: 'User not found' });
//     res.json({ message: 'User deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Delete failed' });
//   }
// });

// // ✅ Upload profile image (user only)
// router.post('/:id/upload', upload.single('profileImage'), async (req, res) => {
//   try {
//     const filePath = `/uploads/${req.file.filename}`;
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { profileImage: filePath },
//       { new: true }
//     ).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: 'Image upload failed' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// ✅ Create 'uploads' folder if it doesn't exist
const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ✅ Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Auth Middleware (admin-check optional)
function auth(requireAdmin = false) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (requireAdmin && decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// ✅ Get all users without passwords
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ Get user by ID (without password)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Update user (admin or self)
router.put('/:id', auth(), async (req, res) => {
  const { name, bio, role } = req.body;

  const isSelf = req.user.id === req.params.id;
  const isAdmin = req.user.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ error: 'Forbidden: You cannot update others' });
  }

  const updateData = { name, bio };
  if (isAdmin && role) {
    updateData.role = role;
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// ✅ Delete user (admin only)
router.delete('/:id', auth(true), async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ✅ Upload profile image (user or admin)
router.post('/:id/upload', auth(), upload.single('profileImage'), async (req, res) => {
  const isSelf = req.user.id === req.params.id;
  const isAdmin = req.user.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Cannot upload for others' });
  }

  try {
    const filePath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: filePath },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error('Image upload failed:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
