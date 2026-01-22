const dns = require('dns');
const net = require('net');

// Force IPv4
dns.setDefaultResultOrder('ipv4first');

const host = 'db.yjsmugjzolprxtfrtgyc.supabase.co';

dns.resolve4(host, (err, addresses) => {
  if (err) {
    console.error('❌ DNS resolution failed:', err);
    return;
  }
  
  console.log('✅ IPv4 addresses:', addresses);
  
  // Test connection to first IP
  const socket = net.createConnection({ host: addresses[0], port: 5432 }, () => {
    console.log('✅ Successfully connected to', addresses[0]);
    socket.end();
  });
  
  socket.on('error', (err) => {
    console.error('❌ Connection failed:', err.message);
  });
});