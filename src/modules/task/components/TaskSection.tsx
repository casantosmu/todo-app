import CheckboxButton from "../../../components/CheckboxButton";
import type Task from "../types/Task";

interface TaskSectionProps {
  title: string;
  tasks: Task[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isCompletedList?: boolean;
}

export default function TaskSection({
  title,
  tasks,
  isLoading,
  isError,
  isCompletedList = false,
}: TaskSectionProps) {
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
            <CheckboxButton isChecked={isCompletedList} />
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
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      {renderContent()}
    </>
  );
}
