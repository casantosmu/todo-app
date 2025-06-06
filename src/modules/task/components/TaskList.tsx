import CheckboxButton from "../../../components/CheckboxButton";
import useTaskList from "../hooks/useTaskList";

export default function TaskList() {
  const taskListQuery = useTaskList();

  if (taskListQuery.isPending) {
    return "Loading...";
  }
  if (taskListQuery.isError) {
    return "Error...";
  }

  const taskList = taskListQuery.data;

  return (
    <ul>
      {taskList.map((task) => (
        <li
          key={task._id}
          className="flex items-center text-gray-800 w-full p-4 bg-white border border-gray-200 rounded-lg"
        >
          <CheckboxButton isChecked={!!task.completedAt} />
          <span className="pl-2">{task.title}</span>
        </li>
      ))}
    </ul>
  );
}
