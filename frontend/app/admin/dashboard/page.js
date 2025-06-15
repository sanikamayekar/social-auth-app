// // app/admin/dashboard/page.js
// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import Navbar from '../../../components/Navbar';
// import AdminClient from './AdminClient';

// const JWT_SECRET = 'my_jwt_secret_key';


// async function getUsers(token) {
//   const res = await fetch('http://localhost:5000/api/users', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     cache: 'no-store',
//   });

//   if (!res.ok) return [];

//   // Ensure it's a plain object
//   const raw = await res.json();
//   return JSON.parse(JSON.stringify(raw));
// }

// export default async function AdminDashboard() {
//   const cookieStore = await cookies(); // ✅ FIXED: await here
//   const token = cookieStore.get('token')?.value;

//   if (!token) redirect('/login'); // ✅ no return needed

//   let decoded;
//   try {
//     decoded = jwt.verify(token, JWT_SECRET);
//   } catch {
//     redirect('/login');
//   }

//   if (decoded.role !== 'admin') {
//     redirect('/login');
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


// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import jwt from 'jsonwebtoken';
// import Navbar from '../../../components/Navbar';
// import AdminClient from './AdminClient';

// const JWT_SECRET = 'my_jwt_secret_key'; // Make sure it matches backend

// async function getUsers(token) {
//   const res = await fetch('http://localhost:5000/api/users', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     cache: 'no-store',
//   });
//   if (!res.ok) return [];
//   return JSON.parse(JSON.stringify(await res.json()));
// }

// export default async function AdminDashboard() {
//   const cookieStore = cookies();
//   const token = cookieStore.get('token')?.value;

//   if (!token) redirect('/login');

//   let decoded;
//   try {
//     decoded = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     console.error('JWT error:', err);
//     redirect('/login');
//   }

//   if (decoded.role !== 'admin') redirect('/login');

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




import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../../../components/Navbar';
import AdminClient from './AdminClient';

async function getUsers(token) {
  const res = await fetch('http://localhost:5000/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  return await res.json();
}

export default async function AdminDashboard() {
  const token = cookies().get('token')?.value;

  if (!token) redirect('/login');

  let decoded;
  try {
    decoded = jwtDecode(token); // ✅ only decode, don't verify
  } catch (err) {
    console.error('JWT decode error:', err);
    redirect('/login');
  }

  if (decoded.role !== 'admin') {
    console.error('Unauthorized: role is not admin');
    redirect('/login');
  }

  const users = await getUsers(token);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">✅ Admin Dashboard</h1>
        <AdminClient users={users} token={token} />
      </main>
    </>
  );
}
