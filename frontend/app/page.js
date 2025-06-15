
import Navbar from '../components/Navbar';
import SearchClient from './SearchClient';
async function getUsers() {
  try {
    const res = await fetch('http://localhost:5000/api/users', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  } catch (err) {
    console.error('Failed to load users:', err.message);
    return [];
  }
}

export default async function HomePage() {
  const users = await getUsers();

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <SearchClient users={users} />
      </div>
    </>
  );
}
