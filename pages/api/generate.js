export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { event, vibe, duration, crowdAge, genres, bpmStart, bpmPeak, mustPlay, avoid, level } = req.body;
  const isPro = level === 'pro';

  const prompt = `You are an expert DJ. Generate a DJ set plan as clean JSON only — no markdown, no explanation, just the raw JSON object.

Event: ${event}
Duration: ${duration} minutes
Vibe: ${vibe}
Genres: ${genres.join(', ')}
BPM arc: ${bpmStart} opening to ${bpmPeak} peak
Crowd age: ${crowdAge}
Must play: ${mustPlay || 'none'}
Avoid: ${avoid || 'none'}
DJ level: ${level}

Return this exact JSON structure:
{
  "overview": "2 sentence set arc description",
  "phases": [
    {
      "name": "Phase name",
      "time": "0:00–20 min",
      "bpm": "95–108",
      "energy": 4,
      "genre": "R&B / Hip-Hop",
      "tracks": ["Artist – Track title", "Artist – Track title", "Artist – Track title", "Artist – Track title"]${isPro ? '' : ',\n      "notes": "1 sentence tip for this phase"'}
    }
  ],
  "transitions": [
    {"moment": "Brief description of the transition moment", "technique": "Specific technique to use"}
  ],
  "emergency": ["Artist – Track", "Artist – Track", "Artist – Track"]
}

Rules:
- 4 to 5 phases covering the full duration
- ${isPro ? 'No song descriptions — tracks only as "Artist – Track title"' : 'Include brief helpful notes per phase for a beginner DJ'}
- 3 transitions between key phase shifts
- 3 emergency tracks
- Real artist and track names only
- Return ONLY the JSON, nothing else`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to generate set plan.' });
  }
}
