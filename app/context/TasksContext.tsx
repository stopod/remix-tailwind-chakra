import { createContext, useContext, useReducer } from "react";
import type { Task } from "../components/forReducerAndContext/TaskList";
import { tasksReducer } from "../reducer/tasksReducer";

type TasksDispatches = (
  action:
    | {
        type: "added";
        id: number;
        text: string;
      }
    | {
        type: "changed";
        task: Task;
      }
    | {
        type: "deleted";
        id: number;
      }
) => void;

export const TasksContext = createContext<Task[]>([]);
export const TasksDispatchContext = createContext<TasksDispatches | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

const initialTasks = [
  { id: 0, text: "Visit Kafka Museum", done: true },
  { id: 1, text: "Watch a puppet show", done: false },
  { id: 2, text: "Lennon Wall pic", done: false },
];
