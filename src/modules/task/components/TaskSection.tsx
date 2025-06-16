import CheckboxButton from "../../../components/CheckboxButton";
import type Task from "../types/Task";

interface TaskSectionProps {
  title: string;
  tasks: Task[] | undefined;
  onUpdateTask: (task: Task) => void;
  isLoading: boolean;
  isError: boolean;
  isCompletedList?: boolean;
}

export default function TaskSection({
  title,
  tasks,
  onUpdateTask,
  isLoading,
  isError,
  isCompletedList = false,
}: TaskSectionProps) {
  const headingID = isCompletedList
    ? "completed-tasks-heading"
    : "pending-tasks-heading";

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-gray-500">Loading...</p>;
    }
    if (isError) {
      return <p className="text-red-500">Error...</p>;
    }
    if (!tasks || tasks.length === 0) {
      return <p className="text-gray-500">Empty...</p>;
    }
    return (
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex items-center w-full p-4 bg-white border border-gray-200 rounded-lg"
          >
            <CheckboxButton
              isChecked={isCompletedList}
              onClick={() => {
                const toggled: Task = {
                  ...task,
                  completedAt: isCompletedList ? null : new Date(),
                };
                onUpdateTask(toggled);
              }}
              //  aria-label={`Mark "${task.title}" as ${
              //   isCompletedList ? "pending" : "completed"
              // }`}
            />
            <span
              className={`pl-3 ${
                isCompletedList ? "text-gray-500 line-through" : "text-gray-800"
              }`}
            >
              {task.title}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby={headingID}>
      <h2 id={headingID} className="text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h2>
      {renderContent()}
    </section>
  );
}
