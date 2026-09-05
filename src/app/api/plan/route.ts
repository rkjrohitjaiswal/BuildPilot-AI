import { NextResponse } from 'next/server';
import { profileSchema, PlanApiResponse, RecommendedProject } from '../../../types/profile';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'google/gemini-2.5-flash';

/**
 * Safely extracts raw text from OpenRouter message.content, handling both string and content-part array formats.
 */
function extractMessageContent(content: any): string {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string') {
          return part.text;
        }
        return '';
      })
      .join('\n');
  }
  if (content && typeof content === 'object' && 'text' in content && typeof content.text === 'string') {
    return content.text;
  }
  return '';
}

/**
 * Safely extracts JSON text string by removing code fences or extraneous surrounding prose.
 */
function extractJsonString(raw: string): string {
  let cleaned = raw.trim();

  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  // Isolate JSON object between first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

/**
 * Normalizes raw JSON object into a guaranteed, strictly-conforming PlanApiResponse object.
 */
function normalizePlanApiResponse(rawObj: any): PlanApiResponse {
  if (!rawObj || typeof rawObj !== 'object') {
    throw new Error('Parsed JSON payload is not a valid object.');
  }

  let summaryFit = 'Matched student technical capabilities and project constraints.';
  let summaryRec = 'Synthesized 3 custom defendable project blueprints for your final-year defense.';

  if (typeof rawObj.summary === 'string') {
    summaryFit = rawObj.summary;
  } else if (rawObj.summary && typeof rawObj.summary === 'object') {
    summaryFit = rawObj.summary.profileFit || rawObj.summary.fit || summaryFit;
    summaryRec = rawObj.summary.recommendation || rawObj.summary.advice || summaryRec;
  }

  const rawProjects = Array.isArray(rawObj.projects) ? rawObj.projects : [];

  if (rawProjects.length === 0) {
    throw new Error('AI response did not contain any valid project recommendations in the "projects" array.');
  }

  const projects: RecommendedProject[] = rawProjects.map((p: any, idx: number) => {
    const title = p.title || `Project Option ${idx + 1}`;
    const tagline = p.tagline || 'Defendable capstone project solution';
    const problem = p.problem || p.description || 'Real-world problem statement addressed by this system.';
    const solution = p.solution || p.ml_component || 'Proposed fullstack AI and software implementation.';

    const skillMatch = Math.min(100, Math.max(0, Math.round(Number(p.skillMatch) || 90)));
    const feasibility = Math.min(100, Math.max(0, Math.round(Number(p.feasibility) || 85)));
    const innovation = Math.min(100, Math.max(0, Math.round(Number(p.innovation) || 88)));
    const overallScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(Number(p.overallScore) || Math.round((skillMatch + feasibility + innovation) / 3))
      )
    );

    const whyItFits = Array.isArray(p.whyItFits)
      ? p.whyItFits.map(String)
      : Array.isArray(p.skills_to_leverage)
      ? p.skills_to_leverage.map(String)
      : ['Leverages your existing skill set'];

    const targetUsers = Array.isArray(p.targetUsers)
      ? p.targetUsers.map(String)
      : ['End Users', 'Administrators'];

    const features = Array.isArray(p.features)
      ? p.features.map(String)
      : ['Core API Module', 'User Dashboard'];

    const rawStack = p.techStack && typeof p.techStack === 'object' ? p.techStack : {};
    const technologiesArr = Array.isArray(p.technologies) ? p.technologies.map(String) : [];

    const techStack = {
      frontend:
        Array.isArray(rawStack.frontend) && rawStack.frontend.length > 0
          ? rawStack.frontend.map(String)
          : technologiesArr.filter((t: string) => /react|next|flutter|html|css|vue|tailwind/i.test(t)).length > 0
          ? technologiesArr.filter((t: string) => /react|next|flutter|html|css|vue|tailwind/i.test(t))
          : ['React', 'Next.js'],
      backend:
        Array.isArray(rawStack.backend) && rawStack.backend.length > 0
          ? rawStack.backend.map(String)
          : technologiesArr.filter((t: string) => /python|node|express|fastapi|flask|django|java/i.test(t)).length > 0
          ? technologiesArr.filter((t: string) => /python|node|express|fastapi|flask|django|java/i.test(t))
          : ['Node.js', 'Python'],
      database:
        Array.isArray(rawStack.database) && rawStack.database.length > 0
          ? rawStack.database.map(String)
          : technologiesArr.filter((t: string) => /sql|postgres|mongo|redis|sqlite/i.test(t)).length > 0
          ? technologiesArr.filter((t: string) => /sql|postgres|mongo|redis|sqlite/i.test(t))
          : ['PostgreSQL'],
      ai:
        Array.isArray(rawStack.ai) && rawStack.ai.length > 0
          ? rawStack.ai.map(String)
          : technologiesArr.filter((t: string) => /ai|ml|speech|tensorflow|openai|gemini/i.test(t)).length > 0
          ? technologiesArr.filter((t: string) => /ai|ml|speech|tensorflow|openai|gemini/i.test(t))
          : ['AI API'],
      deployment:
        Array.isArray(rawStack.deployment) && rawStack.deployment.length > 0
          ? rawStack.deployment.map(String)
          : ['Vercel', 'Render'],
    };

    const rawRoadmap = Array.isArray(p.roadmap) ? p.roadmap : [];
    const roadmap =
      rawRoadmap.length > 0
        ? rawRoadmap.map((rm: any, rIdx: number) => ({
            phase: rm.phase || `Phase ${rIdx + 1}`,
            duration: rm.duration || '2-3 Weeks',
            tasks: Array.isArray(rm.tasks) ? rm.tasks.map(String) : ['Implementation'],
            deliverable: rm.deliverable || 'Milestone release',
          }))
        : [
            {
              phase: 'Phase 1: Architecture & Setup',
              duration: 'Weeks 1–3',
              tasks: ['Initialize repo', 'Design DB schema'],
              deliverable: 'Core working architecture baseline',
            },
            {
              phase: 'Phase 2: Core Engine & API',
              duration: 'Weeks 4–7',
              tasks: ['Implement backend endpoints', 'Integrate UI'],
              deliverable: 'Functional preview',
            },
            {
              phase: 'Phase 3: Testing & Defense Prep',
              duration: 'Weeks 8–10',
              tasks: ['Conduct integration tests', 'Prepare viva slides'],
              deliverable: 'Production deployment & viva ready',
            },
          ];

    const risks = Array.isArray(p.risks)
      ? p.risks.map(String)
      : p.budget_notes
      ? [p.budget_notes]
      : ['Scope management under deadline constraints'];

    const futureScope = Array.isArray(p.futureScope)
      ? p.futureScope.map(String)
      : ['Production scaling and mobile app expansion'];

    const vivaQuestions = Array.isArray(p.vivaQuestions)
      ? p.vivaQuestions.map(String)
      : [
          'Why did you choose this architecture over alternative approaches?',
          'How does your system maintain data integrity under high latency?',
          'What security controls protect user inputs in this implementation?',
        ];

    return {
      title,
      tagline,
      problem,
      solution,
      skillMatch,
      feasibility,
      innovation,
      overallScore,
      whyItFits,
      targetUsers,
      features,
      techStack,
      roadmap,
      risks,
      futureScope,
      vivaQuestions,
    };
  });

  return {
    summary: {
      profileFit: summaryFit,
      recommendation: summaryRec,
    },
    projects: projects.slice(0, 3),
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        {
          error: 'Server Configuration Error',
          message:
            'OPENROUTER_API_KEY environment variable is missing on the server. Please configure OPENROUTER_API_KEY in .env.local.',
        },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid Request',
          message: 'Malformed JSON payload in request body.',
        },
        { status: 400 }
      );
    }

    const validationResult = profileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid Profile Data',
          message: 'The submitted profile data failed validation.',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const profile = validationResult.data;

    const systemInstruction = `You are BuildPilot, an expert academic capstone mentor and senior software architect.
Your mission is to evaluate a final-year student's technical background, interests, and constraints, and synthesize EXACTLY 3 realistic, highly practical, and defendable final-year project blueprints.

CRITICAL INSTRUCTIONS FOR OUTPUT FORMAT:
- You MUST respond with ONLY a raw, unformatted, valid JSON object.
- DO NOT use markdown code fences (NO \`\`\` or \`\`\`json).
- DO NOT include any introductory or concluding text, explanations, or commentary.
- The root of the JSON MUST be an object with keys "summary" and "projects" (array of exactly 3 objects).

CRITICAL CONTENT & CONCISENESS RULES:
1. PRACTICAL & DEFENDABLE: Prioritize projects students can build and defend in their viva.
2. TAILORED TO SKILLS: Heavily leverage student skills (${profile.skills.join(', ')}) and interests (${profile.interests.join(', ')}).
3. SCORES: Integers between 0 and 100 for skillMatch, feasibility, innovation, overallScore.
4. COMPACTNESS: Keep "problem" and "solution" to 1-2 crisp sentences each. Keep "roadmap" to 3 phases with 2 short tasks each. Keep "vivaQuestions" to 3 sharp questions. Keep the entire response compact so all 3 projects are fully generated.

JSON SCHEMA STRUCTURE TO FOLLOW EXACTLY:
{
  "summary": {
    "profileFit": "1-2 sentence fit summary",
    "recommendation": "1-2 sentence strategic advice"
  },
  "projects": [
    {
      "title": "Project Title",
      "tagline": "Catchy 1-line summary",
      "problem": "1-2 sentence problem statement",
      "solution": "1-2 sentence software solution",
      "skillMatch": 95,
      "feasibility": 90,
      "innovation": 88,
      "overallScore": 91,
      "whyItFits": ["Reason 1", "Reason 2"],
      "targetUsers": ["User 1", "User 2"],
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "techStack": {
        "frontend": ["React", "Next.js"],
        "backend": ["FastAPI", "Python"],
        "database": ["PostgreSQL"],
        "ai": ["OpenAI API"],
        "deployment": ["Vercel"]
      },
      "roadmap": [
        {
          "phase": "Phase 1: Setup & Architecture",
          "duration": "Weeks 1–3",
          "tasks": ["DB schema setup", "API scaffolding"],
          "deliverable": "Working baseline"
        },
        {
          "phase": "Phase 2: Core Engine & API",
          "duration": "Weeks 4–7",
          "tasks": ["Core logic pipeline", "UI dashboard integration"],
          "deliverable": "Functional MVP"
        },
        {
          "phase": "Phase 3: Testing & Viva Prep",
          "duration": "Weeks 8–10",
          "tasks": ["Integration tests", "Deploy to cloud"],
          "deliverable": "Production & viva ready"
        }
      ],
      "risks": ["Risk 1", "Risk 2"],
      "futureScope": ["Future expansion 1"],
      "vivaQuestions": ["Examiner question 1?", "Examiner question 2?", "Examiner question 3?"]
    }
  ]
}`;

    const userPrompt = `Student Profile Summary:
- Technical Skills: ${profile.skills.join(', ')}
- Interests & Domains: ${profile.interests.join(', ')}
- Experience Level: ${profile.experienceLevel}
- Team Size: ${profile.teamSize} Member(s)
- Project Duration: ${profile.duration}
- Budget Limit: ${profile.budget}
- Preferred Domain Focus: ${profile.domain}
- Additional Student Notes: ${profile.additionalNotes || 'None provided'}

Generate EXACTLY 3 complete project recommendation blueprints in JSON format.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let openRouterResponse: Response;
    try {
      openRouterResponse = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://buildpilot.local',
          'X-Title': 'BuildPilot',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          max_tokens: 1250,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
        }),
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return NextResponse.json(
          {
            error: 'Request Timeout',
            message: 'OpenRouter took too long to generate project recommendations (30s timeout). Please try again.',
          },
          { status: 504 }
        );
      }
      throw fetchErr;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!openRouterResponse.ok) {
      let errorMsg = `OpenRouter API error: ${openRouterResponse.status} ${openRouterResponse.statusText}`;
      try {
        const errJson = await openRouterResponse.json();
        if (errJson.error?.message) {
          errorMsg = `OpenRouter Error: ${errJson.error.message}`;
        }
      } catch {
        // use default fallback text
      }
      console.error('[Server Error] OpenRouter API returned non-200 status:', openRouterResponse.status);
      return NextResponse.json(
        {
          error: 'OpenRouter API Error',
          message: errorMsg,
        },
        { status: openRouterResponse.status >= 400 && openRouterResponse.status < 600 ? openRouterResponse.status : 502 }
      );
    }

    const responseData = await openRouterResponse.json();
    const messageContent = responseData?.choices?.[0]?.message?.content;
    const rawText = extractMessageContent(messageContent);

    if (!rawText || rawText.trim() === '') {
      console.error('[Server Error] OpenRouter returned empty message content.');
      return NextResponse.json(
        {
          error: 'AI Generation Error',
          message: 'Received an empty or invalid content response from OpenRouter model.',
        },
        { status: 502 }
      );
    }

    const cleanedContent = extractJsonString(rawText);

    let parsedRaw: any;
    try {
      parsedRaw = JSON.parse(cleanedContent);
    } catch {
      try {
        parsedRaw = JSON.parse(rawText.trim());
      } catch {
        try {
          const sanitized = cleanedContent.replace(/,\s*([\]}])/g, '$1');
          parsedRaw = JSON.parse(sanitized);
        } catch (finalParseErr: any) {
          console.error('[Server Error] JSON parse failure:', finalParseErr.message);
          return NextResponse.json(
            {
              error: 'Response Parsing Error',
              message: 'Failed to parse structured JSON from OpenRouter model output.',
            },
            { status: 502 }
          );
        }
      }
    }

    let planData: PlanApiResponse;
    try {
      planData = normalizePlanApiResponse(parsedRaw);
    } catch (normErr: any) {
      console.error('[Server Error] Response normalization failure:', normErr.message);
      return NextResponse.json(
        {
          error: 'Invalid AI Blueprint Structure',
          message: normErr.message || 'The AI output failed structure validation.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json(planData, { status: 200 });
  } catch (error: any) {
    console.error('[Server Error] /api/plan route unhandled exception:', error.message);
    return NextResponse.json(
      {
        error: 'AI Generation Failed',
        message: 'An unexpected error occurred while generating project blueprints. Please try again.',
      },
      { status: 500 }
    );
  }
}
