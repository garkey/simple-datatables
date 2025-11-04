import { spawn } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

// Ensure the target directory exists
const targetDir = dirname('docs/demos/dist/module.js');
if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
}

// Function to copy the module file
function copyModule() {
    try {
        copyFileSync('dist/module.js', 'docs/demos/dist/module.js');
        console.log('✅ Copied dist/module.js to docs/demos/dist/module.js');
    } catch (error) {
        console.error('❌ Failed to copy module.js:', error.message);
    }
}

// Start test server
console.log('🚀 Starting test server...');
const testServer = spawn('node', ['--watch', 'test/server.mjs'], {
    stdio: ['inherit', 'pipe', 'inherit']
});

testServer.stdout.on('data', (data) => {
    const output = data.toString();
    output.split('\n').forEach(line => {
        if (line.trim()) {
            console.log(`🌐 [SERVER] ${line}`);
        }
    });
});

// Start rollup in watch mode
console.log('🔨 Starting Rollup build watcher...');
const rollup = spawn('npx', ['rollup', '-c', '--watch'], {
    stdio: ['inherit', 'pipe', 'pipe']
});

// Track file modification time to detect real changes
let lastModTime = 0;

function checkAndCopyIfChanged() {
    try {
        if (existsSync('dist/module.js')) {
            const stats = statSync('dist/module.js');
            const currentModTime = stats.mtime.getTime();
            
            console.log('currentModTime', currentModTime);
            console.log('lastModTime', lastModTime);
            console.log('currentModTime > lastModTime', currentModTime > lastModTime);
            

            if (currentModTime > lastModTime) {
                console.log('🎯 New build detected, copying module.js...');
                lastModTime = currentModTime;
                copyModule();
            }
        }
    } catch (error) {
        // File might not exist yet
    }
}

// Check for changes every 500ms (only when we think a build happened)
let checkInterval = null;
/* 
rollup.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('output: stdout', output);
    
    output.split('\n').forEach(line => {
        if (line.trim()) {
            console.log(`🔨 [BUILD] ${line}`);
        }
    });
    
    const cleanOutput = output.replace(/\u001b\[[0-9;]*m/g, '');
    
    // When build starts, clear any existing interval
    if (cleanOutput.includes('bundles') && cleanOutput.includes('src/index.ts')) {
        if (checkInterval) {
            clearInterval(checkInterval);
        }
    }
    
    
});
 */

rollup.stderr.on('data', (data) => {
  const output = data.toString();
  console.log('output: stderr', output);
  
  const cleanOutput = output.replace(/\u001b\[[0-9;]*m/g, '');
    
  console.log('cleanOutput', cleanOutput);

  // When build completes, check for changes a few times
    if (cleanOutput.includes('created') && cleanOutput.includes('dist/module.js')) {
        let checks = 0;
        checkAndCopyIfChanged();
    }
  

});


// Handle process cleanup
function cleanup() {
    console.log('\n🛑 Stopping all processes...');
    if (checkInterval) clearInterval(checkInterval);
    testServer.kill('SIGINT');
    rollup.kill('SIGINT');
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

testServer.on('close', (code) => {
    console.log(`🌐 Test server exited with code ${code}`);
    if (code !== 0) cleanup();
});

rollup.on('close', (code) => {
    console.log(`🔨 Rollup process exited with code ${code}`);
    if (code !== 0) cleanup();
});

console.log('📋 Development environment started!');
console.log('   🌐 Test server: watching test/server.mjs');
console.log('   🔨 Build watcher: watching src/ files');
console.log('   📁 Auto-copy: dist/module.js → docs/demos/dist/module.js');
console.log('   🛑 Press Ctrl+C to stop all processes');