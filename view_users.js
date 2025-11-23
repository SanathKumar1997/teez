import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'server/teez.db');
const db = new sqlite3.Database(dbPath);

console.log('📋 Fetching all users from database...\n');

db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
        console.error('❌ Error:', err.message);
        return;
    }

    if (rows.length === 0) {
        console.log('No users found in the database.');
    } else {
        console.log(`Found ${rows.length} user(s):\n`);
        rows.forEach((user, index) => {
            console.log(`User #${index + 1}:`);
            console.log(`  ID: ${user.id}`);
            console.log(`  Name: ${user.name}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Admin: ${user.is_admin ? 'Yes' : 'No'}`);
            console.log(`  Created: ${user.created_at}`);
            console.log('');
        });
    }

    db.close();
});
