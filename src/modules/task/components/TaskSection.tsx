import * as ContextMenu from "@radix-ui/react-context-menu";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
          <ContextMenu.Root key={task._id}>
            <ContextMenu.Trigger asChild>
              {/*  cursor-default select-none focus:outline-none focus:ring-2 focus:ring-gray-500 */}
              <li className="flex items-center w-full p-4 bg-white border border-gray-200 rounded-lg">
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
                    isCompletedList
                      ? "text-gray-500 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </span>
              </li>
            </ContextMenu.Trigger>

            <ContextMenu.Portal>
              <ContextMenu.Content className="w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <ContextMenu.Item
                  className="flex items-center text-red-500 px-4 py-2 text-sm cursor-pointer select-none data-[highlighted]:bg-red-50 data-[highlighted]:outline-none"
                  onSelect={() => {
                    console.log("delete", task);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("delete")}
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Portal>
          </ContextMenu.Root>
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
