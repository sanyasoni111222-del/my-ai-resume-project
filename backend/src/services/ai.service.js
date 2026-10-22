const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");
const apiKey =
  process.env.GOOGLE_GENAI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

let ai = null;

function getAiClient() {
  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Set GOOGLE_GENAI_API_KEY, GEMINI_API_KEY, or GOOGLE_API_KEY in backend/.env"
    );
  }

  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }

  return ai;
}

const cleanSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    matchScore: { type: "number" },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] }
        },
        required: ["skill", "severity"]
      }
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: { type: "array", items: { type: "string" } }
        },
        required: ["day", "focus", "tasks"]
      }
    }
  },
  required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

function normalizeInterviewReport(report) {
  const candidate = report || {};

  const normalizeQuestionList = (items, fallbackLabel) =>
    Array.isArray(items)
      ? items.map((item) => ({
          question: item?.question || item?.prompt || "",
          intention: item?.intention || item?.intension || item?.purpose || `Assess ${fallbackLabel}.`,
          answer: item?.answer || item?.modelAnswer || "No answer template provided.",
        }))
      : [];

  const normalizeSkillGaps = (items) =>
    Array.isArray(items)
      ? items.map((item) => ({
          skill: item?.skill || item?.name || "Unspecified skill",
          severity: ["low", "medium", "high"].includes(item?.severity) ? item.severity : "medium",
        }))
      : [];

  const normalizePlan = (items) =>
    Array.isArray(items)
      ? items.map((item, index) => ({
          day: Number(item?.day ?? index + 1),
          focus: item?.focus || `Preparation focus ${index + 1}`,
          tasks: Array.isArray(item?.tasks)
            ? item.tasks
            : Array.isArray(item?.task)
              ? item.task
              : ["Review relevant material", "Practice the key concept"],
        }))
      : [];

  return {
    title: typeof candidate.title === "string" && candidate.title.trim() ? candidate.title.trim() : "Interview Report",
    matchScore: Number.isFinite(Number(candidate.matchScore)) ? Number(candidate.matchScore) : 0,
    technicalQuestions: normalizeQuestionList(candidate.technicalQuestions, "technical comprehension"),
    behavioralQuestions: normalizeQuestionList(candidate.behavioralQuestions, "behavioral fit"),
    skillGaps: normalizeSkillGaps(candidate.skillGaps),
    preparationPlan: normalizePlan(candidate.preparationPlan),
  };
}

