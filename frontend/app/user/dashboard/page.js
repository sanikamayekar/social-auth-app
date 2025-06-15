'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ name: '', bio: '' });
  const [preview, setPreview] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    const decoded = jwtDecode(token);
    if (decoded.role !== 'user') return router.push('/login');

    setUserId(decoded.id);
    fetchUser(decoded.id);
  }, [router]);

const fetchUser = async (id) => {
  try {
    const token = localStorage.getItem('token'); // ✅ Get token
    const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Include token in headers
      },
    });
    setUser(res.data);
    setForm({ name: res.data.name || '', bio: res.data.bio || '' });
  } catch (err) {
    console.error('Fetch error:', err);
  }
};

const handleUpdate = async () => {
  try {
    const token = localStorage.getItem('token'); // ✅ Get token
    await axios.put(
      `http://localhost:5000/api/users/${userId}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token in headers
          'Content-Type': 'application/json',
        },
      }
    );
    fetchUser(userId);
  } catch (err) {
    console.error('Update error:', err);
  }
};

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    const token = localStorage.getItem('token'); // ✅ get token

    try {
      await axios.post(
        `http://localhost:5000/api/users/${userId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ pass token in headers
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      setPreview(null);
      fetchUser(userId);
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
    }
  };

  // ✅ FIXED: This was missing
  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      handleUpload(e);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">User Dashboard</h1>

        <div className="flex justify-center mb-4">
          <img
            src={
              preview ||
              (user.profileImage ? `http://localhost:5000${user.profileImage}` : '/default-avatar.png')
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
          />
        </div>

        <Input type="file" accept="image/*" onChange={handlePreview} className="mb-4" />

        <Input
          className="mb-4"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Textarea
          className="mb-4"
          placeholder="Your Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <Button className="w-full" onClick={handleUpdate}>
          Save Changes
        </Button>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p><strong>Followers:</strong> {user.followers?.length || 10}</p>
          <p><strong>Following:</strong> {user.following?.length || 5}</p>
        </div>
      </div>
    </>
  );
}
