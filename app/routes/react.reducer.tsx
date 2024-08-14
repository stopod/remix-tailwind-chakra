import { useReducer } from "react";
import AddTask from "../components/forReducerSample/AddTask";
import TaskList from "../components/forReducerSample/TaskList";
import type { Task } from "../components/forReducerSample/TaskList";
import { tasksReducer } from "../reducer/tasksReducer";

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  // function handleAddTask(text: string) {
  //   setTasks([
  //     ...tasks,
  //     {
  //       id: nextId++,
  //       text: text,
  //       done: false,
  //     },
  //   ]);
  // }

  // function handleChangeTask(task: Task) {
  //   setTasks(
  //     tasks.map((t) => {
  //       if (t.id === task.id) {
  //         return task;
  //       } else {
  //         return t;
  //       }
  //     })
  //   );
  // }

  // function handleDeleteTask(taskId: number) {
  //   setTasks(tasks.filter((t) => t.id !== taskId));
  // }

  function handleAddTask(text: string) {
    dispatch({
      type: "added",
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task: Task) {
    dispatch({
      type: "changed",
      task: task,
    });
  }

  function handleDeleteTask(taskId: number) {
    dispatch({
      type: "deleted",
      id: taskId,
    });
  }

  return (
    <div className="mt-5 ml-5">
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList tasks={tasks} onChangeTask={handleChangeTask} onDeleteTask={handleDeleteTask} />
    </div>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: "Visit Kafka Museum", done: true },
  { id: 1, text: "Watch a puppet show", done: false },
  { id: 2, text: "Lennon Wall pic", done: false },
];
