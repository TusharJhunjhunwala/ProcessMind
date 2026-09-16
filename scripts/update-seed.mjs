import fs from 'fs';
import path from 'path';

// Run build or reset db
const dbPath = path.join(process.cwd(), '.data', 'db.json');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed old db.json to trigger fresh multi-workflow seed generation.');
}
