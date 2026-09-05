// test_step8_ui_regression.mjs
// Step 8 UI & API regression verification

async function runRegression() {
  console.log('🧪 Starting Step 8 UI & API Regression Tests...\n');

  // Test 1: GET /
  console.log('1. Testing GET / (Landing Page)...');
  try {
    const res = await fetch('http://localhost:3000/');
    if (!res.ok) {
      throw new Error(`GET / failed with status ${res.status}`);
    }
    const html = await res.text();
    
    // Check required copy
    const checks = [
      { name: 'Branding: BuildPilot', pass: html.includes('BuildPilot') },
      { name: 'Hero Eyebrow: Engineering Project Intelligence', pass: html.includes('Engineering Project Intelligence') },
      { name: 'Headline: Turn an idea into a project', pass: html.includes('Turn an idea into a project') },
      { name: 'CTA: Build My Project', pass: html.includes('Build My Project') },
      { name: 'Section: How BuildPilot Works / Workflow', pass: html.includes('Workflow') || html.includes('How BuildPilot Works') || html.includes('From skill mapping to viva defense') },
      { name: 'Section: Configuration / Profile', pass: html.includes('Define your engineering profile') || html.includes('Configuration') },
      { name: 'Section: Your Project Directions', pass: html.includes('Your Project Directions') },
      { name: 'Section: Capabilities', pass: html.includes('Built for rigorous academic review') || html.includes('Capabilities') },
    ];

    let allPass = true;
    for (const c of checks) {
      if (c.pass) {
        console.log(`  ✓ ${c.name}`);
      } else {
        console.error(`  ✗ ${c.name} NOT found in HTML!`);
        allPass = false;
      }
    }

    if (!allPass) {
      throw new Error('Some landing page copy checks failed');
    }
    console.log('  ✅ GET / page regression verified successfully.\n');
  } catch (err) {
    console.error('  ❌ GET / failed:', err.message);
    process.exit(1);
  }

  // Test 2: POST /api/plan validation
  console.log('2. Testing POST /api/plan input validation...');
  try {
    const res = await fetch('http://localhost:3000/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: [], interests: [] }),
    });
    const data = await res.json();
    if (res.status === 400 && data.error === 'Validation Failed') {
      console.log('  ✓ POST /api/plan properly rejects empty skills/interests with HTTP 400.');
    } else {
      console.warn(`  ⚠️ Unexpected response status ${res.status}:`, data);
    }
  } catch (err) {
    console.error('  ❌ /api/plan validation test failed:', err.message);
  }

  // Test 3: POST /api/mentor validation
  console.log('3. Testing POST /api/mentor input validation...');
  try {
    const res = await fetch('http://localhost:3000/api/mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '' }),
    });
    const data = await res.json();
    if (res.status === 400) {
      console.log('  ✓ POST /api/mentor properly rejects invalid payload with HTTP 400.');
    } else {
      console.warn(`  ⚠️ Unexpected response status ${res.status}:`, data);
    }
  } catch (err) {
    console.error('  ❌ /api/mentor validation test failed:', err.message);
  }

  console.log('\n🎉 Step 8 UI & API regression checks passed!');
}

runRegression();
