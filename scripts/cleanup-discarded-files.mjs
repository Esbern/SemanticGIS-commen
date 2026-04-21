import fs from 'fs';
import path from 'path';

const filesToDeletePath = '/Users/holmes/local_dev/semanticGIS/DanishData/content/assets/lookup/files-to-delete.json';

// Load the list
const filesToDelete = JSON.parse(fs.readFileSync(filesToDeletePath, 'utf-8'));

console.log(`Deleting ${filesToDelete.count} markdown files...`);

let deleted = 0;
let failed = 0;

for (const filePath of filesToDelete.files) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deleted++;
    }
  } catch (e) {
    console.error(`Failed to delete ${filePath}: ${e.message}`);
    failed++;
  }
}

console.log(`\n✓ Cleanup complete:`);
console.log(`  - Deleted: ${deleted}`);
console.log(`  - Failed: ${failed}`);
console.log(`\nRemaining cleanup:`);
console.log(`  - Check for empty owner directories and remove if needed`);
console.log(`  - Run markdown lint autofix if any lint issues introduced`);
