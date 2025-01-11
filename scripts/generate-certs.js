import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const certsDir = path.join(__dirname, '..', 'certs');
const domain = 'kpt.arisweb.ru';

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

console.log('Generating SSL certificates...');

try {
  // Generate private key
  execSync(`openssl genrsa -out ${path.join(certsDir, 'server.key')} 2048`);

  // Generate CSR configuration
  const csrConf = `[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
[dn]
C=RU
ST=Moscow
L=Moscow
O=CBT Marketplace
OU=Development
CN=${domain}`;

  const csrConfPath = path.join(certsDir, 'csr.conf');
  fs.writeFileSync(csrConfPath, csrConf);

  // Generate CSR
  execSync(`openssl req -new -key ${path.join(certsDir, 'server.key')} -out ${path.join(certsDir, 'server.csr')} -config ${csrConfPath}`);

  // Generate self-signed certificate
  execSync(`openssl x509 -req -days 365 -in ${path.join(certsDir, 'server.csr')} -signkey ${path.join(certsDir, 'server.key')} -out ${path.join(certsDir, 'server.cert')}`);

  // Clean up CSR files
  fs.unlinkSync(path.join(certsDir, 'server.csr'));
  fs.unlinkSync(csrConfPath);

  console.log('SSL certificates generated successfully!');
  console.log('Certificates location:', certsDir);
} catch (error) {
  console.error('Error generating certificates:', error);
  process.exit(1);
}