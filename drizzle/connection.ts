import dns from 'dns';

// Force IPv4 globally for Node.js
dns.setDefaultResultOrder('ipv4first');

// You can also set specific DNS servers
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS