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

// Function to build UMD version
function buildUMD() {
    console.log('🔧 Building UMD version...');
    const umdBuild = spawn('pnpm', ['run', 'build_js_umd'], {
        stdio: ['inherit', 'pipe', 'pipe']
    });

    umdBuild.stdout.on('data', (data) => {
        const output = data.toString();
        output.split('\n').forEach(line => {
            if (line.trim()) {
                console.log(`🔧 [UMD] ${line}`);
            }
        });
    });

    umdBuild.stderr.on('data', (data) => {
        const output = data.toString();
        output.split('\n').forEach(line => {
            if (line.trim()) {
                console.log(`🔧 [UMD] ${line}`);
            }
        });
    });

    umdBuild.on('close', (code) => {
        if (code === 0) {
            console.log('✅ UMD build completed successfully');
            copyFileSync('dist/umd/simple-datatables.js', 'docs/demos/dist/ksp-table.js');
        } else {
            console.log(`❌ UMD build failed with code ${code}`);
        }
    });
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

// Start TypeScript checker
console.log('🔍 Starting TypeScript checker...');
const tsc = spawn('npx', ['tsc', '--noEmit', '--watch'], {
    stdio: ['inherit', 'pipe', 'pipe']
});

tsc.stdout.on('data', (data) => {
    const output = data.toString();
    output.split('\n').forEach(line => {
        if (line.trim()) {
            console.log(`🔍 [TSC] ${line}`);
        }
    });
});

tsc.stderr.on('data', (data) => {
    const output = data.toString();
    output.split('\n').forEach(line => {
        if (line.trim()) {
            console.log(`🔍 [TSC] ${line}`);
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
                return true;
            }
            return false;
        }
    } catch (error) {
        // File might not exist yet
    }
}

// Check for changes every 500ms (only when we think a build happened)
let checkInterval = null;

rollup.stderr.on('data', (data) => {
  const output = data.toString();
  console.log('output: stderr', output);
  
  const cleanOutput = output.replace(/\u001b\[[0-9;]*m/g, '');
    
  console.log('cleanOutput', cleanOutput);

    // When build completes, check for changes a few times
    if (cleanOutput.includes('created') && cleanOutput.includes('dist/module.js')) {
        const hasChanged = checkAndCopyIfChanged();
        
        if (hasChanged) {
            console.log('🎯 Changes detected, building UMD version...');
            buildUMD();
        }
    }
  

});


// Handle process cleanup
function cleanup() {
    console.log('\n🛑 Stopping all processes...');
    if (checkInterval) clearInterval(checkInterval);
    testServer.kill('SIGINT');
    tsc.kill('SIGINT');
    rollup.kill('SIGINT');
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

testServer.on('close', (code) => {
    console.log(`🌐 Test server exited with code ${code}`);
    if (code !== 0) cleanup();
});

tsc.on('close', (code) => {
    console.log(`🔍 TypeScript checker exited with code ${code}`);
    if (code !== 0) cleanup();
});

rollup.on('close', (code) => {
    console.log(`🔨 Rollup process exited with code ${code}`);
    if (code !== 0) cleanup();
});

console.log('📋 Development environment started!');
console.log('   🌐 Test server: watching test/server.mjs');
console.log('   🔍 TypeScript checker: watching src/ files for type errors');
console.log('   🔨 Build watcher: watching src/ files');
console.log('   📁 Auto-copy: dist/module.js → docs/demos/dist/module.js');
console.log('   🛑 Press Ctrl+C to stop all processes');