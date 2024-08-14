import type { Task } from "~/components/forReducerSample/TaskList";

type TasksAction = {
  Added: {
    type: "added";
    id: number;
    text: string;
  };
  Changed: {
    type: "changed";
    task: Task;
  };
  Deleted: {
    type: "deleted";
    id: number;
  };
};

export function tasksReducer(
  tasks: Task[],
  action: TasksAction["Added"] | TasksAction["Changed"] | TasksAction["Deleted"]
): Task[] {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action);
    }
  }
}
