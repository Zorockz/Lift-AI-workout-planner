import { config } from '../config/config';

// Mock workout plan for testing
const mockWorkoutPlan = {
  weekPlan: {
    "Day 1": [
      {
        type: "Warm-up",
        name: "Jump Rope",
        duration: "5 min"
      },
      {
        type: "Main",
        name: "Push-ups",
        sets: 3,
        reps: 12,
        rest: 60,
        duration: "10 min"
      },
      {
        type: "Main",
        name: "Squats",
        sets: 4,
        reps: 15,
        rest: 90,
        duration: "12 min"
      }
    ],
    "Day 2": "Rest Day",
    "Day 3": [
      {
        type: "Warm-up",
        name: "Arm Circles",
        duration: "3 min"
      },
      {
        type: "Main",
        name: "Pull-ups",
        sets: 3,
        reps: 8,
        rest: 90,
        duration: "15 min"
      },
      {
        type: "Main",
        name: "Lunges",
        sets: 3,
        reps: 12,
        rest: 60,
        duration: "10 min"
      }
    ],
    "Day 4": "Rest Day",
    "Day 5": [
      {
        type: "Warm-up",
        name: "Jumping Jacks",
        duration: "5 min"
      },
      {
        type: "Main",
        name: "Plank",
        sets: 3,
        reps: 30,
        rest: 45,
        duration: "8 min"
      },
      {
        type: "Main",
        name: "Mountain Climbers",
        sets: 3,
        reps: 20,
        rest: 45,
        duration: "8 min"
      }
    ],
    "Day 6": "Rest Day",
    "Day 7": "Rest Day"
  }
};

export async function generateWorkoutPlan(profile) {
  // For testing, return mock plan
  return mockWorkoutPlan;

  // Uncomment below for actual API integration
  /*
  const prompt = `You are FitBuddy, an AI workout planner. Given this user profile:
${JSON.stringify(profile, null, 2)}

Generate a 7-day weekly plan that schedules exactly ${profile.frequency} workout days and designates the remaining days as "Rest Day." On each workout day, provide:
- 1–2 warm-up exercises (with name and duration)
- 4–6 main exercises (for each: name, sets, reps, rest in seconds, and approximate duration)
- Ensure each exercise object includes: 
  - type ("Warm-up" or "Main")
  - name
  - sets (if Main)
  - reps (if Main)
  - rest (if Main)
  - duration (all exercises)

Requirements:
- Rest days must appear in the correct number and be clearly labeled (e.g., "Day 3: Rest Day").
- Distribute workout and rest days logically (e.g., avoid two heavy leg days in a row, follow common recovery practices for the user's experience).
- Use only equipment from ${JSON.stringify(profile.equipment)}. If empty, use only bodyweight/minimal-equipment exercises.
- Target the specified muscle groups and align with the user's goal.
- Return only valid JSON in the following format, with no extra text:

{
  "weekPlan": {
    "Day 1": [
      {
        "type": "Warm-up",
        "name": "Jump Rope",
        "duration": "5 min"
      },
      {
        "type": "Main",
        "name": "Bench Press",
        "sets": 4,
        "reps": 8,
        "rest": 90,
        "duration": "8 min"
      }
    ],
    "Day 2": "Rest Day",
    // ...through Day 7
  }
}`;

  const response = await fetch(config.openai.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.openai.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'You are FitBuddy, an expert fitness coach specializing in creating personalized workout plans. You excel at creating balanced, progressive, and safe workout routines that match users\' goals, experience level, and available equipment.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch plan: ' + response.statusText);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to parse AI response: ' + text);
  }
  */
} 