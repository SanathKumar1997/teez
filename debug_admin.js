// Debug script - paste this in browser console after logging in

console.log('🔍 Debugging Admin Access...\n');

const user = localStorage.getItem('user');
const token = localStorage.getItem('token');

console.log('User data in localStorage:');
console.log(user ? JSON.parse(user) : 'No user found');

console.log('\nToken exists:', !!token);

if (user) {
    const userData = JSON.parse(user);
    console.log('\n✅ Checks:');
    console.log('  - is_admin field exists:', 'is_admin' in userData);
    console.log('  - is_admin value:', userData.is_admin);
    console.log('  - is_admin type:', typeof userData.is_admin);
    console.log('  - Should show admin UI:', userData.is_admin === true || userData.is_admin === 1);
}

console.log('\n💡 If is_admin is false or undefined:');
console.log('  1. Logout from the app');
console.log('  2. Login again with admin@teez.com / admin123');
console.log('  3. The admin badge should appear in the header');
