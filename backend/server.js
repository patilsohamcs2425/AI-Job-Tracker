require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
fastify.register(require('@fastify/cors'), { origin: '*' });

// Local keyword matcher if AI fails
function getFallbackScore(jobDesc, resume) {
  const keywords = ['react', 'javascript', 'html', 'css', 'node', 'web', 'sql'];
  let score = 35;
  keywords.forEach(word => {
    if (resume.toLowerCase().includes(word) && jobDesc.toLowerCase().includes(word)) score += 10;
  });
  return Math.min(score, 95);
}

async function calculateMatch(jobDescription, resumeText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Compare Resume: "${resumeText}" to Job: "${jobDescription}". Return ONLY: SCORE: [number], REASON: [text]`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
    const reasonMatch = text.match(/REASON:\s*(.*)/i);
    return { 
      score: scoreMatch ? parseInt(scoreMatch[1]) : getFallbackScore(jobDescription, resumeText), 
      reason: reasonMatch ? reasonMatch[1].trim() : "Strong technical overlap detected."
    };
  } catch (err) {
    return { score: getFallbackScore(jobDescription, resumeText), reason: "Matched on core web development skills." };
  }
}

// AI Career Coach
fastify.post('/chat', async (request, reply) => {
  const { message } = request.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    return { reply: result.response.text() };
  } catch (err) {
    return { reply: "Focus on your MERN stack projects to stand out for high-paying roles!" };
  }
});

// Professional Job Feed
fastify.post('/jobs', async (request, reply) => {
  const { resumeText } = request.body;
  const { ADZUNA_APP_ID, ADZUNA_APP_KEY } = process.env;
  try {
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=9&what=web%20developer`;
    const response = await axios.get(url);
    const scoredJobs = await Promise.all(response.data.results.map(async (job) => {
      const match = await calculateMatch(job.description, resumeText);
      return {
        id: job.id, title: job.title, company: job.company.display_name,
        location: job.location.display_name, link: job.redirect_url,
        matchScore: match.score, reason: match.reason
      };
    }));
    return scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) { return reply.status(500).send({ error: "Job API Error" }); }
});

fastify.listen({ port: 5000, host: '0.0.0.0' });