import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/teez.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

db.serialize(() => {
    console.log('Database path:', dbPath);

    db.all("SELECT id, customer_email, total_amount FROM orders", [], (err, rows) => {
        if (err) throw err;
        console.log('Orders Count:', rows.length);
        console.log('Orders:', JSON.stringify(rows, null, 2));
    });

    db.all("SELECT id, email, name FROM users", [], (err, rows) => {
        if (err) throw err;
        console.log('Users Count:', rows.length);
        console.log('Users:', JSON.stringify(rows, null, 2));
    });
});

db.close();
