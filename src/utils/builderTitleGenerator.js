/**
 * builderTitleGenerator.js
 *
 * Uses Groq API (llama-3.1-8b-instant) to generate a creative "builder title"
 * based on the user's stack/role input.
 */

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'llama-3.1-8b-instant';

/**
 * Generate a creative builder title using Groq LLM (Llama 3.1).
 *
 * @param {string} role - The user's stack/role (e.g. "AI/ML Engineer")
 * @param {string} apiKey - Groq API key from VITE_GROQ_API_KEY
 * @returns {Promise<{ title: string, source: 'groq' }>}
 */
export async function generateBuilderTitle(role, apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API key is missing. Please add VITE_GROQ_API_KEY to your .env file.');
  }

  if (!role || !role.trim()) {
    throw new Error('Role string is empty.');
  }

  const systemPrompt = `Generate one short builder title based only on this role: "${role.trim()}".

Requirements:
- 2–3 words only
- The title must clearly relate to the same technical field as the role "${role.trim()}"
- Use terminology, concepts, or themes from that field
- Make it creative, modern, and hackathon-style
- Do not simply rewrite the role
- Do not use generic titles unless they fit the field
- No explanation
- No emoji
- Return only the title in ALL CAPS`;


  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    console.log('[Groq Llama 3.1 LLM] Generating title for role:', role);
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.replace(/["']/g, '').trim()}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Role: ${role.trim()}` },

        ],
        temperature: 0.7,
        max_tokens: 30,
      }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq API HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    const cleanText = raw.replace(/^(Builder Title|Title):/i, '').replace(/[*"'`#]/g, '').trim();
    const lines = cleanText.split('\n')
      .map(l => l.trim().toUpperCase())
      .filter(l => l && !l.includes('RULES') && !l.includes('EXPLANATIONS'));

    const title = (lines[0] || '').slice(0, 40);

    if (!title) {
      throw new Error('Empty response received from Groq Llama 3.1.');
    }

    console.log('[Groq Llama 3.1 LLM] Success! Title:', title);
    return { title, source: 'groq' };
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('[Groq Llama 3.1 LLM] Generation Error:', err.message);
    throw err;
  }
}
