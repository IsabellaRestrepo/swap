// Simple static file server for SWAP! — no dependencies needed.
// Usage: node server.js  (then open the printed URL)
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8877;
const ROOT = __dirname;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.json': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

function localIPs(){
  const nets = os.networkInterfaces();
  const ips = [];
  for(const name of Object.keys(nets)){
    for(const net of nets[name]){
      if(net.family === 'IPv4' && !net.internal) ips.push(net.address);
    }
  }
  return ips;
}

const server = http.createServer((req, res)=>{
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if(reqPath === '/') reqPath = '/Swap.html';
  const filePath = path.join(ROOT, reqPath);
  if(!filePath.startsWith(ROOT)){ res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(filePath, (err, data)=>{
    if(err){ res.writeHead(404); res.end('Not found: '+reqPath); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {'Content-Type': TYPES[ext] || 'application/octet-stream'});
    res.end(data);
  });
});

server.listen(PORT, ()=>{
  console.log(`SWAP! corriendo en:`);
  console.log(`  http://localhost:${PORT}`);
  localIPs().forEach(ip=> console.log(`  http://${ip}:${PORT}   <-- abre esta desde tu celular (misma WiFi)`));
});
