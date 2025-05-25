interface Exercise {
  id: number;
  title: string;
  duration: number; // in minutes
  caloriesBurned: number; // in kcal
  sets?: number; // optional property for strength training
  reps?: number; // optional property for strength training
  weight?: number; // optional property for strength training
  distance?: number; // optional property for cardio
}

export const ExerciseData: {
  [key in
    | "strength"
    | "cardio"
    | "flexibility"
    | "balance"
    | "endurance"
    | "high-intensity"
    | "custom"]: Exercise[];
} = {
  strength: [
    {
      id: 1,
      title: "Bench Press",
      duration: 60,
      caloriesBurned: 80,
      sets: 3,
      reps: 10,
      weight: 50,
    },
    {
      id: 2,
      title: "Squats",
      duration: 60,
      caloriesBurned: 90,
      sets: 3,
      reps: 12,
      weight: 70,
    },
    {
      id: 3,
      title: "Deadlift",
      duration: 60,
      caloriesBurned: 100,
      sets: 3,
      reps: 8,
      weight: 80,
    },
    {
      id: 4,
      title: "Shoulder Press",
      duration: 45,
      caloriesBurned: 60,
      sets: 3,
      reps: 10,
      weight: 30,
    },
    {
      id: 5,
      title: "Pull Ups",
      duration: 40,
      caloriesBurned: 50,
      sets: 3,
      reps: 8,
    },
  ],
  cardio: [
    {
      id: 1,
      title: "Running",
      duration: 30,
      caloriesBurned: 200,
      distance: 5,
    },
    {
      id: 2,
      title: "Cycling",
      duration: 45,
      caloriesBurned: 250,
      distance: 15,
    },
    {
      id: 3,
      title: "Jump Rope",
      duration: 20,
      caloriesBurned: 150,
      distance: 0.5,
    },
    {
      id: 4,
      title: "Rowing",
      duration: 30,
      caloriesBurned: 180,
      distance: 3,
    },
    {
      id: 5,
      title: "Elliptical",
      duration: 40,
      caloriesBurned: 220,
      distance: 6,
    },
  ],
  flexibility: [
    {
      id: 1,
      title: "Hamstring Stretch",
      duration: 5,
      caloriesBurned: 10,
    },
    {
      id: 2,
      title: "Quad Stretch",
      duration: 5,
      caloriesBurned: 10,
    },
    {
      id: 3,
      title: "Shoulder Stretch",
      duration: 5,
      caloriesBurned: 10,
    },
    {
      id: 4,
      title: "Triceps Stretch",
      duration: 5,
      caloriesBurned: 10,
    },
    {
      id: 5,
      title: "Butterfly Stretch",
      duration: 5,
      caloriesBurned: 10,
    },
  ],
  balance: [
    {
      id: 1,
      title: "Single Leg Stand",
      duration: 5,
      caloriesBurned: 15,
    },
    {
      id: 2,
      title: "Heel-to-Toe Walk",
      duration: 5,
      caloriesBurned: 15,
    },
    {
      id: 3,
      title: "Balance Board",
      duration: 10,
      caloriesBurned: 20,
    },
    {
      id: 4,
      title: "Tai Chi",
      duration: 15,
      caloriesBurned: 30,
    },
    {
      id: 5,
      title: "Tree Pose",
      duration: 5,
      caloriesBurned: 10,
    },
  ],
  endurance: [
    {
      id: 1,
      title: "Jogging",
      duration: 30,
      caloriesBurned: 180,
      distance: 4,
    },
    {
      id: 2,
      title: "Swimming",
      duration: 30,
      caloriesBurned: 250,
      distance: 1,
    },
    {
      id: 3,
      title: "Stair Climbing",
      duration: 20,
      caloriesBurned: 120,
    },
    {
      id: 4,
      title: "Rowing Machine",
      duration: 25,
      caloriesBurned: 160,
      distance: 2,
    },
    {
      id: 5,
      title: "Brisk Walking",
      duration: 40,
      caloriesBurned: 140,
      distance: 5,
    },
  ],
  "high-intensity": [
    {
      id: 1,
      title: "Burpees",
      duration: 2,
      caloriesBurned: 20,
    },
    {
      id: 2,
      title: "Mountain Climbers",
      duration: 2,
      caloriesBurned: 18,
    },
    {
      id: 3,
      title: "Jump Squats",
      duration: 2,
      caloriesBurned: 16,
    },
    {
      id: 4,
      title: "High Knees",
      duration: 2,
      caloriesBurned: 15,
    },
    {
      id: 5,
      title: "Push Ups",
      duration: 2,
      caloriesBurned: 12,
    },
  ],
  custom: [],
};