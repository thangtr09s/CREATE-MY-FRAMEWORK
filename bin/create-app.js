#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const appName = process.argv[2];

if (!appName) {
    console.error('Please specify the project directory');
    console.error('Example:');
    console.error('    create-app my-app');
    process.exit(1);
}

const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

const projectName = process.argv[2];
if (!projectName) {
    console.error('Please provide a project name.');
    process.exit(1);
}

const templateDir = path.resolve(__dirname, '../templates/app');
const targetDir = path.resolve(process.cwd(), projectName);

fs.mkdirSync(targetDir);
fs.cpSync(templateDir, targetDir, { recursive: true });

exec(`cd ${appName} && npm install`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error installing dependencies: ${error}`);
        return;
    }
    console.log(stdout);
    console.error(stderr);
});

copyRecursiveSync(templateDir, targetDir);

console.log(`Project ${projectName} created successfully.`);
console.log(`cd ${appName} && npm start`);
