import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, 'src');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            // Remove unused React import
            content = content.replace(/import React from 'react';\r?\n/g, '');
            content = content.replace(/import React, {([^}]+)} from 'react';\r?\n/g, 'import {$1} from \'react\';\n');
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
}

walk(directory);
console.log('Cleanup complete');
