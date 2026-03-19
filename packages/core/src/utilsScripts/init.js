import path from 'path';
import fs from 'fs';
import { homedir } from 'os';

const dbPath = path.join(homedir(), '.spiderq', 'main.db');

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(path.join(homedir(), '.spiderq'), { recursive: true });
  fs.writeFileSync(dbPath, '', { flag: 'wx' });
  console.log('Created database');
}
