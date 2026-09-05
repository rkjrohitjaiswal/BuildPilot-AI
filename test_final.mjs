/**
 * BuildPilot - Step 7 Final Regression Test Suite
 * Validates /api/plan, /api/mentor, and defensive 400 validation error responses against live dev server.
 */

const BASE_URL = 'http://localhost:3000';

let allPassed = true;

function logPass(msg) {
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
}

function logFail(msg) {
  console.error(`\x1b[31m[FAIL]\x1b[0m ${msg}`);
  allPassed = false;
}

function logInfo(msg) {
  console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('       BUILDPILOT — FINAL REGRESSION SUITE          ');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // TEST 1: POST /api/plan with realistic student profile
  // ----------------------------------------------------
  logInfo('Test 1: Testing POST /api/plan with realistic profile...');
  let planData;
  try {
    const res = await fetch(`${BASE_URL}/api/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skills: ['React', 'Next.js', 'Python', 'FastAPI', 'PostgreSQL'],
        interests: ['AI/ML', 'Web Development'],
        experienceLevel: 'Intermediate',
        teamSize: '2',
        duration: '3–4 months',
        budget: 'Under ₹5,000',
        domain: 'Artificial Intelligence & Data Science',
        additionalNotes: 'Need a defendable fullstack AI capstone for viva examination.',
      }),
    });

    const resText = await res.text();
    try {
      planData = JSON.parse(resText);
    } catch {
      planData = null;
    }

    if (res.status === 200) {
      logPass('POST /api/plan returned HTTP 200');
    } else {
      logFail(`POST /api/plan returned HTTP ${res.status}: ${resText}`);
    }

    if (planData && typeof planData === 'object') {
      logPass('/api/plan returned valid JSON');
    } else {
      logFail('/api/plan did not return a valid JSON object');
    }

    if (planData?.summary?.profileFit && planData?.summary?.recommendation) {
      logPass('Summary object has profileFit and recommendation');
    } else {
      logFail('Summary object missing profileFit or recommendation');
    }

    if (Array.isArray(planData?.projects) && planData.projects.length === 3) {
      logPass(`Returned exactly 3 projects (count: ${planData.projects.length})`);
    } else {
      logFail(`Expected exactly 3 projects, received: ${planData?.projects?.length}`);
    }

    // Validate project schema items
    if (Array.isArray(planData?.projects)) {
      planData.projects.forEach((proj, idx) => {
        const num = idx + 1;
        if (proj.title && proj.title.trim().length > 0) {
          logPass(`Project ${num} has title: "${proj.title}"`);
        } else {
          logFail(`Project ${num} is missing title`);
        }

        if (proj.problem && proj.problem.trim().length > 0) {
          logPass(`Project ${num} has problem statement`);
        } else {
          logFail(`Project ${num} is missing problem statement`);
        }

        if (proj.solution && proj.solution.trim().length > 0) {
          logPass(`Project ${num} has solution description`);
        } else {
          logFail(`Project ${num} is missing solution description`);
        }

        const scoresValid =
          typeof proj.skillMatch === 'number' && proj.skillMatch >= 0 && proj.skillMatch <= 100 &&
          typeof proj.feasibility === 'number' && proj.feasibility >= 0 && proj.feasibility <= 100 &&
          typeof proj.innovation === 'number' && proj.innovation >= 0 && proj.innovation <= 100 &&
          typeof proj.overallScore === 'number' && proj.overallScore >= 0 && proj.overallScore <= 100;

        if (scoresValid) {
          logPass(`Project ${num} scores valid: Skill=${proj.skillMatch}, Feas=${proj.feasibility}, Innov=${proj.innovation}, Overall=${proj.overallScore}`);
        } else {
          logFail(`Project ${num} has invalid scores`);
        }

        if (proj.techStack && typeof proj.techStack === 'object' && Array.isArray(proj.techStack.frontend)) {
          logPass(`Project ${num} techStack exists (Frontend: ${proj.techStack.frontend.join(', ')})`);
        } else {
          logFail(`Project ${num} techStack is invalid`);
        }

        if (Array.isArray(proj.roadmap) && proj.roadmap.length > 0) {
          logPass(`Project ${num} roadmap exists (${proj.roadmap.length} phases)`);
        } else {
          logFail(`Project ${num} roadmap is empty or missing`);
        }

        if (Array.isArray(proj.vivaQuestions) && proj.vivaQuestions.length > 0) {
          logPass(`Project ${num} viva questions exist (${proj.vivaQuestions.length} questions)`);
        } else {
          logFail(`Project ${num} viva questions missing`);
        }
      });
    }
  } catch (err) {
    logFail(`Test 1 threw error: ${err.message}`);
  }

  console.log('\n----------------------------------------------------');
  await new Promise((r) => setTimeout(r, 2000));

  // ----------------------------------------------------
  // TEST 2: POST /api/mentor with active project context
  // ----------------------------------------------------
  logInfo('Test 2: Testing POST /api/mentor with real project context...');
  try {
    const selectedProject = planData?.projects?.[0] || {
      title: 'Automated AI Viva Assessment System',
      tagline: 'Defendable capstone solution',
      problem: 'Students struggle with viva exam preparation.',
      solution: 'Fullstack Next.js and Python evaluation engine.',
      features: ['Speech-to-text', 'Rubric scoring'],
      techStack: {
        frontend: ['Next.js', 'React'],
        backend: ['Python', 'FastAPI'],
        database: ['PostgreSQL'],
        ai: ['Gemini Flash'],
        deployment: ['Vercel'],
      },
      roadmap: [{ phase: 'Phase 1', duration: 'Weeks 1-3', tasks: ['Setup'], deliverable: 'MVP' }],
      risks: ['API latency'],
      futureScope: ['Mobile app'],
    };

    const mentorRes = await fetch(`${BASE_URL}/api/mentor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: selectedProject,
        studentProfile: {
          skills: ['React', 'Python'],
          interests: ['AI/ML'],
          experienceLevel: 'Intermediate',
          teamSize: '2',
          duration: '3–4 months',
          budget: 'Under ₹5,000',
          domain: 'Artificial Intelligence & Data Science',
        },
        conversation: [],
        question: 'What database tables and schema design should we create for Phase 1?',
      }),
    });

    const mentorText = await mentorRes.text();
    let mentorData;
    try {
      mentorData = JSON.parse(mentorText);
    } catch {
      mentorData = null;
    }

    if (mentorRes.status === 200) {
      logPass('POST /api/mentor returned HTTP 200');
    } else {
      logFail(`POST /api/mentor returned HTTP ${mentorRes.status}: ${mentorText}`);
    }

    if (mentorData && typeof mentorData === 'object') {
      logPass('/api/mentor returned valid JSON');
    } else {
      logFail('/api/mentor did not return valid JSON');
    }

    if (mentorData?.answer && mentorData.answer.trim().length > 0) {
      logPass(`answer exists (${mentorData.answer.length} chars)`);
    } else {
      logFail('answer is missing or empty');
    }

    if (Array.isArray(mentorData?.keyPoints) && mentorData.keyPoints.length > 0) {
      logPass(`keyPoints exists (${mentorData.keyPoints.length} points)`);
    } else {
      logFail('keyPoints missing or empty');
    }

    if (Array.isArray(mentorData?.nextSteps) && mentorData.nextSteps.length > 0) {
      logPass(`nextSteps exists (${mentorData.nextSteps.length} steps)`);
    } else {
      logFail('nextSteps missing or empty');
    }

    if (typeof mentorData?.code === 'string') {
      logPass(`code field exists (${mentorData.code.length} chars)`);
    } else {
      logFail('code field is missing or not a string');
    }

    if (Array.isArray(mentorData?.warnings)) {
      logPass(`warnings field exists (${mentorData.warnings.length} warnings)`);
    } else {
      logFail('warnings field missing or not an array');
    }
  } catch (err) {
    logFail(`Test 2 threw error: ${err.message}`);
  }

  console.log('\n----------------------------------------------------');

  // ----------------------------------------------------
  // TEST 3: Validation Error Handling (400 Bad Request)
  // ----------------------------------------------------
  logInfo('Test 3: Testing input validation rejection (HTTP 400)...');
  try {
    // Invalid /api/plan (empty skills)
    const invalidPlanRes = await fetch(`${BASE_URL}/api/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: [] }),
    });

    if (invalidPlanRes.status === 400) {
      logPass('/api/plan rejected empty payload with HTTP 400');
    } else {
      logFail(`Expected HTTP 400 from invalid /api/plan, got ${invalidPlanRes.status}`);
    }

    // Invalid /api/mentor (empty question & missing project)
    const invalidMentorRes = await fetch(`${BASE_URL}/api/mentor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '' }),
    });

    if (invalidMentorRes.status === 400) {
      logPass('/api/mentor rejected empty payload with HTTP 400');
    } else {
      logFail(`Expected HTTP 400 from invalid /api/mentor, got ${invalidMentorRes.status}`);
    }
  } catch (err) {
    logFail(`Test 3 threw error: ${err.message}`);
  }

  console.log('\n====================================================');
  if (allPassed) {
    console.log('\x1b[32m  ALL BUILDPILOT REGRESSION TESTS PASSED! ✅ \x1b[0m');
  } else {
    console.log('\x1b[31m  SOME REGRESSION TESTS FAILED. CHECK LOGS ABOVE. ❌ \x1b[0m');
  }
  console.log('====================================================\n');
}

runTests();
