export interface Task {
  id: string;
  title: string;
  completedAt: Date | null;
  isCompleted: 0 | 1; // The derived field for efficient querying.
  createdAt: Date;
  updatedAt: Date;
}

export const TASK_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
} as const;