async function generateInterviewReport(resume, selfDescription, jobDescription) {
  const prompt = `You are an expert technical interviewer. Generate an interview analysis report based on the candidate's details.

IMPORTANT INSTRUCTIONS:
1. You MUST generate at least 3-5 relevant 'technicalQuestions'.
2. You MUST generate at least 2-3 relevant 'behavioralQuestions'.
3. Do NOT omit 'technicalQuestions' or 'behavioralQuestions' or leave them empty.
4. Include a short and clear 'title' describing the role.
5. Use the exact property names: title, matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan.
6. For each question object, use keys: question, intention, answer.
7. For each preparation plan item, use keys: day, focus, tasks.

Strictly follow this JSON output structure:
{
  "title": "Senior Full Stack Engineer",
  "matchScore": 82,
  "technicalQuestions": [
    {
      "question": "How do indexing and aggregation pipelines improve MongoDB performance?",
      "intention": "Assess candidate's depth in MongoDB optimization based on their resume.",
      "answer": "Indexing creates B-tree structures to speed up queries, while aggregation pipelines optimize multi-stage data transformations at the database level."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Describe a time you dealt with a bottleneck in production.",
      "intention": "Evaluate problem-solving under pressure.",
      "answer": "Discuss identifying high latency, using profiling tools, and applying caching or database indexing."
    }
  ],
  "skillGaps": [
    {
      "skill": "Microservices Architecture",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Database Optimization",
      "tasks": ["Review MongoDB aggregation stages", "Practice indexing strategies"]
    }
  ]
}

CANDIDATE DETAILS:
Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}`;

  const aiClient = getAiClient();

  const response = await aiClient.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: cleanSchema,
    },
  });

  const rawReport = JSON.parse(response.text);
  return normalizeInterviewReport(rawReport);
}
async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch({
    headless: "shell",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setContent(html, { waitUntil: "load" });
    return await page.pdf({ format: "A4", printBackground: true });
  } finally {
    await browser.close();
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = {
    type: "object",
    properties: {
      html: { type: "string" },
    },
    required: ["html"],
  };
  const prompt = `Create a detailed, polished, job-tailored resume as a complete, self-contained HTML document.

Use the candidate's resume and self-description as the source of truth. Preserve all relevant facts and do not invent employers, job titles, dates, degrees, earned certifications, completed projects, technologies used, responsibilities, metrics, or achievements. You may improve wording and emphasize relevant experience, but every claim about completed work or credentials must be supported by the supplied candidate information. Use the job description only to prioritize relevant existing qualifications; do not present job requirements as candidate experience.

Use these section headings in this order:
1. Name and contact details
2. Professional summary
3. Core skills
4. Professional experience, with a separate entry for each supplied role and several specific, concise bullets when the source provides enough detail
5. Selected Projects and, if needed, Suggested Project Ideas
6. Education
7. Certifications and Recommended Certifications

Always include the "Selected Projects", "Education", and "Certifications" headings. List projects as completed only if they are supported by the candidate information. If there are fewer than two supported projects, add up to two relevant, realistic ideas under a clearly labeled "Suggested Project Ideas (Not Yet Completed)" subheading. Tailor these ideas to the candidate's stated skills and target role, and describe each as a proposal (for example, what the candidate could build and which demonstrated skills it would exercise); never imply the candidate has built, deployed, or achieved results with them.

List certifications as earned only when supported by the candidate information. If none are supplied, add up to two relevant options under a clearly labeled "Recommended Certifications (Not Yet Earned)" subheading. Recommend only credible, role-relevant credentials; do not invent credential names, providers, or claim enrollment/completion. If no reliable specific credential fits, recommend a certification subject area instead. Keep recommendations concise and visibly distinct from earned credentials.

Make the resume substantive rather than reducing it to a short summary. Retain useful details from the supplied resume and self-description, and tailor the wording to the target role. Aim for one page for an early-career candidate and up to two pages for a more experienced candidate; do not add filler or unsupported details to reach a page count. If the source information is sparse, use the clearly labeled suggested ideas above rather than fabricating experience or credentials.

Design a polished, professional resume that is easy to scan and print:
- Use a restrained navy/charcoal palette with one subtle accent color, strong contrast, and no decorative backgrounds that reduce readability.
- Start with a prominent, visually distinctive <h1> containing the candidate's name; if the name is unavailable, use "Professional Resume". Place contact details in a compact line directly below it.
- Render every resume section title as a semantic <h2>, not as plain bold text. Give section headings a consistent, polished treatment (for example, strong typography, a subtle accent rule, and generous separation from the content); use <h3> for individual roles and projects.
- Use consistent heading styles, whitespace, alignment, and typography. Keep body text readable and avoid dense paragraphs; use concise bullets and clear role/project/date hierarchy. Keep vertical spacing compact and consistent so a page does not end with a large avoidable blank area.
- Use a centered, sensibly sized content column, balanced margins, and print-friendly A4 CSS. Avoid oversized headings, fixed-height containers, excessive empty space, tables for primary layout, and forced page breaks between sections. Keep short role/project entries together when practical, but allow longer entries to continue across pages rather than leaving a large blank area at the bottom.
- Keep all styling inline in a <style> element. Use semantic HTML. Do not include JavaScript, external resources, or markdown fences.
- make it ATS friendly and without losing any important information from the resume and self-description. Use standard section headings, clear role/project/date hierarchy, and concise bullets. Avoid decorative elements that could confuse parsing software.
Return only a JSON object with one field, "html", containing a complete HTML document.

Candidate resume:
${resume || "(not provided)"}

Self-description:
${selfDescription || "(not provided)"}

Target job description:
${jobDescription || "(not provided)"}`;

  const aiClient = getAiClient();
  const response = await aiClient.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumePdfSchema,
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty resume response.");
  }

  const { html } = JSON.parse(response.text);
  if (typeof html !== "string" || !html.trim()) {
    throw new Error("Gemini returned an invalid resume HTML document.");
  }

  return generatePdfFromHtml(html);
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
  normalizeInterviewReport,
};
