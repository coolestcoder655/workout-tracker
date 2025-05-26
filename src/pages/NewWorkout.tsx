import { useState } from "react";
import {
  Fire,
  Trash,
  Icon1Circle,
  Icon2Circle,
  House,
} from "react-bootstrap-icons";
import { Modal } from "react-bootstrap";
import { ExerciseData } from "../workouts";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthContext";

const API_KEY = "V8b7TJIWiE7+Co1M4wo8LQ==BCVPwsFhjAiJN6zi";
const BASE_URL = "https://api.api-ninjas.com/v1/caloriesburned?activity=";

async function getExerciseNames(query: string): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Assert that data is an array before mapping
    const exerciseNames = (data as Array<{ name: string }>).map(
      (exercise) => exercise.name
    );
    return exerciseNames;
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return [];
  }
}

// Example usage:
getExerciseNames("run").then((names) => {
  console.log("Matching Exercises:");
  names.forEach((name) => console.log(name));
});

const NewWorkout = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState(ExerciseData.custom);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState(false);
  const [errorLoggingWorkout, setErrorLoggingWorkout] = useState(false);
  const [modalExercise, setModalExercise] = useState<string>("");
  const [modalDuration, setModalDuration] = useState<number>(0);
  const [modalCalories, setModalCalories] = useState<number | null>(null);
  const [caloriesLoading, setCaloriesLoading] = useState(false);
  const [modalDropdownOptions, setModalDropdownOptions] = useState<string[]>(
    []
  );
  const [modalShowDropdown, setModalShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleUserError = () => {
    alert("You must be logged in to log a workout.");
    navigate("/");
  };

  const handleRemoveExercise = (id: number) => {
    setSelectedWorkoutType("custom");

    // Remove the exercise with the given id from the exercises array
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== id)
    );
  };

  const handleClearAddExercise = () => {
    handleModalExerciseChange("");
    handleModalDurationChange(0);
    setShowModal(false);
  };

  const handleLogWorkout = () => {
    // Form Validation
    if (selectedWorkoutType === "" || exercises.length == 0) {
      // Make it so that if exercises are empty, show error
      setFormSubmitError(true);
      return;
    }

    const today = new Date();
    const dateWithoutTime = today.toLocaleDateString();
    const duration = exercises.reduce(
      (total, exercise) => total + exercise.duration,
      0
    );
    const totalCaloriesBurned = exercises.reduce(
      (total, exercise) => total + exercise.caloriesBurned,
      0
    );

    const workoutData = {
      type: selectedWorkoutType,
      date: dateWithoutTime,
      duration: duration,
      totalCaloriesBurned: totalCaloriesBurned,
      exercises: exercises.map((exercise) => ({
        name: exercise.title,
        duration: exercise.duration,
        caloriesBurned: exercise.caloriesBurned,
      })),
    };

    if (user === null) {
      toggleUserError();
      return;
    }

    // Save to Firestore
    const workoutsCollection = collection(db, "users", user, "workouts");

    const logWorkout = async () => {
      try {
        await addDoc(workoutsCollection, workoutData);
        console.log("Workout logged successfully!");
      } catch (error) {
        setErrorLoggingWorkout(true);
      }
    };

    logWorkout();

    setExercises([]);
    setSelectedWorkoutType("");
    navigate("/dashboard");
  };

  const handleAddExercise = (
    title: string,
    duration: number,
    caloriesBurned: number
  ) => {
    setSelectedWorkoutType("custom");

    const newExercise = {
      id: exercises.length + 1,
      title: title,
      duration: duration,
      caloriesBurned: caloriesBurned,
    };
    setExercises((prevExercises) => [...prevExercises, newExercise]);
  };

  const handleWorkoutTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as keyof typeof ExerciseData;
    setSelectedWorkoutType(type);
    setExercises([...ExerciseData[type]]);
  };

  // Fetch exercise names for dropdown as user types
  const handleModalExerciseChange = async (val: string) => {
    setModalExercise(val);
    setModalCalories(null);
    if (val.length > 1) {
      const names = await getExerciseNames(val);
      setModalDropdownOptions(names);
      setModalShowDropdown(true);
    } else {
      setModalDropdownOptions([]);
      setModalShowDropdown(false);
    }
  };

  // When user selects from dropdown, update and try to fetch calories
  const handleModalExerciseSelect = async (val: string) => {
    setModalExercise(val);
    setModalShowDropdown(false);
    if (modalDuration > 0) {
      setCaloriesLoading(true);
      const response = await fetch(`${BASE_URL}${encodeURIComponent(val)}`, {
        method: "GET",
        headers: { "X-Api-Key": API_KEY },
      });
      if (response.ok) {
        const data = await response.json();
        const match = data.find(
          (ex: any) => ex.name.toLowerCase() === val.toLowerCase()
        );
        if (match && match.calories_per_hour) {
          setModalCalories(
            Math.round((match.calories_per_hour * modalDuration) / 60)
          );
        } else {
          setModalCalories(null);
        }
      } else {
        setModalCalories(null);
      }
      setCaloriesLoading(false);
    }
  };

  // When user changes duration, update calories if exercise is selected
  const handleModalDurationChange = async (val: number) => {
    setModalDuration(val);
    setModalCalories(null);
    if (modalExercise && val > 0) {
      setCaloriesLoading(true);
      const response = await fetch(
        `${BASE_URL}${encodeURIComponent(modalExercise)}`,
        {
          method: "GET",
          headers: { "X-Api-Key": API_KEY },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const match = data.find(
          (ex: any) => ex.name.toLowerCase() === modalExercise.toLowerCase()
        );
        if (match && match.calories_per_hour) {
          setModalCalories(Math.round((match.calories_per_hour * val) / 60));
        } else {
          setModalCalories(null);
        }
      } else {
        setModalCalories(null);
      }
      setCaloriesLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-600 m-4">
        Generate New Workout
      </h1>

      <button
        className="position-absolute top-0 end-0 m-3 d-flex flex-row align-items-center gap-3 btn btn-outline-secondary text-center"
        onClick={() => navigate("/dashboard")}
      >
        <span className="text-gray-600">Back to Dashboard</span>
        <House className="text-gray-600" size={24} />
      </button>

      <select
        className="m-4 p-2 border border-gray-300 rounded"
        value={selectedWorkoutType}
        onChange={handleWorkoutTypeChange}
      >
        <option value="" disabled>
          Select a workout type
        </option>
        <option value="strength">Strength Training</option>
        <option value="cardio">Cardio</option>
        <option value="flexibility">Flexibility</option>
        <option value="balance">Balance</option>
        <option value="endurance">Endurance</option>
        <option value="high-intensity">
          High-Intensity Interval Training (HIIT)
        </option>
        <option value="custom">Custom Workout</option>
      </select>

      {exercises.length >= 1 && (
        <ul className="list-group m-4 p-2 border border-gray-300 rounded">
          {exercises.map((exercise) => (
            <li
              key={exercise.id}
              className="list-group-item flex items-center justify-between"
              style={{ minHeight: "100px" }}
            >
              <div>
                <h1 className="text-lg text-blue-400 font-bold">
                  {exercise.title}
                </h1>
                <p className="text-md text-gray-600">
                  <strong>Duration: </strong>
                  {exercise.duration} minutes
                </p>
                <p className="text-md text-gray-600">
                  <strong>Calories Burned: </strong>
                  {exercise.caloriesBurned} kcal
                  <Fire className="inline-block ml-1" color="red" />
                </p>
              </div>
              <div
                className="flex items-center justify-end"
                style={{ minWidth: "150px" }}
              >
                <button
                  className="btn btn-danger px-6 py-3 text-lg"
                  onClick={() => handleRemoveExercise(exercise.id)}
                >
                  <Trash size={28} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-end m-5">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Exercise
        </button>
      </div>

      {exercises.length !== 0 && (
        <div className="flex justify-center m-5">
          <button className="btn btn-outline-dark" onClick={handleLogWorkout}>
            Submit
          </button>
        </div>
      )}

      <Modal show={showModal} onHide={handleClearAddExercise} centered>
        <Modal.Header>
          <Modal.Title>Add New Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4 relative w-full">
            <label className="block text-gray-700 mb-2">Exercise Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search for exercise..."
              value={modalExercise}
              onChange={(e) => handleModalExerciseChange(e.target.value)}
              onFocus={() => setModalShowDropdown(true)}
              onBlur={() => setTimeout(() => setModalShowDropdown(false), 100)}
            />
            {modalShowDropdown && modalDropdownOptions.length > 0 && (
              <ul className="absolute left-0 right-0 z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {modalDropdownOptions.map((option, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleModalExerciseSelect(option)}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter duration"
              value={modalDuration}
              onChange={(e) =>
                handleModalDurationChange(Number(e.target.value))
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Estimated Calories Burned
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              value={caloriesLoading ? "..." : modalCalories ?? ""}
              placeholder="Calories will be calculated"
              disabled
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleClearAddExercise}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (
                modalExercise &&
                modalDuration > 0 &&
                modalCalories !== null
              ) {
                handleAddExercise(modalExercise, modalDuration, modalCalories);
                setShowModal(false);
                setModalExercise("");
                setModalDuration(0);
                setModalCalories(null);
                setModalDropdownOptions([]);
              }
            }}
            disabled={
              !modalExercise || !modalDuration || modalCalories === null
            }
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={formSubmitError}
        onHide={() => setFormSubmitError(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="text-red-500">Form Submission Error</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-red-500">
            <p>
              <strong>One or more parts</strong> of the form has
              <strong> not been filled</strong>. Please make sure one of
              following fields are filled:
            </p>
            <ul>
              <li className="text-red-500 d-flex mb-0.5">
                <Icon1Circle className="mr-0.5" />
                <strong>
                  <p> - Preset Exercise Has Been Selected</p>
                </strong>
              </li>
              <li className="text-red-500 d-flex">
                <Icon2Circle className="mr-0.5" />
                <p>
                  <strong>- Exercise Has Been Added To A Custom Workout</strong>
                </p>
              </li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={() => setFormSubmitError(false)}
          >
            Understood
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={errorLoggingWorkout}
        onHide={() => setErrorLoggingWorkout(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Error Logging Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-red-500">
            There was an error logging your workout. Please try again later.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={() => setErrorLoggingWorkout(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* {<div className="text-center text-gray-500 mt-8">
        <p>
          <strong>Note:</strong> This is a custom workout generator. You can
          select a workout type and add exercises to create your own workout
          routine.
        </p>
      </div>} */}
    </>
  );
};

export default NewWorkout;
