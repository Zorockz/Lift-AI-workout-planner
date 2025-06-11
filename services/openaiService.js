import { OPENAI_KEY } from '@env';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateWorkoutPlan = async (userPreferences) => {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer. Generate a 7-day workout plan based on the user's preferences."
          },
          {
            role: "user",
            content: `Create a workout plan with these preferences: ${JSON.stringify(userPreferences)}`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate workout plan');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw error;
  }
};

export const getExerciseDetails = async (exerciseName) => {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer. Provide detailed instructions for exercises."
          },
          {
            role: "user",
            content: `Provide detailed instructions for the exercise: ${exerciseName}`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get exercise details');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting exercise details:', error);
    throw error;
  }
}; 