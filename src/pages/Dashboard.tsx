import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Calendar2Check,
  HeartPulse,
  BarChartLine,
  Fire,
  Clock,
  Trophy,
  MoonStars,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const DashboardButtons = () => {
  const handleClick = (menu: string) => alert(`Open ${menu} menu`);

  return (
    <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mb-4 px-3">
      <button
        onClick={() => handleClick("Schedule")}
        className="btn btn-primary d-flex align-items-center gap-2"
      >
        <Calendar2Check /> Schedule
      </button>
      <button
        onClick={() => handleClick("Workouts")}
        className="btn btn-success d-flex align-items-center gap-2"
      >
        <HeartPulse /> Workouts
      </button>
      <button
        onClick={() => handleClick("Stats")}
        className="btn btn-purple d-flex align-items-center gap-2"
        style={{ backgroundColor: "#6f42c1", borderColor: "#6f42c1" }} // Bootstrap doesn't have built-in purple btn
      >
        <BarChartLine /> Stats
      </button>
      <button
        onClick={() => handleClick("Calories")}
        className="btn btn-danger d-flex align-items-center gap-2"
      >
        <Fire /> Calories
      </button>
      <button
        onClick={() => handleClick("Time")}
        className="btn btn-warning d-flex align-items-center gap-2 text-dark"
      >
        <Clock /> Time
      </button>
      <button
        onClick={() => handleClick("Streak")}
        className="btn btn-pink d-flex align-items-center gap-2"
        style={{ backgroundColor: "#d63384", borderColor: "#d63384" }}
      >
        <Trophy /> Streak
      </button>

      <button
        onClick={() => handleClick("Sleep")}
        className="btn btn-info d-flex align-items-center gap-2"
        style={{ backgroundColor: "#17a2b8", borderColor: "#17a2b8" }}
      >
        <MoonStars /> Sleep
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [showWeeklyCalories, setShowWeeklyCalories] = useState(false);
  const [dailyCalories, _] = useState(480);
  const navigate = useNavigate();
  const splashTexts: string[] = [
    "Your Fitness Hub",
    "Today’s Game Plan",
    "Workout Command Center",
    "Daily Burn Dashboard",
    "FitFlow: Your Training Tracker",
    "Performance Overview",
    "Sweat Summary",
    "Train. Track. Triumph.",
    "Your Fitness Journey at a Glance",
    "Athlete’s HQ",
  ];

  const fitnessDashboardSubtitles: string[] = [
    "Track your progress and crush your goals.",
    "Your daily workout stats at a glance.",
    "Stay motivated, stay on track.",
    "Every workout counts. Let’s get moving!",
    "Push harder, get stronger, feel better.",
    "Consistency is the key to success.",
    "Small steps lead to big results.",
    "Fuel your fitness journey.",
    "Track, improve, and repeat.",
    "Your personal training companion.",
  ];

  const randomSubtitle =
    fitnessDashboardSubtitles[
      Math.floor(Math.random() * fitnessDashboardSubtitles.length)
    ];

  const randomSplashText =
    splashTexts[Math.floor(Math.random() * splashTexts.length)];

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await useAuth();
      if (!isAuthenticated) {
        navigate("/");
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg">
          {randomSplashText}
        </h1>
        <p className="text-md text-gray-600 mt-2">{randomSubtitle}</p>
      </div>

      <div className="flex justify-center">
        <DashboardButtons />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Section 1: Workout of the Day */}
        <div className="col-span-2 md:col-span-2 row-span-1 bg-white rounded-lg shadow p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Today’s Workout
            </h2>
            <p className="text-lg text-gray-800 mb-1">
              Push Day – 45 min – Strength
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Mark as Complete
            </button>
            <button className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">
              Swap / Reschedule
            </button>
          </div>
        </div>

        {/* Section 1: Workout of the Day */}
        <div className="col-span-2 md:col-span-2 row-span-1 bg-white rounded-lg shadow p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              New Workout
            </h2>
            <p className="text-lg text-gray-800 mb-1">
              Create or view your workout plans
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => {
                navigate("/newWorkout");
              }}
            >
              Create New Workout Plan
            </button>
            <button className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">
              View Workout Plans
            </button>
          </div>
        </div>

        {/* Section 2: Workout Count */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Workouts Completed
          </h3>
          <p className="text-3xl font-bold text-blue-600">72</p>
        </div>

        {/* Section 3: Most Recent Workout */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Most Recent
          </h3>
          <p className="text-gray-700">Pull Day – 50 min – Strength</p>
          <p className="text-sm text-gray-500">Completed: Yesterday</p>
        </div>

        {/* Section 4: Calories Burned */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Calories Burned
            </h3>
            <button
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
              onClick={() => setShowWeeklyCalories(!showWeeklyCalories)}
            >
              {showWeeklyCalories ? "Show Today" : "Show Week"}
            </button>
          </div>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            {showWeeklyCalories ? dailyCalories * 7 : dailyCalories} kcal
          </p>
        </div>

        {/* Section 5: Time Spent This Week */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Time Spent This Week
          </h3>
          <p className="text-3xl font-bold text-green-600">5h 20m</p>
        </div>

        {/* Section 6: Streak Info */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Streak</h3>
          <p className="text-xl text-purple-600 font-bold">7 Days</p>
          <p className="text-sm text-gray-500">Keep it going!</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
