import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'server/teez.db');
const db = new sqlite3.Database(dbPath);

// Admin user credentials
const adminUser = {
    name: 'Admin User',
    email: 'admin@teez.com',
    password: 'admin123',
    is_admin: 1
};

console.log('🔐 Creating admin user...\n');

// Hash the password
bcrypt.hash(adminUser.password, 10, (err, hash) => {
    if (err) {
        console.error('❌ Error hashing password:', err.message);
        db.close();
        return;
    }

    // Insert admin user
    const sql = `INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)`;

    db.run(sql, [adminUser.name, adminUser.email, hash, adminUser.is_admin], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                console.log('⚠️  Admin user already exists!');
                console.log('\n📧 Use existing credentials:');
                console.log('   Email: admin@teez.com');
                console.log('   Password: admin123');
            } else {
                console.error('❌ Error creating user:', err.message);
            }
        } else {
            console.log('✅ Admin user created successfully!\n');
            console.log('📧 Login Credentials:');
            console.log('   Email: admin@teez.com');
            console.log('   Password: admin123');
            console.log('\n🔑 Admin Features Available:');
            console.log('   • Access Admin Panel (/admin)');
            console.log('   • Manage Products (Add/Edit/Delete)');
            console.log('   • Apply Discounts');
            console.log('   • Update Stock Quantities');
            console.log('   • Access Custom Design Tool');
        }

        db.close();
    });
});
