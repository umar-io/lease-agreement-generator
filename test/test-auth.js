const { Client } = require('pg');

// Paste the password you just copied from Supabase
const password = 'gsrFzhNaLtudxwvk';

const client = new Client({
  host: '18.198.30.239',
  port: 5432,
  user: 'postgres.yjsmugjzolprxtfrtgyc',
  password: password,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

console.log('Testing with password length:', password.length);
console.log('Attempting connection...');

client.connect()
  .then(() => {
    console.log('✅ SUCCESS! Password works!');
    return client.query('SELECT current_user');
  })
  .then((result) => {
    console.log('✅ Connected as:', result.rows[0].current_user);
    client.end();
  })
  .catch((err) => {
    console.error('❌ FAILED:', err.message);
    client.end();
  });