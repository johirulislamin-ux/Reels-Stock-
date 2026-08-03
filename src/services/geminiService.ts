import { GoogleGenAI } from '@google/genai';

// Initialize Google Gen AI client lazily
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    // Check key in client or server context safely
    const apiKey = typeof process !== 'undefined' && process.env?.GEMINI_API_KEY
      ? process.env.GEMINI_API_KEY
      : (import.meta as any).env?.VITE_GEMINI_API_KEY;
    
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

export async function generateReelIdea(topic: string): Promise<{
  title: string;
  description: string;
  hashtags: string[];
  scriptOutline: string;
}> {
  const ai = getAIClient();
  if (!ai) {
    // Fallback response if API key is not configured
    return {
      title: `Viral Reel: ${topic}`,
      description: `Check out this amazing short clip about ${topic}! Like & follow for more daily content! 🔥`,
      hashtags: ['Reels', 'Trending', topic.replace(/\s+/g, ''), 'Viral'],
      scriptOutline: `0-3s: Strong visual hook about ${topic}.\n3-10s: Quick high-value tip or demonstration.\n10-15s: Call to action: "Follow for part 2!"`,
    };
  }

  try {
    const prompt = `You are a viral social media video creator assistant. Generate content for a short-form video Reel about: "${topic}".
Return a JSON object with:
"title": (punchy, catchy reel title max 80 chars),
"description": (engaging caption max 200 chars),
"hashtags": (array of 4-6 trending hashtag strings without #),
"scriptOutline": (bullet points showing 15-second hook, body, and CTA).

Return ONLY valid JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJsonStr);

    return {
      title: parsed.title || `Viral Reel: ${topic}`,
      description: parsed.description || `Check out ${topic}!`,
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['Reels', 'Viral'],
      scriptOutline: parsed.scriptOutline || 'Hook -> Demonstration -> Call to action',
    };
  } catch (err) {
    console.warn('Gemini API call failed, using smart template:', err);
    return {
      title: `Trending: Everything about ${topic}`,
      description: `Quick breakdown of ${topic} in under 30 seconds! Drop your thoughts in the comments 👇`,
      hashtags: ['Reels2026', 'Creator', topic.replace(/\s+/g, '')],
      scriptOutline: `Hook: "You won't believe this about ${topic}..."\nBody: Highlight top 2 key facts.\nCTA: "Hit follow for more!"`,
    };
  }
}

export async function getMonetizationAdvice(currentFollowers: number, currentWatchHours: number): Promise<string> {
  const ai = getAIClient();
  const followerGap = Math.max(0, 10000 - currentFollowers);
  const hourGap = Math.max(0, 3000 - currentWatchHours);

  if (!ai) {
    if (followerGap === 0 && hourGap === 0) {
      return "🎉 Congratulations! You have met the criteria of 10,000 Followers and 3,000 Watch Hours! Your profile is verified with the Blue Tick Badge and monetization is active.";
    }
    return `📈 Strategy to reach Monetization:\n- You need ${followerGap.toLocaleString()} more followers and ${hourGap.toFixed(1)} more watch hours.\n- Tip 1: Post 2 vertical Reels daily at peak hours (5-8 PM).\n- Tip 2: Focus on trending audio tracks and high-retention 15-second hooks.`;
  }

  try {
    const prompt = `A video content creator currently has ${currentFollowers} followers (Goal: 10,000) and ${currentWatchHours} watch hours (Goal: 3,000 hours).
Provide 3 concise, highly actionable tips tailored to help them close the gap (${followerGap} followers and ${hourGap} watch hours remaining) to unlock Monetization and their Blue Tick badge.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Focus on consistent daily Reels and long-form video tutorials to maximize watch time!";
  } catch (err) {
    return `Keep posting consistent Reels and Long Videos! You are only ${followerGap} followers and ${hourGap.toFixed(1)} watch hours away from Monetization and your Blue Tick Badge!`;
  }
}
