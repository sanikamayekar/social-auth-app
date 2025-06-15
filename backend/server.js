// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');

// const app = express();
// dotenv.config();

// // ✅ Use CORS *before* routes and with correct config
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));

// // ✅ Use JSON parser
// app.use(express.json());

// // ✅ Serve static files from /uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((err) => console.error('❌ MongoDB error:', err));

// // ✅ Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/user'));

// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));






// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import jwt from 'jsonwebtoken';
// import Navbar from '../../../components/Navbar';
// import AdminClient from './AdminClient';

// const JWT_SECRET = process.env.JWT_SECRET || 'my_jwt_secret_key';

// async function getUsers(token) {
//   const res = await fetch('http://localhost:5000/api/users', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     cache: 'no-store',
//   });

//   if (!res.ok) return [];
//   return await res.json();
// }

// export default async function AdminDashboard() {
//   // ✅ Correct usage of cookies()
//   const cookieStore = cookies();
//   const tokenCookie = cookieStore.get('token');
//   const token = tokenCookie?.value;

//   if (!token) {
//     console.warn('❌ No token in cookie');
//     return redirect('/login');
//   }

//   let decoded;
//   try {
//     decoded = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     console.error('❌ Invalid JWT:', err);
//     return redirect('/login');
//   }

//   if (decoded.role !== 'admin') {
//     console.warn('❌ Not an admin');
//     return redirect('/login');
//   }

//   const users = await getUsers(token);

//   return (
//     <>
//       <Navbar />
//       <main className="max-w-5xl mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-4">✅ Admin Dashboard</h1>
//         <AdminClient users={users} token={token} />
//       </main>
//     </>
//   );
// }



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes); // ✅ includes admin-only check in route

// // DB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('✅ MongoDB Connected'))
// .catch((err) => console.error('❌ MongoDB Error:', err));

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ✅ Serve static profile images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
