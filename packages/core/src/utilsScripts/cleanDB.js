import path from 'path';
import fs from 'fs';
import { homedir } from 'os';


const dbPath = path.join(homedir(), '.spiderq', 'main.db');

fs.rmSync(dbPath, { force: true });
console.log('Cleaned database');
