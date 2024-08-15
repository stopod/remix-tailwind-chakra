import AddTask from "../../components/forReducerAndContext/AddTask";
import TaskList from "../../components/forReducerAndContext/TaskList";
import { TasksProvider } from "../../context/TasksContext";

export default function TaskApp() {
  return (
    <TasksProvider>
      <div className="mt-5 ml-5">
        <h1>Prague itinerary</h1>
        <AddTask />
        <TaskList />
      </div>
    </TasksProvider>
  );
}
