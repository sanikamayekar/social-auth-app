'use client';

import { useState } from 'react';

export default function AdminClient({ users: initialUsers, token }) {
  const [userList, setUserList] = useState(initialUsers);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', bio: '', role: '' });

  const startEdit = (u) => {
    setEditing(u._id);
    setForm({ name: u.name, email: u.email, bio: u.bio, role: u.role });
  };

  const handleUpdate = async (id) => {
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setUserList((prev) => prev.map((u) => (u._id === id ? updated : u)));
      setEditing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUserList((prev) => prev.filter((u) => u._id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {userList.map((u) => (
        <div
          key={u._id}
          className="p-4 shadow border rounded bg-white flex justify-between items-center"
        >
          {editing === u._id ? (
            <div className="flex-1 space-y-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="border rounded px-2 py-1 w-full"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="border rounded px-2 py-1 w-full"
              />
              <input
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Bio"
                className="border rounded px-2 py-1 w-full"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleUpdate(u._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <p><strong>Name:</strong> {u.name}</p>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Bio:</strong> {u.bio}</p>
              <p><strong>Role:</strong> {u.role}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => startEdit(u)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
