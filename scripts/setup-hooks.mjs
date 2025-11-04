import { writeFileSync, mkdirSync, chmodSync, existsSync } from 'fs';
import { join } from 'path';

// Ensure .husky directory exists
if (!existsSync('.husky')) {
    mkdirSync('.husky', { recursive: true });
}

// Create pre-commit hook content
const hookContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm test && pnpm run pre-commit
`;

// Write the hook file
const hookPath = join('.husky', 'pre-commit');
writeFileSync(hookPath, hookContent, 'utf8');

// Make executable (Unix/Linux/macOS only, ignored on Windows)
try {
    chmodSync(hookPath, 0o755);
} catch (error) {
    // Silently ignore on Windows
}

console.log('✅ Pre-commit hook created successfully!');
console.log('📁 Location:', hookPath);