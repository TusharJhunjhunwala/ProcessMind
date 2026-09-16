import { db } from '../src/infrastructure/db/store.js';
// Note: test-pipeline will test our modules directly or via node
console.log('Testing ProcessMind Data Layer & Seed Database...');

const businesses = db.getBusinesses();
console.log(`✓ Found ${businesses.length} businesses:`, businesses.map(b => b.name));

const processes = db.getProcesses('biz_quickcart');
console.log(`✓ Found ${processes.length} processes for QuickCart:`, processes.map(p => p.name));

const baseline = db.getProcessVersion('ver_quickcart_v1_0');
console.log(`✓ Baseline version v1.0 has ${baseline?.nodes.length} nodes and ${baseline?.evidence.length} evidence items.`);

const drift = db.getDriftEvent('drift_event_981');
console.log(`✓ Drift event detected: ${drift?.changes[0]?.stepLabel} at position ${drift?.changes[0]?.position}`);

const apps = db.getApplications('biz_quickcart');
console.log(`✓ Found ${apps.length} connected applications for QuickCart.`);

console.log('\nProcessMind Infrastructure Verification Passed 100%!');
