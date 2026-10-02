 {
  "matchScore"; 75,
  "technicalQuestions"; [
    {
      "question": "How do you handle middleware error handling asynchronously in Express.js?",
      "intension": "Assess candidate's ability to write robust Node.js backend logic without crashing the application.",
      "answer": "By passing errors to the next() function in async/catch blocks or using a wrapper utility function."
    },
    {
      "question": "What is the difference between populate() and $lookup in MongoDB Mongoose?",
      "intension": "Evaluate deep understanding of database relations and aggregation capabilities.",
      "answer": "populate() is a Mongoose-level abstraction for document references, whereas $lookup is a native MongoDB aggregation stage used for complex JOIN operations."
    },
    {
      "question": "How would you integrate an LLM API like OpenAI or Gemini into an existing Express.js backend?",
      "intension": "Test knowledge of third-party AI integration required by the job description.",
      "answer": "By creating a dedicated service layer that makes authenticated HTTP requests using axios or fetch, handling rate limits, streaming responses, and sanitizing user prompts."
    },
    {
      "question": "Explain how JWT authentication works and how you secure sensitive routes.",
      "intension": "Verify practical knowledge of JWT implementation mentioned in the resume.",
      "answer": "JWT is issued upon successful login, stored securely (preferably in HTTP-only cookies), and verified on subsequent requests via authentication middleware."
    }
  ],
  "behavioralQuestions"; [
    {
      "question": "Describe a time when you had to learn a new framework or technology quickly to meet a project deadline.",
      "intension": "Assess adaptability and self-learning capabilities.",
      "answer": "Focus on identifying learning resources, building a minimal viable prototype, and applying the acquired skills directly to solve the problem."
    },
    {
      "question": "How do you prioritize your tasks when working on multiple features simultaneously in a fast-paced environment?",
      "intension": "Evaluate time management and organizational skills.",
      "answer": "Discuss using project management tools, assessing business impact, and communicating timelines clearly with stakeholders."
    }
  ],
  "skillGaps"; [
    {
      "skill": "Generative AI Integration",
      "severity": "medium"
    },
    {
      "skill": "Advanced TypeScript",
      "severity": "low"
    },
    {
      "skill": "Production Docker Containerization",
      "severity": "medium"
    }
  ],
  "preparationPlan"; [
    {
      "day": 1,
      "focus": "Node.js and Express Architecture",
      "task": [
        "Review asynchronous error handling patterns",
        "Practice building scalable router-controller architectures"
      ]
    },
    {
      "day": 2,
      "focus": "MongoDB & Advanced Queries",
      "task": [
        "Practice complex aggregation pipelines",
        "Review indexing strategies for high-traffic apps"
      ]
    },
    {
      "day": 3,
      "focus": "Gen AI API Integration",
      "task": [
        "Build a sample service integrating OpenAI or Gemini API",
        "Implement rate limiting and prompt sanitization"
      ]
    }
  ]
}
