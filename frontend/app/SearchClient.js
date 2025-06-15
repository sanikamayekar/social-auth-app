'use client';

import { useState } from 'react';

export default function SearchClient({ users }) {
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      {filtered.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        filtered.map((user) => <UserCard key={user._id} user={user} />)
      )}
    </div>
  );
}

function UserCard({ user }) {
  const imageUrl = user.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : '/default-avatar.png'; 

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg shadow bg-white hover:shadow-md transition">
      <img
        src={imageUrl}
        alt={user.name}
        className="w-14 h-14 rounded-full object-cover border"
      />
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
        {user.bio && <p className="text-sm text-gray-600 mt-1">{user.bio}</p>}
        <div className="text-xs text-gray-400 mt-1">
          <span>Followers: {user.followers?.length || 10}</span>{' '}
          · <span>Following: {user.following?.length || 5}</span>
        </div>
      </div>
    </div>
  );
}
