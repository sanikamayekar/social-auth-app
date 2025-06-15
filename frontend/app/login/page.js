// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', form);
//       localStorage.setItem('token', res.data.token);

//       const decoded = JSON.parse(atob(res.data.token.split('.')[1]));
//       if (decoded.role === 'admin') {
//         router.push('/admin/dashboard');
//       } else {
//         router.push('/user/dashboard');
//       }
//     } catch (err) {
//       console.error('Login error:', err.response?.data || err.message);
//       alert('Login failed. Please check your credentials.');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//       <form onSubmit={handleLogin} className="space-y-4">
//         <input
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/login',
      form,
      {
        withCredentials: true,
      }
    );

    // ✅ Decode token from response
    const token = res.data.token;
    if (!token) {
      throw new Error('No token received');
    }

    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    // ✅ Optional: Save token in localStorage or cookie
    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/`;

    // ✅ Role-based redirection
    if (userRole === 'admin') {
      router.push('/admin/dashboard');
    } else if (userRole === 'user') {
      router.push('/user/dashboard');
    } else {
      throw new Error('Unknown role');
    }
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    alert(err.response?.data?.error || 'Login failed. Please check your credentials.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
