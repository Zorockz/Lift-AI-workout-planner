// Exercise database with 5-10 exercises per level for each goal/location
const exerciseDatabase = {
  strength: {
    gym: {
      beginner: [
        { name: 'Machine Chest Press', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Focus on form and controlled movement' },
        { name: 'Leg Press', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Keep back flat against pad' },
        { name: 'Lat Pulldown', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Pull bar to upper chest' },
        { name: 'Machine Shoulder Press', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Keep core tight' },
        { name: 'Machine Leg Extension', sets: 3, reps: 15, restTime: 45, equipment: 'full_gym', notes: 'Full range of motion' },
        { name: 'Seated Row', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Squeeze shoulder blades' },
        { name: 'Cable Tricep Pushdown', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Keep elbows tucked' },
        { name: 'Leg Curl', sets: 3, reps: 15, restTime: 45, equipment: 'full_gym', notes: 'Control the movement' },
        { name: 'Chest Fly Machine', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Focus on chest squeeze' },
        { name: 'Standing Calf Raise', sets: 3, reps: 15, restTime: 45, equipment: 'full_gym', notes: 'Full range of motion' }
      ],
      intermediate: [
        { name: 'Barbell Bench Press', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Focus on chest contraction' },
        { name: 'Barbell Squats', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Keep chest up' },
        { name: 'Bent Over Rows', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Squeeze shoulder blades' },
        { name: 'Overhead Press', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Full lockout at top' },
        { name: 'Romanian Deadlifts', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Keep back straight' },
        { name: 'Pull-ups', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Full range of motion' },
        { name: 'Incline Dumbbell Press', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Focus on upper chest' },
        { name: 'Leg Press', sets: 4, reps: 12, restTime: 90, equipment: 'full_gym', notes: 'Drive through heels' },
        { name: 'Face Pulls', sets: 3, reps: 15, restTime: 60, equipment: 'full_gym', notes: 'Control the movement' },
        { name: 'Cable Bicep Curl', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Squeeze at the top' }
      ],
      advanced: [
        { name: 'Deadlifts', sets: 5, reps: 5, restTime: 120, equipment: 'full_gym', notes: 'Focus on hip hinge' },
        { name: 'Front Squats', sets: 4, reps: 6, restTime: 120, equipment: 'full_gym', notes: 'Keep elbows high' },
        { name: 'Pull-ups', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Full range of motion' },
        { name: 'Incline Bench Press', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Focus on upper chest' },
        { name: 'Barbell Rows', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Squeeze at top' },
        { name: 'Weighted Dips', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Go deep, control movement' },
        { name: 'Bulgarian Split Squats', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Keep torso upright' },
        { name: 'Pendlay Row', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Explosive pull' },
        { name: 'Arnold Press', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Rotate wrists' },
        { name: 'Barbell Hip Thrust', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Squeeze glutes at top' }
      ]
    },
    home: {
      beginner: [
        { name: 'Push-ups', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Focus on form' },
        { name: 'Bodyweight Squats', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Keep back straight' },
        { name: 'Plank', sets: 3, reps: 30, restTime: 45, equipment: 'bodyweight', notes: 'Hold position' },
        { name: 'Lunges', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Alternate legs' },
        { name: 'Mountain Climbers', sets: 3, reps: 20, restTime: 45, equipment: 'bodyweight', notes: 'Keep core tight' },
        { name: 'Glute Bridge', sets: 3, reps: 15, restTime: 45, equipment: 'bodyweight', notes: 'Squeeze at top' },
        { name: 'Superman', sets: 3, reps: 12, restTime: 45, equipment: 'bodyweight', notes: 'Hold at top' },
        { name: 'Wall Sit', sets: 3, reps: 30, restTime: 45, equipment: 'bodyweight', notes: 'Hold position' },
        { name: 'Step-ups', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Alternate legs' },
        { name: 'Standing Calf Raise', sets: 3, reps: 15, restTime: 45, equipment: 'bodyweight', notes: 'Full range of motion' }
      ],
      intermediate: [
        { name: 'Diamond Push-ups', sets: 4, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Focus on triceps' },
        { name: 'Jump Squats', sets: 4, reps: 15, restTime: 60, equipment: 'bodyweight', notes: 'Land softly' },
        { name: 'Side Plank', sets: 3, reps: 45, restTime: 45, equipment: 'bodyweight', notes: 'Alternate sides' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Keep front knee stable' },
        { name: 'Burpees', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Full range of motion' },
        { name: 'Decline Push-ups', sets: 4, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Feet elevated' },
        { name: 'Reverse Lunge', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Alternate legs' },
        { name: 'V-Ups', sets: 3, reps: 15, restTime: 45, equipment: 'bodyweight', notes: 'Control the movement' },
        { name: 'Tricep Dips', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Use chair or bench' },
        { name: 'Russian Twist', sets: 3, reps: 20, restTime: 45, equipment: 'bodyweight', notes: 'Twist fully' }
      ],
      advanced: [
        { name: 'Pike Push-ups', sets: 4, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Focus on shoulders' },
        { name: 'Pistol Squats', sets: 3, reps: 8, restTime: 90, equipment: 'bodyweight', notes: 'Progress gradually' },
        { name: 'Hollow Hold', sets: 3, reps: 45, restTime: 60, equipment: 'bodyweight', notes: 'Keep lower back pressed' },
        { name: 'Box Jumps', sets: 4, reps: 10, restTime: 90, equipment: 'bodyweight', notes: 'Land quietly' },
        { name: 'Pull-ups', sets: 4, reps: 8, restTime: 90, equipment: 'bodyweight', notes: 'Full range of motion' },
        { name: 'Handstand Push-ups', sets: 3, reps: 6, restTime: 120, equipment: 'bodyweight', notes: 'Wall support if needed' },
        { name: 'Single-leg Glute Bridge', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Alternate legs' },
        { name: 'Dragon Flag', sets: 3, reps: 6, restTime: 120, equipment: 'bodyweight', notes: 'Advanced core' },
        { name: 'Clapping Push-ups', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Explosive power' },
        { name: 'L-Sit', sets: 3, reps: 20, restTime: 60, equipment: 'bodyweight', notes: 'Hold position' }
      ]
    }
  },
  cardio: {
    gym: {
      beginner: [
        { name: 'Treadmill Walking', duration: 20, intensity: 'low', equipment: 'full_gym', notes: 'Maintain steady pace' },
        { name: 'Stationary Bike', duration: 15, intensity: 'low', equipment: 'full_gym', notes: 'Comfortable pace' },
        { name: 'Elliptical', duration: 15, intensity: 'low', equipment: 'full_gym', notes: 'Smooth motion' },
        { name: 'Rowing Machine', duration: 10, intensity: 'low', equipment: 'full_gym', notes: 'Focus on form' },
        { name: 'Stair Climber', duration: 10, intensity: 'low', equipment: 'full_gym', notes: 'Steady pace' },
        { name: 'Recumbent Bike', duration: 15, intensity: 'low', equipment: 'full_gym', notes: 'Low impact' },
        { name: 'Arm Ergometer', duration: 10, intensity: 'low', equipment: 'full_gym', notes: 'Upper body cardio' }
      ],
      intermediate: [
        { name: 'Treadmill Jog', duration: 20, intensity: 'medium', equipment: 'full_gym', notes: 'Steady pace' },
        { name: 'Stationary Bike', duration: 20, intensity: 'medium', equipment: 'full_gym', notes: 'Increase resistance' },
        { name: 'Elliptical', duration: 20, intensity: 'medium', equipment: 'full_gym', notes: 'Increase speed' },
        { name: 'Rowing Machine', duration: 15, intensity: 'medium', equipment: 'full_gym', notes: 'Full range' },
        { name: 'Stair Climber', duration: 15, intensity: 'medium', equipment: 'full_gym', notes: 'Keep good posture' },
        { name: 'Spin Bike', duration: 20, intensity: 'medium', equipment: 'full_gym', notes: 'Interval sprints' },
        { name: 'HIIT Treadmill', duration: 15, intensity: 'high', equipment: 'full_gym', notes: 'Intervals' },
        { name: 'Battle Ropes', duration: 10, intensity: 'high', equipment: 'full_gym', notes: 'Explosive intervals' }
      ],
      advanced: [
        { name: 'Treadmill Run', duration: 25, intensity: 'high', equipment: 'full_gym', notes: 'Push pace' },
        { name: 'Stationary Bike Sprints', duration: 20, intensity: 'high', equipment: 'full_gym', notes: 'Sprint intervals' },
        { name: 'Rowing Machine Sprints', duration: 15, intensity: 'high', equipment: 'full_gym', notes: 'All out effort' },
        { name: 'Stair Climber HIIT', duration: 15, intensity: 'high', equipment: 'full_gym', notes: 'Intervals' },
        { name: 'Elliptical HIIT', duration: 15, intensity: 'high', equipment: 'full_gym', notes: 'Intervals' },
        { name: 'Battle Ropes HIIT', duration: 10, intensity: 'high', equipment: 'full_gym', notes: 'Explosive intervals' },
        { name: 'Spin Bike Sprints', duration: 15, intensity: 'high', equipment: 'full_gym', notes: 'Sprint intervals' },
        { name: 'Treadmill Incline Sprints', duration: 10, intensity: 'high', equipment: 'full_gym', notes: 'High incline' }
      ]
    },
    home: {
      beginner: [
        { name: 'Brisk Walking', duration: 20, intensity: 'low', equipment: 'bodyweight', notes: 'Maintain steady pace' },
        { name: 'Marching in Place', duration: 15, intensity: 'low', equipment: 'bodyweight', notes: 'Low impact' },
        { name: 'Step Touch', duration: 10, intensity: 'low', equipment: 'bodyweight', notes: 'Side to side' },
        { name: 'Seated Jacks', duration: 10, intensity: 'low', equipment: 'bodyweight', notes: 'Chair supported' },
        { name: 'Standing Knee Lifts', duration: 10, intensity: 'low', equipment: 'bodyweight', notes: 'Alternate knees' },
        { name: 'Jumping Jacks', sets: 3, reps: 20, restTime: 30, equipment: 'bodyweight', notes: 'Land softly' }
      ],
      intermediate: [
        { name: 'Jogging in Place', duration: 20, intensity: 'medium', equipment: 'bodyweight', notes: 'Steady pace' },
        { name: 'High Knees', sets: 4, reps: 30, restTime: 30, equipment: 'bodyweight', notes: 'Drive knees up' },
        { name: 'Butt Kicks', sets: 4, reps: 30, restTime: 30, equipment: 'bodyweight', notes: 'Kick heels up' },
        { name: 'Mountain Climbers', sets: 4, reps: 20, restTime: 30, equipment: 'bodyweight', notes: 'Quick pace' },
        { name: 'Jump Rope', duration: 10, intensity: 'medium', equipment: 'bodyweight', notes: 'Steady pace' },
        { name: 'Burpees', sets: 3, reps: 10, restTime: 45, equipment: 'bodyweight', notes: 'Explosive movement' },
        { name: 'Skaters', sets: 3, reps: 20, restTime: 30, equipment: 'bodyweight', notes: 'Side to side' }
      ],
      advanced: [
        { name: 'HIIT Sprints', duration: 15, intensity: 'high', equipment: 'bodyweight', notes: 'All out effort' },
        { name: 'Tuck Jumps', sets: 4, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Explosive power' },
        { name: 'Burpees', sets: 4, reps: 15, restTime: 45, equipment: 'bodyweight', notes: 'Full range' },
        { name: 'Jump Lunges', sets: 4, reps: 12, restTime: 45, equipment: 'bodyweight', notes: 'Alternate legs' },
        { name: 'Mountain Climbers', sets: 4, reps: 30, restTime: 30, equipment: 'bodyweight', notes: 'Quick pace' },
        { name: 'Jump Rope Double Unders', duration: 10, intensity: 'high', equipment: 'bodyweight', notes: 'Advanced' },
        { name: 'Plank Jacks', sets: 3, reps: 20, restTime: 30, equipment: 'bodyweight', notes: 'Core and cardio' },
        { name: 'Skaters', sets: 4, reps: 20, restTime: 30, equipment: 'bodyweight', notes: 'Side to side' }
      ]
    }
  },
  maintain: {
    gym: {
      beginner: [
        { name: 'Machine Chest Press', sets: 3, reps: 10, restTime: 60, equipment: 'full_gym', notes: 'Focus on form' },
        { name: 'Leg Press', sets: 3, reps: 10, restTime: 60, equipment: 'full_gym', notes: 'Keep back flat' },
        { name: 'Treadmill Walking', duration: 15, intensity: 'low', equipment: 'full_gym', notes: 'Comfortable pace' },
        { name: 'Seated Row', sets: 3, reps: 10, restTime: 60, equipment: 'full_gym', notes: 'Squeeze shoulder blades' },
        { name: 'Lat Pulldown', sets: 3, reps: 10, restTime: 60, equipment: 'full_gym', notes: 'Full range' },
        { name: 'Elliptical', duration: 10, intensity: 'low', equipment: 'full_gym', notes: 'Smooth motion' }
      ],
      intermediate: [
        { name: 'Barbell Squats', sets: 3, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Keep form' },
        { name: 'Lat Pulldown', sets: 3, reps: 10, restTime: 60, equipment: 'full_gym', notes: 'Full range' },
        { name: 'Elliptical', duration: 15, intensity: 'medium', equipment: 'full_gym', notes: 'Steady pace' },
        { name: 'Treadmill Jog', duration: 15, intensity: 'medium', equipment: 'full_gym', notes: 'Steady pace' },
        { name: 'Seated Row', sets: 3, reps: 10, restTime: 60, equipment: 'full_gym', notes: 'Squeeze shoulder blades' },
        { name: 'Leg Press', sets: 3, reps: 10, restTime: 60, equipment: 'full_gym', notes: 'Drive through heels' },
        { name: 'Chest Fly Machine', sets: 3, reps: 10, restTime: 60, equipment: 'full_gym', notes: 'Focus on chest squeeze' }
      ],
      advanced: [
        { name: 'Deadlifts', sets: 3, reps: 6, restTime: 90, equipment: 'full_gym', notes: 'Focus on form' },
        { name: 'Pull-ups', sets: 3, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Full range' },
        { name: 'Rowing Machine', duration: 10, intensity: 'medium', equipment: 'full_gym', notes: 'Maintain pace' },
        { name: 'Barbell Bench Press', sets: 3, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Focus on chest contraction' },
        { name: 'Barbell Squats', sets: 3, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Keep chest up' },
        { name: 'Elliptical', duration: 15, intensity: 'medium', equipment: 'full_gym', notes: 'Steady pace' },
        { name: 'Treadmill Run', duration: 15, intensity: 'high', equipment: 'full_gym', notes: 'Push pace' }
      ]
    },
    home: {
      beginner: [
        { name: 'Push-ups', sets: 3, reps: 8, restTime: 60, equipment: 'bodyweight', notes: 'Focus on form' },
        { name: 'Bodyweight Squats', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Keep back straight' },
        { name: 'Brisk Walking', duration: 10, intensity: 'low', equipment: 'bodyweight', notes: 'Comfortable pace' },
        { name: 'Step-ups', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Alternate legs' },
        { name: 'Wall Sit', sets: 3, reps: 20, restTime: 45, equipment: 'bodyweight', notes: 'Hold position' },
        { name: 'Plank', sets: 3, reps: 20, restTime: 45, equipment: 'bodyweight', notes: 'Hold position' }
      ],
      intermediate: [
        { name: 'Diamond Push-ups', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Focus on triceps' },
        { name: 'Jump Squats', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Land softly' },
        { name: 'Light Jogging', duration: 10, intensity: 'medium', equipment: 'bodyweight', notes: 'Steady pace' },
        { name: 'Reverse Lunge', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Alternate legs' },
        { name: 'V-Ups', sets: 3, reps: 12, restTime: 45, equipment: 'bodyweight', notes: 'Control the movement' },
        { name: 'Burpees', sets: 3, reps: 10, restTime: 45, equipment: 'bodyweight', notes: 'Explosive movement' },
        { name: 'Russian Twist', sets: 3, reps: 15, restTime: 45, equipment: 'bodyweight', notes: 'Twist fully' }
      ],
      advanced: [
        { name: 'Pistol Squats', sets: 3, reps: 6, restTime: 90, equipment: 'bodyweight', notes: 'Progress gradually' },
        { name: 'Pull-ups', sets: 3, reps: 8, restTime: 90, equipment: 'bodyweight', notes: 'Full range' },
        { name: 'Running', duration: 10, intensity: 'medium', equipment: 'bodyweight', notes: 'Maintain pace' },
        { name: 'Handstand Push-ups', sets: 3, reps: 4, restTime: 120, equipment: 'bodyweight', notes: 'Wall support if needed' },
        { name: 'Dragon Flag', sets: 3, reps: 4, restTime: 120, equipment: 'bodyweight', notes: 'Advanced core' },
        { name: 'Clapping Push-ups', sets: 3, reps: 8, restTime: 60, equipment: 'bodyweight', notes: 'Explosive power' },
        { name: 'L-Sit', sets: 3, reps: 15, restTime: 60, equipment: 'bodyweight', notes: 'Hold position' }
      ]
    }
  }
};

export default exerciseDatabase; 